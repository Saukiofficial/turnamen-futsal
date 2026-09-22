<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TournamentMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    /**
     * Display public tournament bracket and live match results.
     */
    public function index(Request $request): Response
    {
        $event = Event::where('status', 'open')->first()
            ?? Event::orderByDesc('id')->first();

        $matches = [];
        if ($event) {
            $matches = TournamentMatch::with(['teamA', 'teamB', 'winnerTeam'])
                ->where('event_id', $event->id)
                ->orderBy('round')
                ->orderBy('match_order')
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'round' => $m->round,
                        'match_order' => $m->match_order,
                        'status' => $m->status,
                        'live_period' => $m->live_period,
                        'live_minute' => $m->live_minute,
                        'live_stream_url' => $m->live_stream_url,
                        'court_name' => $m->court_name,
                        'match_time' => $m->match_time?->translatedFormat('d M, H:i').' WIB',
                        'score_a' => $m->score_a,
                        'score_b' => $m->score_b,
                        'penalty_a' => $m->penalty_a,
                        'penalty_b' => $m->penalty_b,
                        'team_a' => $m->teamA ? [
                            'id' => $m->teamA->id,
                            'name' => $m->teamA->team_name,
                            'school' => $m->teamA->school_name,
                            'logo_url' => $m->teamA->logo_url,
                        ] : null,
                        'team_b' => $m->teamB ? [
                            'id' => $m->teamB->id,
                            'name' => $m->teamB->team_name,
                            'school' => $m->teamB->school_name,
                            'logo_url' => $m->teamB->logo_url,
                        ] : null,
                        'winner_id' => $m->winner_team_id,
                        'next_match_id' => $m->next_match_id,
                    ];
                });
        }

        $collection = collect($matches);

        $rounds = [
            'perempat_final' => $collection->where('round', 'perempat_final')->values()->all(),
            'semifinal' => $collection->where('round', 'semifinal')->values()->all(),
            'final' => $collection->where('round', 'final')->values()->all(),
            'juara_3' => $collection->where('round', 'juara_3')->values()->all(),
        ];

        $stats = [
            'total_matches' => $collection->count(),
            'completed_matches' => $collection->where('status', 'completed')->count(),
            'live_matches' => $collection->where('status', 'live')->count(),
        ];

        $liveMatches = $collection->where('status', 'live')->values()->all();

        return Inertia::render('Public/Matches/Index', [
            'event' => $event ? [
                'id' => $event->id,
                'name' => $event->name,
                'organizer' => $event->organizer,
                'location' => $event->location,
            ] : null,
            'rounds' => $rounds,
            'stats' => $stats,
            'liveMatches' => $liveMatches,
            'matches' => $collection->all(),
        ]);
    }
}
