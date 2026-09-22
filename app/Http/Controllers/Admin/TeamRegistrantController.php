<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeamRegistrantController extends Controller
{
    /**
     * Display list of registered teams in Admin.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = Team::with('event')->latest('id');

        if ($status !== 'all') {
            $query->where('verification_status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('team_name', 'like', "%{$search}%")
                    ->orWhere('school_name', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                    ->orWhere('head_coach', 'like', "%{$search}%")
                    ->orWhere('manager_name', 'like', "%{$search}%");
            });
        }

        $teams = $query->paginate(15)->withQueryString()->through(fn ($t) => [
            'id' => $t->id,
            'registration_number' => $t->registration_number,
            'team_name' => $t->team_name,
            'school_name' => $t->school_name,
            'head_coach' => $t->head_coach,
            'manager_name' => $t->manager_name,
            'manager_phone' => $t->manager_phone,
            'verification_status' => $t->verification_status,
            'submitted_at' => $t->submitted_at?->translatedFormat('d M Y, H:i') ?? '-',
            'logo_url' => $t->logo_path ? Storage::url($t->logo_path) : null,
            'has_document' => ! empty($t->document_path),
        ]);

        $counts = [
            'all' => Team::count(),
            'menunggu_verifikasi' => Team::where('verification_status', 'menunggu_verifikasi')->count(),
            'lolos_administrasi' => Team::where('verification_status', 'lolos_administrasi')->count(),
            'perlu_perbaikan' => Team::where('verification_status', 'perlu_perbaikan')->count(),
            'ditolak' => Team::where('verification_status', 'ditolak')->count(),
        ];

        return Inertia::render('Admin/Teams/Index', [
            'teams' => $teams,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'counts' => $counts,
        ]);
    }

    /**
     * Show detail of registered team for verification.
     */
    public function show(int $id): Response
    {
        $team = Team::with(['event', 'verifier', 'players.participant.registrations'])->findOrFail($id);

        $players = $team->players->map(function ($tp) use ($team) {
            $p = $tp->participant;
            $reg = $p ? $p->registrations->where('event_id', $team->event_id)->first() : null;

            return [
                'id' => $tp->id,
                'nisn' => $tp->nisn,
                'name' => $p?->full_name ?? 'Peserta Tidak Ditemukan',
                'school' => $p?->school_name ?? '-',
                'position' => $reg?->primary_position ?? 'Pemain',
                'photo_url' => $reg?->photo_path ? Storage::url($reg->photo_path) : null,
                'verified_status' => $reg?->verification_status ?? 'belum_terdaftar',
            ];
        });

        return Inertia::render('Admin/Teams/Show', [
            'team' => [
                'id' => $team->id,
                'registration_number' => $team->registration_number,
                'access_code' => $team->access_code_plain,
                'team_name' => $team->team_name,
                'school_name' => $team->school_name,
                'head_coach' => $team->head_coach,
                'manager_name' => $team->manager_name,
                'manager_phone' => $team->manager_phone,
                'verification_status' => $team->verification_status,
                'verification_notes' => $team->verification_notes,
                'submitted_at' => $team->submitted_at?->translatedFormat('d F Y, H:i').' WIB',
                'verified_at' => $team->verified_at?->translatedFormat('d F Y, H:i').' WIB',
                'verified_by_name' => $team->verifier?->name,
                'logo_url' => $team->logo_path ? Storage::url($team->logo_path) : null,
                'document_url' => $team->document_path ? Storage::url($team->document_path) : null,
                'qr_token' => $team->qr_token,
                'event_name' => $team->event->name,
                'players' => $players,
            ],
        ]);
    }

    /**
     * Update verification status for a team.
     */
    public function verify(Request $request, int $id): RedirectResponse
    {
        $team = Team::findOrFail($id);

        $validated = $request->validate([
            'verification_status' => ['required', 'in:menunggu_verifikasi,lolos_administrasi,perlu_perbaikan,ditolak'],
            'verification_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $team->update([
            'verification_status' => $validated['verification_status'],
            'verification_notes' => $validated['verification_notes'],
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);

        AuditLog::log('team_verified', $team, null, [
            'status' => $validated['verification_status'],
            'notes' => $validated['verification_notes'],
        ]);

        return back()->with('success', 'Status verifikasi tim berhasil diperbarui.');
    }

    public function destroy(Request $request, Team $team): RedirectResponse
    {
        abort_unless($request->user()?->isAdmin(), 403);

        $storedFiles = array_filter([$team->logo_path, $team->document_path]);

        AuditLog::log('team_registration_deleted', $team, [
            'registration_number' => $team->registration_number,
            'team_name' => $team->team_name,
        ]);

        $team->delete();

        if ($storedFiles !== []) {
            Storage::disk('public')->delete($storedFiles);
        }

        return back()->with('success', 'Pendaftaran tim berhasil dihapus.');
    }
}
