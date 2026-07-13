<?php

namespace Database\Seeders;

use App\Models\Circuit;
use Illuminate\Database\Seeder;

/**
 * Enriquece os circuitos com os dados técnicos que a API Ergast/Jolpica não
 * fornece (comprimento, curvas, 1ª edição e recorde de volta). Casa por slug e
 * apenas ATUALIZA circuitos já existentes — normalmente criados antes pelo
 * scraper (`scrape:f1`). Circuitos ainda não presentes são ignorados.
 * Idempotente e seguro para rodar junto do scraper, que preserva estes campos
 * em execuções seguintes.
 */
class CircuitDetailsSeeder extends Seeder
{
    /**
     * slug => [length_km, curvas, recorde, piloto, ano_recorde, 1ª_edição]
     *
     * @var array<string, array{0: float, 1: int, 2: string, 3: string, 4: int, 5: int}>
     */
    private const CIRCUITS = [
        'albert-park' => [5.278, 16, '1:20.235', 'G. Russell', 2023, 1996],
        'americas' => [5.513, 20, '1:36.169', 'C. Leclerc', 2019, 2012],
        'bahrain' => [5.412, 15, '1:31.447', 'P. de la Rosa', 2005, 2004],
        'baku' => [6.003, 20, '1:43.009', 'C. Leclerc', 2019, 2016],
        'catalunya' => [4.657, 14, '1:18.149', 'M. Verstappen', 2021, 1991],
        'hungaroring' => [4.381, 14, '1:16.627', 'L. Hamilton', 2020, 1986],
        'imola' => [4.909, 19, '1:15.484', 'R. Barrichello', 2004, 1980],
        'interlagos' => [4.309, 15, '1:10.540', 'V. Bottas', 2018, 1973],
        'jeddah' => [6.174, 27, '1:30.734', 'L. Hamilton', 2021, 2021],
        'losail' => [5.419, 16, '1:24.319', 'M. Verstappen', 2023, 2021],
        'marina-bay' => [5.065, 23, '1:35.867', 'K. Magnussen', 2018, 2008],
        'miami' => [5.412, 19, '1:29.708', 'M. Verstappen', 2023, 2022],
        'monaco' => [3.337, 19, '1:12.909', 'L. Hamilton', 2021, 1950],
        'monza' => [5.793, 11, '1:21.046', 'R. Barrichello', 2004, 1950],
        'red-bull-ring' => [4.318, 10, '1:05.619', 'C. Sainz', 2020, 1970],
        'rodriguez' => [4.304, 17, '1:17.774', 'V. Bottas', 2021, 1963],
        'shanghai' => [5.451, 16, '1:32.238', 'M. Schumacher', 2004, 2004],
        'silverstone' => [5.891, 18, '1:27.097', 'M. Verstappen', 2020, 1950],
        'spa' => [7.004, 19, '1:46.286', 'V. Bottas', 2018, 1950],
        'suzuka' => [5.807, 18, '1:30.983', 'L. Hamilton', 2019, 1987],
        'vegas' => [6.201, 17, '1:35.490', 'O. Piastri', 2023, 2023],
        'villeneuve' => [4.361, 14, '1:13.078', 'V. Bottas', 2019, 1978],
        'yas-marina' => [5.281, 16, '1:26.103', 'M. Verstappen', 2021, 2009],
        'zandvoort' => [4.259, 14, '1:11.097', 'L. Hamilton', 2021, 1952],
    ];

    public function run(): void
    {
        $updated = 0;
        $skipped = [];

        foreach (self::CIRCUITS as $slug => [$length, $turns, $record, $holder, $recordYear, $firstYear]) {
            $affected = Circuit::where('slug', $slug)->update([
                'length_km' => $length,
                'number_of_turns' => $turns,
                'first_event_year' => $firstYear,
                'lap_record_ms' => $this->parseLapRecord($record),
                'lap_record_holder' => $holder,
                'lap_record_year' => $recordYear,
            ]);

            $affected > 0 ? $updated++ : $skipped[] = $slug;
        }

        $this->command?->info("Circuitos enriquecidos: {$updated}");

        if ($skipped !== []) {
            $this->command?->warn('Ainda não presentes no banco (rode scrape:f1 antes): '.implode(', ', $skipped));
        }
    }

    /**
     * Converte um tempo de volta "1:10.540" em milissegundos (70540).
     */
    private function parseLapRecord(string $time): int
    {
        [$minutes, $rest] = explode(':', $time);
        [$seconds, $millis] = explode('.', $rest);

        return ((int) $minutes) * 60_000
            + ((int) $seconds) * 1_000
            + (int) str_pad($millis, 3, '0');
    }
}
