import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Search, 
    UserPlus, 
    Menu, 
    X, 
    ArrowRight,
    ClipboardList,
    FileText,
    CalendarDays,
    Home as HomeIcon,
    Megaphone,
    Users,
    Trophy
} from 'lucide-react';

export default function Navbar() {
    const { url } = usePage();
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle Escape key to close mobile drawer
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && mobileDrawerOpen) {
                setMobileDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mobileDrawerOpen]);

    // Prevent body scroll when drawer open
    useEffect(() => {
        if (mobileDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileDrawerOpen]);

    const isHome = url === '/' || url === '';

    return (
        <>
            <header 
                className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 transition-shadow duration-200 ${
                    scrolled ? 'shadow-sm' : ''
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px] sm:h-[72px] gap-4">
                        {/* Kiri: Brand & Logo (100% immune from flex shrinking) */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link href={route('home')} className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg py-1 shrink-0">
                                <img 
                                    src="/images/saf_league_logo.png" 
                                    alt="SAF League" 
                                    className="h-10 sm:h-11 w-auto object-contain drop-shadow-xs transition-transform duration-150 group-hover:scale-105 shrink-0" 
                                />
                                <div className="flex flex-col shrink-0 whitespace-nowrap select-none">
                                    <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                                        SAF <span className="text-amber-500">LEAGUE</span>
                                    </span>
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 -mt-0.5 whitespace-nowrap">
                                        PORTAL TURNAMEN FUTSAL
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Tengah: Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium" aria-label="Navigasi Utama">
                            <Link 
                                href={route('home')} 
                                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                                    isHome 
                                        ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60' 
                                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                                }`}
                            >
                                Beranda
                            </Link>

                            <Link 
                                href={route('matches.index')} 
                                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                                    url.startsWith('/hasil-pertandingan') 
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs' 
                                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                                }`}
                            >
                                <span>Hasil Pertandingan</span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-2xs leading-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    Live
                                </span>
                            </Link>

                            <a 
                                href="/#alur" 
                                className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors whitespace-nowrap"
                            >
                                Alur Pendaftaran
                            </a>

                            <a 
                                href="/#persyaratan" 
                                className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors whitespace-nowrap"
                            >
                                Ketentuan & Syarat
                            </a>

                            <a 
                                href="/#jadwal" 
                                className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors whitespace-nowrap"
                            >
                                Jadwal Turnamen
                            </a>
                        </nav>

                        {/* Kanan: Desktop Action Buttons (Hanya Cek Status) */}
                        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
                            <Link
                                href={route('registration.check-status')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 hover:text-navy-950 transition-all shadow-2xs whitespace-nowrap shrink-0"
                            >
                                <Search className="w-3.5 h-3.5 text-slate-500" />
                                <span>Cek Status</span>
                            </Link>
                        </div>

                        {/* Kanan: Tablet & Mobile Action Compact */}
                        <div className="flex items-center lg:hidden gap-2 shrink-0">
                            <Link
                                href={route('registration.check-status')}
                                className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white whitespace-nowrap shrink-0"
                                aria-label="Cek Status Pendaftaran"
                            >
                                <Search className="w-3.5 h-3.5 text-slate-500" />
                                <span>Cek Status</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileDrawerOpen(true)}
                                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 shrink-0"
                                aria-label="Buka Menu Navigasi"
                                aria-expanded={mobileDrawerOpen}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Slide-Over Navigation Drawer */}
            {mobileDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
                    {/* Backdrop overlay */}
                    <div 
                        className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity" 
                        onClick={() => setMobileDrawerOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
                        {/* Drawer Header */}
                        <div className="h-[68px] px-6 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <img 
                                    src="/images/saf_league_logo.png" 
                                    alt="SAF League" 
                                    className="h-8 w-auto object-contain" 
                                />
                                <span className="font-black text-ink text-base tracking-tight">SAF <span className="text-amber-500">LEAGUE</span></span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
                                aria-label="Tutup Menu Navigasi"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawer Links */}
                        <nav className="flex-1 px-5 py-6 space-y-1.5 overflow-y-auto">
                            <Link
                                href={route('home')}
                                onClick={() => setMobileDrawerOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                                    isHome ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <HomeIcon className="w-4 h-4 text-brand-600" />
                                <span>Beranda</span>
                            </Link>

                            <a
                                href="/#alur"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <ClipboardList className="w-4 h-4 text-slate-400" />
                                <span>Alur Pendaftaran</span>
                            </a>

                            <a
                                href="/#persyaratan"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span>Ketentuan & Syarat</span>
                            </a>

                            <a
                                href="/#jadwal"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <CalendarDays className="w-4 h-4 text-slate-400" />
                                <span>Jadwal Turnamen</span>
                            </a>

                            <Link
                                href={route('matches.index')}
                                onClick={() => setMobileDrawerOpen(false)}
                                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                                    url.startsWith('/hasil-pertandingan') ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span>Hasil Pertandingan</span>
                                </div>
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </Link>
                        </nav>

                        {/* Drawer Bottom Actions */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-2.5">
                            <Link
                                href={route('team.create')}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="w-full flex items-center justify-center gap-2 h-11 text-sm font-bold rounded-xl bg-amber-500 text-navy-950 hover:bg-amber-400 shadow-sm transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                <span>Daftar Tim Futsal</span>
                            </Link>

                            <Link
                                href={route('registration.create')}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="w-full flex items-center justify-center gap-2 h-11 text-sm font-bold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-colors"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Daftar Pemain Individu</span>
                            </Link>

                            <Link
                                href={route('registration.check-status')}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="w-full flex items-center justify-center gap-2 h-10 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                                <Search className="w-3.5 h-3.5 text-slate-500" />
                                <span>Cek Status & Unduh Kartu</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
