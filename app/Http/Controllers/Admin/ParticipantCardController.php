<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantCardController extends Controller
{
    public function index(Request $request): Response
    {
        $eventId = $request->query('event_id');
        $selectedId = $request->query('selected_id');
        $search = $request->query('search');

        $events = Event::select('id', 'name', 'code', 'status')->get();
        $selectedEventId = $eventId ?: ($events->firstWhere('status', 'open')?->id ?? $events->first()?->id);

        $registrations = Registration::with(['participant', 'event'])
            ->where('event_id', $selectedEventId)
            ->where('verification_status', 'lolos_administrasi')
            ->when($search, function ($q, $search) {
                $q->where('registration_number', 'like', "%{$search}%")
                    ->orWhereHas('participant', fn ($p) => $p->where('full_name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(function ($reg) {
                return [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'full_name' => $reg->participant->full_name,
                    'school_name' => $reg->participant->school_name ?? 'Peserta Umum',
                    'primary_position' => $reg->primary_position,
                    'photo_url' => $reg->photo_path ? Storage::url($reg->photo_path) : null,
                    'qr_token' => $reg->qr_token,
                    'event_name' => $reg->event->name,
                    'location' => $reg->event->location,
                    'selection_schedule' => $reg->event->selection_start_at?->translatedFormat('d M Y, H:i').' WIB',
                ];
            });

        $previewRegistration = null;
        if ($registrations->isNotEmpty()) {
            $target = $selectedId
                ? Registration::with(['participant', 'event'])->find($selectedId)
                : Registration::with(['participant', 'event'])->find($registrations->first()['id']);

            if ($target) {
                $previewRegistration = [
                    'id' => $target->id,
                    'registration_number' => $target->registration_number,
                    'full_name' => $target->participant->full_name,
                    'school_name' => $target->participant->school_name ?? 'Peserta Umum',
                    'primary_position' => $target->primary_position,
                    'photo_url' => $target->photo_path ? Storage::url($target->photo_path) : null,
                    'qr_token' => $target->qr_token,
                    'event_name' => $target->event->name,
                    'organizer' => $target->event->organizer,
                    'location' => $target->event->location,
                    'selection_schedule' => $target->event->selection_start_at?->translatedFormat('d M Y, H:i').' WIB',
                ];
            }
        }

        return Inertia::render('Admin/Cards/Index', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'registrations' => $registrations,
            'previewRegistration' => $previewRegistration,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function bulkPrint(Request $request): Response
    {
        $ids = $request->input('ids', []);
        $registrations = Registration::with(['participant', 'event'])
            ->whereIn('id', $ids)
            ->where('verification_status', 'lolos_administrasi')
            ->get()
            ->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'registration_number' => $reg->registration_number,
                    'full_name' => $reg->participant->full_name,
                    'school_name' => $reg->participant->school_name ?? 'Peserta Umum',
                    'primary_position' => $reg->primary_position,
                    'photo_url' => $reg->photo_path ? Storage::url($reg->photo_path) : null,
                    'qr_token' => $reg->qr_token,
                    'event_name' => $reg->event->name,
                    'organizer' => $reg->event->organizer,
                    'location' => $reg->event->location,
                    'selection_schedule' => $reg->event->selection_start_at?->translatedFormat('d M Y, H:i').' WIB',
                ];
            });

        return Inertia::render('Admin/Cards/BulkPrint', [
            'registrations' => $registrations,
        ]);
    }
}
