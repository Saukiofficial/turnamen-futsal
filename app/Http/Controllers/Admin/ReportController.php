<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Models\TournamentMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $events = Event::select('id', 'name', 'code', 'status')->get();
        $selectedEventId = $eventId ?: ($events->firstWhere('status', 'open')?->id ?? $events->first()?->id);

        $event = Event::with('positions')->find($selectedEventId);

        $stats = [
            'total_registrants' => 0,
            'by_status' => [],
            'by_position' => [],
            'by_selection' => [],
            'attendance' => [
                'total_eligible' => 0,
                'present' => 0,
                'absent' => 0,
            ],
            'teams' => [
                'total_teams' => 0,
                'lolos_administrasi' => 0,
                'menunggu_verifikasi' => 0,
                'perlu_perbaikan' => 0,
                'ditolak' => 0,
                'total_players' => 0,
            ],
            'tournament' => [
                'total_matches' => 0,
                'completed' => 0,
                'scheduled' => 0,
                'in_progress' => 0,
            ],
        ];

        if ($event) {
            $regs = Registration::where('event_id', $event->id)->get();
            $stats['total_registrants'] = $regs->count();

            // By verification status
            $stats['by_status'] = [
                'lolos_administrasi' => $regs->where('verification_status', 'lolos_administrasi')->count(),
                'menunggu_verifikasi' => $regs->where('verification_status', 'menunggu_verifikasi')->count(),
                'dikirim_ulang' => $regs->where('verification_status', 'dikirim_ulang')->count(),
                'perlu_perbaikan' => $regs->where('verification_status', 'perlu_perbaikan')->count(),
                'ditolak' => $regs->where('verification_status', 'ditolak')->count(),
            ];

            // By position
            foreach (['Goalkeeper', 'Anchor', 'Flank', 'Pivot'] as $pos) {
                $stats['by_position'][$pos] = $regs->where('primary_position', $pos)->count();
            }

            // By selection status
            $stats['by_selection'] = [
                'lolos_seleksi' => $regs->where('selection_status', 'lolos_seleksi')->count(),
                'cadangan' => $regs->where('selection_status', 'cadangan')->count(),
                'tidak_lolos' => $regs->where('selection_status', 'tidak_lolos')->count(),
                'menunggu' => $regs->where('selection_status', 'menunggu_seleksi')->count(),
            ];

            // Attendance
            $eligibleIds = $regs->where('verification_status', 'lolos_administrasi')->pluck('id');
            $stats['attendance']['total_eligible'] = $eligibleIds->count();
            $stats['attendance']['present'] = Attendance::whereIn('registration_id', $eligibleIds)->count();
            $stats['attendance']['absent'] = max(0, $eligibleIds->count() - $stats['attendance']['present']);

            // School Teams
            $teams = Team::where('event_id', $event->id)->get();
            $stats['teams']['total_teams'] = $teams->count();
            $stats['teams']['lolos_administrasi'] = $teams->where('verification_status', 'lolos_administrasi')->count();
            $stats['teams']['menunggu_verifikasi'] = $teams->where('verification_status', 'menunggu_verifikasi')->count();
            $stats['teams']['perlu_perbaikan'] = $teams->where('verification_status', 'perlu_perbaikan')->count();
            $stats['teams']['ditolak'] = $teams->where('verification_status', 'ditolak')->count();
            $stats['teams']['total_players'] = TeamPlayer::whereHas('team', fn ($q) => $q->where('event_id', $event->id))->count();

            // Tournament Matches
            $matches = TournamentMatch::where('event_id', $event->id)->get();
            $stats['tournament']['total_matches'] = $matches->count();
            $stats['tournament']['completed'] = $matches->where('status', 'completed')->count();
            $stats['tournament']['scheduled'] = $matches->where('status', 'scheduled')->count();
            $stats['tournament']['in_progress'] = $matches->where('status', 'in_progress')->count();
        }

        return Inertia::render('Admin/Reports/Index', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'stats' => $stats,
        ]);
    }
}
