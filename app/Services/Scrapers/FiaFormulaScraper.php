<?php

namespace App\Services\Scrapers;

use App\Models\Championship;
use App\Models\Circuit;
use App\Models\Event;
use App\Models\ScrapeLog;
use App\Models\Season;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

/**
 * Scraper das categorias de acesso da FIA (F2 e F3), que compartilham a mesma
 * plataforma de site (fiaformula2.com / fiaformula3.com, Next.js da FOM).
 *
 * Não há API pública para o calendário completo; os dados são extraídos do
 * payload React (self.__next_f) embutido no HTML de duas páginas:
 *
 *  1. /en/racing/{ano} — cards do calendário com o round e a URL de cada etapa;
 *  2. /en/racing/{ano}/{local} — objeto "meeting" em JSON puro com as sessões
 *     do fim de semana (horários, fuso, estado) e os resultados por sessão.
 *
 * Cada fim de semana tem duas corridas (sprint no sábado e feature no domingo);
 * os vencedores são gravados em event_results com class = sprint|feature.
 * Os circuitos são os mesmos da F1 e são reutilizados pelo slug — registros
 * existentes nunca são sobrescritos, preservando os dados curados manualmente.
 *
 * Limitação da fonte: o site só publica a temporada corrente; calendários de
 * anos anteriores não estão disponíveis.
 */
abstract class FiaFormulaScraper
{
    private const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

    /**
     * API de resultados do próprio site (1ª parte). A página só embute os
     * resultados da sessão exibida por padrão (a feature race); os das demais
     * corridas são buscados aqui, com a chave pública embutida na página.
     */
    private const RESULTS_API = 'https://api.formula1.com/v2/core-fom-results/';

    /** Chave pública da API, extraída do payload da primeira página baixada. */
    private ?string $apiKey = null;

    /** Código da sessão no site => [tipo interno, classe do resultado]. */
    private const SESSION_MAP = [
        'p' => ['practice', null],
        'q' => ['qualifying', null],
        'r1' => ['sprint_race', 'sprint'],
        'r' => ['feature_race', 'feature'],
    ];

    /** Slug do championship (f2/f3). */
    abstract protected function slug(): string;

    /** URL base do site oficial, sem barra final. */
    abstract protected function baseUrl(): string;

    /**
     * Atributos do championship além do slug.
     *
     * @return array<string, mixed>
     */
    abstract protected function championshipAttributes(): array;

    /**
     * Executa o scraping de uma temporada completa.
     *
     * @param  \Closure(string):void|null  $onProgress  callback opcional para log de progresso (CLI)
     */
    public function scrape(int $year, bool $markCurrent = false, bool $fetchResults = true, ?\Closure $onProgress = null): ScrapeLog
    {
        $championship = $this->championship();
        $sourceUrl = $this->baseUrl()."/en/racing/{$year}";

        try {
            $rounds = $this->fetchSchedule($year);
        } catch (Throwable $e) {
            return $this->writeLog($championship, $sourceUrl, 'failed', 0, 0, 'Falha ao buscar o calendário: '.$e->getMessage());
        }

        if ($rounds === []) {
            return $this->writeLog($championship, $sourceUrl, 'failed', 0, 0, "Nenhuma etapa encontrada para {$year}.");
        }

        $season = $this->upsertSeason($championship, $year, $markCurrent);

        $found = count($rounds);
        $processed = 0;
        $errors = [];

        foreach ($rounds as $round) {
            $number = $round['round'];

            try {
                // Pausa curta entre as páginas para não sobrecarregar o site.
                usleep(250_000);

                $meeting = $this->fetchMeeting($year, $round['location']);

                DB::transaction(function () use ($season, $round, $meeting, $year, $fetchResults) {
                    $circuit = $this->upsertCircuit($round['location'], $meeting);
                    $event = $this->upsertEvent($season, $circuit, $round['round'], $meeting, $year);
                    $this->syncSessions($event, $meeting);

                    if ($fetchResults) {
                        $this->upsertResults($event, $meeting);
                    }
                });

                $processed++;
                $this->report($onProgress, sprintf('  ✓ R%02d  %s', $number, F1Reference::raceName($meeting['meetingName'] ?? $round['location'])));
            } catch (Throwable $e) {
                $errors[] = "R{$number}: ".$e->getMessage();
                $this->report($onProgress, sprintf('  ✗ R%02d  %s', $number, $e->getMessage()));
            }
        }

        $status = match (true) {
            $processed === 0 => 'failed',
            $errors !== [] => 'partial',
            default => 'success',
        };

        return $this->writeLog(
            $championship,
            $sourceUrl,
            $status,
            $found,
            $processed,
            $errors === [] ? null : implode("\n", $errors),
        );
    }

    /**
     * @param  \Closure(string):void|null  $onProgress
     */
    private function report(?\Closure $onProgress, string $message): void
    {
        if ($onProgress !== null) {
            $onProgress($message);
        }
    }

    private function championship(): Championship
    {
        return Championship::updateOrCreate(
            ['slug' => $this->slug()],
            $this->championshipAttributes(),
        );
    }

    /**
     * @return list<array{round: int, location: string}>
     */
    private function fetchSchedule(int $year): array
    {
        $payload = $this->fetchFlightPayload("/en/racing/{$year}");

        return $this->parseCalendarRounds($payload, $year);
    }

    /**
     * @return array<string, mixed>
     */
    private function fetchMeeting(int $year, string $location): array
    {
        $payload = $this->fetchFlightPayload("/en/racing/{$year}/{$location}");
        $meeting = $this->extractMeeting($payload);

        if ($meeting === null) {
            throw new RuntimeException("Objeto do meeting não encontrado em /en/racing/{$year}/{$location}.");
        }

        return $meeting;
    }

    /**
     * Baixa uma página e devolve o payload React (RSC) decodificado: cada
     * chunk self.__next_f.push([1,"..."]) é uma string JS escapada; decodificar
     * e concatenar reconstrói o payload completo.
     */
    private function fetchFlightPayload(string $path): string
    {
        $response = Http::withHeaders([
            'User-Agent' => self::USER_AGENT,
            'Accept-Language' => 'en',
        ])->timeout(30)->retry(3, 1000)->get($this->baseUrl().$path);

        $response->throw();

        // O quantificador possessivo (*+) evita estourar o limite de
        // backtracking do PCRE nos chunks grandes (>100 KB).
        preg_match_all('/self\.__next_f\.push\(\[1,"((?:[^"\\\\]|\\\\.)*+)"\]\)/s', $response->body(), $matches);

        $payload = '';

        foreach ($matches[1] as $chunk) {
            $decoded = json_decode('"'.$chunk.'"');

            if (is_string($decoded)) {
                $payload .= $decoded;
            }
        }

        if ($this->apiKey === null && preg_match('/"key":\{"public":"([A-Za-z0-9]+)"\}/', $payload, $keyMatch)) {
            $this->apiKey = $keyMatch[1];
        }

        return $payload;
    }

    /**
     * Extrai (round, local) dos cards do calendário. Cada card é um nó React
     * ["$","div","{meetingKey}",{...}] contendo o texto "ROUND n" e o link da
     * etapa; rounds duplicados (o site repete etapas em mais de uma seção)
     * são deduplicados pelo número.
     *
     * Por causa do streaming do RSC, o link de alguns cards não vem inline:
     * ele chega em um nó separado no fim do payload, ligado ao card pelo id
     * "_S_{n}_" — o card tem a tag de data "_S_{n}_-date" e o nó deferido o
     * link "_S_{n}_-link" com o href.
     *
     * @return list<array{round: int, location: string}>
     */
    private function parseCalendarRounds(string $payload, int $year): array
    {
        preg_match_all('/\["\$","div","(\d{2,6})",\{/', $payload, $matches, PREG_OFFSET_CAPTURE);

        $deferredLinks = $this->parseDeferredLinks($payload, $year);
        $rounds = [];
        $cards = $matches[0];

        foreach ($cards as $index => [, $offset]) {
            $end = $cards[$index + 1][1] ?? strlen($payload);
            $segment = substr($payload, $offset, $end - $offset);

            if (! preg_match('/"children":"ROUND (\d+)"/', $segment, $roundMatch)) {
                continue;
            }

            $location = null;

            if (preg_match('#"href":"/en/racing/'.$year.'/([a-z0-9-]+)"#', $segment, $hrefMatch)) {
                $location = $hrefMatch[1];
            } elseif (preg_match('/"id":"_S_(\d+)_-date"/', $segment, $idMatch)) {
                $location = $deferredLinks[$idMatch[1]] ?? null;
            }

            if ($location === null) {
                continue;
            }

            $rounds[(int) $roundMatch[1]] ??= [
                'round' => (int) $roundMatch[1],
                'location' => $location,
            ];
        }

        ksort($rounds);

        return array_values($rounds);
    }

    /**
     * Mapeia os nós de link deferidos do payload: id "_S_{n}_" => local da etapa.
     *
     * @return array<string, string>
     */
    private function parseDeferredLinks(string $payload, int $year): array
    {
        // [^\[\]]*? em vez de [^{}]*?: os atributos do nó incluem objetos com
        // chaves (ex.: "style":{...}), mas nunca colchetes antes do href.
        preg_match_all(
            '#"id":"_S_(\d+)_-link[^\[\]]*?"href":"/en/racing/'.$year.'/([a-z0-9-]+)"#',
            $payload,
            $matches,
            PREG_SET_ORDER
        );

        $links = [];

        foreach ($matches as [, $id, $location]) {
            $links[$id] ??= $location;
        }

        return $links;
    }

    /**
     * Localiza no payload o objeto JSON do meeting (o que contém a chave
     * meetingSessions) e o decodifica.
     *
     * @return array<string, mixed>|null
     */
    private function extractMeeting(string $payload): ?array
    {
        $keyPosition = strpos($payload, '"meetingSessions"');

        if ($keyPosition === false) {
            return null;
        }

        $start = strrpos(substr($payload, 0, $keyPosition), '{');

        while ($start !== false) {
            $json = $this->extractBalancedObject($payload, $start);

            if ($json !== null) {
                $meeting = json_decode($json, true);

                if (is_array($meeting) && isset($meeting['meetingSessions'])) {
                    return $meeting;
                }
            }

            $start = $start > 0 ? strrpos(substr($payload, 0, $start), '{') : false;
        }

        return null;
    }

    /**
     * Devolve a substring do objeto {...} iniciado em $start, contando chaves
     * fora de strings JSON (ou null se o objeto não fecha).
     */
    private function extractBalancedObject(string $payload, int $start): ?string
    {
        $depth = 0;
        $inString = false;
        $escaped = false;

        for ($i = $start, $length = strlen($payload); $i < $length; $i++) {
            $char = $payload[$i];

            if ($inString) {
                if ($escaped) {
                    $escaped = false;
                } elseif ($char === '\\') {
                    $escaped = true;
                } elseif ($char === '"') {
                    $inString = false;
                }

                continue;
            }

            if ($char === '"') {
                $inString = true;
            } elseif ($char === '{') {
                $depth++;
            } elseif ($char === '}' && --$depth === 0) {
                return substr($payload, $start, $i - $start + 1);
            }
        }

        return null;
    }

    private function upsertSeason(Championship $championship, int $year, bool $markCurrent): Season
    {
        if ($markCurrent) {
            $championship->seasons()->where('year', '!=', $year)->update(['is_current' => false]);
        }

        return $championship->seasons()->updateOrCreate(
            ['year' => $year],
            $markCurrent ? ['is_current' => true] : []
        );
    }

    /**
     * Reutiliza o circuito da F1 do mesmo fim de semana pelo slug; só cria um
     * registro quando o venue não existe, e nunca altera os existentes para
     * preservar os dados curados manualmente.
     *
     * @param  array<string, mixed>  $meeting
     */
    private function upsertCircuit(string $location, array $meeting): Circuit
    {
        $slug = FiaFormulaReference::circuitSlug($location) ?? Str::slug($location);

        $existing = Circuit::firstWhere('slug', $slug);

        if ($existing !== null) {
            return $existing;
        }

        $country = $meeting['meetingIsoCountryName'] ?? $meeting['meetingCountryName'] ?? '';
        $trackLength = $meeting['trackStats']['trackLength'] ?? null;

        return Circuit::create([
            'slug' => $slug,
            'name' => $meeting['circuitOfficialName'] ?? $meeting['circuitShortName'] ?? $location,
            'country' => F1Reference::countryName($country),
            'country_code' => F1Reference::countryCode($country) ?? '',
            'city' => $meeting['circuitLocation'] ?? null,
            'length_km' => is_numeric($trackLength) ? (float) $trackLength : null,
        ]);
    }

    /**
     * @param  array<string, mixed>  $meeting
     */
    private function upsertEvent(Season $season, Circuit $circuit, int $round, array $meeting, int $year): Event
    {
        $name = F1Reference::raceName($meeting['meetingName'] ?? $meeting['meetingLocation'] ?? "Etapa {$round}");

        // A feature race (domingo) é a corrida principal e define data/status
        // do evento; sem ela, cai na data de início do fim de semana.
        $feature = $this->findSession($meeting, 'r');
        $startsAt = $this->parseSessionTime($feature['startTime'] ?? null, $feature['gmtOffset'] ?? null)
            ?? Carbon::parse(($meeting['meetingStartDate'] ?? "{$year}-01-01").'T12:00:00Z');
        $endsAt = $this->parseSessionTime($feature['endTime'] ?? null, $feature['gmtOffset'] ?? null);

        $finished = ($feature['state'] ?? null) === 'completed' || $startsAt->isPast();

        $attributes = [
            'circuit_id' => $circuit->id,
            'name' => $name,
            'slug' => Str::slug($this->slug().' '.$name.' '.$year),
            'status' => $finished ? 'finished' : 'scheduled',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'timezone' => 'UTC',
            'source_url' => isset($meeting['url']) ? $this->baseUrl().$meeting['url'] : null,
            'external_id' => $this->slug()."-{$year}-{$round}",
        ];

        $event = $season->events()->firstWhere('round', $round);

        if ($event === null) {
            return $season->events()->create(['round' => $round] + $attributes);
        }

        $this->logChanges($event, $attributes);
        $event->update($attributes);

        return $event;
    }

    /**
     * Registra em event_change_logs as mudanças relevantes em um evento existente.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function logChanges(Event $event, array $attributes): void
    {
        $tracked = [
            'starts_at' => optional($event->starts_at)->toIso8601String(),
            'status' => $event->status,
        ];

        $incoming = [
            'starts_at' => optional($attributes['starts_at'])->toIso8601String(),
            'status' => $attributes['status'],
        ];

        foreach ($tracked as $field => $oldValue) {
            if ($oldValue !== $incoming[$field]) {
                $event->changeLogs()->create([
                    'field' => $field,
                    'old_value' => $oldValue,
                    'new_value' => $incoming[$field],
                    'changed_by' => 'scraper',
                    'changed_at' => now(),
                ]);
            }
        }
    }

    /**
     * Recria as sessões do evento a partir do meeting. Como as sessões não
     * possuem referências externas, apagar e recriar mantém o estado limpo.
     *
     * @param  array<string, mixed>  $meeting
     */
    private function syncSessions(Event $event, array $meeting): void
    {
        $event->sessions()->delete();

        foreach ($meeting['meetingSessions'] ?? [] as $session) {
            $startsAt = $this->parseSessionTime($session['startTime'] ?? null, $session['gmtOffset'] ?? null);

            if ($startsAt === null) {
                continue;
            }

            [$type] = self::SESSION_MAP[$session['session'] ?? '']
                ?? [Str::slug($session['sessionType'] ?? 'session', '_'), null];

            $event->sessions()->create([
                'type' => $type,
                'name' => $session['shortName'] ?? null,
                'starts_at' => $startsAt,
                'ends_at' => $this->parseSessionTime($session['endTime'] ?? null, $session['gmtOffset'] ?? null),
                'status' => ($session['state'] ?? null) === 'completed' || $startsAt->isPast() ? 'finished' : 'scheduled',
            ]);
        }
    }

    /**
     * Grava o vencedor de cada corrida do fim de semana (sprint e feature) em
     * event_results, distinguidos pela coluna class. Os resultados já vêm
     * embutidos na própria página da etapa.
     *
     * @param  array<string, mixed>  $meeting
     */
    private function upsertResults(Event $event, array $meeting): void
    {
        foreach ($meeting['meetingSessions'] ?? [] as $session) {
            [, $class] = self::SESSION_MAP[$session['session'] ?? ''] ?? [null, null];

            if ($class === null) {
                continue;
            }

            $winner = $this->findWinner($session['results'] ?? [])
                ?? $this->fetchSessionWinner($session);

            if ($winner === null) {
                continue;
            }

            $event->results()->updateOrCreate(['class' => $class], $winner);
        }
    }

    /**
     * Busca na API de resultados o vencedor de uma corrida já concluída cujo
     * resultado não veio embutido na página. A sessão traz o próprio caminho
     * do recurso (ex.: "f2/race?meeting=1289&session=1").
     *
     * @param  array<string, mixed>  $session
     * @return array{team: string, drivers: list<string>}|null
     */
    private function fetchSessionWinner(array $session): ?array
    {
        $path = $session['value'] ?? null;

        if ($path === null || $this->apiKey === null || ($session['state'] ?? null) !== 'completed') {
            return null;
        }

        // Pausa curta para respeitar o rate limit da API.
        usleep(250_000);

        $response = Http::withHeaders([
            'User-Agent' => self::USER_AGENT,
            'apikey' => $this->apiKey,
            'locale' => 'en',
        ])->timeout(20)->retry(3, 500)->get(self::RESULTS_API.$path);

        $response->throw();

        return $this->findWinner($response->json('sessionResults.results') ?? []);
    }

    /**
     * @param  list<array<string, mixed>>  $results
     * @return array{team: string, drivers: list<string>}|null
     */
    private function findWinner(array $results): ?array
    {
        foreach ($results as $entry) {
            if ((string) ($entry['positionNumber'] ?? '') !== '1') {
                continue;
            }

            return [
                'team' => $entry['teamName'] ?? '',
                'drivers' => [trim(($entry['driverFirstName'] ?? '').' '.($entry['driverLastName'] ?? ''))],
            ];
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $meeting
     * @return array<string, mixed>|null
     */
    private function findSession(array $meeting, string $code): ?array
    {
        foreach ($meeting['meetingSessions'] ?? [] as $session) {
            if (($session['session'] ?? null) === $code) {
                return $session;
            }
        }

        return null;
    }

    /**
     * Converte horário local + offset do site ("2026-07-18T14:15:00" e
     * "+02:00") para Carbon em UTC.
     */
    private function parseSessionTime(?string $time, ?string $offset): ?Carbon
    {
        if (! $time) {
            return null;
        }

        return Carbon::parse($time.($offset ?: 'Z'))->utc();
    }

    private function writeLog(Championship $championship, string $sourceUrl, string $status, int $found, int $updated, ?string $error): ScrapeLog
    {
        return $championship->scrapeLogs()->create([
            'source_url' => $sourceUrl,
            'status' => $status,
            'events_found' => $found,
            'events_updated' => $updated,
            'error_message' => $error,
            'scraped_at' => now(),
        ]);
    }
}
