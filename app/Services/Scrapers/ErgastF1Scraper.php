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
use Throwable;

/**
 * Popula o banco com o calendário de Fórmula 1 a partir da API pública
 * Jolpica (sucessora da Ergast), que expõe os dados em JSON estruturado.
 *
 * O processo é idempotente: eventos são casados por (season_id, round) e
 * circuitos por slug, então rodar novamente apenas atualiza. Alterações em
 * eventos já existentes (horário, status) são registradas em event_change_logs
 * e cada execução gera um scrape_log com métricas.
 */
class ErgastF1Scraper
{
    private const BASE_URL = 'https://api.jolpi.ca/ergast/f1/';

    /** Sessões possíveis: chave na API => [tipo interno, número]. */
    private const SESSION_MAP = [
        'FirstPractice' => ['practice', 1],
        'SecondPractice' => ['practice', 2],
        'ThirdPractice' => ['practice', 3],
        'SprintQualifying' => ['sprint_qualifying', null],
        'Sprint' => ['sprint', null],
        'Qualifying' => ['qualifying', null],
    ];

    /**
     * Executa o scraping de uma temporada completa.
     *
     * @param  \Closure(string):void|null  $onProgress  callback opcional para log de progresso (CLI)
     */
    public function scrape(int $year, bool $markCurrent = false, bool $fetchResults = true, ?\Closure $onProgress = null): ScrapeLog
    {
        $championship = $this->championship();
        $sourceUrl = self::BASE_URL.$year.'.json';

        try {
            $races = $this->fetchSchedule($year);
        } catch (Throwable $e) {
            return $this->writeLog($championship, $sourceUrl, 'failed', 0, 0, 'Falha ao buscar o calendário: '.$e->getMessage());
        }

        if ($races === []) {
            return $this->writeLog($championship, $sourceUrl, 'failed', 0, 0, "Nenhuma corrida encontrada para {$year}.");
        }

        $season = $this->upsertSeason($championship, $year, $markCurrent);

        $found = count($races);
        $processed = 0;
        $errors = [];

        foreach ($races as $race) {
            $round = (int) $race['round'];

            try {
                DB::transaction(function () use ($season, $race, $round, $year, $fetchResults) {
                    $circuit = $this->upsertCircuit($race['Circuit']);
                    $event = $this->upsertEvent($season, $circuit, $race, $year);
                    $this->syncSessions($event, $race);

                    if ($fetchResults && $event->status === 'finished') {
                        $this->upsertResult($event, $year, $round);
                    }
                });

                $processed++;
                $this->report($onProgress, sprintf('  ✓ R%02d  %s', $round, F1Reference::raceName($race['raceName'])));
            } catch (Throwable $e) {
                $errors[] = "R{$round}: ".$e->getMessage();
                $this->report($onProgress, sprintf('  ✗ R%02d  %s', $round, $e->getMessage()));
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
            ['slug' => 'f1'],
            [
                'name' => 'Formula 1',
                'short_name' => 'F1',
                'category' => 'single_seater',
                'description' => 'Categoria máxima do automobilismo mundial',
                'color' => '#E10600',
                'text_color' => '#FFFFFF',
                'website' => 'https://www.formula1.com',
                'is_active' => true,
            ]
        );
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function fetchSchedule(int $year): array
    {
        $response = Http::baseUrl(self::BASE_URL)
            ->timeout(20)
            ->retry(3, 500)
            ->get("{$year}.json", ['limit' => 100]);

        $response->throw();

        return $response->json('MRData.RaceTable.Races', []);
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
     * @param  array<string, mixed>  $data  nó "Circuit" da resposta da API
     */
    private function upsertCircuit(array $data): Circuit
    {
        $location = $data['Location'] ?? [];
        $country = $location['country'] ?? '';

        // Só os campos conhecidos pela API são gravados; dados curados
        // manualmente (curvas, comprimento, recorde de volta...) são preservados.
        return Circuit::updateOrCreate(
            ['slug' => Str::slug($data['circuitId'])],
            [
                'name' => $data['circuitName'],
                'country' => F1Reference::countryName($country),
                'country_code' => F1Reference::countryCode($country) ?? '',
                'city' => $location['locality'] ?? null,
                'latitude' => $location['lat'] ?? null,
                'longitude' => $location['long'] ?? null,
            ]
        );
    }

    /**
     * @param  array<string, mixed>  $race  nó "Race" da resposta da API
     */
    private function upsertEvent(Season $season, Circuit $circuit, array $race, int $year): Event
    {
        $round = (int) $race['round'];
        $startsAt = $this->parseDateTime($race['date'] ?? null, $race['time'] ?? null);
        $status = $startsAt && $startsAt->isPast() ? 'finished' : 'scheduled';

        $attributes = [
            'circuit_id' => $circuit->id,
            'name' => F1Reference::raceName($race['raceName']),
            'slug' => Str::slug(F1Reference::raceName($race['raceName']).'-'.$year),
            'status' => $status,
            'starts_at' => $startsAt,
            'timezone' => 'UTC',
            'source_url' => $race['url'] ?? null,
            'external_id' => "f1-{$year}-{$round}",
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
     * Recria as sessões do evento a partir do calendário. Como as sessões não
     * possuem referências externas, apagar e recriar mantém o estado limpo.
     *
     * @param  array<string, mixed>  $race
     */
    private function syncSessions(Event $event, array $race): void
    {
        $event->sessions()->delete();

        foreach (self::SESSION_MAP as $key => [$type, $number]) {
            if (! isset($race[$key])) {
                continue;
            }

            $this->createSession($event, $type, $number, $race[$key]['date'] ?? null, $race[$key]['time'] ?? null);
        }

        // A corrida principal usa a data/hora do próprio evento.
        $this->createSession($event, 'race', null, $race['date'] ?? null, $race['time'] ?? null);
    }

    private function createSession(Event $event, string $type, ?int $number, ?string $date, ?string $time): void
    {
        $startsAt = $this->parseDateTime($date, $time);

        $event->sessions()->create([
            'type' => $type,
            'number' => $number,
            'starts_at' => $startsAt,
            'status' => $startsAt && $startsAt->isPast() ? 'finished' : 'scheduled',
        ]);
    }

    private function upsertResult(Event $event, int $year, int $round): void
    {
        $winner = $this->fetchWinner($year, $round);

        if ($winner === null) {
            return;
        }

        $event->result()->updateOrCreate([], [
            'team' => $winner['team'],
            'drivers' => $winner['drivers'],
        ]);

        if ($winner['laps'] !== null) {
            $event->update(['laps' => $winner['laps']]);
        }
    }

    /**
     * @return array{team: string, drivers: list<string>, laps: int|null}|null
     */
    private function fetchWinner(int $year, int $round): ?array
    {
        // Pequena pausa para respeitar o rate limit da API pública.
        usleep(300_000);

        $response = Http::baseUrl(self::BASE_URL)
            ->timeout(20)
            ->retry(3, 500)
            ->get("{$year}/{$round}/results/1.json");

        $response->throw();

        $result = $response->json('MRData.RaceTable.Races.0.Results.0');

        if ($result === null) {
            return null;
        }

        $driver = $result['Driver'] ?? [];

        return [
            'team' => $result['Constructor']['name'] ?? '',
            'drivers' => [trim(($driver['givenName'] ?? '').' '.($driver['familyName'] ?? ''))],
            'laps' => isset($result['laps']) ? (int) $result['laps'] : null,
        ];
    }

    private function parseDateTime(?string $date, ?string $time): ?Carbon
    {
        if ($date === null) {
            return null;
        }

        // A API entrega horários em UTC (ex.: "15:00:00Z"); quando ausente,
        // usamos meio-dia UTC como valor neutro para não distorcer o status.
        $time = $time ?: '12:00:00Z';

        return Carbon::parse("{$date}T{$time}");
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
