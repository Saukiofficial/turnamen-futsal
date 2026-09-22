import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    LayoutDashboard, 
    ClipboardList, 
    Users, 
    FileCheck2, 
    CreditCard, 
    ScanLine, 
    BarChart3, 
    Trophy, 
    Megaphone, 
    FileBarChart, 
    UserCog, 
    History, 
    Settings, 
    Shield, 
    LogOut, 
    Menu, 
    X, 
    Bell, 
    ChevronDown, 
    CheckCircle2, 
    AlertCircle,
    User
} from 'lucide-react';

interface AdminShellProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: { label: string; href?: string }[];
}

export default function AdminShell({ children, title, breadcrumbs = [] }: AdminShellProps) {
    const page = usePage<PageProps>();
    const { auth, flash, allEvents, defaultEvent } = page.props;
    const url = page.url;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const user = auth.user;

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard },
        { name: 'Event Turnamen', href: route('admin.events.index'), icon: ClipboardList },
        { name: 'Pendaftar Tim', href: route('admin.teams.index'), icon: Users },
        { name: 'Pendaftar Individu', href: route('admin.registrants.index'), icon: User },
        { name: 'Verifikasi Berkas', href: route('admin.verification.index'), icon: FileCheck2 },
        { name: 'Bagan & Pertandingan', href: route('admin.matches.index'), icon: Trophy },
        { name: 'Kartu Peserta', href: route('admin.cards.index'), icon: CreditCard },
        { name: 'Check-in Turnamen', href: route('admin.checkin.index'), icon: ScanLine },
        { name: 'Penilaian Turnamen', href: route('admin.assessment.index'), icon: BarChart3 },
        { name: 'Pengumuman', href: route('admin.announcements.index'), icon: Megaphone },
        { name: 'Laporan', href: route('admin.reports.index'), icon: FileBarChart },
        { name: 'Pengguna Admin', href: route('admin.users.index'), icon: UserCog },
        { name: 'Audit Log', href: route('admin.audit-logs.index'), icon: History },
        { name: 'Pengaturan', href: route('admin.settings.index'), icon: Settings },
    ];

    const isCurrent = (href: string) => {
        const path = new URL(href, window.location.origin).pathname;
        if (path === '/admin' || path === '/admin/dashboard') {
            return url === '/admin' || url === '/admin/dashboard';
        }
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-page flex font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            {/* Desktop Sidebar (Fixed 248px) */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-navy-900 border-r border-slate-800 z-30 shadow-lg">
                {/* Brand */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-navy-950">
                    <img 
                        src="/images/saf_league_logo.png" 
                        alt="SAF League" 
                        className="w-9 h-9 object-contain drop-shadow" 
                    />
                    <div className="flex flex-col">
                        <span className="text-base font-black tracking-tight text-white">
                            SAF <span className="text-amber-400">LEAGUE</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-0.5">
                            Panel Pengelola
                        </span>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Menu Utama
                    </div>
                    {navigation.map((item) => {
                        const active = isCurrent(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    active
                                        ? 'bg-brand-600 text-white shadow-sm'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom User status */}
                <div className="p-3 border-t border-slate-800/80 bg-navy-950/60">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold uppercase">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-bold text-white truncate">{user?.name}</span>
                            <span className="text-[10px] text-brand-400 uppercase tracking-wider font-semibold capitalize truncate">
                                {user?.role?.replace('_', ' ') || 'Admin'}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
                    {/* Left: Mobile hamburger & Breadcrumbs */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileDrawerOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="text-slate-400">Admin</span>
                            {breadcrumbs.map((b, i) => (
                                <React.Fragment key={i}>
                                    <span className="text-slate-300">/</span>
                                    {b.href ? (
                                        <Link href={b.href} className="hover:text-brand-600 transition-colors">
                                            {b.label}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold text-slate-800">{b.label}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Right: Event tag & User Profile */}
                    <div className="flex items-center gap-4">
                        {defaultEvent && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-bold text-navy-950 truncate max-w-[200px]">{defaultEvent.name}</span>
                            </div>
                        )}

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <span className="hidden md:inline text-xs font-bold text-slate-700">{user?.name}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-fadeIn">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                    </div>

                                    <Link
                                        href={route('admin.profile.edit')}
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                                    >
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>Profil Akun</span>
                                    </Link>

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className="w-4 h-4 text-rose-500" />
                                        <span>Keluar (Logout)</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2 shadow-xs">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileDrawerOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div 
                        className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs transition-opacity" 
                        onClick={() => setMobileDrawerOpen(false)} 
                    />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-navy-900 border-r border-slate-800 shadow-2xl">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-navy-950">
                            <div className="flex items-center gap-2.5">
                                <img 
                                    src="/images/saf_league_logo.png" 
                                    alt="SAF League" 
                                    className="w-8 h-8 object-contain drop-shadow" 
                                />
                                <span className="text-base font-black text-white">SAF <span className="text-amber-400">LEAGUE</span></span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileDrawerOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                                        isCurrent(item.href)
                                            ? 'bg-brand-600 text-white'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
