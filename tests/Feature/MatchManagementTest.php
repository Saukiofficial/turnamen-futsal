<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Team;
use App\Models\TournamentMatch;
use App\Models\User;
use Tests\TestCase;

class MatchManagementTest extends TestCase
{
    protected Event $event;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->event = Event::firstOrCreate(
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

        $this->admin = User::firstOrCreate(
            ['email' => 'admin@futsalreg.test'],
            [
                'name' => 'Super Administrator',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );
    }

    protected function createTestTeam(string $name): Team
    {
        $code = Team::generateAccessCode();

        return Team::create([
            'event_id' => $this->event->id,
            'team_name' => $name,
            'school_name' => 'SMA '.$name,
            'head_coach' => 'Coach '.$name,
            'manager_name' => 'Manager '.$name,
            'manager_phone' => '081234567800',
            'registration_number' => Team::generateRegistrationNumber($this->event->id),
            'access_code_plain' => $code,
            'access_code_hash' => bcrypt($code),
            'qr_token' => Team::generateQrToken(),
            'verification_status' => 'lolos_administrasi',
        ]);
    }

    public function test_public_can_view_matches_page(): void
    {
        $response = $this->get(route('matches.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_view_bracket_management_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.matches.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_update_live_score_and_period(): void
    {
        $teamA = $this->createTestTeam('Alpha Futsal');
        $teamB = $this->createTestTeam('Beta Futsal');

        $match = TournamentMatch::create([
            'event_id' => $this->event->id,
            'round' => 'semifinal',
            'match_order' => 1,
            'team_a_id' => $teamA->id,
            'team_b_id' => $teamB->id,
            'status' => 'scheduled',
            'court_name' => 'Lapangan 1',
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.matches.update', $match->id), [
            'status' => 'live',
            'score_a' => 3,
            'score_b' => 2,
            'live_period' => 'Babak 2',
            'live_minute' => "34'",
            'live_stream_url' => 'https://www.youtube.com/watch?v=samplelive',
            'court_name' => 'Lapangan Utama',
        ]);

        $response->assertRedirect();

        $match->refresh();
        $this->assertEquals('live', $match->status);
        $this->assertEquals(3, $match->score_a);
        $this->assertEquals(2, $match->score_b);
        $this->assertEquals('Babak 2', $match->live_period);
        $this->assertEquals("34'", $match->live_minute);
        $this->assertEquals('https://www.youtube.com/watch?v=samplelive', $match->live_stream_url);
    }

    public function test_completing_match_advances_winner_to_next_round(): void
    {
        $teamA = $this->createTestTeam('Juara Futsal');
        $teamB = $this->createTestTeam('Runner Futsal');

        $finalMatch = TournamentMatch::create([
            'event_id' => $this->event->id,
            'round' => 'final',
            'match_order' => 1,
            'status' => 'scheduled',
            'court_name' => 'Lapangan Utama',
        ]);

        $semiMatch = TournamentMatch::create([
            'event_id' => $this->event->id,
            'round' => 'semifinal',
            'match_order' => 1,
            'team_a_id' => $teamA->id,
            'team_b_id' => $teamB->id,
            'next_match_id' => $finalMatch->id,
            'status' => 'live',
            'court_name' => 'Lapangan 1',
        ]);

        // Complete match with teamA as winner (4 - 1)
        $response = $this->actingAs($this->admin)->put(route('admin.matches.update', $semiMatch->id), [
            'status' => 'completed',
            'score_a' => 4,
            'score_b' => 1,
            'court_name' => 'Lapangan 1',
        ]);

        $response->assertRedirect();

        $semiMatch->refresh();
        $this->assertEquals('completed', $semiMatch->status);
        $this->assertEquals($teamA->id, $semiMatch->winner_team_id);

        $finalMatch->refresh();
        // Since semiMatch was match_order 1 (odd), teamA goes into finalMatch team_a_id
        $this->assertEquals($teamA->id, $finalMatch->team_a_id);
    }
}
