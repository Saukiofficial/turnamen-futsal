import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import StatCard from '@/Components/Admin/StatCard';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Users, 
    Clock, 
    CheckCircle2, 
    AlertTriangle, 
    Calendar, 
    TrendingUp, 
    ArrowRight, 
    PlusCircle,
    UserCheck,
    ListFilter,
    Shield,
    Activity,
    UsersRound,
    ChartNoAxesCombined,
    Trophy,
    ShieldCheck
} from 'lucide-react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid 
} from 'recharts';

interface DashboardProps {
    event: {
        id: number;
        name: string;
        code: string;
        status: string;
        is_open: boolean;
        total_quota: number;
        registered_count: number;
        days_remaining: number;
        registration_start_at: string;
        registration_end_at: string;
    } | null;
    kpis: {
        total_registrants: { value: number; meta: string };
        waiting_verification: { value: number; meta: string };
        approved_admin: { value: number; meta: string };
        need_revision: { value: number; meta: string };
    } | null;
    teamKpis?: {
        total_teams: number;
        approved_teams: number;
        waiting_teams: number;
        revision_teams: number;
    };
    tournamentKpis?: {
        total_matches: number;
        completed_matches: number;
        upcoming_matches: number;
    };
    trendData: { date: string; label: string; total: number }[];
    positionQuotas: { name: string; quota: number; filled: number; percentage: number }[];
    recentRegistrations: {
        id: number;
        registration_number: string;
        full_name: string;
        school_name: string;
        primary_position: string;
        submitted_at: string;
        verification_status: string;
        photo_url: string | null;
    }[];
    recentTeams?: {
        id: number;
        registration_number: string;
        team_name: string;
        school_name: string;
        head_coach: string;
        manager_name: string;
        players_count: number;
        verification_status: string;
        submitted_at: string;
        logo_url: string | null;
    }[];
    recentActivities: {
        id: number;
        action: string;
        user_name: string;
        created_at: string;
        description: string;
    }[];
}

export default function Dashboard({
    event,
    kpis,
    teamKpis,
    tournamentKpis,
    trendData,
    positionQuotas,
    recentRegistrations,
    recentTeams = [],
    recentActivities,
}: DashboardProps) {
    const quotaPercentage = event && event.total_quota > 0 
        ? Math.min(100, Math.round((event.registered_count / event.total_quota) * 100)) 
        : 0;

    return (
        <AdminShell breadcrumbs={[{ label: 'Dashboard' }]}>
            <Head title="Dashboard Pengelola Futsal" />

            {/* Page Header */}
            <PageHeader
                title="Dashboard Pendaftaran"
                description="Pantau perkembangan pendaftar, antrean verifikasi berkas, dan kuota seleksi pemain futsal."
                action={
                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('admin.events.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Buat Event Baru</span>
                        </Link>
                    </div>
                }
            />

            {/* 1. Event Status Strip */}
            {event && (
                <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-navy-950">{event.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {event.code}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500">Status: Pendaftaran Dibuka</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{event.registration_start_at} – {event.registration_end_at}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                                    <span>Kuota: {event.registered_count} / {event.total_quota}</span>
                                    <span className="text-brand-600 ml-2">{quotaPercentage}%</span>
                                </div>
                                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                                    <div 
                                        className="bg-brand-600 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${quotaPercentage}%` }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{event.days_remaining} hari tersisa</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Four KPI Cards */}
            {kpis && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Pendaftar"
                        value={kpis.total_registrants.value}
                        meta={kpis.total_registrants.meta}
                        icon={Users}
                        variant="blue"
                    />
                    <StatCard
                        title="Menunggu Verifikasi"
                        value={kpis.waiting_verification.value}
                        meta={kpis.waiting_verification.meta}
                        icon={Clock}
                        variant="amber"
                    />
                    <StatCard
                        title="Lolos Administrasi"
                        value={kpis.approved_admin.value}
                        meta={kpis.approved_admin.meta}
                        icon={CheckCircle2}
                        variant="emerald"
                    />
                    <StatCard
                        title="Perlu Perbaikan"
                        value={kpis.need_revision.value}
                        meta={kpis.need_revision.meta}
                        icon={AlertTriangle}
                        variant="rose"
                    />
                </div>
            )}

            {/* 2b. Team & Tournament Overview Cards */}
            {teamKpis && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-slate-500 block">Tim Sekolah Terdaftar</span>
                            <span className="text-2xl font-black text-navy-950 font-mono mt-0.5 block">{teamKpis.total_teams}</span>
                            <Link href={route('admin.teams.index')} className="text-[11px] text-brand-600 hover:underline font-medium">
                                Kelola Tim Sekolah &rarr;
                            </Link>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <UsersRound className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-slate-500 block">Tim Lolos Verifikasi</span>
                            <span className="text-2xl font-black text-emerald-600 font-mono mt-0.5 block">{teamKpis.approved_teams}</span>
                            <span className="text-[11px] text-emerald-600 font-medium">Siap masuk braket knockout</span>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-slate-500 block">Tim Antre Verifikasi</span>
                            <span className="text-2xl font-black text-amber-600 font-mono mt-0.5 block">{teamKpis.waiting_teams}</span>
                            <Link href={route('admin.teams.index')} className="text-[11px] text-amber-600 hover:underline font-medium">
                                Review berkas tim &rarr;
                            </Link>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-medium text-slate-500 block">Pertandingan Braket</span>
                            <span className="text-2xl font-black text-brand-600 font-mono mt-0.5 block">
                                {tournamentKpis?.total_matches || 0}
                            </span>
                            <Link href={route('admin.matches.index')} className="text-[11px] text-brand-600 hover:underline font-medium">
                                {tournamentKpis?.completed_matches || 0} selesai &bull; Kelola skor &rarr;
                            </Link>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Recharts Trend & Kuota Posisi Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                {/* Tren Pendaftaran Chart (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                                <ChartNoAxesCombined className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-navy-950">Tren Pendaftaran Harian</h3>
                                <p className="text-xs text-slate-500">Aktivitas pendaftaran dalam 14 hari terakhir</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                            14 Hari Terakhir
                        </span>
                    </div>

                    <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0F172A',
                                        borderRadius: '10px',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontSize: '12px',
                                        padding: '8px 12px',
                                    }}
                                    formatter={(value: any) => [`${value} Pendaftar`, 'Jumlah']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563EB"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Kuota Posisi (4 Cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                                <UsersRound className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-navy-950">Kuota Posisi Pemain</h3>
                        </div>
                        <Link href={route('admin.registrants.index')} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
                            Kelola
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {positionQuotas.map((pos) => (
                            <div key={pos.name} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-800">{pos.name}</span>
                                    <div className="flex items-center gap-1.5 font-mono">
                                        <span className="text-slate-900 font-bold">{pos.filled}</span>
                                        <span className="text-slate-400">/ {pos.quota}</span>
                                        <span className={`font-bold ml-1 ${pos.percentage >= 90 ? 'text-rose-600' : 'text-slate-500'}`}>
                                            ({pos.percentage}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            pos.percentage >= 90 ? 'bg-amber-500' : 'bg-brand-600'
                                        }`}
                                        style={{ width: `${pos.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-center">
                        <span className="text-[11px] text-slate-400">
                            Kuota otomatis diperbarui secara real-time saat pendaftaran baru masuk.
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. Recent Registrations & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Pendaftar Terbaru (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-brand-600" />
                            <h3 className="text-sm font-bold text-navy-950">Pendaftar Terbaru</h3>
                        </div>
                        <Link 
                            href={route('admin.registrants.index')} 
                            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                        >
                            <span>Lihat Semua</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <th className="py-3 px-4">Peserta</th>
                                    <th className="py-3 px-4">No. Pendaftaran</th>
                                    <th className="py-3 px-4">Posisi</th>
                                    <th className="py-3 px-4">Status Verifikasi</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-500">
                                                    {reg.photo_url ? (
                                                        <img src={reg.photo_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        reg.full_name.charAt(0)
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-navy-950 block truncate">{reg.full_name}</span>
                                                    <span className="text-[11px] text-slate-400 block truncate">{reg.school_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                            {reg.registration_number}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                                                {reg.primary_position}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={reg.verification_status} size="sm" />
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={route('admin.registrants.show', reg.id)}
                                                className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                                            >
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {recentRegistrations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            Belum ada data pendaftar pada event ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Aktivitas Terbaru (4 Cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-600" />
                                <h3 className="text-sm font-bold text-navy-950">Aktivitas Sistem</h3>
                            </div>
                            <Link href={route('admin.audit-logs.index')} className="text-xs font-semibold text-brand-600 hover:text-brand-800">
                                Log
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((act) => (
                                <div key={act.id} className="flex items-start gap-3 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 leading-snug truncate">
                                            {act.description}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>{act.user_name}</span>
                                            <span>{act.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {recentActivities.length === 0 && (
                                <p className="text-center py-6 text-slate-400 text-xs">Belum ada aktivitas.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-center">
                        <Link 
                            href={route('admin.audit-logs.index')}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                            Lihat Semua Audit Log
                        </Link>
                    </div>
                </div>
            </div>

            {/* 5. Tim Sekolah Terdaftar Terbaru */}
            {recentTeams && recentTeams.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mt-6">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <UsersRound className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-sm font-bold text-navy-950">Tim Sekolah Terbaru</h3>
                        </div>
                        <Link 
                            href={route('admin.teams.index')} 
                            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                        >
                            <span>Kelola Semua Tim</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                    <th className="py-3 px-4">Nama Tim & Sekolah</th>
                                    <th className="py-3 px-4">No. Pendaftaran</th>
                                    <th className="py-3 px-4">Pelatih / Manajer</th>
                                    <th className="py-3 px-4">Jumlah Pemain</th>
                                    <th className="py-3 px-4">Status Verifikasi</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentTeams.map((team) => (
                                    <tr key={team.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 overflow-hidden shrink-0 flex items-center justify-center font-bold text-indigo-600">
                                                    {team.logo_url ? (
                                                        <img src={team.logo_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        team.team_name.charAt(0)
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-navy-950 block truncate">{team.team_name}</span>
                                                    <span className="text-[11px] text-slate-400 block truncate">{team.school_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                            {team.registration_number}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">
                                            <span className="font-medium block">{team.head_coach || '-'}</span>
                                            <span className="text-[11px] text-slate-400 block">Mgr: {team.manager_name}</span>
                                        </td>
                                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                                                {team.players_count} Pemain
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={team.verification_status} size="sm" />
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link
                                                href={route('admin.teams.show', team.id)}
                                                className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                                            >
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
