<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'round' => $this->round,
            'name' => $this->name,
            'slug' => $this->slug,
            'status' => $this->status,
            'laps' => $this->laps,
            'starts_at' => $this->starts_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'timezone' => $this->timezone,
            'description' => $this->description,
            'circuit' => new CircuitResource($this->whenLoaded('circuit')),
            'sessions' => EventSessionResource::collection($this->whenLoaded('sessions')),
            'result' => $this->whenLoaded('result', fn () => $this->result ? new EventResultResource($this->result) : null),
            'championship' => $this->whenLoaded('season', fn () => [
                'id' => $this->season->championship->id,
                'slug' => $this->season->championship->slug,
                'short_name' => $this->season->championship->short_name,
                'color' => $this->season->championship->color,
            ]),
        ];
    }
}
