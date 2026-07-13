<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CircuitResource extends JsonResource
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
            'country' => $this->country,
            'country_code' => $this->country_code,
            'flag' => $this->flag,
            'city' => $this->city,
            'length_km' => $this->length_km,
            'number_of_turns' => $this->number_of_turns,
            'first_event_year' => $this->first_event_year,
            'lap_record' => $this->lap_record_ms ? [
                'time' => $this->lap_record_formatted,
                'holder' => $this->lap_record_holder,
                'year' => $this->lap_record_year,
            ] : null,
            'map_image_url' => $this->map_image_path ? Storage::url($this->map_image_path) : null,
            'photo_url' => $this->photo_path ? Storage::url($this->photo_path) : null,
        ];
    }
}
