import React from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Shield, ArrowLeft } from 'lucide-react';

interface ParticipantCardProps {
    registration: {
        registration_number: string;
        primary_position: string;
        qr_token: string;
        photo_url: string | null;
        event_name: string;
        organizer: string;
        location: string;
        selection_schedule: string;
        participant: {
            full_name: string;
            birth_place: string;
            birth_date: string;
            school_name: string;
        };
    };
}

export default function ParticipantCard({ registration }: ParticipantCardProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white text-slate-800">
            <Head title={`Kartu Peserta - ${registration.registration_number}`} />

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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 shadow transition-all"
                >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Kartu Peserta</span>
                </button>
            </div>

            {/* Printable ID Card Container (Standard ID Card Aspect Ratio ~85mm x 54mm or A6) */}
            <div className="w-full max-w-sm bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden print:border print:shadow-none print:max-w-none print:w-[90mm] print:m-auto">
                {/* Header Navy Band */}
                <div className="bg-navy-950 text-white px-5 py-4 flex items-center justify-between border-b-2 border-brand-500">
                    <div className="flex items-center gap-2.5">
                        <img 
                            src="/images/saf_league_logo.png" 
                            alt="SAF League" 
                            className="w-10 h-10 object-contain drop-shadow shrink-0" 
                        />
                        <div>
                            <h1 className="text-xs font-black uppercase tracking-wider text-white">KARTU PESERTA TURNAMEN</h1>
                            <p className="text-[9px] text-amber-400 font-bold uppercase tracking-tight">SAF LEAGUE FUTSAL</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        LOLOS ADM
                    </span>
                </div>

                {/* Subheader Event */}
                <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-navy-950 truncate max-w-[200px]">{registration.event_name}</span>
                    <span className="font-mono font-bold text-brand-600">{registration.registration_number}</span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                    <div className="flex items-start gap-4">
                        {/* 3x4 Photo */}
                        <div className="w-24 h-32 rounded-lg bg-slate-200 border-2 border-slate-300 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                            {registration.photo_url ? (
                                <img 
                                    src={registration.photo_url} 
                                    alt="Foto Peserta" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs text-slate-400">3×4</span>
                            )}
                        </div>

                        {/* Candidate Information */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Nama Lengkap</span>
                                <h2 className="text-sm font-bold text-navy-950 leading-tight truncate">
                                    {registration.participant.full_name}
                                </h2>
                            </div>

                            <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Posisi Futsal</span>
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                                    {registration.primary_position}
                                </span>
                            </div>

                            <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Asal Sekolah / Instansi</span>
                                <p className="text-[11px] text-slate-700 font-medium truncate">
                                    {registration.participant.school_name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Jadwal Turnamen:</span>
                            <span className="font-semibold text-slate-800">{registration.selection_schedule}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Lokasi / Venue:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px]">{registration.location}</span>
                        </div>
                    </div>

                    {/* QR Code & Token Footnote */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Verifikasi Check-in</span>
                            <p className="text-[10px] text-slate-600 font-mono">Pindai QR saat tiba di lokasi</p>
                        </div>
                        <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                            <QRCodeSVG value={registration.qr_token} size={54} />
                        </div>
                    </div>
                </div>

                {/* Footer notes */}
                <div className="bg-slate-50 px-5 py-2 border-t border-slate-200 text-[9px] text-slate-400 text-center">
                    Harap membawa kartu ini dan perlengkapan futsal lengkap saat hari turnamen.
                </div>
            </div>
        </div>
    );
}
