import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Stepper from '@/Components/Stepper';
import CropModal from '@/Components/CropModal';
import { 
    Calendar, 
    MapPin, 
    Users, 
    Clock, 
    ArrowLeft, 
    ArrowRight, 
    Upload, 
    Check, 
    AlertCircle, 
    CheckCircle2, 
    Trash2, 
    Edit2,
    Shield,
    Lock
} from 'lucide-react';

interface PositionOption {
    name: string;
    quota: number;
    filled: number;
    is_full: boolean;
}

interface RegisterProps {
    event: {
        id: number;
        name: string;
        code: string;
        slug: string;
        description: string;
        organizer: string;
        location: string;
        registration_start_at: string;
        registration_end_at: string;
        days_remaining: number;
        total_quota: number;
        registered_count: number;
        is_open: boolean;
        is_full: boolean;
    };
    positions: PositionOption[];
}

export default function Register({ event, positions }: RegisterProps) {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        full_name: '',
        nisn: '',
        nik: '',
        school_name: '',
        birth_place: '',
        birth_date: '',
        primary_position: 'Flank',
        photo: null as File | null,
        agreement: false,
    });

    const steps = [
        { number: 1, title: 'Biodata', desc: 'Identitas & Posisi' },
        { number: 2, title: 'Foto 3×4', desc: 'Pasfoto Formal' },
        { number: 3, title: 'Konfirmasi', desc: 'Periksa & Kirim' },
    ];

    // Mask NISN for review screen: e.g. "0081 •••• 67"
    const getMaskedNisn = (raw: string) => {
        const clean = raw.replace(/\D/g, '');
        if (clean.length < 6) return clean;
        const prefix = clean.slice(0, 4);
        const suffix = clean.slice(-2);
        return `${prefix} •••• ${suffix}`;
    };

    // Handle initial photo selection to open crop modal
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            alert('Format file harus JPG, JPEG, atau PNG.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran foto maksimal 2 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setRawImageSrc(reader.result as string);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    // Handle crop modal completion
    const handleCropComplete = (blob: Blob, previewUrl: string) => {
        const file = new File([blob], 'foto_peserta_3x4.jpg', { type: 'image/jpeg' });
        setData('photo', file);
        setPhotoPreview(previewUrl);
        clearErrors('photo');
    };

    // Step 1 Validation
    const validateStep1 = () => {
        if (!data.full_name.trim()) {
            alert('Silakan masukkan nama lengkap.');
            return false;
        }
        const idNumber = data.nisn || data.nik;
        if (!/^[0-9]{10}$/.test(idNumber.trim())) {
            alert('NISN harus berupa 10 digit angka resmi Kemdikbud.');
            return false;
        }
        if (!data.birth_place.trim()) {
            alert('Silakan masukkan tempat lahir.');
            return false;
        }
        if (!data.birth_date) {
            alert('Silakan pilih tanggal lahir.');
            return false;
        }
        if (!data.primary_position) {
            alert('Silakan pilih posisi futsal.');
            return false;
        }
        return true;
    };

    // Step 2 Validation
    const validateStep2 = () => {
        if (!data.photo) {
            alert('Silakan unggah foto formal 3×4 terlebih dahulu.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.agreement) {
            alert('Anda wajib menyetujui pernyataan kebenaran data.');
            return;
        }
        post(route('registration.store', { slug: event.slug }));
    };

    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title={`Pendaftaran Pemain - ${event.name}`} />
            <Navbar />

            {/* Event Masthead with Cinematic Futsal Arena Banner */}
            <section className="relative bg-navy-950 text-white pt-10 pb-20 sm:pb-28 border-b border-navy-900 overflow-hidden">
                {/* Background Banner Image - Bright and Clearly Visible */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <picture>
                        <source srcSet="/images/registration_banner.webp" type="image/webp" />
                        <img 
                            src="/images/registration_banner.jpg" 
                            alt="Banner Turnamen Futsal SAF League" 
                            className="w-full h-full object-cover object-center sm:object-[center_20%] opacity-85 sm:opacity-90 brightness-110 contrast-105"
                        />
                    </picture>
                    {/* Directional gradient: darker on left behind text, bright and open on right */}
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-black/25" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="space-y-3">
                            {/* Breadcrumb / Category pill */}
                            <div className="flex items-center gap-2">
                                <Link 
                                    href={route('home')} 
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Beranda</span>
                                </Link>
                                <span className="text-white/30 text-xs">•</span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded-md border border-brand-500/30">
                                    FORMULIR PENDAFTARAN RESMI
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                                {event.name}
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                                {event.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-200">
                                <span className="inline-flex items-center gap-1.5 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
                                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                                    <span>{event.location}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs text-amber-300">
                                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>{event.days_remaining} hari tersisa</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs text-emerald-300">
                                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Data Aman & Terverifikasi</span>
                                </span>
                            </div>
                        </div>

                        {/* Top-right Quota Status Card */}
                        <div className="hidden lg:flex flex-col items-end bg-navy-900/90 backdrop-blur-md px-5 py-4 rounded-xl border border-white/15 shadow-xl min-w-[200px]">
                            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Kapasitas Pendaftar</span>
                            <div className="text-2xl font-black text-white font-mono mt-0.5">
                                {event.registered_count} <span className="text-xs text-slate-400 font-normal font-sans">/ {event.total_quota} kuota</span>
                            </div>
                            <div className="w-40 h-1.5 bg-navy-950 rounded-full mt-2.5 overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-brand-500 rounded-full" 
                                    style={{ width: `${Math.min(100, Math.round((event.registered_count / (event.total_quota || 1)) * 100))}%` }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Form Container (Overlaps masthead) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 pb-20 flex-1 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Form Area (8 Cols) */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                        {/* Stepper Header */}
                        <div className="mb-8 pb-6 border-b border-slate-100">
                            <Stepper currentStep={currentStep} steps={steps} />
                        </div>

                        {/* If Event Closed or Full */}
                        {(!event.is_open || event.is_full) && (
                            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                                <div>
                                    <span className="font-bold">Pemberitahuan Pendaftaran</span>
                                    <p className="text-xs mt-0.5">
                                        {event.is_full 
                                            ? 'Mohon maaf, kuota pendaftaran telah terpenuhi. Pantau terus pengumuman untuk sesi tambahan.' 
                                            : 'Pendaftaran saat ini sedang tidak dibuka.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Top General Error */}
                        {errors.nik && (
                            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                                <div>
                                    <span className="font-bold">Pendaftaran Tidak Dapat Diproses</span>
                                    <p className="text-xs mt-0.5">{errors.nik}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* ================= STEP 1: BIODATA ================= */}
                            {/* ================= STEP 1: BIODATA ================= */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    {/* Notice Switcher to Team Registration */}
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                                                <Users className="w-5 h-5 text-amber-700" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">Mendaftar Sebagai Tim / Sekolah?</h4>
                                                <p className="text-xs text-amber-800 mt-0.5">
                                                    Formulir ini khusus untuk pemain individu. Untuk mendaftarkan seluruh skuad tim sekolah, gunakan formulir tim.
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('team.create')}
                                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 text-navy-950 hover:bg-amber-400 text-xs font-bold shrink-0 transition-colors shadow-xs"
                                        >
                                            <span>Beralih ke Formulir Tim</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-navy-950">Data Pemain Individu</h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Isi identitas resmi pemain sesuai dengan data NISN aktif.
                                        </p>
                                    </div>

                                    {/* Nama Lengkap */}
                                    <div>
                                        <label htmlFor="full_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Nama Lengkap <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            required
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            placeholder="Masukkan nama lengkap sesuai identitas resmi"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                        />
                                        {errors.full_name && <p className="text-xs text-rose-600 mt-1">{errors.full_name}</p>}
                                    </div>

                                    {/* NISN & Asal Sekolah (2 Kolom) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="nisn" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                NISN (10 Digit Angka) <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="nisn"
                                                type="text"
                                                required
                                                inputMode="numeric"
                                                maxLength={10}
                                                value={data.nisn}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setData((prev) => ({ ...prev, nisn: val, nik: val }));
                                                }}
                                                placeholder="Contoh: 0081234567"
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                            />
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                Nomor Induk Siswa Nasional (NISN) resmi 10 digit dari Dapodik / Kemdikbud.
                                            </p>
                                            {(errors.nisn || errors.nik) && <p className="text-xs text-rose-600 mt-1">{errors.nisn || errors.nik}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="school_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Asal Sekolah / Madrasah <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="school_name"
                                                type="text"
                                                required
                                                value={data.school_name}
                                                onChange={(e) => setData('school_name', e.target.value)}
                                                placeholder="Contoh: SMA Negeri 1 Sumenep"
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                            />
                                            {errors.school_name && <p className="text-xs text-rose-600 mt-1">{errors.school_name}</p>}
                                        </div>
                                    </div>

                                    {/* Tempat Lahir & Tanggal Lahir (2 Kolom) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="birth_place" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Tempat Lahir <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="birth_place"
                                                type="text"
                                                required
                                                value={data.birth_place}
                                                onChange={(e) => setData('birth_place', e.target.value)}
                                                placeholder="Contoh: Sumenep"
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                            />
                                            {errors.birth_place && <p className="text-xs text-rose-600 mt-1">{errors.birth_place}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="birth_date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Tanggal Lahir <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                id="birth_date"
                                                type="date"
                                                required
                                                max={new Date().toISOString().split('T')[0]}
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                            />
                                            {errors.birth_date && <p className="text-xs text-rose-600 mt-1">{errors.birth_date}</p>}
                                        </div>
                                    </div>

                                    {/* Posisi Futsal (Segmented Radio Grid) */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                            Posisi Futsal Utama <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            {['Goalkeeper', 'Anchor', 'Flank', 'Pivot'].map((pos) => {
                                                const isSelected = data.primary_position === pos;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={pos}
                                                        onClick={() => setData('primary_position', pos)}
                                                        className={`h-12 px-3 rounded-lg border text-sm font-semibold flex items-center justify-between transition-all ${
                                                            isSelected 
                                                                ? 'border-brand-600 bg-brand-50/70 text-brand-700 ring-2 ring-brand-500/20' 
                                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span>{pos}</span>
                                                        {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.primary_position && <p className="text-xs text-rose-600 mt-1">{errors.primary_position}</p>}
                                    </div>
                                </div>
                            )}

                            {/* ================= STEP 2: FOTO 3X4 ================= */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-navy-950">Unggah Foto Peserta</h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Unggah foto formal terbaru dengan rasio 3×4.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        {/* Frame Preview (Left 5 Cols) */}
                                        <div className="md:col-span-5 flex flex-col items-center">
                                            <div className="w-[180px] h-[240px] sm:w-[210px] sm:h-[280px] rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex flex-col items-center justify-center relative shadow-sm">
                                                {photoPreview ? (
                                                    <img 
                                                        src={photoPreview} 
                                                        alt="Preview Foto 3x4" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="p-4 text-center space-y-2">
                                                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                                            <Upload className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-500 block">Rasio 3×4</span>
                                                        <span className="text-[11px] text-slate-400 block">Belum ada foto</span>
                                                    </div>
                                                )}
                                            </div>

                                            {photoPreview && (
                                                <div className="flex items-center gap-2 mt-3">
                                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                                                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>Ganti</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/jpeg,image/png,image/jpg" 
                                                            onChange={handlePhotoSelect} 
                                                            className="hidden" 
                                                        />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setData('photo', null);
                                                            setPhotoPreview(null);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Hapus</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Dropzone & Requirements (Right 7 Cols) */}
                                        <div className="md:col-span-7 space-y-4">
                                            {!photoPreview && (
                                                <label className="block p-8 border-2 border-dashed border-brand-300 rounded-2xl bg-brand-50/40 hover:bg-brand-50/70 text-center cursor-pointer transition-colors">
                                                    <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                                                    <span className="text-sm font-bold text-navy-950 block">Pilih File Foto</span>
                                                    <span className="text-xs text-slate-500 block mt-1">Klik di sini untuk memilih foto dari perangkat Anda</span>
                                                    <input 
                                                        type="file" 
                                                        accept="image/jpeg,image/png,image/jpg" 
                                                        onChange={handlePhotoSelect} 
                                                        className="hidden" 
                                                    />
                                                </label>
                                            )}

                                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                                                <span className="font-bold text-navy-950 uppercase tracking-wider text-[11px] block">
                                                    Ketentuan Foto Peserta:
                                                </span>
                                                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                                                    <li>Format file: <strong>JPG, JPEG, atau PNG</strong>.</li>
                                                    <li>Ukuran maksimal: <strong>2 MB</strong>.</li>
                                                    <li>Foto formal terbaru dengan latar belakang polos.</li>
                                                    <li>Wajah menghadap lurus dan terlihat jelas tanpa kacamata hitam/penutup wajah.</li>
                                                </ul>
                                            </div>

                                            {errors.photo && <p className="text-xs text-rose-600 font-semibold">{errors.photo}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ================= STEP 3: KONFIRMASI ================= */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-navy-950">Periksa & Konfirmasi</h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Pastikan seluruh data sudah benar sebelum pendaftaran dikirimkan.
                                        </p>
                                    </div>

                                    {/* Description List Ringkasan */}
                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-200">
                                            <div className="w-20 h-28 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                                                {photoPreview ? (
                                                    <img src={photoPreview} alt="Foto Peserta" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Foto</div>
                                                )}
                                            </div>
                                            <div className="space-y-1 text-center sm:text-left">
                                                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Calon Peserta</span>
                                                <h3 className="text-lg font-bold text-navy-950">{data.full_name}</h3>
                                                <p className="text-xs font-mono text-slate-600">NISN: {getMaskedNisn(data.nisn || data.nik)}</p>
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                                                    Posisi: {data.primary_position}
                                                </span>
                                            </div>
                                        </div>

                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                            <div>
                                                <dt className="text-slate-500 font-medium">Asal Sekolah / Instansi:</dt>
                                                <dd className="text-slate-900 font-semibold mt-0.5">
                                                    {data.school_name || 'Tidak diisi (Peserta Umum)'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 font-medium">Tempat & Tanggal Lahir:</dt>
                                                <dd className="text-slate-900 font-semibold mt-0.5">
                                                    {data.birth_place}, {data.birth_date ? new Date(data.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                                </dd>
                                            </div>
                                        </dl>

                                        <div className="pt-1 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(1)}
                                                className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                                            >
                                                Ubah Biodata
                                            </button>
                                            <span className="text-slate-300">•</span>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(2)}
                                                className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                                            >
                                                Ganti Foto
                                            </button>
                                        </div>
                                    </div>

                                    {/* Satu Checkbox Pernyataan Wajib */}
                                    <div className="space-y-3 pt-2">
                                        <label className="flex items-start gap-3 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={data.agreement}
                                                onChange={(e) => setData('agreement', e.target.checked)}
                                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 mt-0.5"
                                            />
                                            <span className="text-xs text-slate-700 leading-relaxed font-medium">
                                                Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan.
                                            </span>
                                        </label>

                                        <p className="text-[11px] text-slate-500">
                                            Dengan mengirim pendaftaran, Anda menyetujui pemrosesan data pribadi untuk keperluan administrasi turnamen sesuai kebijakan privasi.
                                        </p>

                                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                            <span>Data tidak dapat diubah setelah dikirimkan, kecuali jika verifikator panitia meminta perbaikan.</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ================= STEP ACTION BUTTONS ================= */}
                            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                                <div>
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Kembali</span>
                                        </button>
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-400">
                                            Langkah 1 dari 3
                                        </span>
                                    )}
                                </div>

                                <div>
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-sm transition-all"
                                        >
                                            <span>Lanjutkan</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing || !data.agreement}
                                            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50"
                                        >
                                            <Check className="w-4 h-4 stroke-[2.5]" />
                                            <span>{processing ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Contextual Info Rail (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-navy-950">Informasi Pendaftaran</h3>
                                    <p className="text-[11px] text-slate-500">{event.organizer}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="flex items-start gap-2.5">
                                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-slate-500 font-medium">Batas Waktu:</span>
                                        <p className="font-semibold text-slate-800">
                                            {new Date(event.registration_end_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                         <span className="text-slate-500 font-medium">Lokasi Turnamen:</span>
                                         <p className="font-semibold text-slate-800">{event.location}</p>
                                     </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-slate-500 font-medium">Sisa Kuota:</span>
                                        <p className="font-semibold text-slate-800">
                                            {Math.max(0, event.total_quota - event.registered_count)} peserta lagi
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step Hint */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                                <span className="font-bold text-navy-950 text-[11px] uppercase tracking-wider block">
                                    {currentStep === 1 && 'Petunjuk Biodata'}
                                    {currentStep === 2 && 'Petunjuk Foto'}
                                    {currentStep === 3 && 'Petunjuk Konfirmasi'}
                                </span>
                                <p className="leading-relaxed">
                                    {currentStep === 1 && 'Pastikan nama dan NIK sesuai dengan dokumen identitas resmi Anda.'}
                                    {currentStep === 2 && 'Gunakan pasfoto formal dengan latar polos agar kartu peserta Anda tercetak rapi.'}
                                    {currentStep === 3 && 'Periksa kembali data Anda. Setelah dikirim, Anda akan menerima nomor pendaftaran dan kode akses rahasia.'}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>Data NIK dienkripsi secara aman.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Crop Modal */}
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
