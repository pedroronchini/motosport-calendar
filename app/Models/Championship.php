<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'short_name',
    'slug',
    'category',
    'description',
    'logo_path',
    'color',
    'text_color',
    'website',
    'is_active',
])]
class Championship extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Season, $this>
     */
    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }

    /**
     * @return HasMany<ScrapeLog, $this>
     */
    public function scrapeLogs(): HasMany
    {
        return $this->hasMany(ScrapeLog::class);
    }
}
