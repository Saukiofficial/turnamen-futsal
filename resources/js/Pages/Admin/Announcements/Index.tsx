import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import { Megaphone, PlusCircle, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

interface AnnouncementsIndexProps {
    announcements: {
        data: {
            id: number;
            title: string;
            slug: string;
            content: string;
            audience_type: string;
            publish_at: string;
            status: string;
            created_by?: { name: string };
            event?: { name: string };
        }[];
        links: any[];
    };
    events: { id: number; name: string }[];
}

export default function AnnouncementsIndex({ announcements, events }: AnnouncementsIndexProps) {
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const form = useForm({
        event_id: '' as string | number,
        title: '',
        content: '',
        audience_type: 'publik',
        status: 'published',
        publish_at: new Date().toISOString().substring(0, 16),
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.announcements.store'), {
            onSuccess: () => {
                form.reset();
                setCreateModalOpen(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus pengumuman ini?')) {
            router.delete(route('admin.announcements.destroy', id));
        }
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Pengumuman' }]}>
            <Head title="Manajemen Pengumuman Seleksi" />

            <PageHeader
                title="Pengumuman Panitia"
                description="Publikasikan informasi resmi, jadwal seleksi, dan pengumuman hasil seleksi kepada peserta dan masyarakat."
                action={
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Buat Pengumuman</span>
                    </button>
                }
            />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <th className="py-3.5 px-4">Judul & Isi Singkat</th>
                                <th className="py-3.5 px-4">Target Pembaca</th>
                                <th className="py-3.5 px-4">Waktu Terbit</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {announcements.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4 max-w-sm">
                                        <div className="space-y-0.5">
                                            <span className="font-bold text-navy-950 text-sm block">{item.title}</span>
                                            <p className="text-slate-500 line-clamp-2 text-xs">{item.content}</p>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                                            {item.audience_type}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500">
                                        {new Date(item.publish_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {announcements.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        Belum ada pengumuman yang diterbitkan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-navy-950">Buat Pengumuman Baru</h3>
                            <p className="text-xs text-slate-500">Tuliskan pesan resmi untuk peserta atau publik.</p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman</label>
                                <input
                                    type="text"
                                    required
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    placeholder="Contoh: Jadwal Pelaksanaan Seleksi Fisik Futsal 2026"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Target Pembaca</label>
                                    <select
                                        value={form.data.audience_type}
                                        onChange={(e) => form.setData('audience_type', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                    >
                                        <option value="publik">Publik (Umum)</option>
                                        <option value="peserta">Seluruh Peserta Terdaftar</option>
                                        <option value="lolos_administrasi">Peserta Lolos Administrasi</option>
                                        <option value="lolos_seleksi">Pemain Lolos Skuad Utama</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Waktu Publikasi</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={form.data.publish_at}
                                        onChange={(e) => form.setData('publish_at', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Isi Pengumuman</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={form.data.content}
                                    onChange={(e) => form.setData('content', e.target.value)}
                                    placeholder="Tuliskan isi pengumuman secara rinci..."
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 leading-relaxed"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-4 py-2 font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-5 py-2 font-bold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                                >
                                    {form.processing ? 'Menyimpan...' : 'Terbitkan Pengumuman'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
