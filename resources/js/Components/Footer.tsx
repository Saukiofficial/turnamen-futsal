import React from 'react';
import { Link } from '@inertiajs/react';
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight, Lock } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-navy-950 text-slate-400 border-t border-navy-800/80">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    {/* Kolom 1: Brand (4 Cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/images/saf_league_logo.png" 
                                alt="SAF League Logo" 
                                className="h-10 w-auto object-contain drop-shadow" 
                            />
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-tight text-white leading-tight">
                                    SAF <span className="text-amber-400">LEAGUE</span>
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-0.5">
                                    PORTAL TURNAMEN FUTSAL
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                            Platform turnamen futsal resmi kompetisi SAF League secara transparan, terintegrasi, dan berbasis digital.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Data pribadi peserta dienkripsi dengan standar AES-256.</span>
                        </div>
                    </div>

                    {/* Kolom 2: Navigasi (3 Cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigasi Portal</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href={route('home')} className="hover:text-white transition-colors">
                                    Beranda Pendaftaran
                                </Link>
                            </li>
                            <li>
                                <Link href={route('registration.create')} className="hover:text-white transition-colors">
                                    Formulir Pendaftaran
                                </Link>
                            </li>
                            <li>
                                <Link href={route('registration.check-status')} className="hover:text-white transition-colors">
                                    Cek Status & Perbaikan
                                </Link>
                            </li>
                            <li>
                                <Link href={route('announcements.index')} className="hover:text-white transition-colors">
                                    Pengumuman Turnamen
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 3: Bantuan & Kontak (3 Cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Pusat Bantuan</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-start gap-2.5">
                                <Mail className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                                <span>bantuan@futsalreg.test</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Phone className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                                <span>0812-3456-7890 (WhatsApp)</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                                <span>GOR Futsal Sport Hall</span>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 4: Akses Panitia (2 Cols) */}
                    <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Akses Petugas</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Khusus panitia, verifikator berkas, dan petugas turnamen.
                        </p>
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 border border-slate-700 text-white text-xs font-semibold transition-colors"
                        >
                            <span>Panel Admin</span>
                            <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-12 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} SAF League. Seluruh hak cipta dilindungi.</p>
                    <p className="text-slate-400">Dibangun untuk kemajuan olahraga futsal Indonesia.</p>
                </div>
            </div>
        </footer>
    );
}
