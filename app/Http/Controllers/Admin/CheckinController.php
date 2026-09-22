<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Registration;
use App\Models\SelectionSession;
use App\Models\Team;
use App\Models\TeamPlayer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CheckinController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $events = Event::select('id', 'name', 'code', 'status')->get();
        $selectedEventId = $eventId ?: ($events->firstWhere('status', 'open')?->id ?? $events->first()?->id);

        $sessions = SelectionSession::where('event_id', $selectedEventId)->get();

        $officialRegistrationsQuery = Registration::where('event_id', $selectedEventId)
            ->where('verification_status', 'lolos_administrasi')
            ->whereHas('participant.teamPlayers.team', function ($query) use ($selectedEventId) {
                $query->where('event_id', $selectedEventId)
                    ->where('verification_status', 'lolos_administrasi');
            });

        $totalEligible = (clone $officialRegistrationsQuery)->count();

        $attendancesQuery = Attendance::whereHas('registration', function ($query) use ($selectedEventId) {
            $query->where('event_id', $selectedEventId)
                ->whereHas('participant.teamPlayers.team', function ($teamQuery) use ($selectedEventId) {
                    $teamQuery->where('event_id', $selectedEventId)
                        ->where('verification_status', 'lolos_administrasi');
                });
        });
        $totalPresent = (clone $attendancesQuery)->where('status', 'hadir')->count();
        $totalLate = (clone $attendancesQuery)->where('status', 'terlambat')->count();

        $recentCheckins = Attendance::with(['registration.participant', 'session', 'checkedInBy'])
            ->whereHas('registration', fn ($q) => $q->where('event_id', $selectedEventId))
            ->whereHas('registration.participant.teamPlayers.team', function ($query) use ($selectedEventId) {
                $query->where('event_id', $selectedEventId)
                    ->where('verification_status', 'lolos_administrasi');
            })
            ->latest('checked_in_at')
            ->take(10)
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'registration_number' => $att->registration->registration_number,
                    'full_name' => $att->registration->participant->full_name,
                    'position' => $att->registration->primary_position,
                    'status' => $att->status,
                    'checked_in_at' => $att->checked_in_at->translatedFormat('H:i:s'),
                    'session_name' => $att->session?->name ?? 'Sesi Umum',
                    'checked_in_by' => $att->checkedInBy?->name ?? 'Petugas',
                    'photo_url' => $att->registration->photo_path ? Storage::url($att->registration->photo_path) : null,
                ];
            });

        return Inertia::render('Admin/Checkin/Index', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'sessions' => $sessions,
            'stats' => [
                'total_eligible' => $totalEligible,
                'present' => $totalPresent,
                'late' => $totalLate,
                'unaccounted' => max(0, $totalEligible - ($totalPresent + $totalLate)),
            ],
            'recentCheckins' => $recentCheckins,
        ]);
    }

    /**
     * Search/Scan lookup by QR token or Registration Number.
     */
    public function lookup(Request $request): JsonResponse
    {
        $keyword = trim($request->input('keyword', ''));
        $eventId = $request->input('event_id');

        if (empty($keyword)) {
            return response()->json(['found' => false, 'message' => 'Masukkan nomor pendaftaran atau pindai QR token.']);
        }

        $registration = Registration::with(['participant', 'event', 'attendance'])
            ->where('event_id', $eventId)
            ->where(function ($q) use ($keyword) {
                $q->where('qr_token', $keyword)
                    ->orWhere('registration_number', $keyword);
            })
            ->first();

        if (! $registration) {
            $team = Team::with(['players.participant.registrations.attendance', 'event'])
                ->where('event_id', $eventId)
                ->where(function ($q) use ($keyword) {
                    $q->where('qr_token', $keyword)
                        ->orWhere('registration_number', $keyword);
                })
                ->first();

            if ($team) {
                return response()->json([
                    'found' => true,
                    'type' => 'team',
                    'team' => [
                        'id' => $team->id,
                        'registration_number' => $team->registration_number,
                        'team_name' => $team->team_name,
                        'school_name' => $team->school_name,
                        'head_coach' => $team->head_coach,
                        'manager_name' => $team->manager_name,
                        'manager_phone' => $team->manager_phone,
                        'verification_status' => $team->verification_status,
                        'is_eligible' => $team->verification_status === 'lolos_administrasi',
                        'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                        'submitted_at' => $team->submitted_at?->translatedFormat('d M Y, H:i') ?? '-',
                        'players' => $team->players->map(function ($player) use ($team) {
                            $participant = $player->participant;
                            $registration = $participant?->registrations->firstWhere('event_id', $team->event_id);

                            return [
                                'id' => $player->id,
                                'registration_id' => $registration?->id,
                                'nisn' => $player->nisn,
                                'full_name' => $participant?->full_name ?? 'Pemain',
                                'school_name' => $participant?->school_name ?? '-',
                                'birth_date' => $participant?->birth_date?->translatedFormat('d M Y') ?? '-',
                                'position' => $registration?->primary_position ?? 'Pemain',
                                'photo_url' => $registration?->photo_path ? Storage::url($registration->photo_path) : null,
                                'is_eligible' => $team->verification_status === 'lolos_administrasi'
                                    && $registration?->verification_status === 'lolos_administrasi',
                                'attendance' => $registration?->attendance ? [
                                    'status' => $registration->attendance->status,
                                    'checked_in_at' => $registration->attendance->checked_in_at->translatedFormat('d M Y, H:i:s'),
                                ] : null,
                            ];
                        })->values(),
                    ],
                ]);
            }

            return response()->json([
                'found' => false,
                'message' => 'Pendaftar individu atau tim tidak ditemukan pada event ini.',
            ], 404);
        }

        $alreadyCheckedIn = $registration->attendance !== null;
        $teamPlayer = TeamPlayer::with('team')
            ->where('participant_id', $registration->participant_id)
            ->whereHas('team', fn ($query) => $query->where('event_id', $registration->event_id))
            ->first();
        $isOfficialRosterPlayer = $teamPlayer?->team?->verification_status === 'lolos_administrasi';
        $isEligible = $registration->verification_status === 'lolos_administrasi' && $isOfficialRosterPlayer;

        return response()->json([
            'found' => true,
            'type' => 'player',
            'already_checked_in' => $alreadyCheckedIn,
            'attendance' => $alreadyCheckedIn ? [
                'status' => $registration->attendance->status,
                'checked_in_at' => $registration->attendance->checked_in_at->translatedFormat('d M Y, H:i:s'),
            ] : null,
            'registration' => [
                'id' => $registration->id,
                'registration_number' => $registration->registration_number,
                'full_name' => $registration->participant->full_name,
                'school_name' => $registration->participant->school_name ?? 'Peserta Umum',
                'primary_position' => $registration->primary_position,
                'verification_status' => $registration->verification_status,
                'is_eligible' => $isEligible,
                'eligibility_message' => $isEligible
                    ? 'Pemain tercatat dalam roster tim resmi.'
                    : 'Pemain tidak tercatat dalam roster tim yang telah disetujui untuk event ini.',
                'team_name' => $teamPlayer?->team?->team_name,
                'nisn' => $registration->participant->nisn,
                'birth_date' => $registration->participant->birth_date?->translatedFormat('d M Y') ?? '-',
                'photo_url' => $registration->photo_path ? Storage::url($registration->photo_path) : null,
            ],
        ]);
    }

    /**
     * Confirm check-in action.
     */
    public function confirm(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'registration_id' => ['required', 'exists:registrations,id'],
            'session_id' => ['nullable', 'exists:selection_sessions,id'],
            'status' => ['required', 'in:hadir,terlambat,tidak_hadir,izin'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $registration = Registration::findOrFail($validated['registration_id']);

        if ($registration->verification_status !== 'lolos_administrasi') {
            return back()->with('error', 'Peserta belum Lolos Administrasi sehingga belum dapat check-in.');
        }

        $officialTeamPlayer = TeamPlayer::with('team')
            ->where('participant_id', $registration->participant_id)
            ->whereHas('team', function ($query) use ($registration) {
                $query->where('event_id', $registration->event_id)
                    ->where('verification_status', 'lolos_administrasi');
            })
            ->first();

        if (! $officialTeamPlayer) {
            return back()->with('error', 'Check-in ditolak. Pemain tidak tercatat dalam roster tim resmi yang telah disetujui.');
        }

        if (! empty($validated['session_id'])) {
            $sessionBelongsToEvent = SelectionSession::whereKey($validated['session_id'])
                ->where('event_id', $registration->event_id)
                ->exists();

            if (! $sessionBelongsToEvent) {
                return back()->with('error', 'Sesi check-in tidak sesuai dengan event tim pemain.');
            }
        }

        // Prevent duplicate check-in
        $existing = Attendance::where('registration_id', $registration->id)->first();
        if ($existing) {
            return back()->with('error', "Peserta sudah melakukan check-in pada pukul {$existing->checked_in_at->format('H:i')}.");
        }

        $attendance = Attendance::create([
            'registration_id' => $registration->id,
            'session_id' => $validated['session_id'] ?? null,
            'status' => $validated['status'],
            'checked_in_at' => now(),
            'checked_in_by' => auth()->id(),
            'notes' => $validated['notes'] ?? null,
        ]);

        AuditLog::log('participant_checked_in', $attendance, null, [
            'registration_number' => $registration->registration_number,
            'team_id' => $officialTeamPlayer->team_id,
            'team_name' => $officialTeamPlayer->team->team_name,
            'nisn' => $officialTeamPlayer->nisn,
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Identitas {$registration->participant->full_name} cocok dengan roster {$officialTeamPlayer->team->team_name}. Check-in berhasil dicatat.");
    }
}
