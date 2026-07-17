<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Categorias com mais de uma corrida por evento (F2/F3 sprint+feature) ou com
// vencedor por classe (IMSA, WEC, GTWC) precisam de vários resultados por
// evento. A coluna `class` distingue cada resultado e o unique passa a ser
// composto. Para a F1 a coluna fica nula (resultado único).
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // hasColumn: em alguns ambientes a coluna foi criada manualmente antes
        // desta migration existir.
        if (! Schema::hasColumn('event_results', 'class')) {
            Schema::table('event_results', function (Blueprint $table) {
                $table->string('class')->nullable()->after('event_id');
            });
        }

        // O unique composto é criado antes de remover o antigo: como event_id é
        // a primeira coluna, ele assume o papel de índice da FK no MySQL.
        Schema::table('event_results', function (Blueprint $table) {
            $table->unique(['event_id', 'class']);
        });

        Schema::table('event_results', function (Blueprint $table) {
            if (Schema::hasIndex('event_results', ['event_id'], 'unique')) {
                $table->dropUnique(['event_id']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_results', function (Blueprint $table) {
            $table->unique('event_id');
        });

        Schema::table('event_results', function (Blueprint $table) {
            $table->dropUnique(['event_id', 'class']);
            $table->dropColumn('class');
        });
    }
};
