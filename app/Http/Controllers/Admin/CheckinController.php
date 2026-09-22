<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Registration;
use App\Models\SelectionSession;
use App\Models\Team;
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

        $totalEligible = Registration::where('event_id', $selectedEventId)
            ->where('verification_status', 'lolos_administrasi')
            ->count();

        $attendancesQuery = Attendance::whereHas('registration', fn ($q) => $q->where('event_id', $selectedEventId));
        $totalPresent = (clone $attendancesQuery)->where('status', 'hadir')->count();
        $totalLate = (clone $attendancesQuery)->where('status', 'terlambat')->count();

        $recentCheckins = Attendance::with(['registration.participant', 'session', 'checkedInBy'])
            ->whereHas('registration', fn ($q) => $q->where('event_id', $selectedEventId))
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
            $team = Team::with(['players.participant.registrations', 'event'])
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
                        'players' => $team->players->map(fn ($p) => [
                            'id' => $p->id,
                            'jersey_number' => $p->jersey_number,
                            'nisn' => $p->nisn,
                            'full_name' => $p->participant?->full_name ?? 'Pemain',
                            'position' => $p->participant?->registrations?->first()?->primary_position ?? 'Pemain',
                        ]),
                    ],
                ]);
            }

            return response()->json([
                'found' => false,
                'message' => 'Pendaftar individu atau tim tidak ditemukan pada event ini.',
            ], 404);
        }

        $alreadyCheckedIn = $registration->attendance !== null;

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
                'is_eligible' => $registration->verification_status === 'lolos_administrasi',
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
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Check-in {$registration->participant->full_name} ({$registration->registration_number}) berhasil dicatat.");
    }
}
