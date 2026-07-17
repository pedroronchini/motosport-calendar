<?php

namespace App\Services\Scrapers;

/**
 * Mapas auxiliares dos sites da FIA Formula 2 e Formula 3 (plataforma FOM).
 *
 * Como as etapas de F2/F3 acontecem em fins de semana de F1, os circuitos são
 * reutilizados dos registros já criados pelo scraper de F1 — este mapa converte
 * o local usado na URL do site para o slug do circuito correspondente.
 */
class FiaFormulaReference
{
    /**
     * Local da URL (/en/racing/{ano}/{local}) => slug do circuito da F1.
     * Locais fora do mapa geram um circuito próprio com slug igual ao local.
     *
     * @var array<string, string>
     */
    private const LOCATION_CIRCUITS = [
        'melbourne' => 'albert-park',
        'sakhir' => 'bahrain',
        'jeddah' => 'jeddah',
        'shanghai' => 'shanghai',
        'suzuka' => 'suzuka',
        'miami-gardens' => 'miami',
        'imola' => 'imola',
        'monte-carlo' => 'monaco',
        'montreal' => 'villeneuve',
        'barcelona' => 'catalunya',
        'spielberg' => 'red-bull-ring',
        'silverstone' => 'silverstone',
        'budapest' => 'hungaroring',
        'spa-francorchamps' => 'spa',
        'zandvoort' => 'zandvoort',
        'monza' => 'monza',
        'madrid' => 'madring',
        'baku' => 'baku',
        'marina-bay' => 'marina-bay',
        'austin' => 'americas',
        'mexico-city' => 'rodriguez',
        'sao-paulo' => 'interlagos',
        'las-vegas' => 'vegas',
        'lusail' => 'losail',
        'yas-marina' => 'yas-marina',
    ];

    /**
     * Slug do circuito da F1 para o local da URL (ou null se desconhecido).
     */
    public static function circuitSlug(string $location): ?string
    {
        return self::LOCATION_CIRCUITS[$location] ?? null;
    }
}
