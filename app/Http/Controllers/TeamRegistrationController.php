<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Team;
use App\Models\TeamPlayer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TeamRegistrationController extends Controller
{
    /**
     * Show team registration form.
     */
    public function create(): Response
    {
        $event = Event::where('status', 'open')->first()
            ?? Event::orderByDesc('id')->first();

        return Inertia::render('Registration/RegisterTeam', [
            'event' => $event ? [
                'id' => $event->id,
                'name' => $event->name,
                'organizer' => $event->organizer,
                'location' => $event->location,
                'registration_end_at' => $event->registration_end_at?->translatedFormat('d F Y') ?? '-',
            ] : null,
        ]);
    }

    /**
     * Check if a player with this NISN has registered individually (Stage 1).
     */
    public function checkPlayerNisn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nisn' => ['required', 'string'],
            'event_id' => ['required', 'exists:events,id'],
        ]);

        $cleanNisn = preg_replace('/\D/', '', $validated['nisn']);

        if (strlen($cleanNisn) !== 10) {
            return response()->json([
                'valid' => false,
                'message' => 'NISN harus terdiri dari tepat 10 digit angka resmi.',
            ], 422);
        }

        $participant = Participant::where('nisn', $cleanNisn)->first();

        if (! $participant) {
            return response()->json([
                'valid' => false,
                'not_found' => true,
                'message' => 'NISN belum terdaftar di Tahap 1 (Pendaftaran Individu). Minta pemain mendaftar individu terlebih dahulu.',
            ]);
        }

        // Check if player has registered for this event
        $registration = $participant->registrations()
            ->where('event_id', $validated['event_id'])
            ->first();

        if (! $registration) {
            return response()->json([
                'valid' => false,
                'not_found' => true,
                'message' => 'Pemain terdaftar di sistem, namun belum terdaftar pada event turnamen ini.',
            ]);
        }

        // Check if player is already assigned to a team in this event
        $existingTeamPlayer = TeamPlayer::where('participant_id', $participant->id)
            ->whereHas('team', function ($q) use ($validated) {
                $q->where('event_id', $validated['event_id']);
            })
            ->with('team')
            ->first();

        if ($existingTeamPlayer) {
            return response()->json([
                'valid' => false,
                'already_in_team' => true,
                'team_name' => $existingTeamPlayer->team->team_name,
                'message' => "Pemain ini sudah terdaftar pada tim '{$existingTeamPlayer->team->team_name}'. Satu atlet tidak boleh terdaftar di 2 tim berbeda.",
            ]);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Data pemain terverifikasi di Tahap 1.',
            'player' => [
                'id' => $participant->id,
                'nisn' => $participant->nisn,
                'name' => $participant->full_name,
                'school' => $participant->school_name ?? $participant->birth_place,
                'position' => $registration->primary_position ?? 'Pemain',
                'photo_url' => $registration->photo_path ? asset('storage/'.$registration->photo_path) : null,
            ],
        ]);
    }

    /**
     * Store new team registration.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'team_name' => ['required', 'string', 'max:100'],
            'school_name' => ['required', 'string', 'max:150'],
            'head_coach' => ['required', 'string', 'max:100'],
            'manager_name' => ['required', 'string', 'max:100'],
            'manager_phone' => ['required', 'string', 'max:25'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'], // Surat Rekomendasi & NISN Peserta (1 file)
            'players' => ['nullable', 'array', 'max:14'],
            'players.*.nisn' => ['required', 'digits:10', 'distinct'],
            'agreement' => ['accepted'],
        ], [
            'team_name.required' => 'Nama tim wajib diisi.',
            'school_name.required' => 'Nama sekolah / instansi wajib diisi.',
            'head_coach.required' => 'Nama Head Coach (Pelatih Kepala) wajib diisi.',
            'manager_name.required' => 'Nama Manager Team wajib diisi.',
            'manager_phone.required' => 'Nomor WhatsApp aktif wajib diisi.',
            'document.required' => 'File Surat Rekomendasi Sekolah & NISN Peserta wajib diunggah.',
            'document.max' => 'Ukuran file dokumen maksimal 5 MB.',
            'logo.max' => 'Ukuran file logo maksimal 2 MB.',
            'agreement.accepted' => 'Anda harus menyetujui pernyataan keabsahan data tim.',
        ]);

        $rosterPlayers = collect($validated['players'] ?? [])->map(function (array $playerData) use ($validated) {
            $nisn = preg_replace('/\D/', '', $playerData['nisn']);
            $participant = Participant::where('nisn', $nisn)
                ->whereHas('registrations', fn ($query) => $query->where('event_id', $validated['event_id']))
                ->first();

            if (! $participant) {
                throw ValidationException::withMessages([
                    'players' => "Pemain dengan NISN {$nisn} tidak terdaftar pada event turnamen ini.",
                ]);
            }

            $existingTeamPlayer = TeamPlayer::where('participant_id', $participant->id)
                ->whereHas('team', fn ($query) => $query->where('event_id', $validated['event_id']))
                ->with('team')
                ->first();

            if ($existingTeamPlayer) {
                throw ValidationException::withMessages([
                    'players' => "Pemain dengan NISN {$nisn} sudah terdaftar pada tim {$existingTeamPlayer->team->team_name}.",
                ]);
            }

            return [
                'participant' => $participant,
                'nisn' => $nisn,
            ];
        });

        return DB::transaction(function () use ($request, $validated, $rosterPlayers) {
            $event = Event::findOrFail($validated['event_id']);

            // Upload Logo
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store("teams/{$event->id}/logos", 'public');
            }

            // Upload Document (Surat Rekomendasi & NISN)
            $documentPath = null;
            if ($request->hasFile('document')) {
                $documentPath = $request->file('document')->store("teams/{$event->id}/documents", 'public');
            }

            $registrationNumber = Team::generateRegistrationNumber($event->id);
            $accessCode = Team::generateAccessCode();
            $qrToken = Team::generateQrToken();

            $team = Team::create([
                'event_id' => $event->id,
                'team_name' => trim($validated['team_name']),
                'school_name' => trim($validated['school_name']),
                'head_coach' => trim($validated['head_coach']),
                'manager_name' => trim($validated['manager_name']),
                'manager_phone' => trim($validated['manager_phone']),
                'logo_path' => $logoPath,
                'document_path' => $documentPath,
                'registration_number' => $registrationNumber,
                'access_code_plain' => $accessCode,
                'access_code_hash' => Hash::make($accessCode),
                'qr_token' => $qrToken,
                'verification_status' => 'menunggu_verifikasi',
                'submitted_at' => now(),
            ]);

            // Save team players roster
            foreach ($rosterPlayers as $rosterPlayer) {
                TeamPlayer::create([
                    'team_id' => $team->id,
                    'participant_id' => $rosterPlayer['participant']->id,
                    'nisn' => $rosterPlayer['nisn'],
                ]);
            }

            AuditLog::log('team_registered', $team, null, [
                'registration_number' => $registrationNumber,
                'team_name' => $team->team_name,
                'school_name' => $team->school_name,
                'players_count' => count($validated['players'] ?? []),
            ]);

            session()->flash('new_team_registration', [
                'registration_number' => $registrationNumber,
                'access_code' => $accessCode,
            ]);

            return redirect()->route('team.success', ['registrationNumber' => $registrationNumber]);
        });
    }

    /**
     * Display team registration success page.
     */
    public function success(string $registrationNumber): Response
    {
        $team = Team::with('event')
            ->where('registration_number', $registrationNumber)
            ->firstOrFail();

        $sessionData = session('new_team_registration');
        $accessCode = ($sessionData && $sessionData['registration_number'] === $registrationNumber)
            ? $sessionData['access_code']
            : $team->access_code_plain;

        return Inertia::render('Registration/TeamSuccess', [
            'team' => [
                'registration_number' => $team->registration_number,
                'access_code' => $accessCode,
                'team_name' => $team->team_name,
                'school_name' => $team->school_name,
                'head_coach' => $team->head_coach,
                'manager_name' => $team->manager_name,
                'manager_phone' => $team->manager_phone,
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'document_url' => $team->document_path ? Storage::url($team->document_path) : null,
                'event_name' => $team->event->name,
                'location' => $team->event->location,
                'verification_status' => $team->verification_status,
                'submitted_at' => $team->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
            ],
        ]);
    }

    /**
     * Print official team accreditation card.
     */
    public function printCard(string $registrationNumber): Response
    {
        $team = Team::with('event')
            ->where('registration_number', $registrationNumber)
            ->firstOrFail();

        abort_if($team->verification_status !== 'lolos_administrasi', 403, 'Kartu Akreditasi Tim hanya dapat dicetak setelah tim dinyatakan Lolos Administrasi.');

        return Inertia::render('Registration/TeamCard', [
            'team' => [
                'registration_number' => $team->registration_number,
                'team_name' => $team->team_name,
                'school_name' => $team->school_name,
                'head_coach' => $team->head_coach,
                'manager_name' => $team->manager_name,
                'manager_phone' => $team->manager_phone,
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'qr_token' => $team->qr_token,
                'event_name' => $team->event->name,
                'location' => $team->event->location,
                'tournament_schedule' => $team->event->selection_start_at?->translatedFormat('d F Y, H:i').' WIB' ?? 'Sesuai Jadwal Pertandingan',
            ],
        ]);
    }
}
