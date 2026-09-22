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
        Schema::create('selection_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('name');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location')->nullable();
            $table->unsignedInteger('capacity')->default(50);
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('selection_sessions')->nullOnDelete();
            $table->string('status')->default('hadir'); // hadir, terlambat, tidak_hadir, izin
            $table->dateTime('checked_in_at')->useCurrent();
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique('registration_id'); // Satu check-in per pendaftaran
        });

        Schema::create('assessment_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('min_score')->default(0);
            $table->unsignedInteger('max_score')->default(100);
            $table->unsignedInteger('weight')->default(10); // Persentase bobot
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->foreignId('criterion_id')->constrained('assessment_criteria')->cascadeOnDelete();
            $table->foreignId('assessor_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('score', 5, 2)->default(0);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['registration_id', 'criterion_id', 'assessor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('assessment_criteria');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('selection_sessions');
    }
};
