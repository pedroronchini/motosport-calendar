<?php

namespace App\Services\Scrapers;

/**
 * Scraper da FIA Formula 2 — ver FiaFormulaScraper para o funcionamento.
 */
class F2Scraper extends FiaFormulaScraper
{
    protected function slug(): string
    {
        return 'f2';
    }

    protected function baseUrl(): string
    {
        return 'https://www.fiaformula2.com';
    }

    /**
     * @return array<string, mixed>
     */
    protected function championshipAttributes(): array
    {
        return [
            'name' => 'Formula 2',
            'short_name' => 'F2',
            'category' => 'single_seater',
            'description' => 'Principal categoria de acesso à Fórmula 1, disputada nos mesmos fins de semana da F1',
            'color' => '#0090D0',
            'text_color' => '#FFFFFF',
            'website' => 'https://www.fiaformula2.com',
            'is_active' => true,
        ];
    }
}
