<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventPosition extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'position_name',
        'quota',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'quota' => 'integer',
            'active' => 'boolean',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
