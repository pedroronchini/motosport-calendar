<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Reraspa o calendário da temporada atual toda terça de manhã, capturando
// mudanças de horário/status após os fins de semana de corrida.
// Requer o scheduler ativo no servidor: `* * * * * php artisan schedule:run`.
Schedule::command('scrape:f1 --current')->weeklyOn(2, '05:00')->withoutOverlapping();
