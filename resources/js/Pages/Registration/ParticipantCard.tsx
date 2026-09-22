import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Printer, Download, Image, ArrowLeft, Loader2 } from 'lucide-react';
import ParticipantCardDesign, {
    PARTICIPANT_CARD_HEIGHT,
    PARTICIPANT_CARD_WIDTH,
} from '@/Components/ParticipantCardDesign';

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
    const cardRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState<'pdf' | 'img' | null>(null);

    const exportCard = async (type: 'pdf' | 'img') => {
        setExporting(type);
        try {
            await document.fonts.ready;
            await Promise.all(
                Array.from(cardRef.current!.querySelectorAll('img')).map((image) =>
                    image.complete ? image.decode().catch(() => undefined) : new Promise<void>((resolve) => {
                        image.addEventListener('load', () => resolve(), { once: true });
                        image.addEventListener('error', () => resolve(), { once: true });
                    }),
                ),
            );

            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(cardRef.current!, {
                scale: 4,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: PARTICIPANT_CARD_WIDTH,
                height: PARTICIPANT_CARD_HEIGHT,
            });

            if (type === 'img') {
                const link = document.createElement('a');
                link.download = `kartu-peserta-${registration.registration_number}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } else {
                const { jsPDF } = await import('jspdf');
                // CR80 in mm: 85.6 × 54
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
                pdf.save(`kartu-peserta-${registration.registration_number}.pdf`);
            }
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="card-print-page min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
            <Head title={`Kartu Peserta — ${registration.registration_number}`} />

            {/* ── Toolbar (hidden on print) ── */}
            <div className="print:hidden w-full mb-6" style={{ maxWidth: 640 }}>
                <div className="flex items-center justify-between mb-3">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </button>

                    <span className="text-xs text-slate-500 font-mono">
                        CR80 • 85.6 × 54 mm • Landscape
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/10"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Cetak</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => exportCard('pdf')}
                        disabled={exporting !== null}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-semibold text-xs transition-all shadow-lg"
                    >
                        {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>Download PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => exportCard('img')}
                        disabled={exporting !== null}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-xs transition-all shadow-lg"
                    >
                        {exporting === 'img' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
                        <span>Download IMG</span>
                    </button>
                </div>
            </div>

            <div
                ref={cardRef}
                className="card-print-surface shadow-2xl print:shadow-none"
            >
                <ParticipantCardDesign
                    participant={{
                        registration_number: registration.registration_number,
                        full_name: registration.participant.full_name,
                        school_name: registration.participant.school_name,
                        primary_position: registration.primary_position,
                        photo_url: registration.photo_url,
                        qr_token: registration.qr_token,
                        event_name: registration.event_name,
                        location: registration.location,
                    }}
                />
            </div>

            <style>{`
                @media print {
                    @page { size: 85.6mm 54mm; margin: 0; }
                    html, body, #app { width: 85.6mm !important; height: 54mm !important; margin: 0 !important; overflow: hidden !important; }
                    .card-print-page { width: 85.6mm !important; height: 54mm !important; min-height: 0 !important; display: block !important; overflow: hidden !important; }
                    .card-print-surface { width: 85.6mm !important; height: 54mm !important; margin: 0 !important; }
                    .participant-card-design { width: 85.6mm !important; height: 54mm !important; border: 0 !important; border-radius: 0 !important; }
                }
            `}</style>
        </div>
    );
}
