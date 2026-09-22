import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    ChartNoAxesColumnIncreasing,
    CircleAlert,
    Eye,
    EyeOff,
    FileCheck2,
    Loader2,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react';
import { FormEventHandler, KeyboardEvent, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);

    const handleKeyEvent = (e: KeyboardEvent<HTMLInputElement>) => {
        setCapsLockActive(e.getModifierState('CapsLock'));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const hasGlobalAuthError = Boolean(errors.email && (
        errors.email.toLowerCase().includes('tidak sesuai') ||
        errors.email.toLowerCase().includes('failed') ||
        errors.email.toLowerCase().includes('terlalu banyak') ||
        errors.email.toLowerCase().includes('throttle') ||
        errors.email.toLowerCase().includes('too many')
    ));

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-[#F7F7F5] flex flex-col lg:flex-row text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title="Masuk — Panel Admin SAF League" />

            {/* ========================================================= */}
            {/* PANEL KIRI: Brand & Atmosphere (Desktop & Tablet Besar)   */}
            {/* ========================================================= */}
            <aside
                className="hidden lg:flex lg:w-[54%] xl:w-[56%] relative bg-navy-950 text-white flex-col justify-between p-10 xl:p-16 overflow-hidden select-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(7, 19, 32, 0.86), rgba(7, 19, 32, 0.92)), url('/images/hero_futsal_court.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Header Brand: Logo & Title */}
                <div className="relative z-10 flex items-center gap-4">
                    <img
                        src="/images/saf_league_logo.png"
                        alt="SAF League"
                        className="h-16 w-16 xl:h-20 xl:w-20 object-contain drop-shadow-md"
                    />
                    <div className="h-10 w-px bg-white/20" />
                    <div>
                        <h2 className="text-xl xl:text-2xl font-bold tracking-wider text-white">
                            SAF LEAGUE
                        </h2>
                        <p className="text-[11px] xl:text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase">
                            Portal Turnamen Futsal
                        </p>
                    </div>
                </div>

                {/* Konten Utama Kiri: Headline & Value Proposition */}
                <div className="relative z-10 max-w-xl my-auto py-12">
                    {/* Amber Accent Bar */}
                    <div className="w-11 h-1 bg-[#D89A16] rounded-full mb-6" />

                    <span className="inline-block text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
                        PORTAL ADMINISTRASI TURNAMEN
                    </span>

                    <h1 className="text-3xl xl:text-[44px] font-bold text-white leading-[1.14] tracking-tight mb-4">
                        Kelola turnamen futsal dengan lebih terarah.
                    </h1>

                    <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-10">
                        Akses khusus panitia untuk memantau pendaftar, memverifikasi data,
                        mencetak kartu peserta, dan mengelola jalannya turnamen.
                    </p>

                    {/* 3 Value Pillars */}
                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-blue-300">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">
                                    Data peserta terlindungi
                                </h3>
                                <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                                    Enkripsi data pribadi dan kepatuhan privasi kandidat pendaftar turnamen.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-blue-300">
                                <FileCheck2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">
                                    Verifikasi terstruktur
                                </h3>
                                <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                                    Alur verifikasi berkas cepat dengan status real-time dan validasi data pemain.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-blue-300">
                                <ChartNoAxesColumnIncreasing className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">
                                    Aktivitas admin tercatat
                                </h3>
                                <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                                    Riwayat audit otomatis untuk setiap perubahan status dan pencetakan kartu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Panel Kiri */}
                <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Satu portal untuk seluruh penyelenggaraan turnamen.</span>
                    <span>&copy; {currentYear} SAF League</span>
                </div>
            </aside>

            {/* ========================================================= */}
            {/* HEADER MOBILE (< 1024px)                                  */}
            {/* ========================================================= */}
            <header
                className="lg:hidden relative bg-navy-950 text-white px-6 py-8 select-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(7, 19, 32, 0.88), rgba(7, 19, 32, 0.94)), url('/images/hero_futsal_court.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex items-center gap-3.5">
                    <img
                        src="/images/saf_league_logo.png"
                        alt="SAF League"
                        className="h-12 w-12 object-contain drop-shadow"
                    />
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.16em] text-blue-400 uppercase block">
                            PORTAL ADMINISTRASI TURNAMEN
                        </span>
                        <h2 className="text-lg font-bold tracking-wider text-white">
                            SAF LEAGUE
                        </h2>
                    </div>
                </div>
            </header>

            {/* ========================================================= */}
            {/* PANEL KANAN: Form Login Panitia Admin                     */}
            {/* ========================================================= */}
            <main className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-14 xl:px-20 overflow-y-auto">
                <div className="w-full max-w-[420px] mx-auto">
                    {/* Link Kembali ke Beranda */}
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-navy-950 transition-colors mb-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    {/* Logo SAF League Ringkas di atas form */}
                    <div className="mb-4">
                        <img
                            src="/images/saf_league_logo.png"
                            alt="SAF League"
                            className="h-14 w-14 object-contain"
                        />
                    </div>

                    {/* Heading Form */}
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-[0.15em] text-brand-700 uppercase block mb-1.5">
                            AKSES PANITIA
                        </span>
                        <h1 className="text-2xl sm:text-[30px] font-bold text-navy-950 tracking-tight leading-snug">
                            Masuk ke Panel Admin
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                            Gunakan akun yang telah diberikan oleh administrator.
                        </p>
                    </div>

                    {/* Session Status Banner (misal reset password berhasil) */}
                    {status && (
                        <div
                            role="status"
                            className="mb-5 p-3.5 rounded-[9px] bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5"
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{status}</span>
                        </div>
                    )}

                    {/* Alert Kredensial Tidak Valid / Rate Limit */}
                    {hasGlobalAuthError && (
                        <div
                            role="alert"
                            className="mb-5 p-3.5 rounded-[9px] bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700"
                        >
                            <div className="flex items-start gap-2.5">
                                <CircleAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-red-800">Login gagal</p>
                                    <p className="mt-0.5 text-xs text-red-700">
                                        {errors.email?.toLowerCase().includes('terlalu banyak') ||
                                        errors.email?.toLowerCase().includes('throttle') ||
                                        errors.email?.toLowerCase().includes('too many')
                                            ? errors.email
                                            : 'Email atau password yang Anda masukkan tidak sesuai.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Autentikasi */}
                    <form onSubmit={submit} className="space-y-4" noValidate>
                        {/* Field Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="nama@domain.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    className={`w-full h-12 pl-10 pr-4 rounded-[9px] border bg-white text-slate-900 text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                                        errors.email
                                            ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20'
                                            : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
                                    }`}
                                />
                            </div>
                            {errors.email && !hasGlobalAuthError && (
                                <p id="email-error" className="mt-1.5 text-xs text-red-600 font-medium">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Field Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-xs sm:text-sm font-semibold text-slate-800"
                                >
                                    Password
                                </label>
                                {capsLockActive && (
                                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        Caps Lock aktif
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <LockKeyhole className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    placeholder="Masukkan password Anda"
                                    onChange={(e) => setData('password', e.target.value)}
                                    onKeyDown={handleKeyEvent}
                                    onKeyUp={handleKeyEvent}
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    className={`w-full h-12 pl-10 pr-11 rounded-[9px] border bg-white text-slate-900 text-sm placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                                        errors.password
                                            ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20'
                                            : 'border-slate-300 focus:border-brand-600 focus:ring-brand-600/20'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-r-[9px]"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p id="password-error" className="mt-1.5 text-xs text-red-600 font-medium">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Lupa Password */}
                        <div className="flex items-center justify-between pt-1 pb-2">
                            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none py-1">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded-[4px] border-slate-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
                                />
                                <span className="text-xs sm:text-sm text-slate-600">Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs sm:text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Button Submit Masuk ke Panel */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 rounded-[9px] bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>Masuk ke Panel</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Catatan Keamanan */}
                    <div className="mt-6 pt-5 border-t border-slate-200/80 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Akses ini hanya untuk panitia yang berwenang.</span>
                    </div>

                    {/* Bantuan Support */}
                    <p className="mt-3 text-center text-[11px] sm:text-xs text-slate-400">
                        Mengalami kendala akses? Hubungi Super Admin
                    </p>
                </div>
            </main>
        </div>
    );
}
