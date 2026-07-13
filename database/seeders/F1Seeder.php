<?php

namespace Database\Seeders;

use App\Models\Championship;
use App\Models\Circuit;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class F1Seeder extends Seeder
{
    /**
     * Seed a sample Formula 1 championship: one season, a handful of real
     * circuits, and a mix of finished/upcoming rounds with sessions and
     * results. Safe to run multiple times (upserts by slug/round).
     */
    public function run(): void
    {
        $championship = Championship::updateOrCreate(
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

        $circuits = $this->seedCircuits();

        $season = $championship->seasons()->updateOrCreate(
            ['year' => 2026],
            [
                'is_current' => true,
                'starts_on' => '2026-03-08',
                'ends_on' => '2026-12-06',
            ]
        );

        foreach ($this->rounds() as $data) {
            $event = $season->events()->updateOrCreate(
                ['round' => $data['round']],
                [
                    'circuit_id' => $circuits[$data['circuit']]->id,
                    'name' => $data['name'],
                    'slug' => Str::slug($data['name']),
                    'status' => $data['status'],
                    'laps' => $data['laps'],
                    'starts_at' => $data['starts_at'],
                    'ends_at' => Carbon::parse($data['starts_at'])->addHours(2),
                    'timezone' => 'UTC',
                ]
            );

            $this->seedSessions($event, Carbon::parse($data['starts_at']), $data['sprint'] ?? false);

            if ($data['result']) {
                $event->result()->updateOrCreate([], $data['result']);
            } else {
                $event->result()->delete();
            }
        }
    }

    /**
     * @return array<string, Circuit>
     */
    private function seedCircuits(): array
    {
        $definitions = [
            'bahrain' => [
                'name' => 'Bahrain International Circuit',
                'country' => 'Bahrein',
                'country_code' => 'BH',
                'city' => 'Sakhir',
                'length_km' => 5.412,
                'number_of_turns' => 15,
                'first_event_year' => 2004,
                'lap_record_ms' => 91447,
                'lap_record_holder' => 'P. de la Rosa',
                'lap_record_year' => 2005,
            ],
            'jeddah' => [
                'name' => 'Jeddah Corniche Circuit',
                'country' => 'Arábia Saudita',
                'country_code' => 'SA',
                'city' => 'Jeddah',
                'length_km' => 6.174,
                'number_of_turns' => 27,
                'first_event_year' => 2021,
                'lap_record_ms' => 90734,
                'lap_record_holder' => 'L. Hamilton',
                'lap_record_year' => 2021,
            ],
            'albert-park' => [
                'name' => 'Albert Park Circuit',
                'country' => 'Austrália',
                'country_code' => 'AU',
                'city' => 'Melbourne',
                'length_km' => 5.278,
                'number_of_turns' => 14,
                'first_event_year' => 1996,
                'lap_record_ms' => 80235,
                'lap_record_holder' => 'G. Russell',
                'lap_record_year' => 2024,
            ],
            'suzuka' => [
                'name' => 'Suzuka International Racing Course',
                'country' => 'Japão',
                'country_code' => 'JP',
                'city' => 'Suzuka',
                'length_km' => 5.807,
                'number_of_turns' => 18,
                'first_event_year' => 1987,
                'lap_record_ms' => 90983,
                'lap_record_holder' => 'L. Hamilton',
                'lap_record_year' => 2019,
            ],
            'shanghai' => [
                'name' => 'Shanghai International Circuit',
                'country' => 'China',
                'country_code' => 'CN',
                'city' => 'Xangai',
                'length_km' => 5.451,
                'number_of_turns' => 16,
                'first_event_year' => 2004,
                'lap_record_ms' => 92238,
                'lap_record_holder' => 'M. Schumacher',
                'lap_record_year' => 2004,
            ],
            'miami' => [
                'name' => 'Miami International Autodrome',
                'country' => 'EUA',
                'country_code' => 'US',
                'city' => 'Miami',
                'length_km' => 5.412,
                'number_of_turns' => 19,
                'first_event_year' => 2022,
                'lap_record_ms' => 89708,
                'lap_record_holder' => 'M. Verstappen',
                'lap_record_year' => 2023,
            ],
            'monaco' => [
                'name' => 'Circuit de Monaco',
                'country' => 'Mônaco',
                'country_code' => 'MC',
                'city' => 'Monte Carlo',
                'length_km' => 3.337,
                'number_of_turns' => 19,
                'first_event_year' => 1950,
                'lap_record_ms' => 72909,
                'lap_record_holder' => 'L. Hamilton',
                'lap_record_year' => 2021,
            ],
            'silverstone' => [
                'name' => 'Silverstone Circuit',
                'country' => 'Reino Unido',
                'country_code' => 'GB',
                'city' => 'Silverstone',
                'length_km' => 5.891,
                'number_of_turns' => 18,
                'first_event_year' => 1950,
                'lap_record_ms' => 87097,
                'lap_record_holder' => 'M. Verstappen',
                'lap_record_year' => 2020,
            ],
        ];

        $circuits = [];
        foreach ($definitions as $slug => $attributes) {
            $circuits[$slug] = Circuit::updateOrCreate(['slug' => $slug], $attributes);
        }

        return $circuits;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function rounds(): array
    {
        return [
            [
                'round' => 1,
                'name' => 'Grande Prêmio do Bahrein',
                'circuit' => 'bahrain',
                'starts_at' => '2026-03-08 15:00:00',
                'laps' => 57,
                'status' => 'finished',
                'result' => ['team' => 'Red Bull Racing', 'drivers' => ['Max Verstappen']],
            ],
            [
                'round' => 2,
                'name' => 'Grande Prêmio da Arábia Saudita',
                'circuit' => 'jeddah',
                'starts_at' => '2026-03-15 17:00:00',
                'laps' => 50,
                'status' => 'finished',
                'result' => ['team' => 'Ferrari', 'drivers' => ['Charles Leclerc']],
            ],
            [
                'round' => 3,
                'name' => 'Grande Prêmio da Austrália',
                'circuit' => 'albert-park',
                'starts_at' => '2026-03-29 05:00:00',
                'laps' => 58,
                'status' => 'finished',
                'result' => ['team' => 'McLaren', 'drivers' => ['Lando Norris']],
            ],
            [
                'round' => 4,
                'name' => 'Grande Prêmio do Japão',
                'circuit' => 'suzuka',
                'starts_at' => '2026-04-12 06:00:00',
                'laps' => 53,
                'status' => 'finished',
                'result' => ['team' => 'Red Bull Racing', 'drivers' => ['Max Verstappen']],
            ],
            [
                'round' => 5,
                'name' => 'Grande Prêmio da China',
                'circuit' => 'shanghai',
                'starts_at' => '2026-04-26 07:00:00',
                'laps' => 56,
                'status' => 'finished',
                'result' => ['team' => 'McLaren', 'drivers' => ['Oscar Piastri']],
            ],
            [
                'round' => 6,
                'name' => 'Grande Prêmio de Miami',
                'circuit' => 'miami',
                'starts_at' => '2026-05-10 20:00:00',
                'laps' => 57,
                'status' => 'finished',
                'sprint' => true,
                'result' => ['team' => 'McLaren', 'drivers' => ['Lando Norris']],
            ],
            [
                'round' => 7,
                'name' => 'Grande Prêmio de Mônaco',
                'circuit' => 'monaco',
                'starts_at' => '2026-07-19 15:00:00',
                'laps' => 78,
                'status' => 'scheduled',
                'result' => null,
            ],
            [
                'round' => 8,
                'name' => 'Grande Prêmio da Grã-Bretanha',
                'circuit' => 'silverstone',
                'starts_at' => '2026-08-02 15:00:00',
                'laps' => 52,
                'status' => 'scheduled',
                'result' => null,
            ],
        ];
    }

    private function seedSessions(Event $event, Carbon $raceStart, bool $sprint): void
    {
        $event->sessions()->delete();

        $friday = $raceStart->copy()->subDays(2);
        $saturday = $raceStart->copy()->subDay();

        $sessions = $sprint
            ? [
                ['type' => 'practice', 'number' => 1, 'starts_at' => $friday->copy()->setTime(12, 30)],
                ['type' => 'sprint_qualifying', 'starts_at' => $friday->copy()->setTime(16, 30)],
                ['type' => 'sprint', 'starts_at' => $saturday->copy()->setTime(12, 0)],
                ['type' => 'qualifying', 'starts_at' => $saturday->copy()->setTime(16, 0)],
                ['type' => 'race', 'starts_at' => $raceStart],
            ]
            : [
                ['type' => 'practice', 'number' => 1, 'starts_at' => $friday->copy()->setTime(12, 30)],
                ['type' => 'practice', 'number' => 2, 'starts_at' => $friday->copy()->setTime(16, 0)],
                ['type' => 'practice', 'number' => 3, 'starts_at' => $saturday->copy()->setTime(11, 30)],
                ['type' => 'qualifying', 'starts_at' => $saturday->copy()->setTime(15, 0)],
                ['type' => 'race', 'starts_at' => $raceStart],
            ];

        foreach ($sessions as $session) {
            $event->sessions()->create([
                'type' => $session['type'],
                'number' => $session['number'] ?? null,
                'starts_at' => $session['starts_at'],
                'status' => $session['starts_at']->isPast() ? 'finished' : 'scheduled',
            ]);
        }
    }
}
