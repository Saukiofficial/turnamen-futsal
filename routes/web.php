<?php

use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\AssessmentController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\CheckinController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\MatchManagementController;
use App\Http\Controllers\Admin\ParticipantCardController;
use App\Http\Controllers\Admin\RegistrantController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TeamRegistrantController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicPortalController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\TeamRegistrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Portal Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicPortalController::class, 'index'])->name('home');

// Pendaftaran Pemain Futsal (Individu)
Route::get('/daftar/{slug?}', [RegistrationController::class, 'create'])->name('registration.create');
Route::post('/daftar/{slug?}', [RegistrationController::class, 'store'])->name('registration.store');
Route::get('/sukses/{registrationNumber}', [RegistrationController::class, 'success'])->name('registration.success');

// Pendaftaran Tim Futsal
Route::get('/daftar-tim', [TeamRegistrationController::class, 'create'])->name('team.create');
Route::post('/daftar-tim', [TeamRegistrationController::class, 'store'])->name('team.store');
Route::post('/api/teams/check-player-nisn', [TeamRegistrationController::class, 'checkPlayerNisn'])->name('team.check-player-nisn');
Route::get('/sukses-tim/{registrationNumber}', [TeamRegistrationController::class, 'success'])->name('team.success');
Route::get('/tim/{registrationNumber}/cetak-kartu', [TeamRegistrationController::class, 'printCard'])->name('team.print-card');

// Cek Status & Perbaikan Berkas (Mendukung No Reg Pemain FTS- & Tim TIM-)
Route::get('/cek-status', [RegistrationController::class, 'checkStatus'])->name('registration.check-status');
Route::post('/cek-status', [RegistrationController::class, 'checkStatus'])->name('registration.check-status.submit');
Route::post('/revisi/{registrationNumber}', [RegistrationController::class, 'submitRevision'])->name('registration.revision');
Route::get('/cetak-kartu/{registrationNumber}', [RegistrationController::class, 'printCard'])->name('registration.print-card');

// Hasil Pertandingan & Bagan Turnamen (Live Bracket)
Route::get('/hasil-pertandingan', [MatchController::class, 'index'])->name('matches.index');

// Pengumuman Publik (Arsip / Berita)
Route::get('/pengumuman', [PublicPortalController::class, 'announcements'])->name('announcements.index');
Route::get('/pengumuman/{slug}', [PublicPortalController::class, 'announcementDetail'])->name('announcements.show');

/*
|--------------------------------------------------------------------------
| Admin Panel Routes (Protected by Auth)
|--------------------------------------------------------------------------
*/
Route::redirect('/dashboard', '/admin/dashboard')->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // 1. Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('root');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 2. Pendaftaran/Event
    Route::resource('events', EventController::class)->except(['show']);
    Route::post('/events/{id}/toggle-status', [EventController::class, 'toggleStatus'])->name('events.toggle-status');

    // 3. Data Pendaftar
    Route::get('/registrants', [RegistrantController::class, 'index'])->name('registrants.index');
    Route::get('/registrants/{id}', [RegistrantController::class, 'show'])->name('registrants.show');
    Route::delete('/registrants/{registration}', [RegistrantController::class, 'destroy'])->name('registrants.destroy');
    Route::post('/registrants/{id}/status', [RegistrantController::class, 'updateStatus'])->name('registrants.update-status');
    Route::get('/registrants-export/csv', [RegistrantController::class, 'export'])->name('registrants.export');

    // 4. Verifikasi Berkas
    Route::get('/verification', [VerificationController::class, 'index'])->name('verification.index');
    Route::post('/verification/{id}/process', [VerificationController::class, 'process'])->name('verification.process');

    // 5. Kartu Peserta
    Route::get('/cards', [ParticipantCardController::class, 'index'])->name('cards.index');
    Route::post('/cards/bulk-print', [ParticipantCardController::class, 'bulkPrint'])->name('cards.bulk-print');

    // 6. Check-in Turnamen
    Route::get('/checkin', [CheckinController::class, 'index'])->name('checkin.index');
    Route::post('/checkin/lookup', [CheckinController::class, 'lookup'])->name('checkin.lookup');
    Route::post('/checkin/confirm', [CheckinController::class, 'confirm'])->name('checkin.confirm');

    // 7. Penilaian
    Route::get('/assessment', [AssessmentController::class, 'index'])->name('assessment.index');
    Route::post('/assessment/grades', [AssessmentController::class, 'storeGrades'])->name('assessment.grades');
    Route::post('/assessment/status', [AssessmentController::class, 'setSelectionStatus'])->name('assessment.status');

    // 8. Bagan & Hasil Pertandingan Turnamen (Live Bracket)
    Route::get('/matches', [MatchManagementController::class, 'index'])->name('matches.index');
    Route::post('/matches/setup-bracket', [MatchManagementController::class, 'setupBracket'])->name('matches.setup-bracket');
    Route::put('/matches/{id}', [MatchManagementController::class, 'update'])->name('matches.update');

    // 8b. Pendaftar Tim Turnamen
    Route::get('/teams', [TeamRegistrantController::class, 'index'])->name('teams.index');
    Route::get('/teams-alias', [TeamRegistrantController::class, 'index'])->name('team-registrants.index');
    Route::get('/teams/{id}', [TeamRegistrantController::class, 'show'])->name('teams.show');
    Route::get('/teams-alias/{id}', [TeamRegistrantController::class, 'show'])->name('team-registrants.show');
    Route::post('/teams/{id}/verify', [TeamRegistrantController::class, 'verify'])->name('teams.verify');

    // 8c. Arsip Pengumuman (Opsional)
    Route::get('/announcements', [AdminAnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/announcements', [AdminAnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{id}', [AdminAnnouncementController::class, 'destroy'])->name('announcements.destroy');

    // 9. Laporan
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // 10. Pengguna Admin
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');

    // 11. Audit Log
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

    // 12. Pengaturan
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
