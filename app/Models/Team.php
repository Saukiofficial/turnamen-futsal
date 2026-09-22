<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'team_name',
        'school_name',
        'head_coach',
        'manager_name',
        'manager_phone',
        'logo_path',
        'document_path',
        'registration_number',
        'access_code_plain',
        'access_code_hash',
        'qr_token',
        'verification_status',
        'verification_notes',
        'verified_by',
        'submitted_at',
        'verified_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    protected $appends = [
        'logo_url',
    ];

    /**
     * Get the publicly accessible URL for the team's logo.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo_path) {
            return null;
        }

        if (str_starts_with($this->logo_path, 'http://') || str_starts_with($this->logo_path, 'https://')) {
            return $this->logo_path;
        }

        $cleanPath = ltrim(str_replace(['public/', 'storage/'], '', $this->logo_path), '/');

        return asset('storage/'.$cleanPath);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function matchesAsTeamA(): HasMany
    {
        return $this->hasMany(TournamentMatch::class, 'team_a_id');
    }

    public function matchesAsTeamB(): HasMany
    {
        return $this->hasMany(TournamentMatch::class, 'team_b_id');
    }

    public function wonMatches(): HasMany
    {
        return $this->hasMany(TournamentMatch::class, 'winner_team_id');
    }

    public function players(): HasMany
    {
        return $this->hasMany(TeamPlayer::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'team_players')
            ->withPivot('nisn')
            ->withTimestamps();
    }

    public static function generateRegistrationNumber(int $eventId): string
    {
        $year = date('Y');
        $count = static::where('event_id', $eventId)->count() + 1;
        $sequence = str_pad((string) $count, 5, '0', STR_PAD_LEFT);
        $number = "TIM-{$year}-{$sequence}";

        while (static::where('registration_number', $number)->exists()) {
            $count++;
            $sequence = str_pad((string) $count, 5, '0', STR_PAD_LEFT);
            $number = "TIM-{$year}-{$sequence}";
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
