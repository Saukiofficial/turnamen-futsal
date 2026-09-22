<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentCriterion;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $position = $request->query('position');
        $search = $request->query('search');

        $events = Event::select('id', 'name', 'code', 'status')->get();
        $selectedEventId = $eventId ?: ($events->firstWhere('status', 'open')?->id ?? $events->first()?->id);

        $criteria = AssessmentCriterion::where('event_id', $selectedEventId)
            ->where('active', true)
            ->get();

        $candidates = Registration::with(['participant', 'attendance', 'assessments'])
            ->where('event_id', $selectedEventId)
            ->where('verification_status', 'lolos_administrasi')
            ->when($position, fn ($q) => $q->where('primary_position', $position))
            ->when($search, function ($q, $search) {
                $q->where('registration_number', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($p) => $p->where('full_name', 'like', "%{$search}%"));
            })
            ->get()
            ->map(function ($reg) use ($criteria) {
                // Calculate weighted score
                $totalScore = 0;
                $assessmentsMap = [];
                foreach ($reg->assessments as $ass) {
                    $assessmentsMap[$ass->criterion_id] = (float) $ass->score;
                }

                $totalWeight = 0;
                foreach ($criteria as $crit) {
                    if (isset($assessmentsMap[$crit->id])) {
                        $totalScore += ($assessmentsMap[$crit->id] * ($crit->weight / 100));
                        $totalWeight += $crit->weight;
                    }
                }

                return [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'full_name' => $reg->participant->full_name,
                    'school_name' => $reg->participant->school_name ?? 'Peserta Umum',
                    'primary_position' => $reg->primary_position,
                    'selection_status' => $reg->selection_status,
                    'is_present' => $reg->attendance !== null,
                    'photo_url' => $reg->photo_path ? Storage::url($reg->photo_path) : null,
                    'assessments' => $assessmentsMap,
                    'calculated_score' => round($totalScore, 2),
                ];
            });

        return Inertia::render('Admin/Assessment/Index', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'criteria' => $criteria,
            'candidates' => $candidates,
            'filters' => [
                'position' => $position,
                'search' => $search,
            ],
        ]);
    }

    public function storeGrades(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'registration_id' => ['required', 'exists:registrations,id'],
            'grades' => ['required', 'array'],
            'grades.*.criterion_id' => ['required', 'exists:assessment_criteria,id'],
            'grades.*.score' => ['required', 'numeric', 'min:0', 'max:100'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $assessorId = auth()->id();

        foreach ($validated['grades'] as $item) {
            Assessment::updateOrCreate(
                [
                    'registration_id' => $validated['registration_id'],
                    'criterion_id' => $item['criterion_id'],
                    'assessor_id' => $assessorId,
                ],
                [
                    'score' => $item['score'],
                    'note' => $validated['note'] ?? null,
                ]
            );
        }

        AuditLog::log('grades_submitted', null, null, [
            'registration_id' => $validated['registration_id'],
            'assessor' => auth()->user()->name,
        ]);

        return back()->with('success', 'Nilai seleksi pemain berhasil disimpan.');
    }

    public function setSelectionStatus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'registration_id' => ['required', 'exists:registrations,id'],
            'status' => ['required', 'in:menunggu_seleksi,lolos_seleksi,cadangan,tidak_lolos'],
        ]);

        $reg = Registration::findOrFail($validated['registration_id']);
        $prev = $reg->selection_status;
        $reg->selection_status = $validated['status'];
        $reg->save();

        AuditLog::log('selection_status_updated', $reg, ['status' => $prev], ['status' => $validated['status']]);

        return back()->with('success', 'Hasil seleksi pemain berhasil diperbarui.');
    }
}
