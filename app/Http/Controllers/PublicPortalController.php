<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class PublicPortalController extends Controller
{
    /**
     * Display the public landing page.
     */
    public function index(): Response
    {
        $activeEvent = Event::with(['positions' => function ($query) {
            $query->where('active', true);
        }])
            ->where('status', 'open')
            ->first() ?? Event::latest()->first();

        $stats = null;
        if ($activeEvent) {
            $registeredCount = $activeEvent->registrations()->count();
            $positionsData = $activeEvent->positions->map(function ($pos) use ($activeEvent) {
                $filled = $activeEvent->registrations()->where('primary_position', $pos->position_name)->count();

                return [
                    'id' => $pos->id,
                    'name' => $pos->position_name,
                    'quota' => $pos->quota,
                    'filled' => $filled,
                    'percentage' => $pos->quota > 0 ? min(100, round(($filled / $pos->quota) * 100)) : 0,
                ];
            });

            $stats = [
                'registered_count' => $registeredCount,
                'total_quota' => $activeEvent->total_quota,
                'days_remaining' => $activeEvent->days_remaining,
                'is_open' => $activeEvent->isOpenForRegistration(),
                'positions' => $positionsData,
            ];
        }

        $announcements = Announcement::where('status', 'published')
            ->where('audience_type', 'publik')
            ->latest('publish_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/Home', [
            'event' => $activeEvent,
            'stats' => $stats,
            'announcements' => $announcements,
        ]);
    }

    /**
     * Display the announcements list.
     */
    public function announcements(): Response
    {
        $announcements = Announcement::where('status', 'published')
            ->where('audience_type', 'publik')
            ->latest('publish_at')
            ->paginate(9);

        return Inertia::render('Public/Announcements', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Display announcement detail.
     */
    public function announcementDetail(string $slug): Response
    {
        $announcement = Announcement::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('Public/AnnouncementDetail', [
            'announcement' => $announcement,
        ]);
    }
}
