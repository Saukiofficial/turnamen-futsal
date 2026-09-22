<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventPosition;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Core Users (updateOrCreate — password & data selalu sinkron)
        $admin = User::updateOrCreate(
            ['email' => 'admin@futsalreg.test'],
            [
                'name' => 'Super Admin Futsal',
                'password' => Hash::make('saf2026!'),
                'role' => 'super_admin',
                'status' => 'active',
                'phone' => '081234567890',
            ]
        );

        User::updateOrCreate(
            ['email' => 'verifikator@futsalreg.test'],
            [
                'name' => 'Budi Santoso (Verifikator)',
                'password' => Hash::make('password'),
                'role' => 'verifikator',
                'status' => 'active',
                'phone' => '081234567891',
            ]
        );

        User::updateOrCreate(
            ['email' => 'pelatih@futsalreg.test'],
            [
                'name' => 'Coach Danu (Head Coach)',
                'password' => Hash::make('password'),
                'role' => 'pelatih',
                'status' => 'active',
                'phone' => '081234567892',
            ]
        );

        User::updateOrCreate(
            ['email' => 'checkin@futsalreg.test'],
            [
                'name' => 'Rian Hidayat (Petugas Check-in)',
                'password' => Hash::make('password'),
                'role' => 'checkin_officer',
                'status' => 'active',
                'phone' => '081234567893',
            ]
        );

        // 2. Create Active Event (idempoten — skip jika sudah ada)
        $event = Event::firstOrCreate(
            ['code' => 'FTS2026'],
            [
                'name' => 'SAF League — Turnamen Futsal 2026',
                'slug' => 'saf-league-turnamen-futsal-2026',
                'organizer' => 'Panitia Penyelenggara SAF League 2026',
                'description' => 'Turnamen resmi kompetisi futsal SAF League musim 2026. Pendaftaran perorangan terbuka untuk posisi Goalkeeper, Anchor, Flank, dan Pivot.',
                'location' => 'GOR Futsal Arena Sport Center, Sumenep',
                'registration_start_at' => now()->subDays(10),
                'registration_end_at' => now()->addDays(20)->endOfDay(),
                'selection_start_at' => now()->addDays(25)->setHour(8)->setMinute(0),
                'selection_end_at' => now()->addDays(27)->setHour(17)->setMinute(0),
                'total_quota' => 200,
                'status' => 'open',
                'close_when_full' => true,
                'settings_json' => [
                    'allow_revisions' => true,
                    'card_template' => 'id_card',
                ],
            ]
        );

        // 3. Create Event Positions (idempoten — skip jika sudah ada per event)
        $positions = [
            ['name' => 'Goalkeeper', 'quota' => 20],
            ['name' => 'Anchor', 'quota' => 50],
            ['name' => 'Flank', 'quota' => 80],
            ['name' => 'Pivot', 'quota' => 50],
        ];

        foreach ($positions as $pos) {
            EventPosition::firstOrCreate(
                ['event_id' => $event->id, 'position_name' => $pos['name']],
                ['quota' => $pos['quota'], 'active' => true]
            );
        }

        // 4. Audit Log
        AuditLog::log('system_initialized', $event, null, ['status' => 'open', 'event' => $event->name]);
    }
}
