<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TournamentMatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'round',
        'match_order',
        'team_a_id',
        'team_b_id',
        'score_a',
        'score_b',
        'penalty_a',
        'penalty_b',
        'winner_team_id',
        'status',
        'live_period',
        'live_minute',
        'live_stream_url',
        'court_name',
        'match_time',
        'next_match_id',
    ];

    protected $casts = [
        'match_time' => 'datetime',
        'score_a' => 'integer',
        'score_b' => 'integer',
        'penalty_a' => 'integer',
        'penalty_b' => 'integer',
        'match_order' => 'integer',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function teamA(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_a_id');
    }

    public function teamB(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_b_id');
    }

    public function winnerTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'winner_team_id');
    }

    public function nextMatch(): BelongsTo
    {
        return $this->belongsTo(TournamentMatch::class, 'next_match_id');
    }
}
