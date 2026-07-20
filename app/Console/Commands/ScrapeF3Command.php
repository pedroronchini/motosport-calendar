<?php

namespace App\Console\Commands;

use App\Services\Scrapers\F3Scraper;
use Illuminate\Console\Command;

class ScrapeF3Command extends Command
{
    /**
     * @var string
     */
    protected $signature = 'scrape:f3
        {year? : Ano da temporada (padrão: ano atual; o site só publica a corrente)}
        {--current : Marca a temporada como a atual}
        {--no-results : Não grava os vencedores (sprint e feature)}';

    /**
     * @var string
     */
    protected $description = 'Popula o banco com o calendário de F3 raspando o site oficial (fiaformula3.com)';

    public function handle(F3Scraper $scraper): int
    {
        $year = (int) ($this->argument('year') ?: now()->year);
        $markCurrent = $this->option('current') || $year >= now()->year;
        $fetchResults = ! $this->option('no-results');

        $this->info("Buscando o calendário de F3 de {$year}...");
        $this->newLine();

        $log = $scraper->scrape(
            $year,
            $markCurrent,
            $fetchResults,
            fn (string $message) => $this->line($message),
        );

        $this->newLine();

        $this->table(
            ['Status', 'Etapas encontradas', 'Processadas', 'Registrado em'],
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
