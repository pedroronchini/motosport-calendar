<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'slug',
    'country',
    'country_code',
    'city',
    'length_km',
    'lap_record_ms',
    'lap_record_holder',
    'lap_record_year',
    'number_of_turns',
    'drs_zones',
    'type',
    'first_event_year',
    'latitude',
    'longitude',
    'description',
    'map_image_path',
    'photo_path',
])]
class Circuit extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'length_km' => 'decimal:3',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    /**
     * Lap record formatted as "1:19.200" instead of raw milliseconds.
     */
    protected function lapRecordFormatted(): Attribute
    {
        return Attribute::make(get: function () {
            if ($this->lap_record_ms === null) {
                return null;
            }

            $minutes = intdiv($this->lap_record_ms, 60_000);
            $seconds = intdiv($this->lap_record_ms % 60_000, 1_000);
            $millis = $this->lap_record_ms % 1_000;

            return sprintf('%d:%02d.%03d', $minutes, $seconds, $millis);
        });
    }

    /**
     * Country flag emoji derived from the ISO 3166-1 alpha-2 country code.
     */
    protected function flag(): Attribute
    {
        return Attribute::make(get: function () {
            if (! $this->country_code) {
                return null;
            }

            return collect(mb_str_split(strtoupper($this->country_code)))
                ->map(fn (string $letter) => mb_chr(127397 + ord($letter)))
                ->implode('');
        });
    }

    /**
     * @return HasMany<Event, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
