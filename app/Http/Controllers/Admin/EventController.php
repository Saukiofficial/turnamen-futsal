<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventPosition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $events = Event::with('positions')
            ->withCount('registrations')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Events/Form', [
            'event' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'code' => ['required', 'string', 'max:20', 'unique:events,code'],
            'organizer' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:200'],
            'registration_start_at' => ['required', 'date'],
            'registration_end_at' => ['required', 'date', 'after:registration_start_at'],
            'selection_start_at' => ['nullable', 'date'],
            'selection_end_at' => ['nullable', 'date', 'after_or_equal:selection_start_at'],
            'total_quota' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:draft,scheduled,open,paused,closed,completed,archived'],
            'close_when_full' => ['boolean'],
            'positions' => ['required', 'array', 'min:1'],
            'positions.*.name' => ['required', 'string'],
            'positions.*.quota' => ['required', 'integer', 'min:0'],
        ]);

        $slug = Str::slug($validated['name']);
        $uniqueSlug = $slug;
        $counter = 1;
        while (Event::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = "{$slug}-{$counter}";
            $counter++;
        }

        $event = Event::create([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'slug' => $uniqueSlug,
            'organizer' => $validated['organizer'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? null,
            'registration_start_at' => $validated['registration_start_at'],
            'registration_end_at' => $validated['registration_end_at'],
            'selection_start_at' => $validated['selection_start_at'] ?? null,
            'selection_end_at' => $validated['selection_end_at'] ?? null,
            'total_quota' => $validated['total_quota'],
            'status' => $validated['status'],
            'close_when_full' => $validated['close_when_full'] ?? true,
        ]);

        foreach ($validated['positions'] as $pos) {
            EventPosition::create([
                'event_id' => $event->id,
                'position_name' => $pos['name'],
                'quota' => $pos['quota'],
                'active' => true,
            ]);
        }

        AuditLog::log('create_event', $event, null, ['name' => $event->name, 'code' => $event->code]);

        return redirect()->route('admin.events.index')->with('success', 'Event pendaftaran baru berhasil dibuat.');
    }

    public function edit(int $id): Response
    {
        $event = Event::with('positions')->findOrFail($id);

        return Inertia::render('Admin/Events/Form', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'code' => ['required', 'string', 'max:20', 'unique:events,code,'.$event->id],
            'organizer' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:200'],
            'registration_start_at' => ['required', 'date'],
            'registration_end_at' => ['required', 'date', 'after:registration_start_at'],
            'selection_start_at' => ['nullable', 'date'],
            'selection_end_at' => ['nullable', 'date'],
            'total_quota' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:draft,scheduled,open,paused,closed,completed,archived'],
            'close_when_full' => ['boolean'],
            'positions' => ['required', 'array', 'min:1'],
            'positions.*.name' => ['required', 'string'],
            'positions.*.quota' => ['required', 'integer', 'min:0'],
        ]);

        $old = $event->toArray();

        $event->update([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'organizer' => $validated['organizer'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? null,
            'registration_start_at' => $validated['registration_start_at'],
            'registration_end_at' => $validated['registration_end_at'],
            'selection_start_at' => $validated['selection_start_at'] ?? null,
            'selection_end_at' => $validated['selection_end_at'] ?? null,
            'total_quota' => $validated['total_quota'],
            'status' => $validated['status'],
            'close_when_full' => $validated['close_when_full'] ?? true,
        ]);

        // Sync positions
        foreach ($validated['positions'] as $pos) {
            EventPosition::updateOrCreate(
                ['event_id' => $event->id, 'position_name' => $pos['name']],
                ['quota' => $pos['quota'], 'active' => true]
            );
        }

        AuditLog::log('update_event', $event, $old, $event->toArray());

        return redirect()->route('admin.events.index')->with('success', 'Event pendaftaran berhasil diperbarui.');
    }

    public function toggleStatus(Request $request, int $id): RedirectResponse
    {
        $event = Event::findOrFail($id);
        $newStatus = $request->input('status');

        if (! in_array($newStatus, ['open', 'paused', 'closed', 'archived'])) {
            return back()->with('error', 'Status tidak valid.');
        }

        $prevStatus = $event->status;
        $event->status = $newStatus;
        $event->save();

        AuditLog::log('toggle_event_status', $event, ['status' => $prevStatus], ['status' => $newStatus]);

        return back()->with('success', "Status event berhasil diubah menjadi: {$newStatus}");
    }
}
