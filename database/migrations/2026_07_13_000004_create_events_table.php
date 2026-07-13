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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('season_id')->constrained()->cascadeOnDelete();
            $table->foreignId('circuit_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('round');
            $table->string('name');
            $table->string('slug');
            $table->string('status')->default('scheduled');
            $table->unsignedSmallInteger('laps')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->string('timezone')->nullable();
            $table->text('description')->nullable();
            $table->string('source_url')->nullable();
            $table->string('external_id')->nullable();
            $table->timestamps();

            $table->unique(['season_id', 'round']);
            $table->index('status');
            $table->index('external_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
