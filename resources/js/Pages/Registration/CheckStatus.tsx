import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import StatusBadge from '@/Components/StatusBadge';
import CropModal from '@/Components/CropModal';
import { QRCodeSVG } from 'qrcode.react';
import { 
    Search, 
    Printer, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Upload, 
    CreditCard, 
    ShieldCheck, 
    Edit3,
    ArrowRight,
    MapPin,
    Calendar,
    Users,
    School,
    FileCheck,
    ExternalLink
} from 'lucide-react';

interface CheckStatusProps {
    registrationData: {
        type?: 'individual' | 'team';
        id: number;
        registration_number: string;
        access_code: string;
        primary_position?: string;
        submitted_at: string;
        photo_url?: string | null;
        logo_url?: string | null;
        document_url?: string | null;
        team_name?: string;
        school_name?: string;
        head_coach?: string;
        manager_name?: string;
        manager_phone?: string;
        verification_status: string;
        verification_notes: string | null;
        revision_fields?: string[];
        selection_status?: string;
        qr_token: string;
        event: {
            name: string;
            organizer: string;
            location: string;
            selection_start_at?: string;
        };
        participant?: {
            full_name: string;
            nisn?: string;
            masked_nik: string;
            birth_place: string;
            birth_date: string;
            school_name: string;
        };
        attendance?: {
            status: string;
            checked_in_at: string;
            session_name?: string;
        } | null;
    } | null;
    errorMessage: string | null;
    initialQuery: {
        registration_number?: string;
        access_code?: string;
    };
}

export default function CheckStatus({ registrationData, errorMessage, initialQuery }: CheckStatusProps) {
    // Search form
    const searchForm = useForm({
        registration_number: initialQuery.registration_number || '',
        access_code: initialQuery.access_code || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchForm.get(route('registration.check-status'));
    };

    // Revision Form
    const [showRevisionForm, setShowRevisionForm] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [revisedPhotoPreview, setRevisedPhotoPreview] = useState<string | null>(null);

    const revisionForm = useForm({
        access_code: registrationData?.access_code || '',
        full_name: registrationData?.participant?.full_name || '',
        birth_place: registrationData?.participant?.birth_place || '',
        birth_date: '',
        school_name: registrationData?.participant?.school_name !== 'Tidak diisi' ? (registrationData?.participant?.school_name || '') : '',
        primary_position: registrationData?.primary_position || 'Flank',
        photo: null as File | null,
    });

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setRawImageSrc(reader.result as string);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (blob: Blob, previewUrl: string) => {
        const file = new File([blob], 'foto_revisi_3x4.jpg', { type: 'image/jpeg' });
        revisionForm.setData('photo', file);
        setRevisedPhotoPreview(previewUrl);
    };

    const handleRevisionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!registrationData) return;

        revisionForm.post(route('registration.revision', { registrationNumber: registrationData.registration_number }), {
            onSuccess: () => setShowRevisionForm(false),
        });
    };

    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title="Cek Status Pendaftaran & Kartu Peserta" />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                        LAYANAN MANDIRI PESERTA
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                        Cek Status & Unduh Kartu Turnamen
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                        Masukkan nomor pendaftaran dan kode akses rahasia yang Anda peroleh saat mendaftar.
                    </p>
                </div>

                {/* Lookup Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-6">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Nomor Pendaftaran
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: FTS-2026-000127"
                                value={searchForm.data.registration_number}
                                onChange={(e) => searchForm.setData('registration_number', e.target.value.toUpperCase())}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 uppercase"
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Kode Akses
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Kode 8 Digit"
                                value={searchForm.data.access_code}
                                onChange={(e) => searchForm.setData('access_code', e.target.value.toUpperCase())}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 uppercase tracking-wider"
                            />
                        </div>

                        <div className="sm:col-span-2 sm:self-end">
                            <button
                                type="submit"
                                disabled={searchForm.processing}
                                className="w-full h-10 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <Search className="w-4 h-4" />
                                <span>Cari</span>
                            </button>
                        </div>
                    </form>

                    {errorMessage && (
                        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>

                {/* Status Result Card */}
                {registrationData && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-navy-950 text-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-navy-900">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>Nomor Pendaftaran:</span>
                                        <span className="font-mono font-bold text-white bg-navy-900 px-2 py-0.5 rounded">
                                            {registrationData.registration_number}
                                        </span>
                                        <span className="text-amber-400 text-[11px] font-semibold">
                                            {registrationData.type === 'team' ? '• KONTINGEN TIM' : '• PEMAIN INDIVIDU'}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white">
                                        {registrationData.type === 'team'
                                            ? registrationData.team_name
                                            : registrationData.participant?.full_name}
                                    </h2>
                                </div>
                                <StatusBadge status={registrationData.verification_status} size="md" />
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Alert Catatan Panitia */}
                                {registrationData.verification_notes && (
                                    <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                                        registrationData.verification_status === 'perlu_perbaikan'
                                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                                            : registrationData.verification_status === 'ditolak'
                                            ? 'bg-red-50 border-red-200 text-red-900'
                                            : 'bg-blue-50 border-blue-200 text-blue-900'
                                    }`}>
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <span className="font-bold block">Catatan Verifikator Panitia:</span>
                                            <p>{registrationData.verification_notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Main details: Team vs Individual */}
                                {registrationData.type === 'team' ? (
                                    /* TEAM DETAILS */
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                                        <div className="sm:col-span-4 flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center p-2">
                                                {registrationData.logo_url ? (
                                                    <img 
                                                        src={registrationData.logo_url} 
                                                        alt="Logo Tim" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <Users className="w-12 h-12 text-slate-300" />
                                                )}
                                            </div>
                                            <span className="text-[11px] text-slate-400 mt-2 font-medium">Logo Tim Sekolah</span>
                                        </div>

                                        <div className="sm:col-span-8 space-y-4">
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Nama Tim:</dt>
                                                    <dd className="text-slate-900 font-bold mt-0.5 text-sm">{registrationData.team_name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Asal Sekolah:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.school_name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Head Coach (Pelatih):</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.head_coach}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Manager Team:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.manager_name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">No. WhatsApp:</dt>
                                                    <dd className="text-slate-900 font-mono font-semibold mt-0.5">{registrationData.manager_phone}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Turnamen:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.event.name}</dd>
                                                </div>
                                            </dl>

                                            {/* Berkas Rekomendasi & NISN */}
                                            {registrationData.document_url && (
                                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <FileCheck className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-xs font-semibold text-slate-700">Berkas Surat Rekomendasi & NISN Peserta</span>
                                                    </div>
                                                    <a
                                                        href={registrationData.document_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                                                    >
                                                        <span>Lihat Berkas</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* INDIVIDUAL PARTICIPANT DETAILS */
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                                        <div className="sm:col-span-4 flex flex-col items-center">
                                            <div className="w-32 h-44 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                                                {registrationData.photo_url ? (
                                                    <img 
                                                        src={registrationData.photo_url} 
                                                        alt="Pasfoto Peserta" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-slate-400">Belum ada foto</div>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-slate-400 mt-2">Pasfoto Formal 3×4</span>
                                        </div>

                                        <div className="sm:col-span-8 space-y-4">
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                                <div>
                                                    <dt className="text-slate-500 font-medium">NISN / NIK:</dt>
                                                    <dd className="text-slate-900 font-mono font-semibold mt-0.5">
                                                        {registrationData.participant?.nisn ? `NISN: ${registrationData.participant.nisn}` : registrationData.participant?.masked_nik}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Posisi Futsal:</dt>
                                                    <dd className="text-slate-900 font-bold mt-0.5 text-brand-600">{registrationData.primary_position}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Tempat, Tanggal Lahir:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">
                                                        {registrationData.participant?.birth_place}, {registrationData.participant?.birth_date}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Asal Sekolah / Instansi:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.participant?.school_name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Kegiatan / Event:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.event.name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Waktu Pendaftaran:</dt>
                                                    <dd className="text-slate-900 font-semibold mt-0.5">{registrationData.submitted_at}</dd>
                                                </div>
                                            </dl>

                                            {/* Attendance info if any */}
                                            {registrationData.attendance && (
                                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                                                    <span className="font-semibold">Kehadiran Turnamen: Hadir</span>
                                                    <span>Check-in: {registrationData.attendance.checked_in_at}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Bar */}
                                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                    {/* Download Card if Lolos Administrasi */}
                                    {registrationData.verification_status === 'lolos_administrasi' ? (
                                        <div className="flex items-center gap-3">
                                            {registrationData.type === 'team' ? (
                                                <a
                                                    href={route('team.print-card', { registrationNumber: registrationData.registration_number })}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-navy-950 font-bold text-sm hover:bg-amber-400 shadow-sm transition-all"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                    <span>Cetak Kartu Akreditasi Tim Resmi</span>
                                                </a>
                                            ) : (
                                                <a
                                                    href={route('registration.print-card', { registrationNumber: registrationData.registration_number })}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 shadow-sm transition-all"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                    <span>Cetak / Unduh Kartu Peserta Resmi</span>
                                                </a>
                                            )}
                                            <span className="text-xs text-slate-500">Siap dicetak sebagai ID Card Resmi</span>
                                        </div>
                                    ) : registrationData.verification_status === 'perlu_perbaikan' ? (
                                        registrationData.type === 'team' ? (
                                            <span className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                                                <AlertCircle className="w-4 h-4" />
                                                Harap hubungi panitia turnamen untuk penyerahan revisi berkas tim.
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setShowRevisionForm(!showRevisionForm)}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-sm transition-all"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                <span>{showRevisionForm ? 'Tutup Form Revisi' : 'Kirim Perbaikan Berkas'}</span>
                                            </button>
                                        )
                                    ) : (
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                            Kartu akreditasi/peserta tersedia setelah berkas berstatus Lolos Administrasi.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Revision Form Section (Opened when Perlu Perbaikan) */}
                        {showRevisionForm && registrationData.verification_status === 'perlu_perbaikan' && (
                            <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6 space-y-6 animate-fadeIn">
                                <div className="border-b border-slate-100 pb-3">
                                    <h3 className="text-base font-bold text-navy-950">Form Perbaikan Data & Berkas</h3>
                                    <p className="text-xs text-slate-500">
                                        Perbaiki data atau unggah ulang foto yang diminta oleh verifikator panitia.
                                    </p>
                                </div>

                                <form onSubmit={handleRevisionSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                value={revisionForm.data.full_name}
                                                onChange={(e) => revisionForm.setData('full_name', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Asal Sekolah / Instansi
                                            </label>
                                            <input
                                                type="text"
                                                value={revisionForm.data.school_name}
                                                onChange={(e) => revisionForm.setData('school_name', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    {/* Upload Foto Baru */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Unggah Foto Baru (Jika Diminta)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                                                <Upload className="w-4 h-4 text-slate-500" />
                                                <span>Pilih Foto 3×4 Baru</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/jpeg,image/png,image/jpg" 
                                                    onChange={handlePhotoSelect} 
                                                    className="hidden" 
                                                />
                                            </label>
                                            {revisedPhotoPreview && (
                                                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Foto baru siap dikirim
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowRevisionForm(false)}
                                            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={revisionForm.processing}
                                            className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
                                        >
                                            {revisionForm.processing ? 'Mengirim...' : 'Kirim Ulang Revisi'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Crop modal for revision photo */}
            {rawImageSrc && (
                <CropModal
                    isOpen={cropModalOpen}
                    imageSrc={rawImageSrc}
                    onClose={() => setCropModalOpen(false)}
                    onCropComplete={handleCropComplete}
                />
            )}

            <Footer />
        </div>
    );
}
