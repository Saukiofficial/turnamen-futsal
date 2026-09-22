import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { 
    CalendarDays, 
    MapPin, 
    Clock3, 
    Users, 
    ArrowRight, 
    UserPlus, 
    Search, 
    Check, 
    ShieldCheck, 
    BadgeCheck, 
    QrCode, 
    ChevronRight,
    Megaphone,
    FileText,
    CheckCircle2,
    Trophy,
    School,
    FileCheck
} from 'lucide-react';

interface PositionQuota {
    id: number;
    name: string;
    quota: number;
    filled: number;
    percentage: number;
}

interface HomeProps {
    event: {
        id: number;
        name: string;
        code: string;
        slug: string;
        description: string;
        organizer: string;
        location: string;
        status: string;
        registration_start_at: string;
        registration_end_at: string;
        selection_start_at?: string;
        selection_end_at?: string;
        total_quota: number;
        positions?: PositionQuota[];
    } | null;
    stats: {
        registered_count: number;
        total_quota: number;
        days_remaining: number;
        is_open: boolean;
        positions: PositionQuota[];
    } | null;
    announcements: {
        id: number;
        title: string;
        slug: string;
        excerpt?: string;
        content: string;
        publish_at: string;
    }[];
}

export default function Home({ event, stats, announcements }: HomeProps) {
    const totalQuota = stats?.total_quota || event?.total_quota || 200;
    const registeredCount = stats?.registered_count || 0;
    const quotaPercentage = totalQuota > 0 ? Math.min(100, Math.round((registeredCount / totalQuota) * 100)) : 0;
    const isOpen = stats ? stats.is_open : event?.status === 'open';
    const isFull = registeredCount >= totalQuota && totalQuota > 0;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    };

    const registrationStartDateFormatted = formatDate(event?.registration_start_at);
    const registrationEndDateFormatted = formatDate(event?.registration_end_at);
    const selectionStartDateFormatted = formatDate(event?.selection_start_at);

    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-text antialiased selection:bg-brand-600 selection:text-white">
            <Head title="SAF LEAGUE — Portal Turnamen Futsal Resmi" />
            <Navbar />

            {/* ========================================================= */}
            {/* 1. HERO SECTION (Matching SAF League Official Mockup)      */}
            {/* ========================================================= */}
            <section className="relative bg-page border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
                {/* Hero Background Futsal Arena Photography with Match Ball */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                    <picture>
                        <source srcSet="/images/hero_futsal_banner.webp" type="image/webp" />
                        <img 
                            src="/images/hero_futsal_banner.jpg" 
                            alt="Latar Arena Futsal SAF League" 
                            className="w-full h-full object-cover object-right-bottom sm:object-right"
                            loading="eager"
                            fetchPriority="high"
                        />
                    </picture>
                    {/* Smooth soft white fade on the left so typography is 100% legible */}
                    <div className="absolute inset-0 bg-gradient-to-r from-page via-page/95 sm:via-page/85 via-45% to-transparent hidden sm:block" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/80 sm:hidden" />
                </div>

                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                        
                        {/* Kolom Kiri: Copywriting & CTA (7 Cols) */}
                        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                            
                            {/* Eyebrow & Status Baris Bersama */}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xs font-black tracking-wider text-brand-600 uppercase">
                                    PENDAFTARAN RESMI
                                </span>

                                {isOpen && !isFull ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Pendaftaran Dibuka</span>
                                    </span>
                                ) : isFull ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                                        <span>Kuota Penuh</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                                        <span>Pendaftaran Ditutup</span>
                                    </span>
                                )}
                            </div>

                            {/* Heading Utama (54-60px desktop) */}
                            <h1 className="text-[34px] sm:text-5xl lg:text-[56px] font-black tracking-tight text-slate-900 leading-[1.08]">
                                {event ? event.name : 'SAF League — Turnamen Futsal 2026'}
                            </h1>

                            {/* Deskripsi */}
                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                                {event?.description || 'Turnamen resmi kompetisi futsal untuk mencari talenta terbaik dan membangun generasi futsal masa depan.'}
                            </p>

                            {/* Metadata Tanggal & Lokasi (Single line on desktop) */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-6 text-sm text-slate-600 pt-1">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
                                    <span>Pendaftaran Dibuka s/d <strong className="font-semibold text-slate-900">{registrationEndDateFormatted}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                                    <span className="font-medium text-slate-700">{event?.location || 'GOR Futsal Sport Hall'}</span>
                                </div>
                            </div>

                            {/* Tombol CTA Dual: Tahap 1 Individu & Tahap 2 Tim */}
                            <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                <Link
                                    href={route('registration.create')}
                                    className="h-12 px-3 sm:px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span className="sm:hidden">Daftar Pemain</span>
                                    <span className="hidden sm:inline">Tahap 1: Daftar Pemain</span>
                                </Link>

                                <Link
                                    href={route('team.create')}
                                    className="h-12 px-3 sm:px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="sm:hidden">Daftar Tim</span>
                                    <span className="hidden sm:inline">Tahap 2: Daftar Tim</span>
                                    <ArrowRight className="w-4 h-4 hidden sm:block" />
                                </Link>

                                <Link
                                    href={route('matches.index')}
                                    className="col-span-2 h-12 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs sm:col-span-1"
                                >
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span>Bagan Laga</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </Link>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500 pt-0.5">
                                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Alur Terhubung: Pemain (Tahap 1) → Tim Sekolah (Tahap 2)
                                </span>
                                <span className="hidden sm:inline text-slate-300">•</span>
                                <Link href={route('registration.check-status')} className="hover:text-brand-600 flex items-center gap-1.5 font-semibold underline underline-offset-4">
                                    <Search className="w-3.5 h-3.5" />
                                    <span>Cek Status & Cetak Kartu</span>
                                </Link>
                            </div>

                            {/* Tagline Motto Under Buttons */}
                            <div className="flex items-center gap-3 pt-3">
                                <div className="w-8 h-1 bg-amber-500 rounded-full shrink-0" />
                                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                    DISCIPLINE • TEAMWORK • A STRONGER TOMORROW
                                </span>
                            </div>
                        </div>

                        {/* Kolom Kanan: Panel Kuota (5 Cols) - Deep Navy Floating Box */}
                        <div className="lg:col-span-5 flex justify-end">
                            <div className="w-full max-w-[440px] bg-navy-950 text-white rounded-xl border border-navy-800/90 p-6 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xs space-y-5">
                                {/* Subtle Court Geometry */}
                                <div 
                                    className="absolute -right-16 -top-16 w-52 h-52 rounded-full border border-white/5 pointer-events-none"
                                />

                                {/* Header Kuota & Sisa Hari */}
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-navy-900/90 flex items-center justify-center text-brand-400">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Kapasitas Pendaftar
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                                        <Clock3 className="w-3.5 h-3.5" />
                                        <span>{stats?.days_remaining ?? 20} hari tersisa</span>
                                    </div>
                                </div>

                                {/* Angka Utama Tabular */}
                                <div className="space-y-1.5 relative z-10">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black tracking-tight text-white font-sans">
                                            {registeredCount}
                                        </span>
                                        <span className="text-slate-400 text-xs sm:text-sm font-medium">
                                            dari <span className="text-slate-200">{totalQuota}</span> kuota
                                        </span>
                                        <span className="ml-auto text-base font-bold text-white font-mono">
                                            {quotaPercentage}%
                                        </span>
                                    </div>

                                    {/* Progress Bar Tipis */}
                                    <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${Math.max(1, quotaPercentage)}%` }}
                                            role="progressbar"
                                            aria-valuenow={quotaPercentage}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label="Persentase kuota terisi"
                                        />
                                    </div>
                                </div>

                                {/* Divider & Bagian Bawah Panel */}
                                <div className="border-t border-navy-800/90 pt-4 relative z-10">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                                        <span>KETERSEDIAAN KUOTA PENDAFTAR</span>
                                    </div>

                                    {/* Dua Kolom: Quote/Status & Brand Motto */}
                                    <div className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-8 flex items-start gap-2.5">
                                            <div className="w-1 h-9 bg-amber-500 rounded-full shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-300 leading-snug">
                                                Saatnya tunjukkan kemampuan terbaikmu di lapangan.
                                            </p>
                                        </div>
                                        <div className="col-span-4 text-right">
                                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase leading-tight block font-mono">
                                                MORE<br />THAN A GAME<br />A BRIGHTER<br />GENERATION
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rincian Posisi jika tersedia */}
                                    {stats?.positions && stats.positions.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-navy-900/80 grid grid-cols-4 gap-1.5 text-center text-[10px]">
                                            {stats.positions.map((pos) => (
                                                <div key={pos.id} className="p-1 rounded bg-navy-900/60 border border-navy-800/60">
                                                    <div className="text-slate-400 font-medium truncate">{pos.name}</div>
                                                    <div className="text-white font-mono font-bold">{pos.filled}/{pos.quota}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Facts Strip (3 Kolom Bersih) */}
                    <div className="hidden sm:grid grid-cols-3 bg-white rounded-xl border border-slate-200 mt-12 divide-x divide-slate-100 shadow-xs">
                        <div className="p-5 flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                <CalendarDays className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Pendaftaran Dibuka</span>
                                <span className="text-sm font-bold text-ink">{event?.registration_start_at ? registrationStartDateFormatted : '10 Oktober 2026'}</span>
                            </div>
                        </div>

                        <div className="p-5 flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Lokasi Turnamen</span>
                                <span className="text-sm font-bold text-ink truncate max-w-[220px]">{event?.location || 'GOR Futsal Sport Hall'}</span>
                            </div>
                        </div>

                        <div className="p-5 flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Kartu QR</span>
                                <span className="text-sm font-bold text-ink">Diterbitkan setelah lolos administrasi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 2. SECTION TAHAPAN PENDAFTARAN & TURNAMEN (Timeline)      */}
            {/* ========================================================= */}
            <section id="alur" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="max-w-2xl mb-12 sm:mb-16">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">
                            ALUR PENDAFTARAN TURNAMEN
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
                            Alur Pendaftaran 2-Tahap Terhubung
                        </h2>
                        <p className="text-base text-slate-600 leading-relaxed">
                            Proses pendaftaran dirancang berjenjang dan transparan: atlet mendaftar mandiri terlebih dahulu, kemudian official mendaftarkan tim dan mencocokkan skuad via NISN.
                        </p>
                    </div>

                    {/* Desktop Horizontal Timeline (>= md) */}
                    <div className="hidden md:block relative">
                        {/* Connecting Line */}
                        <div 
                            className="absolute top-6 left-8 right-8 h-[2px] bg-slate-200 pointer-events-none" 
                            aria-hidden="true"
                        />

                        <div className="grid grid-cols-4 gap-8 relative z-10">
                            {/* Step 01 */}
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-mono font-bold text-sm flex items-center justify-center ring-8 ring-white shadow-xs">
                                    01
                                </div>
                                <div className="space-y-1.5 pr-2">
                                    <h3 className="text-base font-bold text-ink">Tahap 1: Registrasi Pemain</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Seluruh atlet/pemain perwakilan sekolah wajib mendaftar individu terlebih dahulu dengan <strong>10 digit NISN</strong>, pasfoto 3×4, dan posisi bermain.
                                    </p>
                                </div>
                            </div>

                            {/* Step 02 */}
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-amber-500 text-navy-950 font-mono font-bold text-sm flex items-center justify-center ring-8 ring-white shadow-xs">
                                    02
                                </div>
                                <div className="space-y-1.5 pr-2">
                                    <h3 className="text-base font-bold text-ink">Tahap 2: Registrasi Tim</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Official/Coach mendaftarkan tim, mengunggah Surat Rekomendasi & Logo, serta menginput NISN skuad pemain (sistem mencocokkan otomatis ke Tahap 1).
                                    </p>
                                </div>
                            </div>

                            {/* Step 03 */}
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-mono font-bold text-sm flex items-center justify-center ring-8 ring-white">
                                    03
                                </div>
                                <div className="space-y-1.5 pr-2">
                                    <h3 className="text-base font-bold text-ink">Verifikasi Dokumen & Skuad</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Panitia memvalidasi keabsahan Surat Rekomendasi Sekolah dan kelengkapan skuad pemain. Status dapat dipantau di menu Cek Status.
                                    </p>
                                </div>
                            </div>

                            {/* Step 04 */}
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-mono font-bold text-sm flex items-center justify-center ring-8 ring-white">
                                    04
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-base font-bold text-ink">Kartu Akreditasi & Bagan Laga</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Setelah lolos administrasi, cetak <strong>Kartu Akreditasi Tim & ID Card</strong> ber-QR token, dan tim siap bertanding pada bagan turnamen sistem gugur.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Vertical Timeline (< md) */}
                    <div className="md:hidden relative pl-8 border-l-2 border-slate-200 ml-4 space-y-8">
                        {/* Step 01 */}
                        <div className="relative space-y-1">
                            <span className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-brand-600 text-white font-mono font-bold text-xs flex items-center justify-center ring-4 ring-white">
                                01
                            </span>
                            <h3 className="text-base font-bold text-ink">Tahap 1: Registrasi Pemain (NISN)</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Seluruh atlet mendaftar mandiri via 10 digit NISN, pasfoto 3×4, dan posisi futsal.
                            </p>
                        </div>

                        {/* Step 02 */}
                        <div className="relative space-y-1">
                            <span className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-amber-500 text-navy-950 font-mono font-bold text-xs flex items-center justify-center ring-4 ring-white">
                                02
                            </span>
                            <h3 className="text-base font-bold text-ink">Tahap 2: Registrasi Tim Sekolah</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Official sekolah mendaftarkan tim, mengunggah surat rekomendasi & menginput NISN skuad pemain.
                            </p>
                        </div>

                        {/* Step 03 */}
                        <div className="relative space-y-1">
                            <span className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-mono font-bold text-xs flex items-center justify-center ring-4 ring-white">
                                03
                            </span>
                            <h3 className="text-base font-bold text-ink">Verifikasi Dokumen & Skuad</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Validasi dokumen rekomendasi sekolah & kecocokan data pemain oleh panitia pelaksana.
                            </p>
                        </div>

                        {/* Step 04 */}
                        <div className="relative space-y-1">
                            <span className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-mono font-bold text-xs flex items-center justify-center ring-4 ring-white">
                                04
                            </span>
                            <h3 className="text-base font-bold text-ink">Kartu Akreditasi & Bagan Laga</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Cetak Kartu Akreditasi Tim dan pantau posisi tim pada bagan pertandingan sistem gugur secara realtime.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 3. SECTION KETENTUAN & SYARAT PENDAFTARAN (2 TAHAP)       */}
            {/* ========================================================= */}
            <section id="persyaratan" className="py-16 sm:py-20 lg:py-24 bg-section-soft border-b border-slate-200/80">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Header Section */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">
                            KETENTUAN & PERSYARATAN RESMI
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
                            Ketentuan 2 Tahap Pendaftaran Turnamen
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            Turnamen Futsal SAF League menggunakan mekanisme pendaftaran berjenjang terhubung: Pemain mendaftar mandiri (Tahap 1) sebelum Official mendaftarkan tim & memasukkan NISN skuad (Tahap 2).
                        </p>
                    </div>

                    {/* Dual Cards Grid: Tahap 1 Individu vs Tahap 2 Tim */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        
                        {/* CARD 1: TAHAP 1 - PENDAFTARAN PEMAIN INDIVIDU */}
                        <div className="bg-white rounded-2xl border-2 border-brand-300 p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-bl-full pointer-events-none" />

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-600 text-white">
                                        LANGKAH 1 (WAJIB BAGI ATLET)
                                    </span>
                                    <UserPlus className="w-6 h-6 text-brand-600" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-navy-950">
                                        Tahap 1: Pendaftaran Pemain Individu
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        Wajib diselesaikan oleh seluruh atlet/siswa perwakilan sekolah sebelum official mendaftarkan tim.
                                    </p>
                                </div>

                                {/* Syarat-syarat Individu */}
                                <div className="space-y-3.5 pt-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Nomor Induk Siswa Nasional (NISN)</strong>
                                            <p className="text-slate-600">Cukup masukkan 10 digit NISN aktif. Tidak perlu mengunggah scan KTP atau KK.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Pasfoto Formal Rasio 3×4</strong>
                                            <p className="text-slate-600">Foto formal wajah jelas format JPG/PNG dengan fitur crop interaktif otomatis.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Pilihan Posisi Futsal</strong>
                                            <p className="text-slate-600">Pilih posisi spesialisasi: Goalkeeper, Anchor, Flank, atau Pivot.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Otomatis Terhubung ke Tim</strong>
                                            <p className="text-slate-600">Data pemain tersimpan di database sistem dan siap dicocokkan saat pelatih menginput NISN di Tahap 2.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 relative z-10">
                                <Link
                                    href={route('registration.create')}
                                    className="w-full h-12 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>1. Isi Formulir Pemain Individu (Tahap 1)</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* CARD 2: TAHAP 2 - PENDAFTARAN TIM (SEKOLAH) */}
                        <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                            
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-navy-950">
                                        LANGKAH 2 (OFFICIAL SEKOLAH)
                                    </span>
                                    <Users className="w-6 h-6 text-amber-500" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-navy-950">
                                        Tahap 2: Pendaftaran Tim Futsal Sekolah
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        Diisi oleh Head Coach / Manager setelah seluruh pemain (minimal 5 atlet) selesai mendaftar di Tahap 1.
                                    </p>
                                </div>

                                {/* Syarat-syarat Tim */}
                                <div className="space-y-3.5 pt-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <FileCheck className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Surat Rekomendasi & NISN Peserta (1 File)</strong>
                                            <p className="text-slate-600">Surat izin resmi dari Kepala Sekolah & lampiran daftar NISN seluruh pemain dijadikan satu file (PDF / Gambar maks 5 MB).</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <School className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Logo Sekolah / Tim</strong>
                                            <p className="text-slate-600">Logo resmi dalam format PNG transparan atau JPG beresolusi jelas (maks 2 MB).</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Head Coach & Manager Team</strong>
                                            <p className="text-slate-600">Nama pelatih kepala dan manager tim resmi beserta nomor WhatsApp aktif untuk koordinasi teknis.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs space-y-0.5">
                                            <strong className="font-bold text-slate-900 block">Daftar Skuad Pemain via NISN</strong>
                                            <p className="text-slate-600">Input minimal 5 hingga maksimal 14 NISN pemain. Sistem mencocokkan otomatis & menampilkan data foto pemain.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 relative z-10">
                                <Link
                                    href={route('team.create')}
                                    className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>2. Isi Formulir Tim Sekolah (Tahap 2)</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Banner Live Match Bracket Shortcut */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-navy-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-navy-800">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-navy-950 flex items-center justify-center shrink-0 shadow-md">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">BAGAN TURNAMEN LIVE</span>
                                </div>
                                <h4 className="text-lg sm:text-xl font-bold text-white">
                                    Lihat Bagan Gugur & Hasil Pertandingan Real-Time
                                </h4>
                                <p className="text-xs text-slate-300">
                                    Pantau tim yang gugur dan tim yang lolos ke semifinal hingga mahkota juara turnamen.
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route('matches.index')}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-950 hover:bg-slate-100 font-bold text-xs shrink-0 transition-colors shadow-sm"
                        >
                            <span>Buka Bagan & Hasil Laga</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* ========================================================= */}
            {/* 4. SECTION JADWAL & AGENDA TURNAMEN                       */}
            {/* ========================================================= */}
            <section id="jadwal" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-12 sm:mb-16">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">
                            AGENDA RESMI
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
                            Jadwal & Agenda Turnamen
                        </h2>
                        <p className="text-base text-slate-600 leading-relaxed">
                            Pastikan Anda mencatat tanggal-tanggal penting berikut agar tidak tertinggal jadwal turnamen.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Item 1 */}
                        <div className="p-6 rounded-xl border border-slate-200 bg-page space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                                01
                            </div>
                            <h3 className="text-base font-bold text-ink">Masa Pendaftaran Online</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Pengisian formulir biodata dan upload pasfoto 3×4 melalui portal resmi. Ditutup pada <strong>{registrationEndDateFormatted}</strong>.
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div className="p-6 rounded-xl border border-slate-200 bg-page space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                                02
                            </div>
                            <h3 className="text-base font-bold text-ink">Verifikasi & Terbit Kartu</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Tim verifikator memvalidasi kelayakan berkas. Peserta lolos administrasi langsung dapat mengunduh kartu tanda peserta turnamen.
                            </p>
                        </div>

                        {/* Item 3 */}
                        <div className="p-6 rounded-xl border border-slate-200 bg-page space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                                03
                            </div>
                            <h3 className="text-base font-bold text-ink">Pelaksanaan Turnamen</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Dilaksanakan di <strong>{event?.location || 'GOR Futsal Sport Hall'}</strong> mulai tanggal <strong>{selectionStartDateFormatted}</strong>. Bawa kartu peserta ber-QR code.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 5. PENGUMUMAN TERBARU (Jika ada pengumuman publik)        */}
            {/* ========================================================= */}
            {announcements && announcements.length > 0 && (
                <section className="py-16 sm:py-20 bg-section-soft border-b border-slate-200/80">
                    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">
                                    INFORMASI RESMI
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                                    Pengumuman Terbaru
                                </h2>
                            </div>
                            <Link 
                                href={route('announcements.index')} 
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                            >
                                <span>Lihat Semua Pengumuman</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {announcements.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('announcements.show', item.slug)}
                                    className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            <span>{formatDate(item.publish_at)}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-ink line-clamp-2 hover:text-brand-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                            {item.excerpt || item.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    </div>

                                    <div className="pt-2 flex items-center gap-1 text-xs font-bold text-brand-600">
                                        <span>Baca Selengkapnya</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ========================================================= */}
            {/* 6. CONFIDENCE / TRUST STRIP (Section 11)                  */}
            {/* ========================================================= */}
            <section className="py-12 sm:py-14 bg-white border-b border-slate-200">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x divide-slate-100">
                        {/* Trust 1 */}
                        <div className="flex items-start gap-3.5 sm:px-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-ink">Data Aman Terlindungi</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    NIK dienkripsi standar AES-256 dan hash anti-duplikasi tanpa mengekspos identitas pribadi.
                                </p>
                            </div>
                        </div>

                        {/* Trust 2 */}
                        <div className="flex items-start gap-3.5 sm:px-6">
                            <BadgeCheck className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-ink">Verifikasi Transparan</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Pantau status kelulusan berkas dan catatan verifikator secara mandiri dengan kode akses unik.
                                </p>
                            </div>
                        </div>

                        {/* Trust 3 */}
                        <div className="flex items-start gap-3.5 sm:px-6">
                            <QrCode className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-ink">Kartu Peserta QR Unik</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Proses check-in turnamen di lapangan cepat dan akurat melalui pemindaian QR token pengenal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
