<?php

use App\Models\Event;
use App\Models\Team;
use App\Models\TournamentMatch;
use Illuminate\Support\Facades\Hash;

$event = Event::first();
if (! $event) {
    echo "No event found.\n";
    exit;
}

$event->update([
    'name' => 'SAF League — Turnamen Futsal 2026',
    'description' => 'Turnamen Futsal Resmi Antar Pelajar memperebutkan Piala Bergilir SAF League 2026.',
    'organizer' => 'SAF League Indonesia & Asosiasi Futsal',
    'location' => 'GOR Futsal Championship Arena',
]);

echo "Event updated: {$event->name}\n";

// 8 Sample Teams
$sampleTeams = [
    ['team_name' => 'SMAN 1 Bandung FC', 'school_name' => 'SMAN 1 Bandung', 'coach' => 'Coach Indra'],
    ['team_name' => 'SMAN 3 Bandung FC', 'school_name' => 'SMAN 3 Bandung', 'coach' => 'Coach Deden'],
    ['team_name' => 'SMAN 1 Garut FC', 'school_name' => 'SMAN 1 Garut', 'coach' => 'Coach Asep'],
    ['team_name' => 'SMKN 1 Cimahi FC', 'school_name' => 'SMKN 1 Cimahi', 'coach' => 'Coach Budi'],
    ['team_name' => 'SMAN 2 Cimahi FC', 'school_name' => 'SMAN 2 Cimahi', 'coach' => 'Coach Rahmat'],
    ['team_name' => 'SMAN 5 Bandung FC', 'school_name' => 'SMAN 5 Bandung', 'coach' => 'Coach Fajar'],
    ['team_name' => 'SMA Al-Masoem FC', 'school_name' => 'SMA Al-Masoem', 'coach' => 'Coach Yudi'],
    ['team_name' => 'SMAN 1 Sukabumi FC', 'school_name' => 'SMAN 1 Sukabumi', 'coach' => 'Coach Harry'],
];

$teamModels = [];
foreach ($sampleTeams as $idx => $st) {
    $regNumber = sprintf('TIM-2026-%04d', $idx + 1);
    $team = Team::firstOrCreate(
        ['event_id' => $event->id, 'team_name' => $st['team_name']],
        [
            'school_name' => $st['school_name'],
            'head_coach' => $st['coach'],
            'manager_name' => 'Manager '.$st['school_name'],
            'manager_phone' => '08123456789'.$idx,
            'registration_number' => $regNumber,
            'access_code_plain' => 'SAF'.(1000 + $idx),
            'access_code_hash' => Hash::make('SAF'.(1000 + $idx)),
            'qr_token' => 'QR-TIM-'.md5($regNumber),
            'verification_status' => 'lolos_administrasi',
            'submitted_at' => now()->subDays(2),
            'verified_at' => now()->subDay(),
        ]
    );
    $teamModels[] = $team;
}

echo 'Teams ready: '.count($teamModels)."\n";

// Clear previous matches for this event to generate a clean, beautiful sample bracket
TournamentMatch::where('event_id', $event->id)->delete();

// Final Match
$final = TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'final',
    'match_order' => 1,
    'team_a_id' => null,
    'team_b_id' => null,
    'status' => 'scheduled',
    'court_name' => 'Lapangan Utama A',
    'match_time' => now()->addDays(3)->setTime(16, 0),
]);

// 3rd Place Match
$juara3 = TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'juara_3',
    'match_order' => 1,
    'team_a_id' => null,
    'team_b_id' => null,
    'status' => 'scheduled',
    'court_name' => 'Lapangan Utama B',
    'match_time' => now()->addDays(3)->setTime(14, 0),
]);

// Semifinal 1 -> winner advances to Final team A
$sf1 = TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'semifinal',
    'match_order' => 1,
    'team_a_id' => $teamModels[0]->id, // SMAN 1 Bandung
    'team_b_id' => $teamModels[2]->id, // SMAN 1 Garut
    'status' => 'live',
    'court_name' => 'Lapangan Utama A',
    'match_time' => now()->setTime(14, 30),
    'score_a' => 2,
    'score_b' => 1,
    'next_match_id' => $final->id,
]);

// Semifinal 2 -> winner advances to Final team B
$sf2 = TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'semifinal',
    'match_order' => 2,
    'team_a_id' => $teamModels[4]->id, // SMAN 2 Cimahi
    'team_b_id' => $teamModels[6]->id, // SMA Al-Masoem
    'status' => 'scheduled',
    'court_name' => 'Lapangan Utama A',
    'match_time' => now()->addDay()->setTime(15, 30),
    'next_match_id' => $final->id,
]);

// Quarterfinals (QF 1 to 4)
// QF 1: Team 0 vs Team 1 -> Winner: Team 0
TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'perempat_final',
    'match_order' => 1,
    'team_a_id' => $teamModels[0]->id,
    'team_b_id' => $teamModels[1]->id,
    'status' => 'completed',
    'court_name' => 'Lapangan A',
    'match_time' => now()->subDay()->setTime(9, 0),
    'score_a' => 4,
    'score_b' => 2,
    'winner_team_id' => $teamModels[0]->id,
    'next_match_id' => $sf1->id,
]);

// QF 2: Team 2 vs Team 3 -> Winner: Team 2
TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'perempat_final',
    'match_order' => 2,
    'team_a_id' => $teamModels[2]->id,
    'team_b_id' => $teamModels[3]->id,
    'status' => 'completed',
    'court_name' => 'Lapangan B',
    'match_time' => now()->subDay()->setTime(10, 30),
    'score_a' => 3,
    'score_b' => 3,
    'penalty_a' => 4,
    'penalty_b' => 3,
    'winner_team_id' => $teamModels[2]->id,
    'next_match_id' => $sf1->id,
]);

// QF 3: Team 4 vs Team 5 -> Winner: Team 4
TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'perempat_final',
    'match_order' => 3,
    'team_a_id' => $teamModels[4]->id,
    'team_b_id' => $teamModels[5]->id,
    'status' => 'completed',
    'court_name' => 'Lapangan A',
    'match_time' => now()->subDay()->setTime(13, 0),
    'score_a' => 5,
    'score_b' => 1,
    'winner_team_id' => $teamModels[4]->id,
    'next_match_id' => $sf2->id,
]);

// QF 4: Team 6 vs Team 7 -> Winner: Team 6
TournamentMatch::create([
    'event_id' => $event->id,
    'round' => 'perempat_final',
    'match_order' => 4,
    'team_a_id' => $teamModels[6]->id,
    'team_b_id' => $teamModels[7]->id,
    'status' => 'completed',
    'court_name' => 'Lapangan B',
    'match_time' => now()->subDay()->setTime(14, 30),
    'score_a' => 2,
    'score_b' => 0,
    'winner_team_id' => $teamModels[6]->id,
    'next_match_id' => $sf2->id,
]);

echo "Tournament bracket seeded successfully with live, completed, and scheduled matches!\n";
