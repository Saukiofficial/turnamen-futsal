<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentCriterion extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'description',
        'min_score',
        'max_score',
        'weight',
        'active',
    ];

    protected $casts = [
        'min_score' => 'integer',
        'max_score' => 'integer',
        'weight' => 'integer',
        'active' => 'boolean',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class, 'criterion_id');
    }
}
