<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Team;
use App\Models\TournamentMatch;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $event = $eventId
            ? Event::with('positions')->find($eventId)
            : Event::where('status', 'open')->first() ?? Event::latest()->first();

        if (! $event) {
            return Inertia::render('Admin/Dashboard', [
                'event' => null,
                'kpis' => null,
                'trendData' => [],
                'positionQuotas' => [],
                'recentRegistrations' => [],
                'recentActivities' => [],
            ]);
        }

        $registrationsQuery = Registration::where('event_id', $event->id);

        $totalRegistrants = (clone $registrationsQuery)->count();
        $waitingVerification = (clone $registrationsQuery)->whereIn('verification_status', ['menunggu_verifikasi', 'dikirim_ulang'])->count();
        $approvedAdmin = (clone $registrationsQuery)->where('verification_status', 'lolos_administrasi')->count();
        $needRevision = (clone $registrationsQuery)->where('verification_status', 'perlu_perbaikan')->count();

        // Trend data for last 14 days
        $trendData = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $label = Carbon::now()->subDays($i)->translatedFormat('d M');
            $count = (clone $registrationsQuery)->whereDate('submitted_at', $date)->count();
            $trendData[] = [
                'date' => $date,
                'label' => $label,
                'total' => $count,
            ];
        }

        // Position quotas
        $positionQuotas = $event->positions()->where('active', true)->get()->map(function ($pos) use ($event) {
            $filled = Registration::where('event_id', $event->id)
                ->where('primary_position', $pos->position_name)
                ->count();

            return [
                'name' => $pos->position_name,
                'quota' => $pos->quota,
                'filled' => $filled,
                'percentage' => $pos->quota > 0 ? min(100, round(($filled / $pos->quota) * 100)) : 0,
            ];
        });

        // Recent registrants (with participant details)
        $recentRegistrations = (clone $registrationsQuery)
            ->with('participant')
            ->latest('submitted_at')
            ->take(6)
            ->get()
            ->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'full_name' => $reg->participant->full_name,
                    'school_name' => $reg->participant->school_name ?? 'Umum',
                    'primary_position' => $reg->primary_position,
                    'submitted_at' => $reg->submitted_at?->translatedFormat('d M Y, H:i'),
                    'verification_status' => $reg->verification_status,
                    'photo_url' => $reg->photo_path ? \Storage::url($reg->photo_path) : null,
                ];
            });

        // Recent activities from audit logs
        $recentActivities = AuditLog::with('user')
            ->latest('created_at')
            ->take(6)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'user_name' => $log->user->name ?? 'Sistem',
                    'created_at' => $log->created_at->diffForHumans(),
                    'description' => match ($log->action) {
                        'participant_registered' => 'Pendaftar baru telah mengirim formulir',
                        'participant_verified' => 'Verifikator menyetujui berkas pendaftar',
                        'participant_needs_revision' => 'Meminta perbaikan berkas pendaftar',
                        'participant_rejected' => 'Menolak verifikasi administrasi',
                        'participant_checked_in' => 'Check-in kehadiran turnamen berhasil',
                        default => $log->action,
                    },
                ];
            });

        // Team metrics & recent registered teams
        $teamsQuery = Team::where('event_id', $event->id);
        $totalTeams = (clone $teamsQuery)->count();
        $approvedTeams = (clone $teamsQuery)->where('verification_status', 'lolos_administrasi')->count();
        $waitingTeams = (clone $teamsQuery)->where('verification_status', 'menunggu_verifikasi')->count();
        $revisionTeams = (clone $teamsQuery)->where('verification_status', 'perlu_perbaikan')->count();

        $recentTeams = (clone $teamsQuery)
            ->withCount('players')
            ->latest('submitted_at')
            ->take(5)
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->id,
                    'registration_number' => $team->registration_number,
                    'team_name' => $team->team_name,
                    'school_name' => $team->school_name,
                    'head_coach' => $team->head_coach,
                    'manager_name' => $team->manager_name,
                    'players_count' => $team->players_count,
                    'verification_status' => $team->verification_status,
                    'submitted_at' => $team->submitted_at?->translatedFormat('d M Y, H:i') ?? '-',
                    'logo_url' => $team->logo_path ? \Storage::url($team->logo_path) : null,
                ];
            });

        // Tournament bracket matches
        $tournamentMatchesQuery = TournamentMatch::where('event_id', $event->id);
        $totalMatches = (clone $tournamentMatchesQuery)->count();
        $completedMatches = (clone $tournamentMatchesQuery)->where('status', 'completed')->count();
        $upcomingMatches = (clone $tournamentMatchesQuery)->whereIn('status', ['scheduled', 'in_progress'])->count();

        return Inertia::render('Admin/Dashboard', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'code' => $event->code,
                'status' => $event->status,
                'is_open' => $event->isOpenForRegistration(),
                'total_quota' => $event->total_quota,
                'registered_count' => $totalRegistrants,
                'days_remaining' => $event->days_remaining,
                'registration_start_at' => $event->registration_start_at->translatedFormat('d M Y'),
                'registration_end_at' => $event->registration_end_at->translatedFormat('d M Y'),
            ],
            'kpis' => [
                'total_registrants' => [
                    'value' => $totalRegistrants,
                    'meta' => '+18 minggu ini',
                ],
                'waiting_verification' => [
                    'value' => $waitingVerification,
                    'meta' => $totalRegistrants > 0 ? round(($waitingVerification / $totalRegistrants) * 100, 1).'% dari total' : '0%',
                ],
                'approved_admin' => [
                    'value' => $approvedAdmin,
                    'meta' => $totalRegistrants > 0 ? round(($approvedAdmin / $totalRegistrants) * 100, 1).'% dari total' : '0%',
                ],
                'need_revision' => [
                    'value' => $needRevision,
                    'meta' => $totalRegistrants > 0 ? round(($needRevision / $totalRegistrants) * 100, 1).'% dari total' : '0%',
                ],
            ],
            'teamKpis' => [
                'total_teams' => $totalTeams,
                'approved_teams' => $approvedTeams,
                'waiting_teams' => $waitingTeams,
                'revision_teams' => $revisionTeams,
            ],
            'tournamentKpis' => [
                'total_matches' => $totalMatches,
                'completed_matches' => $completedMatches,
                'upcoming_matches' => $upcomingMatches,
            ],
            'trendData' => $trendData,
            'positionQuotas' => $positionQuotas,
            'recentRegistrations' => $recentRegistrations,
            'recentTeams' => $recentTeams,
            'recentActivities' => $recentActivities,
        ]);
    }
}
