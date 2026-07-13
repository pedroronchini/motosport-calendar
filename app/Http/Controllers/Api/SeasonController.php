<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\JsonResponse;

class SeasonController extends Controller
{
    public function years(): JsonResponse
    {
        return response()->json([
            'years' => Season::query()->distinct()->orderByDesc('year')->pluck('year'),
            'current_year' => Season::where('is_current', true)->value('year'),
        ]);
    }
}
