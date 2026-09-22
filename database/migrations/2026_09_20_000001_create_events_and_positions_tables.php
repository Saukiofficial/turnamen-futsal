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
            $table->string('name');
            $table->string('code')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('organizer')->default('Asosiasi Futsal / Panitia Seleksi');
            $table->string('banner_path')->nullable();
            $table->string('logo_path')->nullable();
            $table->dateTime('registration_start_at');
            $table->dateTime('registration_end_at');
            $table->dateTime('selection_start_at')->nullable();
            $table->dateTime('selection_end_at')->nullable();
            $table->string('location')->nullable();
            $table->unsignedInteger('total_quota')->default(100);
            $table->unsignedSmallInteger('min_age')->nullable();
            $table->unsignedSmallInteger('max_age')->nullable();
            $table->string('status')->default('open'); // draft, scheduled, open, paused, closed, completed, archived
            $table->boolean('close_when_full')->default(true);
            $table->json('settings_json')->nullable();
            $table->timestamps();
        });

        Schema::create('event_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('position_name'); // Goalkeeper, Anchor, Flank, Pivot
            $table->unsignedInteger('quota')->default(25);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['event_id', 'position_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_positions');
        Schema::dropIfExists('events');
    }
};
