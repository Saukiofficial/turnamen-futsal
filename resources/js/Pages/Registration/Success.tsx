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
    Clock, 
    FileText, 
    CreditCard, 
    ShieldCheck, 
    Users, 
    AlertTriangle,
    Home
} from 'lucide-react';

interface SuccessProps {
    registration: {
        registration_number: string;
        access_code: string;
        primary_position: string;
        submitted_at: string;
        photo_url: string | null;
        event_name: string;
        organizer: string;
        location: string;
        verification_status: string;
        participant: {
            full_name: string;
            birth_place: string;
            birth_date: string;
            school_name: string;
        };
    };
}

export default function Success({ registration }: SuccessProps) {
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
            <Head title={`Pendaftaran Berhasil - ${registration.registration_number}`} />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8">
                {/* Header Banner */}
                <div className="text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        PENDAFTARAN BERHASIL
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                        Data Anda Berhasil Dikirimkan
                    </h1>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Panitia akan memeriksa biodata dan foto formal Anda. Pantau perkembangan melalui menu Cek Status.
                    </p>
                </div>

                {/* Important Credentials Block */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nomor Pendaftaran */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Nomor Pendaftaran
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-mono font-bold text-brand-600">
                                    {registration.registration_number}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(registration.registration_number, 'reg')}
                                    className="p-1.5 text-slate-500 hover:text-brand-600 rounded hover:bg-slate-200 transition-colors"
                                    title="Salin Nomor Pendaftaran"
                                >
                                    {copiedReg ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Kode Akses Rahasia */}
                        <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200 flex flex-col justify-between space-y-2">
                            <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                                Kode Akses Rahasia
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-mono font-bold text-navy-950 tracking-wider">
                                    {registration.access_code}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(registration.access_code, 'code')}
                                    className="p-1.5 text-slate-500 hover:text-brand-600 rounded hover:bg-brand-100 transition-colors"
                                    title="Salin Kode Akses"
                                >
                                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="text-amber-500 font-bold">PENTING:</span>
                        Simpan nomor pendaftaran dan kode akses di atas untuk mengecek status dan mengunduh kartu peserta resmi.
                    </p>
                </div>

                {/* 3-Stage Progress Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                        Status Proses Pendaftaran
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>1. Formulir Dikirim</span>
                            </div>
                            <p className="text-[11px] text-emerald-600">Pendaftaran diterima pada {registration.submitted_at}.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                                <Clock className="w-4 h-4 animate-spin text-blue-500" />
                                <span>2. Verifikasi Berkas</span>
                            </div>
                            <p className="text-[11px] text-blue-600">Sedang diperiksa oleh tim verifikator turnamen.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 opacity-60">
                            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                                <CreditCard className="w-4 h-4" />
                                <span>3. Kartu Peserta Resmi</span>
                            </div>
                            <p className="text-[11px] text-slate-500">Tersedia otomatis setelah dinyatakan Lolos Administrasi.</p>
                        </div>
                    </div>
                </div>

                {/* Preview Kartu Sementara */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-navy-950 text-white p-4 flex items-center justify-between border-b border-navy-900">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-brand-400" />
                            <span className="text-xs font-bold uppercase tracking-wider">Preview Kartu Sementara</span>
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            MENUNGGU VERIFIKASI
                        </span>
                    </div>

                    <div className="p-6">
                        <div className="max-w-md mx-auto bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-28 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 shadow-sm">
                                    {registration.photo_url ? (
                                        <img src={registration.photo_url} alt="Foto Peserta" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Foto 3×4</div>
                                    )}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <span className="text-[11px] font-mono font-bold text-brand-600">{registration.registration_number}</span>
                                    <h4 className="text-base font-bold text-navy-950">{registration.participant.full_name}</h4>
                                    <p className="text-xs text-slate-600">Posisi: <span className="font-semibold text-slate-900">{registration.primary_position}</span></p>
                                    <p className="text-xs text-slate-500">{registration.participant.school_name}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Kegiatan:</span>
                                    <span className="font-semibold text-slate-700">{registration.event_name}</span>
                                </div>
                                <div className="p-1.5 bg-white rounded border border-slate-200">
                                    <QRCodeSVG value={registration.registration_number} size={48} />
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-500 mt-4">
                            Kartu resmi siap cetak dapat diunduh setelah status verifikasi dinyatakan <strong>Lolos Administrasi</strong>.
                        </p>
                    </div>
                </div>

                {/* Bottom Navigation CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href={route('registration.check-status', {
                            registration_number: registration.registration_number,
                            access_code: registration.access_code,
                        })}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-sm transition-all"
                    >
                        <span>Cek Status Pendaftaran</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                        href={route('home')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition-all"
                    >
                        <Home className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
