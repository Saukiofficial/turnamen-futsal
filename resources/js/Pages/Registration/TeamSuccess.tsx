import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { QRCodeSVG } from 'qrcode.react';
import { 
    CheckCircle2, 
    Copy, 
    Check, 
    ArrowRight, 
    FileText, 
    CreditCard, 
    ShieldCheck, 
    Users, 
    Home,
    School,
    Phone,
    UserCheck,
    Download
} from 'lucide-react';

interface TeamSuccessProps {
    team: {
        registration_number: string;
        access_code: string;
        team_name: string;
        school_name: string;
        head_coach: string;
        manager_name: string;
        manager_phone: string;
        submitted_at: string;
        logo_url: string | null;
        event_name: string;
        organizer: string;
        location: string;
        verification_status: string;
    };
}

export default function TeamSuccess({ team }: TeamSuccessProps) {
    const [copiedReg, setCopiedReg] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const copyToClipboard = (text: string, type: 'reg' | 'code') => {
        navigator.clipboard.writeText(text);
        if (type === 'reg') {
            setCopiedReg(true);
            setTimeout(() => setCopiedReg(false), 2000);
        } else {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title={`Pendaftaran Tim Berhasil - ${team.registration_number}`} />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8">
                {/* Header Banner */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        PENDAFTARAN TIM RESMI BERHASIL
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                        Data Tim {team.team_name} Berhasil Diterima
                    </h1>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto">
                        Panitia akan memvalidasi berkas Surat Rekomendasi Sekolah & daftar NISN pemain. Simpan nomor pendaftaran dan kode akses di bawah ini.
                    </p>
                </div>

                {/* Important Credentials Block */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nomor Registrasi Tim */}
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-2">
                            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                                Nomor Pendaftaran Tim
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-mono font-black text-amber-700">
                                    {team.registration_number}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(team.registration_number, 'reg')}
                                    className="p-1.5 text-amber-700 hover:text-amber-900 rounded hover:bg-amber-100 transition-colors"
                                    title="Salin Nomor Registrasi"
                                >
                                    {copiedReg ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Kode Akses Rahasia */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Kode Akses Rahasia (Manager)
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-mono font-bold text-slate-800 tracking-wider">
                                    {team.access_code}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(team.access_code, 'code')}
                                    className="p-1.5 text-slate-500 hover:text-brand-600 rounded hover:bg-slate-200 transition-colors"
                                    title="Salin Kode Akses"
                                >
                                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <strong className="font-semibold">Catat Kode Akses Anda!</strong> Kode akses ini bersifat rahasia dan wajib digunakan untuk memeriksa status validasi berkas tim di menu <strong>Cek Status</strong>.
                        </div>
                    </div>
                </div>

                {/* Team Detail Summary Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-200">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                            {team.logo_url ? (
                                <img src={team.logo_url} alt={team.team_name} className="w-full h-full object-contain" />
                            ) : (
                                <Users className="w-10 h-10 text-slate-400" />
                            )}
                        </div>
                        <div className="space-y-1 text-center sm:text-left flex-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                                Status: Menunggu Verifikasi Panitia
                            </span>
                            <h2 className="text-xl font-bold text-navy-950">{team.team_name}</h2>
                            <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1">
                                <School className="w-3.5 h-3.5 text-slate-400" />
                                <span>{team.school_name}</span>
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <QRCodeSVG value={team.registration_number} size={70} level="M" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block mb-0.5 font-medium">Head Coach</span>
                            <span className="font-bold text-slate-800 text-sm">{team.head_coach}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block mb-0.5 font-medium">Manager Team</span>
                            <span className="font-bold text-slate-800 text-sm">{team.manager_name}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block mb-0.5 font-medium">WhatsApp Manager</span>
                            <span className="font-bold font-mono text-slate-800 text-sm">{team.manager_phone}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <Link
                            href={route('home')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>

                        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
                            <Link
                                href={route('registration.check-status')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                                <span>Cek Status Validasi</span>
                            </Link>

                            <a
                                href={route('team.print-card', team.registration_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-navy-950 hover:bg-amber-400 font-bold text-xs shadow-sm transition-colors"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Cetak Kartu Akreditasi Tim</span>
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
