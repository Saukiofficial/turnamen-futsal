<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Registration;
use App\Models\RegistrationRevision;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    /**
     * Display the 3-step registration form.
     */
    public function create(?string $slug = null): Response
    {
        $event = $slug
            ? Event::where('slug', $slug)->firstOrFail()
            : (Event::where('status', 'open')->first() ?? Event::latest()->firstOrFail());

        $registeredCount = $event->registrations()->count();
        $isOpen = $event->isOpenForRegistration();
        $isFull = $event->close_when_full && ($registeredCount >= $event->total_quota);

        $positions = $event->positions()->where('active', true)->get()->map(function ($pos) use ($event) {
            $count = $event->registrations()->where('primary_position', $pos->position_name)->count();

            return [
                'name' => $pos->position_name,
                'quota' => $pos->quota,
                'filled' => $count,
                'is_full' => $pos->quota > 0 && $count >= $pos->quota,
            ];
        });

        return Inertia::render('Registration/Register', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'code' => $event->code,
                'slug' => $event->slug,
                'description' => $event->description,
                'organizer' => $event->organizer,
                'location' => $event->location,
                'registration_start_at' => $event->registration_start_at->toIso8601String(),
                'registration_end_at' => $event->registration_end_at->toIso8601String(),
                'days_remaining' => $event->days_remaining,
                'total_quota' => $event->total_quota,
                'registered_count' => $registeredCount,
                'is_open' => $isOpen,
                'is_full' => $isFull,
            ],
            'positions' => $positions,
        ]);
    }

    /**
     * Handle submission of the registration form.
     */
    public function store(Request $request, ?string $slug = null): RedirectResponse
    {
        $event = $slug
            ? Event::where('slug', $slug)->firstOrFail()
            : (Event::where('status', 'open')->first() ?? Event::latest()->firstOrFail());

        if (! $event->isOpenForRegistration()) {
            return back()->withErrors([
                'event' => 'Pendaftaran untuk kegiatan ini saat ini sedang tidak dibuka atau kuota telah terpenuhi.',
            ]);
        }

        // Validate strictly for tournament registration with NISN (10 digits)
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'min:2', 'max:100'],
            'nisn' => ['required_without:nik', 'nullable', 'regex:/^[0-9]{10}$/'],
            'nik' => ['required_without:nisn', 'nullable', 'regex:/^[0-9]{10,16}$/'],
            'school_name' => ['nullable', 'string', 'max:150'],
            'birth_place' => ['required', 'string', 'max:100'],
            'birth_date' => ['required', 'date', 'before:today'],
            'primary_position' => ['required', 'in:Goalkeeper,Anchor,Flank,Pivot'],
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:2048'],
            'agreement' => ['accepted'],
        ], [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'nisn.required_without' => 'NISN wajib diisi (10 digit angka).',
            'nisn.regex' => 'NISN harus tepat 10 digit angka resmi Kemdikbud.',
            'nik.required_without' => 'NISN wajib diisi.',
            'birth_place.required' => 'Tempat lahir wajib diisi.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.before' => 'Tanggal lahir harus sebelum hari ini.',
            'primary_position.required' => 'Pilih posisi bermain futsal.',
            'photo.required' => 'Foto formal 3×4 wajib diunggah.',
            'photo.image' => 'File foto harus berupa gambar.',
            'photo.mimes' => 'Format foto harus JPG, JPEG, atau PNG.',
            'photo.max' => 'Ukuran foto maksimal 2 MB.',
            'agreement.accepted' => 'Anda harus menyetujui pernyataan kebenaran data.',
        ]);

        $rawNumber = $validated['nisn'] ?? $validated['nik'];
        $cleanNumber = preg_replace('/\D/', '', $rawNumber);
        $numberHash = hash('sha256', $cleanNumber);

        // Check duplicate registration in this event
        $existingRegistration = Registration::where('event_id', $event->id)
            ->whereHas('participant', function ($query) use ($numberHash, $cleanNumber) {
                $query->where('nik_hash', $numberHash)
                    ->orWhere('nisn', $cleanNumber);
            })
            ->first();

        if ($existingRegistration) {
            return back()->withErrors([
                'nisn' => 'NISN ini sudah terdaftar pada '.$event->name.'. Nomor pendaftaran Anda adalah '.$existingRegistration->registration_number.'. Silakan periksa status di menu Cek Status.',
                'nik' => 'Data ini sudah terdaftar pada '.$event->name.'. Nomor pendaftaran Anda adalah '.$existingRegistration->registration_number.'.',
            ])->withInput();
        }

        return DB::transaction(function () use ($request, $event, $validated, $cleanNumber, $numberHash) {
            // Store photo in public disk under photos/{year}
            $year = date('Y');
            $photoPath = $request->file('photo')->store("photos/{$year}", 'public');

            // Find or create participant
            $participant = Participant::where('nik_hash', $numberHash)
                ->orWhere('nisn', $cleanNumber)
                ->first();

            $nisnValue = ! empty($validated['nisn'])
                ? substr(preg_replace('/\D/', '', $validated['nisn']), 0, 10)
                : (strlen($cleanNumber) === 10 ? $cleanNumber : null);

            if (! $participant) {
                $participant = new Participant([
                    'full_name' => trim($validated['full_name']),
                    'nisn' => $nisnValue,
                    'birth_place' => trim($validated['birth_place']),
                    'birth_date' => $validated['birth_date'],
                    'school_name' => ! empty($validated['school_name']) ? trim($validated['school_name']) : null,
                ]);
                $participant->setNik($cleanNumber);
                $participant->save();
            } else {
                // Update non-sensitive basic profile if needed
                $participant->update([
                    'full_name' => trim($validated['full_name']),
                    'nisn' => $nisnValue,
                    'birth_place' => trim($validated['birth_place']),
                    'birth_date' => $validated['birth_date'],
                    'school_name' => ! empty($validated['school_name']) ? trim($validated['school_name']) : $participant->school_name,
                ]);
            }

            $registrationNumber = Registration::generateRegistrationNumber($event->id);
            $accessCode = Registration::generateAccessCode();
            $qrToken = Registration::generateQrToken();

            $registration = Registration::create([
                'event_id' => $event->id,
                'participant_id' => $participant->id,
                'registration_number' => $registrationNumber,
                'access_code_hash' => Hash::make($accessCode),
                'access_code_plain' => $accessCode,
                'qr_token' => $qrToken,
                'primary_position' => $validated['primary_position'],
                'photo_path' => $photoPath,
                'registration_status' => 'submitted',
                'verification_status' => 'menunggu_verifikasi',
                'selection_status' => 'menunggu_seleksi',
                'submitted_at' => now(),
            ]);

            AuditLog::log('participant_registered', $registration, null, [
                'registration_number' => $registrationNumber,
                'event' => $event->name,
            ]);

            // Save in session for success screen display
            session()->flash('new_registration', [
                'registration_number' => $registrationNumber,
                'access_code' => $accessCode,
            ]);

            return redirect()->route('registration.success', ['registrationNumber' => $registrationNumber]);
        });
    }

    /**
     * Display the registration success page.
     */
    public function success(string $registrationNumber): Response
    {
        $registration = Registration::with(['event', 'participant'])
            ->where('registration_number', $registrationNumber)
            ->firstOrFail();

        $sessionData = session('new_registration');
        $accessCode = ($sessionData && $sessionData['registration_number'] === $registrationNumber)
            ? $sessionData['access_code']
            : $registration->access_code_plain;

        return Inertia::render('Registration/Success', [
            'registration' => [
                'registration_number' => $registration->registration_number,
                'access_code' => $accessCode,
                'primary_position' => $registration->primary_position,
                'submitted_at' => $registration->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
                'photo_url' => $registration->photo_path ? Storage::url($registration->photo_path) : null,
                'event_name' => $registration->event->name,
                'organizer' => $registration->event->organizer,
                'location' => $registration->event->location,
                'verification_status' => $registration->verification_status,
                'participant' => [
                    'full_name' => $registration->participant->full_name,
                    'birth_place' => $registration->participant->birth_place,
                    'birth_date' => $registration->participant->birth_date->translatedFormat('d F Y'),
                    'school_name' => $registration->participant->school_name ?? 'Tidak diisi',
                ],
            ],
        ]);
    }

    /**
     * Display status check page or verify status with access code.
     */
    public function checkStatus(Request $request): Response
    {
        $registrationData = null;
        $errorMessage = null;

        $regNumber = $request->input('registration_number');
        $accessCode = $request->input('access_code');

        if ($regNumber && $accessCode) {
            $trimmedReg = trim($regNumber);
            $trimmedCode = strtoupper(trim($accessCode));

            // Check if looking up a Team (TIM- prefix or match in Team table)
            if (str_starts_with($trimmedReg, 'TIM-')) {
                $team = Team::with('event')
                    ->where('registration_number', $trimmedReg)
                    ->first();

                if ($team && (
                    $team->access_code_plain === $trimmedCode ||
                    Hash::check($trimmedCode, $team->access_code_hash)
                )) {
                    $registrationData = [
                        'type' => 'team',
                        'id' => $team->id,
                        'registration_number' => $team->registration_number,
                        'access_code' => $team->access_code_plain,
                        'team_name' => $team->team_name,
                        'school_name' => $team->school_name,
                        'head_coach' => $team->head_coach,
                        'manager_name' => $team->manager_name,
                        'manager_phone' => $team->manager_phone,
                        'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                        'document_url' => $team->document_path ? Storage::url($team->document_path) : null,
                        'verification_status' => $team->verification_status,
                        'verification_notes' => $team->verification_notes,
                        'submitted_at' => $team->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
                        'qr_token' => $team->qr_token,
                        'event' => [
                            'name' => $team->event->name,
                            'organizer' => $team->event->organizer,
                            'location' => $team->event->location,
                        ],
                    ];
                } else {
                    $errorMessage = 'Nomor pendaftaran tim atau kode akses tidak cocok. Pastikan Anda memasukkan kode dengan benar.';
                }
            } else {
                // Individual lookup
                $registration = Registration::with(['event', 'participant', 'attendance.session'])
                    ->where('registration_number', $trimmedReg)
                    ->first();

                if ($registration && (
                    $registration->access_code_plain === $trimmedCode ||
                    Hash::check($trimmedCode, $registration->access_code_hash)
                )) {
                    $registrationData = [
                        'type' => 'individual',
                        'id' => $registration->id,
                        'registration_number' => $registration->registration_number,
                        'access_code' => $registration->access_code_plain,
                        'primary_position' => $registration->primary_position,
                        'submitted_at' => $registration->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
                        'photo_url' => $registration->photo_path ? Storage::url($registration->photo_path) : null,
                        'verification_status' => $registration->verification_status,
                        'verification_notes' => $registration->verification_notes,
                        'revision_fields' => $registration->revision_fields ?? [],
                        'selection_status' => $registration->selection_status,
                        'qr_token' => $registration->qr_token,
                        'event' => [
                            'name' => $registration->event->name,
                            'organizer' => $registration->event->organizer,
                            'location' => $registration->event->location,
                            'selection_start_at' => $registration->event->selection_start_at?->translatedFormat('d F Y, H:i').' WIB',
                        ],
                        'participant' => [
                            'full_name' => $registration->participant->full_name,
                            'nisn' => $registration->participant->nisn,
                            'masked_nik' => $registration->participant->masked_nik,
                            'birth_place' => $registration->participant->birth_place,
                            'birth_date' => $registration->participant->birth_date->translatedFormat('d F Y'),
                            'school_name' => $registration->participant->school_name ?? 'Tidak diisi',
                        ],
                        'attendance' => $registration->attendance ? [
                            'status' => $registration->attendance->status,
                            'checked_in_at' => $registration->attendance->checked_in_at?->translatedFormat('d F Y, H:i').' WIB',
                            'session_name' => $registration->attendance->session?->name,
                        ] : null,
                    ];
                } else {
                    $errorMessage = 'Nomor pendaftaran atau kode akses tidak cocok. Pastikan Anda memasukkan kode dengan benar.';
                }
            }
        }

        return Inertia::render('Registration/CheckStatus', [
            'registrationData' => $registrationData,
            'errorMessage' => $errorMessage,
            'initialQuery' => [
                'registration_number' => $regNumber,
                'access_code' => $accessCode,
            ],
        ]);
    }

    /**
     * Handle participant resubmission for revisions requested by admin.
     */
    public function submitRevision(Request $request, string $registrationNumber): RedirectResponse
    {
        $registration = Registration::with('participant')->where('registration_number', $registrationNumber)->firstOrFail();

        $validated = $request->validate([
            'access_code' => ['required', 'string'],
            'full_name' => ['nullable', 'string', 'min:2', 'max:100'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'school_name' => ['nullable', 'string', 'max:150'],
            'primary_position' => ['nullable', 'in:Goalkeeper,Anchor,Flank,Pivot'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png', 'max:2048'],
        ]);

        if (
            $registration->access_code_plain !== strtoupper(trim($validated['access_code'])) &&
            ! Hash::check(strtoupper(trim($validated['access_code'])), $registration->access_code_hash)
        ) {
            return back()->withErrors(['access_code' => 'Kode akses tidak valid.']);
        }

        $changedFields = [];

        // Update photo if submitted
        if ($request->hasFile('photo')) {
            $year = date('Y');
            $newPhoto = $request->file('photo')->store("photos/{$year}", 'public');
            $registration->photo_path = $newPhoto;
            $changedFields['photo'] = 'Foto diperbarui';
        }

        // Update participant details if changed
        if (! empty($validated['full_name']) && $validated['full_name'] !== $registration->participant->full_name) {
            $registration->participant->full_name = trim($validated['full_name']);
            $changedFields['full_name'] = $validated['full_name'];
        }

        if (! empty($validated['birth_place']) && $validated['birth_place'] !== $registration->participant->birth_place) {
            $registration->participant->birth_place = trim($validated['birth_place']);
            $changedFields['birth_place'] = $validated['birth_place'];
        }

        if (! empty($validated['birth_date']) && $validated['birth_date'] !== $registration->participant->birth_date->toDateString()) {
            $registration->participant->birth_date = $validated['birth_date'];
            $changedFields['birth_date'] = $validated['birth_date'];
        }

        if (array_key_exists('school_name', $validated)) {
            $registration->participant->school_name = trim($validated['school_name'] ?? '');
            $changedFields['school_name'] = $validated['school_name'];
        }

        if (! empty($validated['primary_position']) && $validated['primary_position'] !== $registration->primary_position) {
            $registration->primary_position = $validated['primary_position'];
            $changedFields['primary_position'] = $validated['primary_position'];
        }

        $registration->participant->save();

        // Update status to dikirim_ulang
        $registration->verification_status = 'dikirim_ulang';
        $registration->revision_count = $registration->revision_count + 1;
        $registration->save();

        RegistrationRevision::create([
            'registration_id' => $registration->id,
            'revision_number' => $registration->revision_count,
            'changed_fields' => $changedFields,
            'submitted_at' => now(),
        ]);

        AuditLog::log('participant_submitted_revision', $registration, null, $changedFields);

        return redirect()->route('registration.check-status', [
            'registration_number' => $registration->registration_number,
            'access_code' => $registration->access_code_plain,
        ])->with('success', 'Revisi berkas pendaftaran berhasil dikirim ulang. Panitia akan memeriksa kembali data Anda.');
    }

    /**
     * View and print official participant card.
     */
    public function printCard(string $registrationNumber, Request $request): Response
    {
        $registration = Registration::with(['event', 'participant'])
            ->where('registration_number', $registrationNumber)
            ->firstOrFail();

        // Must be verified or authorized
        if ($registration->verification_status !== 'lolos_administrasi' && ! auth()->check()) {
            abort(403, 'Kartu peserta belum dapat dicetak karena status verifikasi belum Lolos Administrasi.');
        }

        return Inertia::render('Registration/ParticipantCard', [
            'registration' => [
                'registration_number' => $registration->registration_number,
                'primary_position' => $registration->primary_position,
                'qr_token' => $registration->qr_token,
                'photo_url' => $registration->photo_path ? Storage::url($registration->photo_path) : null,
                'event_name' => $registration->event->name,
                'organizer' => $registration->event->organizer,
                'location' => $registration->event->location,
                'selection_schedule' => $registration->event->selection_start_at?->translatedFormat('l, d F Y - H:i').' WIB',
                'participant' => [
                    'full_name' => $registration->participant->full_name,
                    'birth_place' => $registration->participant->birth_place,
                    'birth_date' => $registration->participant->birth_date->translatedFormat('d F Y'),
                    'school_name' => $registration->participant->school_name ?? 'Peserta Umum / Terbuka',
                ],
            ],
        ]);
    }
}
