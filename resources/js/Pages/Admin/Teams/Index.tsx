import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Users, 
    Search, 
    Filter, 
    School, 
    Phone, 
    FileCheck2, 
    Eye, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Download
} from 'lucide-react';

interface TeamItem {
    id: number;
    registration_number: string;
    team_name: string;
    school_name: string;
    head_coach: string;
    manager_name: string;
    manager_phone: string;
    verification_status: string;
    submitted_at: string;
    logo_url: string | null;
    has_document: boolean;
}

interface AdminTeamsProps {
    teams: {
        data: TeamItem[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status: string;
        search: string;
    };
    counts: {
        all: number;
        menunggu_verifikasi: number;
        lolos_administrasi: number;
        perlu_perbaikan: number;
        ditolak: number;
    };
}

export default function AdminTeamsIndex({ teams, filters, counts }: AdminTeamsProps) {
    const searchForm = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchForm.get(route('admin.teams.index'));
    };

    const handleStatusFilter = (status: string) => {
        searchForm.setData('status', status);
        searchForm.get(route('admin.teams.index', { status, search: searchForm.data.search }));
    };

    return (
        <AdminShell
            title="Pendaftar Tim"
            breadcrumbs={[
                { label: 'Admin', href: route('admin.dashboard') },
                { label: 'Pendaftar Tim' },
            ]}
        >
            <Head title="Data Pendaftar Tim - Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-navy-950 flex items-center gap-2.5">
                            <Users className="w-5 h-5 text-amber-500" />
                            <span>Data Pendaftar Tim Futsal Sekolah</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Validasi berkas gabungan Surat Rekomendasi Sekolah & NISN peserta untuk akreditasi tim turnamen.
                        </p>
                    </div>

                    <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl">
                        Total {teams.total} Tim Terdaftar
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                    {[
                        { key: 'all', label: 'Semua Tim', count: counts.all },
                        { key: 'menunggu_verifikasi', label: 'Menunggu Verifikasi', count: counts.menunggu_verifikasi },
                        { key: 'lolos_administrasi', label: 'Lolos Administrasi', count: counts.lolos_administrasi },
                        { key: 'perlu_perbaikan', label: 'Perlu Perbaikan', count: counts.perlu_perbaikan },
                        { key: 'ditolak', label: 'Ditolak', count: counts.ditolak },
                    ].map((tab) => {
                        const active = filters.status === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleStatusFilter(tab.key)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    active 
                                        ? 'bg-navy-950 text-white shadow-xs' 
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search input */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Cari nama tim, sekolah, pelatih, atau no. pendaftaran..."
                                value={searchForm.data.search}
                                onChange={(e) => searchForm.setData('search', e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-navy-950 text-white text-xs font-bold hover:bg-navy-900 transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Teams Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Tim & Sekolah</th>
                                    <th className="px-5 py-3.5">No. Pendaftaran</th>
                                    <th className="px-5 py-3.5">Pelatih & Manager</th>
                                    <th className="px-5 py-3.5">WhatsApp</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {teams.data.length > 0 ? (
                                    teams.data.map((team) => (
                                        <tr key={team.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {team.logo_url ? (
                                                            <img src={team.logo_url} alt={team.team_name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Users className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 text-sm block">
                                                            {team.team_name}
                                                        </span>
                                                        <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                                                            <School className="w-3 h-3 text-slate-400" />
                                                            <span>{team.school_name}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                    {team.registration_number}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block mt-1">
                                                    {team.submitted_at}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 space-y-0.5">
                                                <div className="text-slate-800 font-semibold">
                                                    Coach: {team.head_coach}
                                                </div>
                                                <div className="text-slate-500 text-[11px]">
                                                    Mgr: {team.manager_name}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <a 
                                                    href={`https://wa.me/${team.manager_phone.replace(/\D/g, '')}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="font-mono text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    <span>{team.manager_phone}</span>
                                                </a>
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={team.verification_status} size="sm" />
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={route('admin.teams.show', team.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-bold text-xs transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Verifikasi</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                            Tidak ada data tim yang sesuai filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
