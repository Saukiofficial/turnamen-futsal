import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import { FileBarChart, Download, Users, CheckCircle2, Trophy, Clock, UsersRound, Calendar, ShieldCheck } from 'lucide-react';

interface ReportsProps {
    events: { id: number; name: string }[];
    selectedEventId: number;
    stats: {
        total_registrants: number;
        by_status: Record<string, number>;
        by_position: Record<string, number>;
        by_selection: Record<string, number>;
        attendance: {
            total_eligible: number;
            present: number;
            absent: number;
        };
        teams?: {
            total_teams: number;
            lolos_administrasi: number;
            menunggu_verifikasi: number;
            perlu_perbaikan: number;
            ditolak: number;
            total_players: number;
        };
        tournament?: {
            total_matches: number;
            completed: number;
            scheduled: number;
            in_progress: number;
        };
    };
}

export default function ReportsIndex({ events, selectedEventId, stats }: ReportsProps) {
    return (
        <AdminShell breadcrumbs={[{ label: 'Laporan' }]}>
            <Head title="Laporan & Rekapitulasi Turnamen" />

            <PageHeader
                title="Laporan & Rekapitulasi Turnamen"
                description="Rekapitulasi statistik pendaftaran pemain individu, verifikasi tim sekolah, dan progres pertandingan turnamen."
                action={
                    <select
                        value={selectedEventId}
                        onChange={(e) => router.get(route('admin.reports.index'), { event_id: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                    >
                        {events.map((evt) => (
                            <option key={evt.id} value={evt.id}>{evt.name}</option>
                        ))}
                    </select>
                }
            />

            {/* Section 1: Tim Sekolah & Turnamen */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
                            <UsersRound className="w-4 h-4 text-indigo-600" />
                            Turnamen & Tim Sekolah
                        </h2>
                        <p className="text-xs text-slate-500">Rekapitulasi tim sekolah dan jalannya kompetisi bracket knockout.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Rekapitulasi Tim Sekolah */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950">Tim Sekolah</h3>
                            </div>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                                {stats.teams?.total_teams || 0} Tim
                            </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Lolos Administrasi (Siap Tanding)</span>
                                <span className="font-bold text-emerald-600 font-mono">{stats.teams?.lolos_administrasi || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Menunggu Verifikasi</span>
                                <span className="font-bold text-amber-600 font-mono">{stats.teams?.menunggu_verifikasi || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Perlu Perbaikan</span>
                                <span className="font-bold text-rose-600 font-mono">{stats.teams?.perlu_perbaikan || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Ditolak</span>
                                <span className="font-bold text-slate-400 font-mono">{stats.teams?.ditolak || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-t border-slate-100 pt-2">
                                <span className="text-slate-700 font-semibold">Total Skuad Pemain Masuk Tim</span>
                                <span className="font-bold text-indigo-600 font-mono">{stats.teams?.total_players || 0} pemain</span>
                            </div>
                        </div>
                    </div>

                    {/* Progres Pertandingan Braket */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950">Pertandingan Braket</h3>
                            </div>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                {stats.tournament?.total_matches || 0} Match
                            </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Pertandingan Selesai</span>
                                <span className="font-bold text-emerald-600 font-mono">{stats.tournament?.completed || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Sedang Berlangsung</span>
                                <span className="font-bold text-amber-600 font-mono">{stats.tournament?.in_progress || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Terjadwal / Menunggu</span>
                                <span className="font-bold text-blue-600 font-mono">{stats.tournament?.scheduled || 0}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <Link
                                    href={route('admin.matches.index')}
                                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center justify-between"
                                >
                                    <span>Buka Manajemen Jadwal & Skor</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Pendaftar Individu & Administrasi */}
            <div>
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-600" />
                        Pemain Individu & Seleksi
                    </h2>
                    <p className="text-xs text-slate-500">Statistik pemain yang mendaftar tahap 1 dengan NISN terdaftar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Rekapitulasi Administrasi */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950">Status Administrasi</h3>
                            </div>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {stats.total_registrants} Pemain
                            </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Lolos Administrasi</span>
                                <span className="font-bold text-emerald-600 font-mono">{stats.by_status.lolos_administrasi || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Menunggu Verifikasi</span>
                                <span className="font-bold text-amber-600 font-mono">{stats.by_status.menunggu_verifikasi || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Dikirim Ulang (Revisi)</span>
                                <span className="font-bold text-blue-600 font-mono">{stats.by_status.dikirim_ulang || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Perlu Perbaikan</span>
                                <span className="font-bold text-rose-600 font-mono">{stats.by_status.perlu_perbaikan || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Ditolak</span>
                                <span className="font-bold text-red-600 font-mono">{stats.by_status.ditolak || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Distribusi Posisi Pemain */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Users className="w-4 h-4 text-brand-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950">Distribusi Posisi</h3>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            {['Goalkeeper', 'Anchor', 'Flank', 'Pivot'].map((pos) => (
                                <div key={pos} className="flex justify-between items-center py-1">
                                    <span className="text-slate-600">{pos}</span>
                                    <span className="font-bold text-navy-950 font-mono">{stats.by_position[pos] || 0} pemain</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Kehadiran Seleksi */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Clock className="w-4 h-4 text-brand-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950">Kehadiran Seleksi</h3>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Total Berhak Hadir</span>
                                <span className="font-bold text-slate-800 font-mono">{stats.attendance?.total_eligible || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Hadir di Lokasi</span>
                                <span className="font-bold text-emerald-600 font-mono">{stats.attendance?.present || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-600">Belum Hadir</span>
                                <span className="font-bold text-rose-600 font-mono">{stats.attendance?.absent || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
