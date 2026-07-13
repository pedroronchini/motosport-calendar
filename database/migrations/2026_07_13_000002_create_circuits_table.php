<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('circuits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('country');
            $table->string('country_code', 2);
            $table->string('city')->nullable();
            $table->decimal('length_km', 6, 3)->nullable();
            $table->unsignedInteger('lap_record_ms')->nullable();
            $table->string('lap_record_holder')->nullable();
            $table->unsignedSmallInteger('lap_record_year')->nullable();
            $table->unsignedTinyInteger('number_of_turns')->nullable();
            $table->unsignedTinyInteger('drs_zones')->nullable();
            $table->string('type')->nullable();
            $table->unsignedSmallInteger('first_event_year')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('description')->nullable();
            $table->string('map_image_path')->nullable();
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('circuits');
    }
};
