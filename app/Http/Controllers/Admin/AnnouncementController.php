<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AuditLog;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::with(['event', 'createdBy'])
            ->latest('publish_at')
            ->paginate(10);

        $events = Event::select('id', 'name')->get();

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'events' => $events,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id' => ['nullable', 'exists:events,id'],
            'title' => ['required', 'string', 'max:200'],
            'content' => ['required', 'string'],
            'audience_type' => ['required', 'in:publik,peserta,lolos_administrasi,lolos_seleksi'],
            'publish_at' => ['nullable', 'date'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $slug = Str::slug($validated['title']);
        $uniqueSlug = $slug;
        $count = 1;
        while (Announcement::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = "{$slug}-{$count}";
            $count++;
        }

        $announcement = Announcement::create([
            'event_id' => $validated['event_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $uniqueSlug,
            'content' => $validated['content'],
            'audience_type' => $validated['audience_type'],
            'publish_at' => $validated['publish_at'] ?? now(),
            'status' => $validated['status'],
            'created_by' => auth()->id(),
        ]);

        AuditLog::log('announcement_created', $announcement);

        return back()->with('success', 'Pengumuman baru berhasil diterbitkan.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        AuditLog::log('announcement_deleted', null, ['title' => $announcement->title]);

        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
