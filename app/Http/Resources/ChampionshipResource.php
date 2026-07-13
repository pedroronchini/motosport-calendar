<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ChampionshipResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'short_name' => $this->short_name,
            'category' => $this->category,
            'description' => $this->description,
            'color' => $this->color,
            'text_color' => $this->text_color,
            'logo_url' => $this->logo_path ? Storage::url($this->logo_path) : null,
            'website' => $this->website,
            'has_calendar' => isset($this->has_calendar) ? (bool) $this->has_calendar : null,
        ];
    }
}
