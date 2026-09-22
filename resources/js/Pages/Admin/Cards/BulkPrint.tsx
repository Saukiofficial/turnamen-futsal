import React from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft, Shield } from 'lucide-react';

interface BulkPrintProps {
    registrations: {
        id: number;
        registration_number: string;
        full_name: string;
        school_name: string;
        primary_position: string;
        photo_url: string | null;
        qr_token: string;
        event_name: string;
        organizer: string;
        location: string;
        selection_schedule: string;
    }[];
}

export default function BulkPrint({ registrations }: BulkPrintProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 print:p-0 print:bg-white text-slate-800">
            <Head title={`Cetak Massal (${registrations.length} Kartu)`} />

            {/* Non-printable action bar */}
            <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                </button>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                        {registrations.length} kartu siap dicetak
                    </span>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-700"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Mulai Cetak Semua Kartu</span>
                    </button>
                </div>
            </div>

            {/* Printable Grid of Cards */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:max-w-none">
                {registrations.map((reg) => (
                    <div
                        key={reg.id}
                        className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden print:border print:shadow-none break-inside-avoid"
                    >
                        <div className="bg-navy-950 text-white px-4 py-3 flex items-center justify-between border-b-2 border-brand-500">
                            <div className="flex items-center gap-2">
                                <img 
                                    src="/images/saf_league_logo.png" 
                                    alt="SAF League" 
                                    className="w-7 h-7 object-contain drop-shadow shrink-0" 
                                />
                                <span className="text-[11px] font-black uppercase tracking-wider">SAF LEAGUE FUTSAL</span>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                LOLOS ADM
                            </span>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-20 h-28 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                                    {reg.photo_url ? (
                                        <img src={reg.photo_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-slate-400">3×4</span>
                                    )}
                                </div>

                                <div className="space-y-1 min-w-0 flex-1 text-xs">
                                    <span className="font-mono font-bold text-brand-600 block text-[11px]">
                                        {reg.registration_number}
                                    </span>
                                    <h4 className="font-bold text-navy-950 text-sm truncate">{reg.full_name}</h4>
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                                        {reg.primary_position}
                                    </span>
                                    <p className="text-[11px] text-slate-500 truncate">{reg.school_name}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                <div className="text-[9px] text-slate-400">
                                    <p>{reg.event_name}</p>
                                </div>
                                <div className="p-1 bg-white rounded border border-slate-200">
                                    <QRCodeSVG value={reg.qr_token} size={42} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
