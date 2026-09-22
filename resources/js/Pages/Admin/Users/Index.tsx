import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import { PlusCircle, UserCheck, Shield, UserCog, Edit2 } from 'lucide-react';

interface UsersIndexProps {
    users: {
        data: {
            id: number;
            name: string;
            email: string;
            role: string;
            status: string;
            phone?: string;
            last_login_at?: string;
            created_at: string;
        }[];
        links: any[];
    };
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'verifikator',
        phone: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'verifikator',
        status: 'active',
        phone: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('admin.users.store'), {
            onSuccess: () => {
                form.reset();
                setCreateModalOpen(false);
            },
        });
    };

    const handleEditOpen = (user: any) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status,
            phone: user.phone || '',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(route('admin.users.update', editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
            },
        });
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Pengguna Admin' }]}>
            <Head title="Manajemen Pengguna Admin" />

            <PageHeader
                title="Pengguna & Hak Akses"
                description="Kelola akun panitia, verifikator, pelatih tim seleksi, dan petugas check-in lapangan."
                action={
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Tambah Pengguna</span>
                    </button>
                }
            />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <th className="py-3.5 px-4">Nama & Email</th>
                                <th className="py-3.5 px-4">Peran (Role)</th>
                                <th className="py-3.5 px-4">Nomor Kontak</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="space-y-0.5">
                                            <span className="font-bold text-navy-950 text-sm block">{u.name}</span>
                                            <span className="text-slate-400 text-xs">{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700">
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                                        {u.phone || '-'}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                            u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {u.status === 'active' ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleEditOpen(u)}
                                            className="p-1.5 rounded-lg border border-slate-200 text-brand-600 hover:bg-brand-50"
                                            title="Ubah Pengguna"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-navy-950">Tambah Pengguna Baru</h3>
                            <p className="text-xs text-slate-500">Buat akun untuk panitia atau tim penilai.</p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Email Login</label>
                                <input
                                    type="email"
                                    required
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Peran / Role</label>
                                <select
                                    value={form.data.role}
                                    onChange={(e) => form.setData('role', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                >
                                    <option value="super_admin">Super Admin</option>
                                    <option value="admin_pendaftaran">Admin Pendaftaran</option>
                                    <option value="verifikator">Verifikator Berkas</option>
                                    <option value="pelatih">Pelatih / Tim Seleksi</option>
                                    <option value="checkin_officer">Petugas Check-in</option>
                                    <option value="viewer">Viewer / Pimpinan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp/HP</label>
                                <input
                                    type="text"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
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
                                    Simpan Pengguna
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-navy-950">Ubah Pengguna</h3>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Peran / Role</label>
                                <select
                                    value={editForm.data.role}
                                    onChange={(e) => editForm.setData('role', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                >
                                    <option value="super_admin">Super Admin</option>
                                    <option value="admin_pendaftaran">Admin Pendaftaran</option>
                                    <option value="verifikator">Verifikator Berkas</option>
                                    <option value="pelatih">Pelatih / Tim Seleksi</option>
                                    <option value="checkin_officer">Petugas Check-in</option>
                                    <option value="viewer">Viewer / Pimpinan</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Status Akun</label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Ganti Password (Kosongkan jika tidak diubah)</label>
                                <input
                                    type="password"
                                    placeholder="Password baru..."
                                    value={editForm.data.password}
                                    onChange={(e) => editForm.setData('password', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-5 py-2 font-bold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
