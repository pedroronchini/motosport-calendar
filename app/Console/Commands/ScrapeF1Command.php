<?php

namespace App\Console\Commands;

use App\Services\Scrapers\ErgastF1Scraper;
use Illuminate\Console\Command;

class ScrapeF1Command extends Command
{
    /**
     * @var string
     */
    protected $signature = 'scrape:f1
        {year? : Ano da temporada (padrão: ano atual)}
        {--current : Marca a temporada como a atual}
        {--no-results : Não busca os vencedores (mais rápido)}';

    /**
     * @var string
     */
    protected $description = 'Popula o banco com o calendário de F1 a partir da API Jolpica/Ergast';

    public function handle(ErgastF1Scraper $scraper): int
    {
        $year = (int) ($this->argument('year') ?: now()->year);
        $markCurrent = $this->option('current') || $year >= now()->year;
        $fetchResults = ! $this->option('no-results');

        $this->info("Buscando o calendário de F1 de {$year}...");
        $this->newLine();

        $log = $scraper->scrape(
            $year,
            $markCurrent,
            $fetchResults,
            fn (string $message) => $this->line($message),
        );

        $this->newLine();

        $this->table(
            ['Status', 'Corridas encontradas', 'Processadas', 'Registrado em'],
            [[$log->status, $log->events_found, $log->events_updated, $log->scraped_at->toDateTimeString()]],
        );

        if ($log->error_message) {
            $this->warn('Detalhes:');
            $this->line($log->error_message);
        }

        return match ($log->status) {
            'success' => self::SUCCESS,
            'partial' => self::SUCCESS,
            default => self::FAILURE,
        };
    }
}
