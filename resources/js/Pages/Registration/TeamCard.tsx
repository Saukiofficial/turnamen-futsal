import React from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Shield, ArrowLeft, Users, School, Phone, Award } from 'lucide-react';

interface TeamCardProps {
    team: {
        registration_number: string;
        team_name: string;
        school_name: string;
        head_coach: string;
        manager_name: string;
        manager_phone: string;
        logo_url: string | null;
        qr_token: string;
        event_name: string;
        organizer: string;
        location: string;
        verification_status: string;
    };
}

export default function TeamCard({ team }: TeamCardProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white text-slate-800">
            <Head title={`Kartu Akreditasi Tim - ${team.registration_number}`} />

            {/* Non-printable action toolbar */}
            <div className="w-full max-w-md mb-4 flex items-center justify-between print:hidden">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </button>

                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-navy-950 font-bold text-xs hover:bg-amber-400 shadow transition-all"
                >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Kartu Akreditasi Tim</span>
                </button>
            </div>

            {/* Printable Team Accreditation ID Card */}
            <div className="w-full max-w-md bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden print:border print:shadow-none print:max-w-none print:w-[100mm] print:m-auto">
                {/* Header Navy Band */}
                <div className="bg-navy-950 text-white px-5 py-4 flex items-center justify-between border-b-2 border-amber-500">
                    <div className="flex items-center gap-2.5">
                        <img 
                            src="/images/saf_league_logo.png" 
                            alt="SAF League" 
                            className="w-10 h-10 object-contain drop-shadow shrink-0" 
                        />
                        <div>
                            <h1 className="text-xs font-black uppercase tracking-wider text-white">AKREDITASI TIM RESMI</h1>
                            <p className="text-[9px] text-amber-400 font-bold uppercase tracking-tight">SAF LEAGUE FUTSAL 2026</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        OFFICIAL TEAM
                    </span>
                </div>

                {/* Subheader Event */}
                <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-navy-950 truncate max-w-[220px]">{team.event_name}</span>
                    <span className="font-mono font-bold text-amber-600">{team.registration_number}</span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-xs">
                            {team.logo_url ? (
                                <img src={team.logo_url} alt={team.team_name} className="w-full h-full object-contain" />
                            ) : (
                                <Users className="w-10 h-10 text-slate-400" />
                            )}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">KONTINGEN SEKOLAH</span>
                            <h2 className="text-lg font-black text-navy-950 truncate leading-tight">{team.team_name}</h2>
                            <p className="text-xs text-slate-600 flex items-center gap-1 font-medium truncate">
                                <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{team.school_name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Team Officials Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Head Coach</span>
                            <span className="font-bold text-slate-800 truncate block">{team.head_coach}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Manager Team</span>
                            <span className="font-bold text-slate-800 truncate block">{team.manager_name}</span>
                        </div>
                    </div>

                    {/* QR Code and Instructions */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                        <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0 shadow-xs">
                            <QRCodeSVG value={team.qr_token || team.registration_number} size={68} level="M" />
                        </div>
                        <div className="space-y-1 text-[10px] text-slate-500 leading-tight">
                            <p className="font-bold text-slate-700">Akreditasi Meja Pertandingan</p>
                            <p>Tunjukkan kartu ini kepada Pengawas Pertandingan (Match Commissioner) sebelum kick-off.</p>
                            <p className="text-amber-700 font-mono font-bold">Venue: {team.location}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Security Strip */}
                <div className="bg-slate-100 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Shield className="w-3 h-3 text-emerald-600" />
                        <span>Dokumen Sah Panitia Turnamen</span>
                    </span>
                    <span className="font-mono text-slate-400">{team.registration_number}</span>
                </div>
            </div>
        </div>
    );
}
