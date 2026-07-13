<?php

use App\Http\Controllers\Api\ChampionshipController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\SeasonController;
use App\Http\Controllers\Api\ThisWeekendController;
use Illuminate\Support\Facades\Route;

Route::get('championships', [ChampionshipController::class, 'index']);
Route::get('seasons/years', [SeasonController::class, 'years']);
Route::get('championships/{championship:slug}/seasons/{year}/events', [EventController::class, 'index']);
Route::get('events/{event}', [EventController::class, 'show']);
Route::get('this-weekend', [ThisWeekendController::class, 'index']);
