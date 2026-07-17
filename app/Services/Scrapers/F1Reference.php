<?php

namespace App\Services\Scrapers;

/**
 * Mapas de tradução para converter os dados em inglês da API Ergast/Jolpica
 * para o padrão pt-BR usado no restante da aplicação (nomes de país, código
 * ISO para a bandeira e nomes oficiais dos Grandes Prêmios).
 *
 * Quando uma chave não é encontrada, os métodos degradam graciosamente:
 * o valor original em inglês é mantido e o código do país fica nulo.
 */
class F1Reference
{
    /**
     * País retornado pela Ergast => [código ISO 3166-1 alpha-2, nome em pt-BR].
     *
     * @var array<string, array{0: string, 1: string}>
     */
    private const COUNTRIES = [
        'Bahrain' => ['BH', 'Bahrein'],
        'Saudi Arabia' => ['SA', 'Arábia Saudita'],
        'Australia' => ['AU', 'Austrália'],
        'Japan' => ['JP', 'Japão'],
        'China' => ['CN', 'China'],
        'USA' => ['US', 'EUA'],
        'United States' => ['US', 'EUA'],
        'Italy' => ['IT', 'Itália'],
        'Monaco' => ['MC', 'Mônaco'],
        'Canada' => ['CA', 'Canadá'],
        'Spain' => ['ES', 'Espanha'],
        'Austria' => ['AT', 'Áustria'],
        'UK' => ['GB', 'Reino Unido'],
        'United Kingdom' => ['GB', 'Reino Unido'],
        'Hungary' => ['HU', 'Hungria'],
        'Belgium' => ['BE', 'Bélgica'],
        'Netherlands' => ['NL', 'Países Baixos'],
        'Azerbaijan' => ['AZ', 'Azerbaijão'],
        'Singapore' => ['SG', 'Singapura'],
        'Mexico' => ['MX', 'México'],
        'Brazil' => ['BR', 'Brasil'],
        'Qatar' => ['QA', 'Catar'],
        'UAE' => ['AE', 'Emirados Árabes Unidos'],
        'United Arab Emirates' => ['AE', 'Emirados Árabes Unidos'],
        'France' => ['FR', 'França'],
        'Germany' => ['DE', 'Alemanha'],
        'Portugal' => ['PT', 'Portugal'],
        'Turkey' => ['TR', 'Turquia'],
        'Russia' => ['RU', 'Rússia'],
        'Argentina' => ['AR', 'Argentina'],
        'Malaysia' => ['MY', 'Malásia'],
        'India' => ['IN', 'Índia'],
        'Korea' => ['KR', 'Coreia do Sul'],
        'South Africa' => ['ZA', 'África do Sul'],
    ];

    /**
     * Nome do GP retornado pela Ergast => nome oficial em pt-BR.
     *
     * @var array<string, string>
     */
    private const RACE_NAMES = [
        'Bahrain Grand Prix' => 'Grande Prêmio do Bahrein',
        'Saudi Arabian Grand Prix' => 'Grande Prêmio da Arábia Saudita',
        'Australian Grand Prix' => 'Grande Prêmio da Austrália',
        'Japanese Grand Prix' => 'Grande Prêmio do Japão',
        'Chinese Grand Prix' => 'Grande Prêmio da China',
        'Miami Grand Prix' => 'Grande Prêmio de Miami',
        'Emilia Romagna Grand Prix' => 'Grande Prêmio da Emilia-Romagna',
        'Monaco Grand Prix' => 'Grande Prêmio de Mônaco',
        'Canadian Grand Prix' => 'Grande Prêmio do Canadá',
        'Spanish Grand Prix' => 'Grande Prêmio da Espanha',
        'Barcelona Grand Prix' => 'Grande Prêmio de Barcelona',
        'Barcelona-Catalunya Grand Prix' => 'Grande Prêmio de Barcelona',
        'Madrid Grand Prix' => 'Grande Prêmio de Madri',
        'Austrian Grand Prix' => 'Grande Prêmio da Áustria',
        'British Grand Prix' => 'Grande Prêmio da Grã-Bretanha',
        'Hungarian Grand Prix' => 'Grande Prêmio da Hungria',
        'Belgian Grand Prix' => 'Grande Prêmio da Bélgica',
        'Dutch Grand Prix' => 'Grande Prêmio dos Países Baixos',
        'Italian Grand Prix' => 'Grande Prêmio da Itália',
        'Azerbaijan Grand Prix' => 'Grande Prêmio do Azerbaijão',
        'Singapore Grand Prix' => 'Grande Prêmio de Singapura',
        'United States Grand Prix' => 'Grande Prêmio dos Estados Unidos',
        'Mexican Grand Prix' => 'Grande Prêmio do México',
        'Mexico City Grand Prix' => 'Grande Prêmio da Cidade do México',
        'Brazilian Grand Prix' => 'Grande Prêmio do Brasil',
        'São Paulo Grand Prix' => 'Grande Prêmio de São Paulo',
        'Las Vegas Grand Prix' => 'Grande Prêmio de Las Vegas',
        'Qatar Grand Prix' => 'Grande Prêmio do Catar',
        'Abu Dhabi Grand Prix' => 'Grande Prêmio de Abu Dhabi',
        'French Grand Prix' => 'Grande Prêmio da França',
        'German Grand Prix' => 'Grande Prêmio da Alemanha',
        'Portuguese Grand Prix' => 'Grande Prêmio de Portugal',
        'Turkish Grand Prix' => 'Grande Prêmio da Turquia',
        'Russian Grand Prix' => 'Grande Prêmio da Rússia',
        'Styrian Grand Prix' => 'Grande Prêmio da Estíria',
        'Tuscan Grand Prix' => 'Grande Prêmio da Toscana',
        'Sakhir Grand Prix' => 'Grande Prêmio de Sakhir',
        'Eifel Grand Prix' => 'Grande Prêmio de Eifel',
        '70th Anniversary Grand Prix' => 'Grande Prêmio do 70º Aniversário',
    ];

    /**
     * Código ISO alpha-2 do país (ou null se desconhecido).
     */
    public static function countryCode(string $ergastCountry): ?string
    {
        return self::COUNTRIES[$ergastCountry][0] ?? null;
    }

    /**
     * Nome do país em pt-BR (ou o original em inglês, se desconhecido).
     */
    public static function countryName(string $ergastCountry): string
    {
        return self::COUNTRIES[$ergastCountry][1] ?? $ergastCountry;
    }

    /**
     * Nome do GP em pt-BR (ou o original em inglês, se desconhecido).
     */
    public static function raceName(string $ergastRaceName): string
    {
        return self::RACE_NAMES[$ergastRaceName] ?? $ergastRaceName;
    }
}
