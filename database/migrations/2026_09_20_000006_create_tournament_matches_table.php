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
        Schema::create('tournament_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('round'); // 16_besar, perempat_final, semifinal, final, juara_3
            $table->unsignedInteger('match_order')->default(1); // Urutan pertandingan dalam bagan
            $table->foreignId('team_a_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('team_b_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->integer('score_a')->nullable();
            $table->integer('score_b')->nullable();
            $table->integer('penalty_a')->nullable();
            $table->integer('penalty_b')->nullable();
            $table->foreignId('winner_team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->string('status')->default('scheduled'); // scheduled, live, completed
            $table->string('court_name')->nullable(); // Lapangan 1 / Arena Utama
            $table->dateTime('match_time')->nullable();
            $table->unsignedBigInteger('next_match_id')->nullable(); // Bagan pertandingan babak berikutnya
            $table->timestamps();

            $table->foreign('next_match_id')->references('id')->on('tournament_matches')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournament_matches');
    }
};
