<?php

namespace App\Services\Scrapers;

/**
 * Scraper da FIA Formula 3 — ver FiaFormulaScraper para o funcionamento.
 */
class F3Scraper extends FiaFormulaScraper
{
    protected function slug(): string
    {
        return 'f3';
    }

    protected function baseUrl(): string
    {
        return 'https://www.fiaformula3.com';
    }

    /**
     * @return array<string, mixed>
     */
    protected function championshipAttributes(): array
    {
        return [
            'name' => 'Formula 3',
            'short_name' => 'F3',
            'category' => 'single_seater',
            'description' => 'Categoria de acesso da FIA um degrau abaixo da F2, disputada em suporte à Fórmula 1',
            'color' => '#E4002B',
            'text_color' => '#FFFFFF',
            'website' => 'https://www.fiaformula3.com',
            'is_active' => true,
        ];
    }
}
