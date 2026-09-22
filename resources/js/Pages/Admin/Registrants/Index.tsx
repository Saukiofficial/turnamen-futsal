import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Search, 
    Download, 
    Eye, 
    Filter, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    XCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface RegistrantsIndexProps {
    events: { id: number; name: string; code: string }[];
    selectedEventId: number;
    registrations: {
        data: {
            id: number;
            registration_number: string;
            full_name: string;
            nisn?: string;
            masked_nik?: string;
            school_name: string;
            primary_position: string;
            submitted_at: string;
            verification_status: string;
            selection_status: string;
            photo_url: string | null;
        }[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        position?: string;
        status?: string;
        selection_status?: string;
    };
    summary: {
        total: number;
        waiting: number;
        approved: number;
        revision: number;
        rejected: number;
    };
}

export default function RegistrantsIndex({
    events,
    selectedEventId,
    registrations,
    filters,
    summary,
}: RegistrantsIndexProps) {
    const handleFilterChange = (key: string, value: string) => {
        router.get(route('admin.registrants.index'), {
            ...filters,
            event_id: selectedEventId,
            [key]: value || undefined,
        }, { preserveState: true, replace: true });
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Data Pendaftar' }]}>
            <Head title="Data Pendaftar Pemain Futsal" />

            <PageHeader
                title="Data Pendaftar Seleksi"
                description="Kelola seluruh calon pemain futsal, pantau kelengkapan berkas, dan ekspor data peserta resmi."
                action={
                    <div className="flex items-center gap-2.5">
                        <a
                            href={route('admin.registrants.export', { event_id: selectedEventId })}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-all"
                        >
                            <Download className="w-4 h-4 text-slate-500" />
                            <span>Ekspor CSV</span>
                        </a>
                    </div>
                }
            />

            {/* Summary mini cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-500 text-[11px] font-semibold block">Total Pendaftar</span>
                    <span className="text-xl font-extrabold text-navy-950 font-mono">{summary.total}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-amber-600 text-[11px] font-semibold block">Menunggu Verifikasi</span>
                    <span className="text-xl font-extrabold text-amber-600 font-mono">{summary.waiting}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-emerald-600 text-[11px] font-semibold block">Lolos Administrasi</span>
                    <span className="text-xl font-extrabold text-emerald-600 font-mono">{summary.approved}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-rose-600 text-[11px] font-semibold block">Perlu Perbaikan</span>
                    <span className="text-xl font-extrabold text-rose-600 font-mono">{summary.revision}</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Event Switcher */}
                    <div className="sm:col-span-3">
                        <select
                            value={selectedEventId}
                            onChange={(e) => handleFilterChange('event_id', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                            {events.map((evt) => (
                                <option key={evt.id} value={evt.id}>
                                    {evt.name} ({evt.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Field */}
                    <div className="sm:col-span-4 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama, nomor, atau sekolah..."
                            defaultValue={filters.search || ''}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFilterChange('search', (e.target as HTMLInputElement).value);
                                }
                            }}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400"
                        />
                    </div>

                    {/* Position Filter */}
                    <div className="sm:col-span-2">
                        <select
                            value={filters.position || ''}
                            onChange={(e) => handleFilterChange('position', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                        >
                            <option value="">Semua Posisi</option>
                            <option value="Goalkeeper">Goalkeeper</option>
                            <option value="Anchor">Anchor</option>
                            <option value="Flank">Flank</option>
                            <option value="Pivot">Pivot</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="sm:col-span-3">
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                        >
                            <option value="">Semua Status Administrasi</option>
                            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                            <option value="dikirim_ulang">Dikirim Ulang</option>
                            <option value="lolos_administrasi">Lolos Administrasi</option>
                            <option value="perlu_perbaikan">Perlu Perbaikan</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Registrant Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <th className="py-3 px-4">Calon Pemain</th>
                                <th className="py-3 px-4">No. Pendaftaran</th>
                                <th className="py-3 px-4">NISN</th>
                                <th className="py-3 px-4">Posisi</th>
                                <th className="py-3 px-4">Tanggal Daftar</th>
                                <th className="py-3 px-4">Status Administrasi</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {registrations.data.map((reg) => (
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
                                                <Link 
                                                    href={route('admin.registrants.show', reg.id)}
                                                    className="font-bold text-navy-950 hover:text-brand-600 block truncate"
                                                >
                                                    {reg.full_name}
                                                </Link>
                                                <span className="text-[11px] text-slate-400 block truncate">{reg.school_name}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                        {reg.registration_number}
                                    </td>

                                    <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                                        {reg.nisn || reg.masked_nik || '-'}
                                    </td>

                                    <td className="py-3 px-4">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                                            {reg.primary_position}
                                        </span>
                                    </td>

                                    <td className="py-3 px-4 text-slate-500">
                                        {reg.submitted_at}
                                    </td>

                                    <td className="py-3 px-4">
                                        <StatusBadge status={reg.verification_status} size="sm" />
                                    </td>

                                    <td className="py-3 px-4 text-right">
                                        <Link
                                            href={route('admin.registrants.show', reg.id)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Lihat</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {registrations.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        Tidak ada data pendaftar yang cocok dengan filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {registrations.last_page > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Halaman {registrations.current_page} dari {registrations.last_page}</span>
                        <div className="flex items-center gap-1">
                            {registrations.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg border text-xs ${
                                        link.active 
                                            ? 'bg-brand-600 text-white border-brand-600 font-bold' 
                                            : link.url 
                                            ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                                            : 'border-transparent text-slate-300 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminShell>
    );
}
