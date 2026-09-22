<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Registration;
use App\Models\VerificationLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $selectedRegId = $request->query('registration_id');

        $events = Event::select('id', 'name', 'code', 'status')->get();
        $selectedEventId = $eventId ?: ($events->firstWhere('status', 'open')?->id ?? $events->first()?->id);

        $queue = Registration::with('participant')
            ->where('event_id', $selectedEventId)
            ->whereIn('verification_status', ['menunggu_verifikasi', 'dikirim_ulang', 'perlu_perbaikan'])
            ->orderByRaw("FIELD(verification_status, 'dikirim_ulang', 'menunggu_verifikasi', 'perlu_perbaikan')")
            ->latest('submitted_at')
            ->get()
            ->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'full_name' => $reg->participant->full_name,
                    'primary_position' => $reg->primary_position,
                    'verification_status' => $reg->verification_status,
                    'submitted_at' => $reg->submitted_at?->translatedFormat('d M, H:i'),
                ];
            });

        $currentRegistration = null;
        if ($queue->isNotEmpty()) {
            $queueIds = $queue->pluck('id')->all();
            $targetId = ($selectedRegId && in_array((int) $selectedRegId, $queueIds))
                ? (int) $selectedRegId
                : $queue->first()['id'];
            $reg = Registration::with(['participant', 'event', 'verificationLogs.admin'])->find($targetId);
            if ($reg) {
                $currentRegistration = [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'primary_position' => $reg->primary_position,
                    'photo_url' => $reg->photo_path ? Storage::url($reg->photo_path) : null,
                    'verification_status' => $reg->verification_status,
                    'verification_notes' => $reg->verification_notes,
                    'revision_fields' => $reg->revision_fields ?? [],
                    'submitted_at' => $reg->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
                    'participant' => [
                        'full_name' => $reg->participant->full_name,
                        'nisn' => $reg->participant->nisn,
                        'masked_nik' => $reg->participant->masked_nik,
                        'birth_place' => $reg->participant->birth_place,
                        'birth_date' => $reg->participant->birth_date->translatedFormat('d F Y'),
                        'school_name' => $reg->participant->school_name ?? 'Tidak diisi (Umum)',
                    ],
                    'logs' => $reg->verificationLogs->map(fn ($log) => [
                        'admin_name' => $log->admin?->name ?? 'Admin',
                        'previous_status' => $log->previous_status,
                        'new_status' => $log->new_status,
                        'note' => $log->note,
                        'created_at' => $log->created_at->translatedFormat('d M, H:i'),
                    ]),
                ];
            }
        }

        return Inertia::render('Admin/Verification/Index', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'queue' => $queue,
            'currentRegistration' => $currentRegistration,
        ]);
    }

    public function process(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:approve,revision,reject'],
            'note' => ['nullable', 'string', 'max:500'],
            'flagged_fields' => ['nullable', 'array'],
        ]);

        if (in_array($validated['action'], ['revision', 'reject']) && empty($validated['note'])) {
            return back()->withErrors(['note' => 'Catatan wajib diisi saat meminta perbaikan atau menolak berkas.']);
        }

        $registration = Registration::findOrFail($id);
        $prevStatus = $registration->verification_status;

        $newStatus = match ($validated['action']) {
            'approve' => 'lolos_administrasi',
            'revision' => 'perlu_perbaikan',
            'reject' => 'ditolak',
        };

        $registration->verification_status = $newStatus;
        $registration->verification_notes = $validated['note'] ?? null;
        $registration->revision_fields = $validated['action'] === 'revision' ? ($validated['flagged_fields'] ?? []) : null;
        $registration->verified_at = now();
        $registration->verified_by = auth()->id();
        $registration->save();

        VerificationLog::create([
            'registration_id' => $registration->id,
            'admin_id' => auth()->id(),
            'previous_status' => $prevStatus,
            'new_status' => $newStatus,
            'checklist_json' => $validated['flagged_fields'] ?? null,
            'note' => $validated['note'] ?? null,
        ]);

        AuditLog::log('verification_processed', $registration, ['status' => $prevStatus], [
            'status' => $newStatus,
            'action' => $validated['action'],
            'note' => $validated['note'] ?? null,
        ]);

        return redirect()
            ->route('admin.verification.index', ['event_id' => $registration->event_id])
            ->with('success', "Berkas atas nama {$registration->participant->full_name} berhasil diproses ({$newStatus}).");
    }
}
