<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = [
            'app_name' => config('app.name', 'FutsalReg'),
            'organizer_name' => 'Asosiasi Futsal Kabupaten',
            'contact_email' => 'panitia@futsalreg.test',
            'contact_phone' => '0812-3456-7890',
            'timezone' => 'Asia/Jakarta',
            'default_quota' => 200,
            'auto_close_when_full' => true,
            'id_card_format' => 'FTS-{YEAR}-{SEQ6}',
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'organizer_name' => ['required', 'string', 'max:100'],
            'contact_email' => ['required', 'email'],
            'contact_phone' => ['required', 'string'],
        ]);

        AuditLog::log('settings_updated', null, null, $validated);

        return back()->with('success', 'Pengaturan sistem berhasil disimpan.');
    }
}
