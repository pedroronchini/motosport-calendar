<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChampionshipResource;
use App\Models\Championship;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ChampionshipController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $year = $request->integer('year') ?: null;

        $championships = Championship::where('is_active', true)
            ->when($year, fn ($query) => $query->withExists(['seasons as has_calendar' => function ($query) use ($year) {
                $query->where('year', $year)->whereHas('events');
            }]))
            ->orderBy('name')
            ->get();

        return ChampionshipResource::collection($championships);
    }
}
