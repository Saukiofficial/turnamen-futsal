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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('team_name');
            $table->string('school_name');
            $table->string('head_coach');
            $table->string('manager_name');
            $table->string('manager_phone'); // WhatsApp
            $table->string('logo_path')->nullable();
            $table->string('document_path')->nullable(); // Surat Rekomendasi & NISN Peserta (1 file)
            $table->string('registration_number')->unique()->index(); // TIM-2026-000001
            $table->string('access_code_plain', 12);
            $table->string('access_code_hash');
            $table->string('qr_token', 64)->unique()->index();
            $table->string('verification_status')->default('menunggu_verifikasi'); // menunggu_verifikasi, perlu_perbaikan, lolos_administrasi, ditolak
            $table->text('verification_notes')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
