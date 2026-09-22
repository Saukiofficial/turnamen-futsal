<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'participant_id',
        'registration_number',
        'access_code_hash',
        'access_code_plain',
        'qr_token',
        'primary_position',
        'photo_path',
        'registration_status',
        'verification_status',
        'selection_status',
        'submitted_at',
        'verified_at',
        'verified_by',
        'revision_count',
        'duplicate_flag',
        'verification_notes',
        'revision_fields',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
        'revision_fields' => 'array',
        'duplicate_flag' => 'boolean',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(RegistrationRevision::class);
    }

    public function verificationLogs(): HasMany
    {
        return $this->hasMany(VerificationLog::class);
    }

    public function attendance(): HasOne
    {
        return $this->hasOne(Attendance::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }

    public static function generateRegistrationNumber(int $eventId): string
    {
        $year = date('Y');
        // Count registrations in the current year to make sequential
        $count = static::whereYear('created_at', $year)->count() + 1;
        $sequence = str_pad((string) $count, 6, '0', STR_PAD_LEFT);

        $number = "FTS-{$year}-{$sequence}";
        while (static::where('registration_number', $number)->exists()) {
            $count++;
            $sequence = str_pad((string) $count, 6, '0', STR_PAD_LEFT);
            $number = "FTS-{$year}-{$sequence}";
        }

        return $number;
    }

    public static function generateAccessCode(): string
    {
        return strtoupper(Str::random(8));
    }

    public static function generateQrToken(): string
    {
        return Str::random(40);
    }
}
