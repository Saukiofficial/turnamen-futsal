import React from 'react';
import { Head } from '@inertiajs/react';
import ParticipantCardDesign from '@/Components/ParticipantCardDesign';
import { Printer, ArrowLeft } from 'lucide-react';

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
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2 print:gap-[8mm] print:max-w-none">
                {registrations.map((reg) => (
                    <div
                        key={reg.id}
                        className="w-max mx-auto shadow-md rounded-[10px] print:shadow-none break-inside-avoid"
                    >
                        <ParticipantCardDesign participant={reg} />
                    </div>
                ))}
            </div>

            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 12mm; }
                    .participant-card-design { width: 85.6mm !important; height: 54mm !important; }
                }
            `}</style>
        </div>
    );
}
