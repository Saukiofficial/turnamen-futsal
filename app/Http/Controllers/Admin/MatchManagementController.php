<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Team;
use App\Models\TournamentMatch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MatchManagementController extends Controller
{
    /**
     * Display match management and bracket builder in Admin.
     */
    public function index(): Response
    {
        $event = Event::where('status', 'open')->first()
            ?? Event::orderByDesc('id')->first();

        $teams = [];
        $matches = [];

        if ($event) {
            $teams = Team::where('event_id', $event->id)
                ->where('verification_status', 'lolos_administrasi')
                ->select('id', 'team_name', 'school_name', 'logo_path')
                ->get()
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->team_name,
                    'school' => $t->school_name,
                    'logo_url' => $t->logo_path ? asset('storage/'.$t->logo_path) : null,
                ]);

            $matches = TournamentMatch::with(['teamA', 'teamB', 'winnerTeam'])
                ->where('event_id', $event->id)
                ->orderBy('round')
                ->orderBy('match_order')
                ->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'round' => $m->round,
                    'match_order' => $m->match_order,
                    'status' => $m->status,
                    'live_period' => $m->live_period,
                    'live_minute' => $m->live_minute,
                    'live_stream_url' => $m->live_stream_url,
                    'court_name' => $m->court_name,
                    'match_time' => $m->match_time?->format('Y-m-d\TH:i'),
                    'score_a' => $m->score_a,
                    'score_b' => $m->score_b,
                    'penalty_a' => $m->penalty_a,
                    'penalty_b' => $m->penalty_b,
                    'team_a' => $m->teamA ? [
                        'id' => $m->teamA->id,
                        'name' => $m->teamA->team_name,
                        'school' => $m->teamA->school_name,
                        'logo_url' => $m->teamA->logo_path ? asset('storage/'.$m->teamA->logo_path) : null,
                    ] : null,
                    'team_b' => $m->teamB ? [
                        'id' => $m->teamB->id,
                        'name' => $m->teamB->team_name,
                        'school' => $m->teamB->school_name,
                        'logo_url' => $m->teamB->logo_path ? asset('storage/'.$m->teamB->logo_path) : null,
                    ] : null,
                    'winner_id' => $m->winner_team_id,
                    'next_match_id' => $m->next_match_id,
                ]);
        }

        return Inertia::render('Admin/Matches/Index', [
            'event' => $event ? [
                'id' => $event->id,
                'name' => $event->name,
            ] : null,
            'verifiedTeams' => $teams,
            'matches' => $matches,
        ]);
    }

    /**
     * Automatically generate an 8-team or 16-team knockout bracket.
     */
    public function setupBracket(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'bracket_size' => ['required', 'in:8,16'],
            'matchups' => ['nullable', 'array'],
            'matchups.*.order' => ['required_with:matchups', 'integer', 'in:1,2,3,4'],
            'matchups.*.team_a_id' => ['nullable', 'exists:teams,id'],
            'matchups.*.team_b_id' => ['nullable', 'exists:teams,id'],
            'matchups.*.court_name' => ['nullable', 'string', 'max:50'],
            'matchups.*.match_time' => ['nullable'],
        ]);

        $eventId = (int) $validated['event_id'];
        $size = (int) $validated['bracket_size'];
        $customMatchups = collect($validated['matchups'] ?? [])->keyBy('order');

        // Get verified teams
        $teams = Team::where('event_id', $eventId)
            ->where('verification_status', 'lolos_administrasi')
            ->inRandomOrder()
            ->take($size)
            ->get();

        DB::transaction(function () use ($eventId, $size, $teams, $customMatchups) {
            // Delete existing matches for this event
            TournamentMatch::where('event_id', $eventId)->delete();

            if ($size === 8) {
                // Final
                $final = TournamentMatch::create([
                    'event_id' => $eventId,
                    'round' => 'final',
                    'match_order' => 1,
                    'status' => 'scheduled',
                    'court_name' => 'Lapangan Utama',
                ]);

                // Perebutan Juara 3
                TournamentMatch::create([
                    'event_id' => $eventId,
                    'round' => 'juara_3',
                    'match_order' => 1,
                    'status' => 'scheduled',
                    'court_name' => 'Lapangan 2',
                ]);

                // Semifinals (2 matches) -> point to final
                $semi1 = TournamentMatch::create([
                    'event_id' => $eventId,
                    'round' => 'semifinal',
                    'match_order' => 1,
                    'next_match_id' => $final->id,
                    'status' => 'scheduled',
                    'court_name' => 'Lapangan 1',
                ]);

                $semi2 = TournamentMatch::create([
                    'event_id' => $eventId,
                    'round' => 'semifinal',
                    'match_order' => 2,
                    'next_match_id' => $final->id,
                    'status' => 'scheduled',
                    'court_name' => 'Lapangan 2',
                ]);

                // Quarterfinals (4 matches) -> point to semi1 and semi2
                $quarters = [
                    ['order' => 1, 'next' => $semi1->id],
                    ['order' => 2, 'next' => $semi1->id],
                    ['order' => 3, 'next' => $semi2->id],
                    ['order' => 4, 'next' => $semi2->id],
                ];

                foreach ($quarters as $idx => $q) {
                    $custom = $customMatchups->get($q['order']);

                    $teamAId = ! empty($custom['team_a_id']) ? (int) $custom['team_a_id'] : $teams->get($idx * 2)?->id;
                    $teamBId = ! empty($custom['team_b_id']) ? (int) $custom['team_b_id'] : $teams->get($idx * 2 + 1)?->id;
                    $courtName = ! empty($custom['court_name']) ? $custom['court_name'] : 'Lapangan '.(($q['order'] % 2 === 1) ? '1' : '2');
                    $matchTime = ! empty($custom['match_time']) ? $custom['match_time'] : null;

                    TournamentMatch::create([
                        'event_id' => $eventId,
                        'round' => 'perempat_final',
                        'match_order' => $q['order'],
                        'team_a_id' => $teamAId,
                        'team_b_id' => $teamBId,
                        'next_match_id' => $q['next'],
                        'status' => 'scheduled',
                        'court_name' => $courtName,
                        'match_time' => $matchTime,
                    ]);
                }
            }
        });

        return back()->with('success', "Bagan turnamen sistem gugur ({$size} Tim) berhasil dibuat.");
    }

    /**
     * Update match scores, status, and advance winner to the next round in the bracket.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $match = TournamentMatch::findOrFail($id);

        $validated = $request->validate([
            'score_a' => ['nullable', 'integer', 'min:0'],
            'score_b' => ['nullable', 'integer', 'min:0'],
            'penalty_a' => ['nullable', 'integer', 'min:0'],
            'penalty_b' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:scheduled,live,completed'],
            'live_period' => ['nullable', 'string', 'max:50'],
            'live_minute' => ['nullable', 'string', 'max:20'],
            'live_stream_url' => ['nullable', 'string', 'max:255'],
            'court_name' => ['nullable', 'string', 'max:50'],
            'match_time' => ['nullable', 'date'],
            'team_a_id' => ['nullable', 'exists:teams,id'],
            'team_b_id' => ['nullable', 'exists:teams,id'],
            'winner_team_id' => ['nullable', 'exists:teams,id'],
        ]);

        DB::transaction(function () use ($match, $validated) {
            // Determine winner automatically if completed and scores provided
            $winnerId = $validated['winner_team_id'] ?? null;

            if ($validated['status'] === 'completed' && ! $winnerId) {
                if (isset($validated['score_a'], $validated['score_b'])) {
                    if ($validated['score_a'] > $validated['score_b']) {
                        $winnerId = $match->team_a_id;
                    } elseif ($validated['score_b'] > $validated['score_a']) {
                        $winnerId = $match->team_b_id;
                    } elseif (isset($validated['penalty_a'], $validated['penalty_b'])) {
                        if ($validated['penalty_a'] > $validated['penalty_b']) {
                            $winnerId = $match->team_a_id;
                        } elseif ($validated['penalty_b'] > $validated['penalty_a']) {
                            $winnerId = $match->team_b_id;
                        }
                    }
                }
            }

            // Defaults when switching to live
            $scoreA = $validated['score_a'] ?? ($validated['status'] === 'live' ? ($match->score_a ?? 0) : $match->score_a);
            $scoreB = $validated['score_b'] ?? ($validated['status'] === 'live' ? ($match->score_b ?? 0) : $match->score_b);
            $livePeriod = $validated['live_period'] ?? ($validated['status'] === 'live' ? ($match->live_period ?? 'Babak 1') : $match->live_period);

            if ($validated['status'] === 'completed') {
                $livePeriod = 'Selesai';
            }

            $updateData = [
                'score_a' => $scoreA,
                'score_b' => $scoreB,
                'penalty_a' => $validated['penalty_a'] ?? $match->penalty_a,
                'penalty_b' => $validated['penalty_b'] ?? $match->penalty_b,
                'status' => $validated['status'],
                'live_period' => $livePeriod,
                'live_minute' => $validated['live_minute'] ?? $match->live_minute,
                'live_stream_url' => $validated['live_stream_url'] ?? $match->live_stream_url,
                'court_name' => $validated['court_name'] ?? $match->court_name,
                'match_time' => $validated['match_time'] ?? $match->match_time,
                'winner_team_id' => $winnerId,
            ];

            if (array_key_exists('team_a_id', $validated)) {
                $updateData['team_a_id'] = $validated['team_a_id'];
            }
            if (array_key_exists('team_b_id', $validated)) {
                $updateData['team_b_id'] = $validated['team_b_id'];
            }

            $match->update($updateData);

            // Auto-advance winner to next match in the bracket
            if ($winnerId && $match->next_match_id) {
                $nextMatch = TournamentMatch::find($match->next_match_id);
                if ($nextMatch) {
                    if ($match->match_order % 2 === 1) {
                        $nextMatch->update(['team_a_id' => $winnerId]);
                    } else {
                        $nextMatch->update(['team_b_id' => $winnerId]);
                    }
                }
            }

            AuditLog::log('match_updated', $match, null, [
                'round' => $match->round,
                'score' => "{$match->score_a} - {$match->score_b}",
                'status' => $match->status,
                'winner_id' => $winnerId,
            ]);
        });

        return back()->with('success', 'Data pertandingan dan skor berhasil diperbarui.');
    }
}
