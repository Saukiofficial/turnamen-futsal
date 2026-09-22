import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import { ArrowLeft, Save } from 'lucide-react';

interface EventFormProps {
    event: {
        id?: number;
        name: string;
        code: string;
        organizer: string;
        description: string;
        location: string;
        registration_start_at: string;
        registration_end_at: string;
        selection_start_at?: string;
        selection_end_at?: string;
        total_quota: number;
        status: string;
        close_when_full: boolean;
        positions?: { position_name: string; quota: number }[];
    } | null;
}

export default function EventForm({ event }: EventFormProps) {
    const isEdit = !!event?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        name: event?.name || '',
        code: event?.code || '',
        organizer: event?.organizer || 'Asosiasi Futsal Kabupaten',
        description: event?.description || '',
        location: event?.location || 'GOR Futsal Arena Center',
        registration_start_at: event?.registration_start_at ? event.registration_start_at.substring(0, 16) : new Date().toISOString().substring(0, 16),
        registration_end_at: event?.registration_end_at ? event.registration_end_at.substring(0, 16) : new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 16),
        selection_start_at: event?.selection_start_at ? event.selection_start_at.substring(0, 16) : '',
        selection_end_at: event?.selection_end_at ? event.selection_end_at.substring(0, 16) : '',
        total_quota: event?.total_quota || 200,
        status: event?.status || 'open',
        close_when_full: event?.close_when_full ?? true,
        positions: event?.positions?.map(p => ({ name: p.position_name, quota: p.quota })) || [
            { name: 'Goalkeeper', quota: 20 },
            { name: 'Anchor', quota: 50 },
            { name: 'Flank', quota: 80 },
            { name: 'Pivot', quota: 50 },
        ],
    });

    const handlePositionQuotaChange = (index: number, val: number) => {
        const updated = [...data.positions];
        updated[index].quota = val;
        setData('positions', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.events.update', event!.id!));
        } else {
            post(route('admin.events.store'));
        }
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Pendaftaran / Event', href: route('admin.events.index') }, { label: isEdit ? 'Ubah Event' : 'Buat Event Baru' }]}>
            <Head title={isEdit ? 'Ubah Event Pendaftaran' : 'Buat Event Pendaftaran Baru'} />

            <div className="mb-4">
                <Link
                    href={route('admin.events.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Event</span>
                </Link>
            </div>

            <PageHeader
                title={isEdit ? `Ubah Event: ${event?.name}` : 'Buat Pendaftaran / Event Baru'}
                description="Tentukan nama event, periode pendaftaran, jadwal seleksi lapangan, dan batas kuota per posisi."
            />

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 max-w-4xl">
                {/* Informasi Dasar */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                        1. Informasi Dasar Event
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Nama Event Seleksi <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Seleksi Tim Futsal 2026"
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            />
                            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Kode Event <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="Contoh: FTS2026"
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase text-slate-800"
                            />
                            {errors.code && <p className="text-xs text-rose-600 mt-1">{errors.code}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Penyelenggara</label>
                            <input
                                type="text"
                                required
                                value={data.organizer}
                                onChange={(e) => setData('organizer', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Seleksi</label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                        />
                    </div>
                </div>

                {/* Jadwal & Kuota */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                        2. Periode & Kuota
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Mulai Pendaftaran</label>
                            <input
                                type="datetime-local"
                                required
                                value={data.registration_start_at}
                                onChange={(e) => setData('registration_start_at', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Selesai Pendaftaran</label>
                            <input
                                type="datetime-local"
                                required
                                value={data.registration_end_at}
                                onChange={(e) => setData('registration_end_at', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Kuota Peserta</label>
                            <input
                                type="number"
                                required
                                min={1}
                                value={data.total_quota}
                                onChange={(e) => setData('total_quota', parseInt(e.target.value) || 0)}
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Status Event</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                            >
                                <option value="draft">Draft</option>
                                <option value="scheduled">Terjadwal</option>
                                <option value="open">Dibuka</option>
                                <option value="paused">Dijeda</option>
                                <option value="closed">Ditutup</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kuota Posisi */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                        3. Alokasi Kuota per Posisi Futsal
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {data.positions.map((pos, idx) => (
                            <div key={pos.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="font-bold text-xs text-slate-800 block mb-1">{pos.name}</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={pos.quota}
                                    onChange={(e) => handlePositionQuotaChange(idx, parseInt(e.target.value) || 0)}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <Link
                        href={route('admin.events.index')}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Menyimpan...' : 'Simpan Event'}</span>
                    </button>
                </div>
            </form>
        </AdminShell>
    );
}
