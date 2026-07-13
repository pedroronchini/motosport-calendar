<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class ThisWeekendController extends Controller
{
    public function index(): JsonResponse
    {
        $today = Carbon::today();

        $daysToFriday = match ($today->dayOfWeek) {
            Carbon::FRIDAY => 0,
            Carbon::SATURDAY => -1,
            Carbon::SUNDAY => -2,
            default => Carbon::FRIDAY - $today->dayOfWeek,
        };

        $friday = $today->copy()->addDays($daysToFriday);
        $sunday = $friday->copy()->addDays(2);

        $events = Event::whereHas('season', fn ($query) => $query->where('is_current', true))
            ->whereBetween('starts_at', [$friday->copy()->startOfDay(), $sunday->copy()->endOfDay()])
            ->with(['circuit', 'sessions', 'result', 'season.championship'])
            ->orderBy('starts_at')
            ->get();

        return response()->json([
            'friday' => $friday->toDateString(),
            'sunday' => $sunday->toDateString(),
            'events' => EventResource::collection($events),
        ]);
    }
}
