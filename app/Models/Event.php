<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'season_id',
    'circuit_id',
    'round',
    'name',
    'slug',
    'status',
    'laps',
    'starts_at',
    'ends_at',
    'timezone',
    'description',
    'source_url',
    'external_id',
])]
class Event extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Season, $this>
     */
    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    /**
     * @return BelongsTo<Circuit, $this>
     */
    public function circuit(): BelongsTo
    {
        return $this->belongsTo(Circuit::class);
    }

    /**
     * @return HasMany<EventSession, $this>
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(EventSession::class);
    }

    /**
     * @return HasMany<EventChangeLog, $this>
     */
    public function changeLogs(): HasMany
    {
        return $this->hasMany(EventChangeLog::class);
    }

    /**
     * @return HasOne<EventResult, $this>
     */
    public function result(): HasOne
    {
        return $this->hasOne(EventResult::class);
    }

    /**
     * Resultados por classe/corrida (F2 sprint+feature, endurance por classe).
     *
     * @return HasMany<EventResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(EventResult::class);
    }
}
