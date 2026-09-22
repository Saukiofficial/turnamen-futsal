<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\AssessmentCriterion;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventPosition;
use App\Models\Participant;
use App\Models\Registration;
use App\Models\SelectionSession;
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
        // 1. Create Core Users
        $admin = User::create([
            'name' => 'Super Admin Futsal',
            'email' => 'admin@futsalreg.test',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active',
            'phone' => '081234567890',
        ]);

        $verifikator = User::create([
            'name' => 'Budi Santoso (Verifikator)',
            'email' => 'verifikator@futsalreg.test',
            'password' => Hash::make('password'),
            'role' => 'verifikator',
            'status' => 'active',
            'phone' => '081234567891',
        ]);

        $pelatih = User::create([
            'name' => 'Coach Danu (Head Coach)',
            'email' => 'pelatih@futsalreg.test',
            'password' => Hash::make('password'),
            'role' => 'pelatih',
            'status' => 'active',
            'phone' => '081234567892',
        ]);

        $checkin = User::create([
            'name' => 'Rian Hidayat (Petugas Check-in)',
            'email' => 'checkin@futsalreg.test',
            'password' => Hash::make('password'),
            'role' => 'checkin_officer',
            'status' => 'active',
            'phone' => '081234567893',
        ]);

        // 2. Create Active Event
        $event = Event::create([
            'name' => 'SAF League — Turnamen Futsal 2026',
            'code' => 'FTS2026',
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
        ]);

        // 3. Create Event Positions
        $positions = [
            ['name' => 'Goalkeeper', 'quota' => 20],
            ['name' => 'Anchor', 'quota' => 50],
            ['name' => 'Flank', 'quota' => 80],
            ['name' => 'Pivot', 'quota' => 50],
        ];

        foreach ($positions as $pos) {
            EventPosition::create([
                'event_id' => $event->id,
                'position_name' => $pos['name'],
                'quota' => $pos['quota'],
                'active' => true,
            ]);
        }

        // 4. Create Selection Sessions
        SelectionSession::create([
            'event_id' => $event->id,
            'name' => 'Sesi 1 - Pagi (Goalkeeper & Anchor)',
            'date' => now()->addDays(25)->toDateString(),
            'start_time' => '08:00:00',
            'end_time' => '11:30:00',
            'location' => 'Lapangan Utama A',
            'capacity' => 60,
        ]);

        SelectionSession::create([
            'event_id' => $event->id,
            'name' => 'Sesi 2 - Siang (Flank & Pivot)',
            'date' => now()->addDays(25)->toDateString(),
            'start_time' => '13:30:00',
            'end_time' => '17:00:00',
            'location' => 'Lapangan Utama B',
            'capacity' => 80,
        ]);

        // 5. Create Assessment Criteria
        $criteria = [
            ['name' => 'Teknik Dasar (Passing & Control)', 'weight' => 25],
            ['name' => 'Pemahaman Taktik & Posisi', 'weight' => 20],
            ['name' => 'Fisik, Kelincahan & Kecepatan', 'weight' => 20],
            ['name' => 'Shooting & Finishing', 'weight' => 20],
            ['name' => 'Kedisiplinan & Sikap', 'weight' => 15],
        ];

        foreach ($criteria as $crit) {
            AssessmentCriterion::create([
                'event_id' => $event->id,
                'name' => $crit['name'],
                'weight' => $crit['weight'],
                'min_score' => 0,
                'max_score' => 100,
                'active' => true,
            ]);
        }

        // 6. Create Sample Registrations
        $sampleParticipants = [
            [
                'name' => 'Ahmad Rizky Pratama',
                'nik' => '3529011204040001',
                'birth_place' => 'Sumenep',
                'birth_date' => '2004-04-12',
                'school' => 'SMA Negeri 1 Sumenep',
                'position' => 'Anchor',
                'status' => 'lolos_administrasi',
            ],
            [
                'name' => 'Dimas Maulana Akbar',
                'nik' => '3529011508050002',
                'birth_place' => 'Pamekasan',
                'birth_date' => '2005-08-15',
                'school' => 'SMK Negeri 2 Pamekasan',
                'position' => 'Flank',
                'status' => 'menunggu_verifikasi',
            ],
            [
                'name' => 'Fahri Ramadhan',
                'nik' => '3529012301030003',
                'birth_place' => 'Surabaya',
                'birth_date' => '2003-01-23',
                'school' => 'Universitas Wiraraja',
                'position' => 'Goalkeeper',
                'status' => 'lolos_administrasi',
            ],
            [
                'name' => 'Bayu Setiawan',
                'nik' => '3529010509060004',
                'birth_place' => 'Sumenep',
                'birth_date' => '2006-09-05',
                'school' => 'MAN 1 Sumenep',
                'position' => 'Pivot',
                'status' => 'perlu_perbaikan',
                'note' => 'Foto 3x4 kurang jelas/gelap. Mohon upload ulang foto terbaru dengan pencahayaan baik.',
                'revision_fields' => ['photo'],
            ],
            [
                'name' => 'Rendra Bagus Wicaksono',
                'nik' => '3529011812040005',
                'birth_place' => 'Bangkalan',
                'birth_date' => '2004-12-18',
                'school' => 'SMA Negeri 2 Sumenep',
                'position' => 'Flank',
                'status' => 'menunggu_verifikasi',
            ],
            [
                'name' => 'Irfan Hakim Putra',
                'nik' => '3529010207050006',
                'birth_place' => 'Sampang',
                'birth_date' => '2005-07-02',
                'school' => 'Klub Futsal Garuda',
                'position' => 'Pivot',
                'status' => 'lolos_administrasi',
            ],
        ];

        foreach ($sampleParticipants as $index => $data) {
            $participant = new Participant([
                'full_name' => $data['name'],
                'birth_place' => $data['birth_place'],
                'birth_date' => $data['birth_date'],
                'school_name' => $data['school'],
            ]);
            $participant->setNik($data['nik']);
            $participant->save();

            $accessCode = Registration::generateAccessCode();
            $regNumber = 'FTS-'.date('Y').'-'.str_pad((string) ($index + 1), 6, '0', STR_PAD_LEFT);

            Registration::create([
                'event_id' => $event->id,
                'participant_id' => $participant->id,
                'registration_number' => $regNumber,
                'access_code_hash' => Hash::make($accessCode),
                'access_code_plain' => $accessCode,
                'qr_token' => Registration::generateQrToken(),
                'primary_position' => $data['position'],
                'photo_path' => null,
                'registration_status' => 'submitted',
                'verification_status' => $data['status'],
                'selection_status' => 'menunggu_seleksi',
                'submitted_at' => now()->subDays(rand(1, 8)),
                'verified_at' => $data['status'] === 'lolos_administrasi' ? now()->subDays(1) : null,
                'verified_by' => $data['status'] === 'lolos_administrasi' ? $verifikator->id : null,
                'verification_notes' => $data['note'] ?? null,
                'revision_fields' => $data['revision_fields'] ?? null,
            ]);
        }

        // 7. Create Sample Announcement
        Announcement::create([
            'event_id' => $event->id,
            'title' => 'Panduan & Tata Tertib Pendaftaran Seleksi Futsal 2026',
            'slug' => 'panduan-tata-tertib-seleksi-futsal-2026',
            'content' => "Selamat datang calon pemain futsal 2026!\n\nPastikan Anda mengisi formulir biodata dengan teliti sesuai KTP/identitas resmi. Foto formal 3x4 wajib berlatar polos dan wajah terlihat jelas.\n\nBagi peserta yang lolos verifikasi berkas administrasi, kartu peserta resmi dapat diunduh langsung melalui menu Cek Status dengan memasukkan nomor pendaftaran dan kode akses rahasia.",
            'audience_type' => 'publik',
            'publish_at' => now()->subDays(5),
            'status' => 'published',
            'created_by' => $admin->id,
        ]);

        // 8. Audit Log Sample
        AuditLog::log('system_initialized', $event, null, ['status' => 'open', 'event' => $event->name]);
    }
}
