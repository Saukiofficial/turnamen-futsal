<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Participant;
use App\Models\Registration;
use App\Models\Team;
use App\Models\TeamPlayer;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FutsalRegistrationTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        Event::firstOrCreate(
            ['slug' => 'seleksi-tim-futsal-2026'],
            [
                'name' => 'Seleksi Terbuka Tim Futsal 2026',
                'code' => 'FTS2026',
                'description' => 'Seleksi resmi pembentukan skuad futsal.',
                'registration_start_at' => now()->subDays(5),
                'registration_end_at' => now()->addDays(20),
                'selection_start_at' => now()->addDays(25),
                'selection_end_at' => now()->addDays(27),
                'location' => 'GOR Futsal Sport Hall',
                'total_quota' => 200,
                'status' => 'open',
                'close_when_full' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@futsalreg.test'],
            [
                'name' => 'Super Administrator',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'checkin@futsalreg.test'],
            [
                'name' => 'Petugas Checkin',
                'password' => bcrypt('password'),
                'role' => 'checkin_officer',
                'status' => 'active',
            ]
        );
    }

    public function test_public_can_view_registration_page(): void
    {
        $event = Event::first();

        $response = $this->get("/daftar/{$event->slug}");
        $response->assertStatus(200);
    }

    public function test_candidate_can_submit_registration(): void
    {
        Storage::fake('public');
        $event = Event::first();

        Participant::where('nik_hash', hash('sha256', '3201123456789999'))->delete();

        $photo = UploadedFile::fake()->image('candidate_photo.jpg', 600, 800);

        $payload = [
            'event_id' => $event->id,
            'full_name' => 'Bambang Pamungkas Jr',
            'nik' => '3201123456789999',
            'birth_place' => 'Bandung',
            'birth_date' => '2008-05-15',
            'school_name' => 'SMAN 1 Bandung',
            'primary_position' => 'Pivot',
            'agreement' => '1',
            'photo' => $photo,
        ];

        $response = $this->post('/daftar', $payload);

        $response->assertRedirect();

        $participant = Participant::where('nik_hash', hash('sha256', '3201123456789999'))->first();
        $this->assertNotNull($participant);
        $this->assertEquals('Bambang Pamungkas Jr', $participant->full_name);
        $this->assertEquals('3201 •••• •••• 9999', $participant->masked_nik);

        $registration = Registration::where('participant_id', $participant->id)->first();
        $this->assertNotNull($registration);
        $this->assertStringStartsWith('FTS-2026-', $registration->registration_number);
        $this->assertNotEmpty($registration->access_code_plain);
        $this->assertNotEmpty($registration->qr_token);
        $this->assertEquals('menunggu_verifikasi', $registration->verification_status);
    }

    public function test_duplicate_nik_in_same_event_is_rejected(): void
    {
        Storage::fake('public');
        $event = Event::first();
        Participant::where('nik_hash', hash('sha256', '3201999988887777'))->delete();

        $photo = UploadedFile::fake()->image('photo.jpg', 600, 800);

        $payload = [
            'event_id' => $event->id,
            'full_name' => 'Candidate Double',
            'nik' => '3201999988887777',
            'birth_place' => 'Jakarta',
            'birth_date' => '2008-01-01',
            'school_name' => 'SMAN 2',
            'primary_position' => 'Flank',
            'agreement' => '1',
            'photo' => $photo,
        ];

        // First registration
        $res1 = $this->post('/daftar', $payload);
        $res1->assertRedirect();

        // Second registration with same NIK and event
        $res2 = $this->post('/daftar', $payload);
        $res2->assertSessionHasErrors('nik');
    }

    public function test_admin_can_verify_and_approve_registration(): void
    {
        $admin = User::where('role', 'super_admin')->first();
        $registration = Registration::where('verification_status', 'menunggu_verifikasi')->first();
        if (! $registration) {
            $participant = Participant::create([
                'full_name' => 'Verif Candidate',
                'nik_encrypted' => Crypt::encryptString('3201111122223333'),
                'nik_hash' => hash('sha256', '3201111122223333'),
                'birth_place' => 'Jakarta',
                'birth_date' => '2008-01-01',
            ]);
            $event = Event::first();
            $registration = Registration::create([
                'event_id' => $event->id,
                'participant_id' => $participant->id,
                'registration_number' => Registration::generateRegistrationNumber($event->id),
                'access_code_hash' => bcrypt('CODE1234'),
                'access_code_plain' => 'CODE1234',
                'qr_token' => Registration::generateQrToken(),
                'primary_position' => 'Anchor',
                'verification_status' => 'menunggu_verifikasi',
                'submitted_at' => now(),
            ]);
        }
        $this->assertNotNull($registration);

        $response = $this->actingAs($admin)->post("/admin/verification/{$registration->id}/process", [
            'action' => 'approve',
            'note' => 'Berkas valid dan sesuai syarat',
        ]);

        $response->assertRedirect();
        $registration->refresh();
        $this->assertEquals('lolos_administrasi', $registration->verification_status);
        $this->assertNotNull($registration->verified_at);
    }

    public function test_checkin_lookup_and_confirm_via_qr_token(): void
    {
        $officer = User::where('role', 'checkin_officer')->firstOrFail();
        $event = Event::firstOrFail();
        $participant = Participant::create([
            'full_name' => 'Checkin Candidate',
            'nisn' => '0091445566',
            'nik_encrypted' => Crypt::encryptString('3201444455556666'),
            'nik_hash' => hash('sha256', '3201444455556666'),
            'birth_place' => 'Jakarta',
            'birth_date' => '2008-01-01',
            'school_name' => 'SMAN Checkin',
        ]);
        $registration = Registration::create([
            'event_id' => $event->id,
            'participant_id' => $participant->id,
            'registration_number' => Registration::generateRegistrationNumber($event->id),
            'access_code_hash' => bcrypt('CODE1234'),
            'access_code_plain' => 'CODE1234',
            'qr_token' => Registration::generateQrToken(),
            'primary_position' => 'Flank',
            'verification_status' => 'lolos_administrasi',
            'submitted_at' => now(),
        ]);
        $team = Team::create([
            'event_id' => $event->id,
            'team_name' => 'Tim Checkin Resmi',
            'school_name' => 'SMAN Checkin',
            'head_coach' => 'Coach Checkin',
            'manager_name' => 'Manager Checkin',
            'manager_phone' => '081234567890',
            'registration_number' => Team::generateRegistrationNumber($event->id),
            'access_code_plain' => 'TEAMCODE',
            'access_code_hash' => bcrypt('TEAMCODE'),
            'qr_token' => Team::generateQrToken(),
            'verification_status' => 'lolos_administrasi',
            'submitted_at' => now(),
        ]);
        TeamPlayer::create([
            'team_id' => $team->id,
            'participant_id' => $participant->id,
            'nisn' => $participant->nisn,
        ]);

        $lookupResponse = $this->actingAs($officer)->post('/admin/checkin/lookup', [
            'keyword' => $registration->qr_token,
            'event_id' => $event->id,
        ]);
        $lookupResponse->assertJson([
            'found' => true,
            'registration' => [
                'registration_number' => $registration->registration_number,
                'is_eligible' => true,
                'team_name' => 'Tim Checkin Resmi',
            ],
        ]);

        $confirmResponse = $this->actingAs($officer)->post('/admin/checkin/confirm', [
            'registration_id' => $registration->id,
            'status' => 'hadir',
        ]);
        $confirmResponse->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('attendances', [
            'registration_id' => $registration->id,
            'status' => 'hadir',
        ]);
    }

    public function test_checkin_rejects_approved_player_outside_official_team_roster(): void
    {
        $officer = User::where('role', 'checkin_officer')->firstOrFail();
        $event = Event::firstOrFail();
        $participant = Participant::create([
            'full_name' => 'Pemain Luar',
            'nisn' => '0091778899',
            'nik_encrypted' => Crypt::encryptString('3201777788889999'),
            'nik_hash' => hash('sha256', '3201777788889999'),
            'birth_place' => 'Bandung',
            'birth_date' => '2008-02-01',
            'school_name' => 'Sekolah Luar',
        ]);
        $registration = Registration::create([
            'event_id' => $event->id,
            'participant_id' => $participant->id,
            'registration_number' => Registration::generateRegistrationNumber($event->id),
            'access_code_hash' => bcrypt('OUTSIDER'),
            'access_code_plain' => 'OUTSIDER',
            'qr_token' => Registration::generateQrToken(),
            'primary_position' => 'Pivot',
            'verification_status' => 'lolos_administrasi',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($officer)->post('/admin/checkin/confirm', [
            'registration_id' => $registration->id,
            'status' => 'hadir',
        ]);

        $response->assertRedirect()->assertSessionHas(
            'error',
            'Check-in ditolak. Pemain tidak tercatat dalam roster tim resmi yang telah disetujui.',
        );
        $this->assertDatabaseMissing('attendances', [
            'registration_id' => $registration->id,
        ]);
    }

    public function test_candidate_can_submit_registration_with_nisn(): void
    {
        Storage::fake('public');
        $event = Event::first();

        Participant::where('nisn', '0089876543')->delete();

        $photo = UploadedFile::fake()->image('nisn_candidate.jpg', 600, 800);

        $payload = [
            'event_id' => $event->id,
            'full_name' => 'Futsal Player NISN',
            'nisn' => '0089876543',
            'birth_place' => 'Surabaya',
            'birth_date' => '2008-08-17',
            'school_name' => 'SMAN 5 Surabaya',
            'primary_position' => 'Anchor',
            'agreement' => '1',
            'photo' => $photo,
        ];

        $response = $this->post('/daftar', $payload);
        $response->assertRedirect();

        $participant = Participant::where('nisn', '0089876543')->first();
        $this->assertNotNull($participant);
        $this->assertEquals('0089876543', $participant->nisn);
    }

    public function test_public_can_view_team_registration_page(): void
    {
        $response = $this->get('/daftar-tim');
        $response->assertStatus(200);
    }

    public function test_school_team_can_submit_registration(): void
    {
        Storage::fake('public');
        $event = Event::first();

        $doc = UploadedFile::fake()->create('surat_rekom_dan_nisn.pdf', 500, 'application/pdf');
        $logo = UploadedFile::fake()->image('team_logo.png', 400, 400);

        $payload = [
            'event_id' => $event->id,
            'team_name' => 'Garuda Muda FC',
            'school_name' => 'SMAN 1 Garut',
            'head_coach' => 'Coach Indra',
            'manager_name' => 'Budi Santoso',
            'manager_phone' => '081234567890',
            'document' => $doc,
            'logo' => $logo,
            'agreement' => '1',
        ];

        $response = $this->post('/daftar-tim', $payload);
        $response->assertRedirect();

        $team = Team::where('team_name', 'Garuda Muda FC')->first();
        $this->assertNotNull($team);
        $this->assertStringStartsWith('TIM-2026-', $team->registration_number);
        $this->assertEquals('SMAN 1 Garut', $team->school_name);
        $this->assertEquals('Coach Indra', $team->head_coach);
        $this->assertEquals('menunggu_verifikasi', $team->verification_status);
        $this->assertNotEmpty($team->access_code_plain);
        $this->assertNotNull($team->document_path);
        $this->assertNotNull($team->logo_path);
    }

    public function test_team_registration_rejects_player_outside_event_roster(): void
    {
        Storage::fake('public');
        $event = Event::firstOrFail();
        $document = UploadedFile::fake()->create('surat-rekomendasi.pdf', 500, 'application/pdf');
        Participant::where('nisn', '0099999999')->delete();

        $response = $this->post('/daftar-tim', [
            'event_id' => $event->id,
            'team_name' => 'Tim Dengan Pemain Luar',
            'school_name' => 'SMAN Anti Curang',
            'head_coach' => 'Coach Aman',
            'manager_name' => 'Manager Aman',
            'manager_phone' => '081299998888',
            'document' => $document,
            'players' => [
                ['nisn' => '0099999999'],
            ],
            'agreement' => '1',
        ]);

        $response->assertInvalid([
            'players' => 'Pemain dengan NISN 0099999999 tidak terdaftar pada event turnamen ini.',
        ]);
        $this->assertDatabaseMissing('teams', [
            'team_name' => 'Tim Dengan Pemain Luar',
        ]);
    }

    public function test_public_can_view_live_tournament_matches_bracket(): void
    {
        $response = $this->get('/hasil-pertandingan');
        $response->assertStatus(200);
    }

    public function test_team_check_player_nisn_validates_individual_registration(): void
    {
        $event = Event::first();

        // 1. Unregistered NISN
        $resNotFound = $this->postJson('/api/teams/check-player-nisn', [
            'nisn' => '9998887776',
            'event_id' => $event->id,
        ]);
        $resNotFound->assertOk();
        $resNotFound->assertJson([
            'valid' => false,
            'not_found' => true,
        ]);

        // 2. Create individual participant with registration
        $participant = Participant::create([
            'full_name' => 'Futsal Star Player',
            'nik_encrypted' => Crypt::encryptString('3201555566667777'),
            'nik_hash' => hash('sha256', '3201555566667777'),
            'nisn' => '0081122334',
            'birth_place' => 'Surabaya',
            'birth_date' => '2008-01-10',
            'school_name' => 'SMAN 1 Surabaya',
        ]);

        $reg = Registration::create([
            'event_id' => $event->id,
            'participant_id' => $participant->id,
            'registration_number' => Registration::generateRegistrationNumber($event->id),
            'access_code_plain' => 'TESTCODE',
            'access_code_hash' => bcrypt('TESTCODE'),
            'qr_token' => Registration::generateQrToken(),
            'primary_position' => 'Pivot',
            'verification_status' => 'lolos_administrasi',
            'submitted_at' => now(),
        ]);

        // 3. Check registered NISN
        $resFound = $this->postJson('/api/teams/check-player-nisn', [
            'nisn' => '0081122334',
            'event_id' => $event->id,
        ]);
        $resFound->assertOk();
        $resFound->assertJson([
            'valid' => true,
            'player' => [
                'nisn' => '0081122334',
                'name' => 'Futsal Star Player',
                'position' => 'Pivot',
            ],
        ]);
    }

    public function test_school_team_can_register_with_squad_players(): void
    {
        Storage::fake('public');
        $event = Event::first();
        Team::where('team_name', 'SMAN 3 Malang Futsal')->delete();

        // Prepare 5 participants
        $playersPayload = [];
        for ($i = 1; $i <= 5; $i++) {
            $nisn = sprintf('008776655%d', $i);
            $nik = sprintf('320188889999000%d', $i);
            Participant::where('nisn', $nisn)->delete();

            $p = Participant::create([
                'full_name' => "Squad Player {$i}",
                'nik_encrypted' => Crypt::encryptString($nik),
                'nik_hash' => hash('sha256', $nik),
                'nisn' => $nisn,
                'birth_place' => 'Malang',
                'birth_date' => '2008-02-01',
                'school_name' => 'SMAN 3 Malang',
            ]);

            Registration::create([
                'event_id' => $event->id,
                'participant_id' => $p->id,
                'registration_number' => Registration::generateRegistrationNumber($event->id),
                'access_code_plain' => "PCODE{$i}",
                'access_code_hash' => bcrypt("PCODE{$i}"),
                'qr_token' => Registration::generateQrToken(),
                'primary_position' => 'Flank',
                'verification_status' => 'lolos_administrasi',
                'submitted_at' => now(),
            ]);

            $playersPayload[] = [
                'nisn' => $nisn,
            ];
        }

        $doc = UploadedFile::fake()->create('rekom_dan_nisn.pdf', 500, 'application/pdf');

        $payload = [
            'event_id' => $event->id,
            'team_name' => 'SMAN 3 Malang Futsal',
            'school_name' => 'SMAN 3 Malang',
            'head_coach' => 'Coach Heri',
            'manager_name' => 'Dwi Cahyono',
            'manager_phone' => '082199887766',
            'document' => $doc,
            'players' => $playersPayload,
            'agreement' => '1',
        ];

        $response = $this->post('/daftar-tim', $payload);
        $response->assertRedirect();

        $team = Team::where('team_name', 'SMAN 3 Malang Futsal')->first();
        $this->assertNotNull($team);
        $this->assertCount(5, $team->players);

        // Player already in another team check
        $resDuplicateCheck = $this->postJson('/api/teams/check-player-nisn', [
            'nisn' => '0087766551',
            'event_id' => $event->id,
        ]);
        $resDuplicateCheck->assertOk();
        $resDuplicateCheck->assertJson([
            'valid' => false,
            'already_in_team' => true,
        ]);
    }
}
