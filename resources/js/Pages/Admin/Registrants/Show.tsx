import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import { QRCodeSVG } from 'qrcode.react';
import { 
    ArrowLeft, 
    Printer, 
    ShieldCheck, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    XCircle, 
    History, 
    User, 
    Calendar,
    Save
} from 'lucide-react';

interface RegistrantShowProps {
    registration: {
        id: number;
        registration_number: string;
        access_code: string;
        qr_token: string;
        primary_position: string;
        photo_url: string | null;
        verification_status: string;
        selection_status: string;
        submitted_at: string;
        verified_at: string | null;
        verified_by_name: string | null;
        verification_notes: string | null;
        revision_count: number;
        event: {
            id: number;
            name: string;
            location: string;
        };
        participant: {
            full_name: string;
            nisn?: string;
            masked_nik?: string;
            birth_place: string;
            birth_date: string;
            school_name: string;
        };
        attendance: {
            status: string;
            checked_in_at: string;
            session_name?: string;
        } | null;
        revisions: {
            revision_number: number;
            changed_fields: any;
            submitted_at: string;
            reviewed_by?: string;
        }[];
        verification_logs: {
            id: number;
            previous_status: string;
            new_status: string;
            admin_name: string;
            note: string | null;
            created_at: string;
        }[];
    };
}

export default function RegistrantShow({ registration }: RegistrantShowProps) {
    const [activeTab, setActiveTab] = useState<'biodata' | 'logs' | 'attendance'>('biodata');
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    const statusForm = useForm({
        status: registration.verification_status,
        note: '',
        revision_fields: [] as string[],
    });

    const handleStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.post(route('admin.registrants.update-status', registration.id), {
            onSuccess: () => setStatusModalOpen(false),
        });
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Data Pendaftar', href: route('admin.registrants.index') }, { label: registration.participant.full_name }]}>
            <Head title={`Detail Pendaftar - ${registration.participant.full_name}`} />

            <div className="mb-4">
                <Link
                    href={route('admin.registrants.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Data Pendaftar</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Card: Summary & Quick Actions (4 Cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-28 h-36 rounded-xl bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                            {registration.photo_url ? (
                                <img src={registration.photo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-xs text-slate-400">Foto 3×4</div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-mono font-bold text-brand-600">
                                {registration.registration_number}
                            </span>
                            <h2 className="text-lg font-bold text-navy-950">
                                {registration.participant.full_name}
                            </h2>
                            <p className="text-xs text-slate-500">{registration.participant.school_name}</p>
                        </div>

                        <StatusBadge status={registration.verification_status} size="md" />
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                        <button
                            type="button"
                            onClick={() => setStatusModalOpen(true)}
                            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all text-center"
                        >
                            Ubah Status Verifikasi
                        </button>

                        {registration.verification_status === 'lolos_administrasi' && (
                            <a
                                href={route('registration.print-card', registration.registration_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
                            >
                                <Printer className="w-4 h-4 text-slate-500" />
                                <span>Preview & Cetak Kartu</span>
                            </a>
                        )}
                    </div>

                    {/* QR Preview */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="space-y-0.5">
                            <span className="font-bold text-slate-800">QR Check-in Token</span>
                            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{registration.qr_token}</p>
                        </div>
                        <div className="p-1 bg-slate-50 rounded border border-slate-200">
                            <QRCodeSVG value={registration.qr_token} size={44} />
                        </div>
                    </div>
                </div>

                {/* Right Card: Tabs (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {/* Tabs Header */}
                    <div className="border-b border-slate-200 px-6 flex items-center gap-6 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('biodata')}
                            className={`py-4 border-b-2 transition-colors ${
                                activeTab === 'biodata' 
                                    ? 'border-brand-600 text-brand-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Biodata Peserta
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('logs')}
                            className={`py-4 border-b-2 transition-colors ${
                                activeTab === 'logs' 
                                    ? 'border-brand-600 text-brand-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Riwayat Verifikasi & Revisi ({registration.verification_logs.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('attendance')}
                            className={`py-4 border-b-2 transition-colors ${
                                activeTab === 'attendance' 
                                    ? 'border-brand-600 text-brand-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Kehadiran & Seleksi
                        </button>
                    </div>

                    {/* Tab 1: Biodata */}
                    {activeTab === 'biodata' && (
                        <div className="p-6 space-y-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                                <div>
                                    <dt className="text-slate-400 font-medium">Nama Lengkap Siswa:</dt>
                                    <dd className="text-sm font-bold text-navy-950 mt-0.5">{registration.participant.full_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">NISN Siswa:</dt>
                                    <dd className="text-sm font-mono font-bold text-slate-800 mt-0.5">
                                        {registration.participant.nisn || registration.participant.masked_nik || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">Tempat, Tanggal Lahir:</dt>
                                    <dd className="text-sm font-semibold text-slate-800 mt-0.5">
                                        {registration.participant.birth_place}, {registration.participant.birth_date}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">Posisi Bermain Utama:</dt>
                                    <dd className="text-sm font-bold text-brand-600 mt-0.5">{registration.primary_position}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">Asal Sekolah / Instansi:</dt>
                                    <dd className="text-sm font-semibold text-slate-800 mt-0.5">{registration.participant.school_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">Event Seleksi:</dt>
                                    <dd className="text-sm font-semibold text-slate-800 mt-0.5">{registration.event.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">Waktu Pendaftaran:</dt>
                                    <dd className="text-xs font-semibold text-slate-700 mt-0.5">{registration.submitted_at}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-400 font-medium">Diverifikasi Oleh:</dt>
                                    <dd className="text-xs font-semibold text-slate-700 mt-0.5">{registration.verified_by_name || 'Belum diverifikasi'}</dd>
                                </div>
                            </dl>

                            {registration.verification_notes && (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                                    <span className="font-bold text-navy-950">Catatan Verifikator:</span>
                                    <p className="text-slate-600">{registration.verification_notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Logs */}
                    {activeTab === 'logs' && (
                        <div className="p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Log Aktivitas Verifikasi</h3>
                            <div className="space-y-3">
                                {registration.verification_logs.map((log) => (
                                    <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-navy-950">
                                                Status diubah ke: <span className="text-brand-600">{log.new_status}</span>
                                            </span>
                                            <span className="text-[11px] text-slate-400">{log.created_at}</span>
                                        </div>
                                        <p className="text-slate-500">Oleh: {log.admin_name}</p>
                                        {log.note && <p className="text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1">{log.note}</p>}
                                    </div>
                                ))}

                                {registration.verification_logs.length === 0 && (
                                    <p className="text-slate-400 text-xs text-center py-6">Belum ada riwayat verifikasi.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Attendance */}
                    {activeTab === 'attendance' && (
                        <div className="p-6 space-y-4 text-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Kehadiran di Lokasi Seleksi</h3>
                            {registration.attendance ? (
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-emerald-900">
                                    <div className="flex items-center gap-2 font-bold">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Status Kehadiran: Hadir</span>
                                    </div>
                                    <p>Check-in tercatat pada: <strong>{registration.attendance.checked_in_at}</strong></p>
                                    <p>Sesi: {registration.attendance.session_name || 'Sesi Turnamen Standar'}</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 space-y-1">
                                    <span className="font-bold text-navy-950 block">Belum Melakukan Check-in</span>
                                    <p>Peserta belum memindai QR code kehadiran di meja registrasi seleksi.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {statusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-navy-950">Ubah Status Verifikasi</h3>
                            <p className="text-xs text-slate-500">Tentukan hasil verifikasi berkas calon pemain.</p>
                        </div>

                        <form onSubmit={handleStatusSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Baru</label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={(e) => statusForm.setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                >
                                    <option value="lolos_administrasi">Lolos Administrasi (Terima)</option>
                                    <option value="perlu_perbaikan">Perlu Perbaikan (Minta Revisi)</option>
                                    <option value="ditolak">Ditolak</option>
                                    <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Catatan Verifikator {statusForm.data.status === 'perlu_perbaikan' && <span className="text-rose-500">*</span>}
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan catatan atau petunjuk perbaikan bagi peserta..."
                                    value={statusForm.data.note}
                                    onChange={(e) => statusForm.setData('note', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setStatusModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={statusForm.processing}
                                    className="px-5 py-2 text-xs font-bold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                                >
                                    {statusForm.processing ? 'Menyimpan...' : 'Simpan Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
