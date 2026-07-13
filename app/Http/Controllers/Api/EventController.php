<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Championship;
use App\Models\Event;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EventController extends Controller
{
    public function index(Championship $championship, int $year): AnonymousResourceCollection
    {
        $season = $championship->seasons()->where('year', $year)->firstOrFail();

        $events = $season->events()
            ->with(['circuit', 'sessions', 'result'])
            ->orderBy('round')
            ->get();

        return EventResource::collection($events);
    }

    public function show(Event $event): EventResource
    {
        $event->load(['circuit', 'sessions', 'result', 'season.championship']);

        return new EventResource($event);
    }
}
