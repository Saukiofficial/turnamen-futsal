import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import { PlusCircle, Calendar, Users, Edit2, Power, Trash2 } from 'lucide-react';

interface EventsProps {
    events: {
        data: {
            id: number;
            name: string;
            code: string;
            slug: string;
            organizer: string;
            location: string;
            registration_start_at: string;
            registration_end_at: string;
            total_quota: number;
            registrations_count: number;
            status: string;
            positions: { position_name: string; quota: number }[];
        }[];
        links: any[];
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function EventsIndex({ events, filters }: EventsProps) {
    const handleToggleStatus = (id: number, currentStatus: string) => {
        const nextStatus = currentStatus === 'open' ? 'paused' : 'open';
        if (confirm(`Ubah status event ini menjadi ${nextStatus}?`)) {
            router.post(route('admin.events.toggle-status', id), { status: nextStatus });
        }
    };

    const handleDelete = (id: number, name: string, registrationsCount: number) => {
        const hasData = registrationsCount > 0;
        const msg = hasData
            ? `Event "${name}" sudah memiliki ${registrationsCount} pendaftar.\n\nEvent akan diarsipkan (tidak dihapus permanen) untuk menjaga integritas data.\n\nLanjutkan?`
            : `Event "${name}" belum memiliki pendaftar.\n\nEvent akan DIHAPUS PERMANEN beserta semua posisinya.\n\nApakah kamu yakin?`;

        if (confirm(msg)) {
            router.delete(route('admin.events.destroy', id));
        }
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Pendaftaran / Event' }]}>
            <Head title="Manajemen Event Pendaftaran" />

            <PageHeader
                title="Pendaftaran & Event Seleksi"
                description="Kelola multi-periode pendaftaran pemain futsal, kuota per posisi, dan status aktif pendaftaran."
                action={
                    <Link
                        href={route('admin.events.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Buat Event Baru</span>
                    </Link>
                }
            />

            {/* Event Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <th className="py-3.5 px-4">Nama Event & Kode</th>
                                <th className="py-3.5 px-4">Jadwal Pendaftaran</th>
                                <th className="py-3.5 px-4">Kuota & Pendaftar</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {events.data.map((evt) => (
                                <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="space-y-0.5">
                                            <span className="font-bold text-navy-950 text-sm block">{evt.name}</span>
                                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                                                    {evt.code}
                                                </span>
                                                <span>•</span>
                                                <span>{evt.organizer}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            <span>
                                                {new Date(evt.registration_start_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – {new Date(evt.registration_end_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 font-semibold text-slate-800">
                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{evt.registrations_count} / {evt.total_quota} peserta</span>
                                            </div>
                                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-brand-600 h-full rounded-full" 
                                                    style={{ width: `${Math.min(100, Math.round((evt.registrations_count / evt.total_quota) * 100))}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <StatusBadge status={evt.status} size="sm" />
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(evt.id, evt.status)}
                                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                                                title="Buka / Jeda Pendaftaran"
                                            >
                                                <Power className="w-3.5 h-3.5" />
                                            </button>
                                            <Link
                                                href={route('admin.events.edit', evt.id)}
                                                className="p-1.5 rounded-lg border border-slate-200 text-brand-600 hover:bg-brand-50"
                                                title="Ubah Event"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(evt.id, evt.name, evt.registrations_count)}
                                                className={`p-1.5 rounded-lg border transition-colors ${
                                                    evt.registrations_count > 0
                                                        ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                                        : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                                }`}
                                                title={evt.registrations_count > 0 ? 'Arsipkan Event (ada data pendaftar)' : 'Hapus Permanen Event'}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {events.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        Belum ada event pendaftaran.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
