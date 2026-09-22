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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->text('nik_encrypted');
            $table->string('nik_hash', 64)->index();
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('school_name')->nullable();
            $table->timestamps();
        });

        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->string('registration_number')->unique()->index();
            $table->string('access_code_hash');
            $table->string('access_code_plain', 12);
            $table->string('qr_token', 64)->unique()->index();
            $table->string('primary_position'); // Goalkeeper, Anchor, Flank, Pivot
            $table->string('photo_path')->nullable();
            $table->string('registration_status')->default('submitted'); // draft, submitted
            $table->string('verification_status')->default('menunggu_verifikasi'); // menunggu_verifikasi, perlu_perbaikan, dikirim_ulang, lolos_administrasi, ditolak
            $table->string('selection_status')->default('menunggu_seleksi'); // menunggu_seleksi, lolos_seleksi, cadangan, tidak_lolos
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('revision_count')->default(0);
            $table->boolean('duplicate_flag')->default(false);
            $table->text('verification_notes')->nullable();
            $table->json('revision_fields')->nullable();
            $table->timestamps();

            $table->unique(['event_id', 'participant_id']);
        });

        Schema::create('registration_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->unsignedInteger('revision_number')->default(1);
            $table->json('changed_fields');
            $table->dateTime('submitted_at');
            $table->dateTime('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('verification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->cascadeOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('previous_status');
            $table->string('new_status');
            $table->json('checklist_json')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_logs');
        Schema::dropIfExists('registration_revisions');
        Schema::dropIfExists('registrations');
        Schema::dropIfExists('participants');
    }
};
