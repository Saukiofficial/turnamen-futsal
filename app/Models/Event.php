<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'slug',
        'description',
        'organizer',
        'banner_path',
        'logo_path',
        'registration_start_at',
        'registration_end_at',
        'selection_start_at',
        'selection_end_at',
        'location',
        'total_quota',
        'min_age',
        'max_age',
        'status',
        'close_when_full',
        'settings_json',
    ];

    protected function casts(): array
    {
        return [
            'registration_start_at' => 'datetime',
            'registration_end_at' => 'datetime',
            'selection_start_at' => 'datetime',
            'selection_end_at' => 'datetime',
            'close_when_full' => 'boolean',
            'settings_json' => 'array',
        ];
    }

    public function positions(): HasMany
    {
        return $this->hasMany(EventPosition::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function selectionSessions(): HasMany
    {
        return $this->hasMany(SelectionSession::class);
    }

    public function assessmentCriteria(): HasMany
    {
        return $this->hasMany(AssessmentCriterion::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }

    public function isOpenForRegistration(): bool
    {
        if ($this->status !== 'open') {
            return false;
        }

        $now = now();
        if ($now->lt($this->registration_start_at) || $now->gt($this->registration_end_at)) {
            return false;
        }

        if ($this->close_when_full && $this->registrations()->count() >= $this->total_quota) {
            return false;
        }

        return true;
    }

    public function getDaysRemainingAttribute(): int
    {
        if (! $this->registration_end_at) {
            return 0;
        }
        $now = now();
        if ($now->gt($this->registration_end_at)) {
            return 0;
        }

        return (int) ceil($now->diffInDays($this->registration_end_at, false));
    }
}
