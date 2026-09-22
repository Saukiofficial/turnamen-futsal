import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import { PageProps } from '@/types';
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    Check, 
    RotateCcw, 
    ZoomIn, 
    ZoomOut,
    Loader2,
    MessageSquare,
    ShieldCheck,
    UserCheck,
    FileText,
    History
} from 'lucide-react';

interface VerificationIndexProps {
    events: { id: number; name: string; code: string }[];
    selectedEventId: number;
    queue: {
        id: number;
        registration_number: string;
        full_name: string;
        primary_position: string;
        verification_status: string;
        submitted_at: string;
    }[];
    currentRegistration: {
        id: number;
        registration_number: string;
        primary_position: string;
        photo_url: string | null;
        verification_status: string;
        verification_notes: string | null;
        revision_fields: string[];
        submitted_at: string;
        participant: {
            full_name: string;
            nisn?: string;
            masked_nik?: string;
            birth_place: string;
            birth_date: string;
            school_name: string;
        };
        logs: Array<{
            admin_name: string;
            previous_status: string;
            new_status: string;
            note: string | null;
            created_at: string;
        }>;
    } | null;
}

export default function VerificationIndex({
    events,
    selectedEventId,
    queue,
    currentRegistration,
}: VerificationIndexProps) {
    const { flash } = usePage<PageProps>().props;
    const [actionModal, setActionModal] = useState<'none' | 'revision' | 'reject'>('none');
    const [processing, setProcessing] = useState(false);
    const [note, setNote] = useState('');
    const [photoZoom, setPhotoZoom] = useState(1);
    const [showNoteField, setShowNoteField] = useState(false);
    const [checklist, setChecklist] = useState({
        biodata: true,
        nisn: true,
        photo: true,
        position: true,
    });

    const handleSelectApplicant = (id: number) => {
        router.get(route('admin.verification.index'), {
            event_id: selectedEventId,
            registration_id: id,
        }, { preserveState: true });
        setActionModal('none');
        setNote('');
    };

    // 1. Direct Approve Action
    const handleApprove = () => {
        if (!currentRegistration || processing) return;

        setProcessing(true);
        router.post(
            route('admin.verification.process', currentRegistration.id),
            {
                action: 'approve',
                note: note.trim() ? note.trim() : null,
                flagged_fields: [],
            },
            {
                onFinish: () => {
                    setProcessing(false);
                    setNote('');
                    setShowNoteField(false);
                },
            }
        );
    };

    // 2. Revision Submit Action
    const handleRevisionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRegistration || processing) return;

        if (!note.trim()) {
            alert('Catatan wajib diisi saat meminta perbaikan berkas.');
            return;
        }

        setProcessing(true);
        router.post(
            route('admin.verification.process', currentRegistration.id),
            {
                action: 'revision',
                note: note.trim(),
                flagged_fields: Object.keys(checklist).filter(k => !checklist[k as keyof typeof checklist]),
            },
            {
                onFinish: () => {
                    setProcessing(false);
                    setActionModal('none');
                    setNote('');
                },
            }
        );
    };

    // 3. Reject Submit Action
    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRegistration || processing) return;

        if (!note.trim()) {
            alert('Alasan penolakan berkas wajib diisi.');
            return;
        }

        setProcessing(true);
        router.post(
            route('admin.verification.process', currentRegistration.id),
            {
                action: 'reject',
                note: note.trim(),
                flagged_fields: [],
            },
            {
                onFinish: () => {
                    setProcessing(false);
                    setActionModal('none');
                    setNote('');
                },
            }
        );
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Verifikasi Berkas' }]}>
            <Head title="Verifikasi Berkas Pendaftar - FutsalReg" />

            <PageHeader
                title="Meja Verifikasi Berkas"
                description="Periksa validitas foto 3×4 dan biodata calon peserta. Ambil putusan lolos, perbaikan, atau tolak secara cepat."
                action={
                    <select
                        value={selectedEventId}
                        onChange={(e) => router.get(route('admin.verification.index'), { event_id: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white shadow-xs focus:ring-2 focus:ring-brand-500"
                    >
                        {events.map((evt) => (
                            <option key={evt.id} value={evt.id}>{evt.name}</option>
                        ))}
                    </select>
                }
            />

            {/* Flash Feedback */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm shadow-xs animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold">{flash.success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. Queue Panel (Left 3 Cols) */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                            Antrean Berkas ({queue.length})
                        </span>
                        <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                            Pending
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
                        {queue.map((item) => {
                            const isSelected = currentRegistration?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelectApplicant(item.id)}
                                    className={`w-full p-3.5 text-left transition-all flex items-center justify-between group ${
                                        isSelected ? 'bg-brand-50/90 border-l-4 border-brand-600 shadow-xs' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="space-y-0.5 min-w-0 pr-2">
                                        <span className={`text-xs font-bold block truncate ${isSelected ? 'text-brand-800' : 'text-navy-950 group-hover:text-brand-600'}`}>
                                            {item.full_name}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                                            <span>{item.registration_number}</span>
                                            <span>•</span>
                                            <span className="font-semibold text-slate-600">{item.primary_position}</span>
                                        </div>
                                    </div>
                                    <StatusBadge status={item.verification_status} size="sm" showIcon={false} />
                                </button>
                            );
                        })}

                        {queue.length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/60" />
                                <p className="font-semibold text-slate-600">Semua Berkas Selesai!</p>
                                <p className="text-[11px] text-slate-400">Tidak ada pendaftar yang menunggu verifikasi pada event ini.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Document & Photo Preview (Center 5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-brand-600" />
                            Pasfoto 3×4 Peserta
                        </h3>
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setPhotoZoom(Math.max(0.8, photoZoom - 0.2))}
                                className="p-1 rounded hover:bg-white text-slate-600"
                                title="Perkecil"
                            >
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setPhotoZoom(1)}
                                className="px-1.5 py-0.5 rounded hover:bg-white text-[10px] font-mono text-slate-600 font-bold"
                                title="Reset"
                            >
                                {Math.round(photoZoom * 100)}%
                            </button>
                            <button
                                type="button"
                                onClick={() => setPhotoZoom(Math.min(2.5, photoZoom + 0.2))}
                                className="p-1 rounded hover:bg-white text-slate-600"
                                title="Perbesar"
                            >
                                <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-80 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner border border-slate-800">
                        {currentRegistration?.photo_url ? (
                            <img
                                src={currentRegistration.photo_url}
                                alt="Pasfoto Peserta"
                                style={{ transform: `scale(${photoZoom})` }}
                                className="max-h-full object-contain transition-transform duration-150 rounded"
                            />
                        ) : (
                            <div className="text-center text-slate-500 text-xs">
                                <p>Foto tidak tersedia atau belum diunggah</p>
                            </div>
                        )}
                    </div>

                    {currentRegistration && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                <span className="text-slate-500 font-medium">Nomor Registrasi:</span>
                                <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                                    {currentRegistration.registration_number}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Nama Lengkap:</span>
                                <span className="font-bold text-navy-950 text-sm">{currentRegistration.participant.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">NISN Peserta:</span>
                                <span className="font-mono font-bold text-slate-800">{currentRegistration.participant.nisn || currentRegistration.participant.masked_nik || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Tempat, Tgl Lahir:</span>
                                <span className="text-slate-700 font-semibold">{currentRegistration.participant.birth_place}, {currentRegistration.participant.birth_date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Posisi Bermain:</span>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-navy-100 text-navy-900">
                                    {currentRegistration.primary_position}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Asal Sekolah:</span>
                                <span className="text-slate-700 font-semibold">{currentRegistration.participant.school_name}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Verification Action Panel (Right 4 Cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Putusan Verifikasi
                        </h3>
                        {currentRegistration && (
                            <StatusBadge status={currentRegistration.verification_status} size="sm" />
                        )}
                    </div>

                    {currentRegistration ? (
                        <div className="space-y-5">
                            {/* Checklist */}
                            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Pemeriksaan Cepat:
                                </span>
                                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={checklist.biodata}
                                        onChange={(e) => setChecklist({ ...checklist, biodata: e.target.checked })}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                    />
                                    <span>Biodata lengkap & sesuai identitas</span>
                                </label>
                                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={checklist.nisn}
                                        onChange={(e) => setChecklist({ ...checklist, nisn: e.target.checked })}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                    />
                                    <span>NISN 10 digit resmi valid & sesuai data sekolah</span>
                                </label>
                                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={checklist.photo}
                                        onChange={(e) => setChecklist({ ...checklist, photo: e.target.checked })}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                    />
                                    <span>Pasfoto 3×4 proporsional & jelas</span>
                                </label>
                                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={checklist.position}
                                        onChange={(e) => setChecklist({ ...checklist, position: e.target.checked })}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                    />
                                    <span>Posisi futsal terisi sesuai alokasi</span>
                                </label>
                            </div>

                            {/* MAIN ACTION: TERIMA & LOLOSKAN (Direct 1-Click Button) */}
                            {actionModal === 'none' && (
                                <div className="space-y-3 pt-2">
                                    <button
                                        type="button"
                                        id="btn-approve-verification"
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Menyimpan Keputusan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Terima & Loloskan Berkas</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Optional Note Accordion */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowNoteField(!showNoteField)}
                                            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium mx-auto"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>{showNoteField ? 'Sembunyikan Catatan' : '+ Tambah Catatan Verifikasi (Opsional)'}</span>
                                        </button>
                                        {showNoteField && (
                                            <div className="mt-2">
                                                <textarea
                                                    rows={2}
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="Catatan verifikator (opsional)..."
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Secondary Action Buttons (Revision & Reject) */}
                                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActionModal('revision');
                                                setNote('');
                                            }}
                                            disabled={processing}
                                            className="py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Minta Revisi</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActionModal('reject');
                                                setNote('');
                                            }}
                                            disabled={processing}
                                            className="py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Tolak Berkas</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* REVISION FORM MODE */}
                            {actionModal === 'revision' && (
                                <form onSubmit={handleRevisionSubmit} className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                                            <RotateCcw className="w-4 h-4 text-amber-600" />
                                            Permintaan Revisi Berkas
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setActionModal('none')}
                                            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                                        >
                                            Batal
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                            Catatan / Instruksi Perbaikan Bagi Peserta <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Contoh: Pasfoto buram atau latar belakang tidak polos. Mohon upload ulang foto 3×4 formal."
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Permintaan Revisi'}
                                    </button>
                                </form>
                            )}

                            {/* REJECT FORM MODE */}
                            {actionModal === 'reject' && (
                                <form onSubmit={handleRejectSubmit} className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                                        <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                                            <XCircle className="w-4 h-4 text-rose-600" />
                                            Konfirmasi Penolakan Berkas
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setActionModal('none')}
                                            className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                                        >
                                            Batal
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                            Alasan Penolakan <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Contoh: Peserta tidak memenuhi kriteria batas usia atau terbukti memasukkan data ganda."
                                            required
                                            className="w-full px-3 py-2 rounded-lg border border-rose-300 bg-white text-xs focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                                    >
                                        {processing ? 'Memproses...' : 'Konfirmasi Tolak Pendaftaran'}
                                    </button>
                                </form>
                            )}

                            {/* Verification Logs for Current Applicant */}
                            {currentRegistration.logs.length > 0 && (
                                <div className="pt-4 border-t border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                                        <History className="w-3.5 h-3.5" />
                                        Riwayat Verifikasi ({currentRegistration.logs.length})
                                    </span>
                                    <div className="space-y-2 max-h-36 overflow-y-auto">
                                        {currentRegistration.logs.map((log, idx) => (
                                            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-800">{log.admin_name}</span>
                                                    <span className="text-slate-400 font-mono text-[10px]">{log.created_at}</span>
                                                </div>
                                                <div className="mt-0.5 text-slate-600">
                                                    Status: <span className="font-semibold text-brand-700">{log.new_status}</span>
                                                </div>
                                                {log.note && <p className="text-slate-500 mt-1 italic">"{log.note}"</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400 text-xs">
                            Pilih peserta dari antrean untuk memulai verifikasi.
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
