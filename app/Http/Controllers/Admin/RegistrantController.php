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
use Symfony\Component\HttpFoundation\StreamedResponse;

class RegistrantController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $search = $request->query('search');
        $position = $request->query('position');
        $status = $request->query('status');
        $selectionStatus = $request->query('selection_status');

        $events = Event::select('id', 'name', 'code', 'status')->get();
        $selectedEventId = $eventId ?: ($events->firstWhere('status', 'open')?->id ?? $events->first()?->id);

        $query = Registration::with(['participant', 'event', 'verifiedBy'])
            ->when($selectedEventId, fn ($q) => $q->where('event_id', $selectedEventId))
            ->when($position, fn ($q) => $q->where('primary_position', $position))
            ->when($status, fn ($q) => $q->where('verification_status', $status))
            ->when($selectionStatus, fn ($q) => $q->where('selection_status', $selectionStatus))
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('registration_number', 'like', "%{$search}%")
                        ->orWhereHas('participant', function ($p) use ($search) {
                            $p->where('full_name', 'like', "%{$search}%")
                                ->orWhere('nisn', 'like', "%{$search}%")
                                ->orWhere('school_name', 'like', "%{$search}%")
                                ->orWhere('birth_place', 'like', "%{$search}%");
                        });
                });
            });

        $summary = [
            'total' => (clone $query)->count(),
            'waiting' => (clone $query)->whereIn('verification_status', ['menunggu_verifikasi', 'dikirim_ulang'])->count(),
            'approved' => (clone $query)->where('verification_status', 'lolos_administrasi')->count(),
            'revision' => (clone $query)->where('verification_status', 'perlu_perbaikan')->count(),
            'rejected' => (clone $query)->where('verification_status', 'ditolak')->count(),
        ];

        $registrations = $query->latest('submitted_at')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($reg) {
                return [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'full_name' => $reg->participant->full_name,
                    'nisn' => $reg->participant->nisn ?? $reg->participant->masked_nik,
                    'masked_nik' => $reg->participant->nisn ?? $reg->participant->masked_nik,
                    'school_name' => $reg->participant->school_name ?? 'Peserta Umum',
                    'primary_position' => $reg->primary_position,
                    'submitted_at' => $reg->submitted_at?->translatedFormat('d M Y, H:i'),
                    'verification_status' => $reg->verification_status,
                    'selection_status' => $reg->selection_status,
                    'photo_url' => $reg->photo_path ? Storage::url($reg->photo_path) : null,
                    'revision_count' => $reg->revision_count,
                    'verified_by' => $reg->verifiedBy?->name,
                ];
            });

        return Inertia::render('Admin/Registrants/Index', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'registrations' => $registrations,
            'filters' => [
                'search' => $search,
                'position' => $position,
                'status' => $status,
                'selection_status' => $selectionStatus,
            ],
            'summary' => $summary,
        ]);
    }

    public function show(int $id): Response
    {
        $registration = Registration::with([
            'participant',
            'event',
            'verifiedBy',
            'revisions.reviewedBy',
            'verificationLogs.admin',
            'attendance.session',
            'assessments.criterion',
            'assessments.assessor',
        ])->findOrFail($id);

        $data = [
            'id' => $registration->id,
            'registration_number' => $registration->registration_number,
            'access_code' => $registration->access_code_plain,
            'qr_token' => $registration->qr_token,
            'primary_position' => $registration->primary_position,
            'photo_url' => $registration->photo_path ? Storage::url($registration->photo_path) : null,
            'registration_status' => $registration->registration_status,
            'verification_status' => $registration->verification_status,
            'selection_status' => $registration->selection_status,
            'submitted_at' => $registration->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
            'verified_at' => $registration->verified_at?->translatedFormat('d F Y, H:i').' WIB',
            'verified_by_name' => $registration->verifiedBy?->name,
            'verification_notes' => $registration->verification_notes,
            'revision_fields' => $registration->revision_fields ?? [],
            'revision_count' => $registration->revision_count,
            'event' => [
                'id' => $registration->event->id,
                'name' => $registration->event->name,
                'location' => $registration->event->location,
            ],
            'participant' => [
                'full_name' => $registration->participant->full_name,
                'nisn' => $registration->participant->nisn ?? $registration->participant->masked_nik,
                'masked_nik' => $registration->participant->nisn ?? $registration->participant->masked_nik,
                'birth_place' => $registration->participant->birth_place,
                'birth_date' => $registration->participant->birth_date->translatedFormat('d F Y'),
                'school_name' => $registration->participant->school_name ?? 'Peserta Umum / Terbuka',
            ],
            'attendance' => $registration->attendance ? [
                'status' => $registration->attendance->status,
                'checked_in_at' => $registration->attendance->checked_in_at->translatedFormat('d F Y, H:i').' WIB',
                'session_name' => $registration->attendance->session?->name,
            ] : null,
            'revisions' => $registration->revisions->map(fn ($rev) => [
                'revision_number' => $rev->revision_number,
                'changed_fields' => $rev->changed_fields,
                'submitted_at' => $rev->submitted_at->translatedFormat('d M Y, H:i'),
                'reviewed_by' => $rev->reviewedBy?->name,
            ]),
            'verification_logs' => $registration->verificationLogs->map(fn ($log) => [
                'id' => $log->id,
                'previous_status' => $log->previous_status,
                'new_status' => $log->new_status,
                'admin_name' => $log->admin?->name ?? 'Sistem',
                'note' => $log->note,
                'checklist' => $log->checklist_json,
                'created_at' => $log->created_at->translatedFormat('d M Y, H:i'),
            ]),
        ];

        return Inertia::render('Admin/Registrants/Show', [
            'registration' => $data,
        ]);
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:lolos_administrasi,perlu_perbaikan,ditolak,menunggu_verifikasi'],
            'note' => ['nullable', 'string', 'max:500'],
            'revision_fields' => ['nullable', 'array'],
        ]);

        $registration = Registration::findOrFail($id);
        $prevStatus = $registration->verification_status;

        $registration->verification_status = $validated['status'];
        $registration->verification_notes = $validated['note'] ?? null;
        $registration->revision_fields = $validated['revision_fields'] ?? null;
        $registration->verified_at = now();
        $registration->verified_by = auth()->id();
        $registration->save();

        VerificationLog::create([
            'registration_id' => $registration->id,
            'admin_id' => auth()->id(),
            'previous_status' => $prevStatus,
            'new_status' => $validated['status'],
            'checklist_json' => $validated['revision_fields'] ?? null,
            'note' => $validated['note'] ?? null,
        ]);

        AuditLog::log('participant_status_updated', $registration, ['status' => $prevStatus], [
            'status' => $validated['status'],
            'note' => $validated['note'] ?? null,
        ]);

        return back()->with('success', 'Status pendaftaran berhasil diperbarui.');
    }

    public function export(Request $request): StreamedResponse
    {
        $eventId = $request->query('event_id');
        $event = Event::findOrFail($eventId);

        $registrations = Registration::with(['participant', 'verifiedBy'])
            ->where('event_id', $event->id)
            ->latest('submitted_at')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="data-pendaftar-'.$event->slug.'-'.date('Ymd-His').'.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($registrations) {
            $handle = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'No.',
                'No Pendaftaran',
                'Nama Lengkap',
                'NISN',
                'Tempat Lahir',
                'Tanggal Lahir',
                'Asal Sekolah / Instansi',
                'Posisi Futsal',
                'Status Administrasi',
                'Status Seleksi',
                'Waktu Mendaftar',
                'Diverifikasi Oleh',
            ]);

            foreach ($registrations as $index => $reg) {
                fputcsv($handle, [
                    $index + 1,
                    $reg->registration_number,
                    $reg->participant->full_name,
                    $reg->participant->nisn ?? $reg->participant->masked_nik,
                    $reg->participant->birth_place,
                    $reg->participant->birth_date->format('d/m/Y'),
                    $reg->participant->school_name ?? '-',
                    $reg->primary_position,
                    $reg->verification_status,
                    $reg->selection_status,
                    $reg->submitted_at?->format('Y-m-d H:i:s'),
                    $reg->verifiedBy?->name ?? '-',
                ]);
            }

            fclose($handle);
        };

        AuditLog::log('export_registrants_csv', $event, null, ['count' => $registrations->count()]);

        return response()->stream($callback, 200, $headers);
    }
}
