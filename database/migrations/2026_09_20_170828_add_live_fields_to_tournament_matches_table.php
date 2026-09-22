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
        Schema::table('tournament_matches', function (Blueprint $table) {
            $table->string('live_period')->nullable()->after('status');
            $table->string('live_minute')->nullable()->after('live_period');
            $table->string('live_stream_url')->nullable()->after('court_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tournament_matches', function (Blueprint $table) {
            $table->dropColumn(['live_period', 'live_minute', 'live_stream_url']);
        });
    }
};
