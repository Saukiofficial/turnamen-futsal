import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Image, ArrowLeft, Users, Shield, Loader2, School } from 'lucide-react';

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

// CR80: 85.6mm × 54mm landscape
const CARD_W = 323;
const CARD_H = 204;
const SCALE  = 3;

export default function TeamCard({ team }: TeamCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState<'pdf' | 'img' | null>(null);

    const exportCard = async (type: 'pdf' | 'img') => {
        setExporting(type);
        try {
            const { toPng } = await import('html-to-image');
            const imageData = await toPng(cardRef.current!, {
                pixelRatio: 2,
                cacheBust: true,
                backgroundColor: '#ffffff',
                width: CARD_W * SCALE,
                height: CARD_H * SCALE,
                skipAutoScale: true,
            });

            if (type === 'img') {
                const link = document.createElement('a');
                link.download = `kartu-tim-${team.registration_number}.png`;
                link.href = imageData;
                link.click();
            } else {
                const { jsPDF } = await import('jspdf');
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
                pdf.addImage(imageData, 'PNG', 0, 0, 85.6, 54);
                pdf.save(`kartu-tim-${team.registration_number}.pdf`);
            }
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="team-card-print-page min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-amber-950 flex flex-col items-center justify-center p-6 print:p-0 print:bg-white">
            <Head title={`Kartu Akreditasi Tim — ${team.registration_number}`} />

            {/* ── Toolbar ── */}
            <div className="print:hidden w-full mb-6" style={{ maxWidth: CARD_W * SCALE }}>
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
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-navy-950 font-semibold text-xs transition-all shadow-lg"
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

            {/* ── Team Accreditation Card (CR80 landscape) ── */}
            <div
                ref={cardRef}
                style={{
                    width:  CARD_W * SCALE,
                    height: CARD_H * SCALE,
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                }}
                className="team-card-print-surface print-color-exact relative bg-white overflow-hidden shadow-2xl print:shadow-none flex flex-col"
            >
                {/* ── Left gold/navy accent panel ── */}
                <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-navy-950 via-amber-700 to-navy-950"
                    style={{ width: CARD_H * SCALE * 0.33 }}
                />

                {/* ── Left panel content ── */}
                <div
                    className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-between py-5 z-10"
                    style={{ width: CARD_H * SCALE * 0.33 }}
                >
                    {/* League logo */}
                    <img
                        src="/images/saf_league_logo.png"
                        alt="SAF League"
                        style={{ width: 48, height: 48, objectFit: 'contain' }}
                        crossOrigin="anonymous"
                    />

                    {/* Team logo / icon */}
                    <div
                        className="bg-white border-2 border-white/30 overflow-hidden flex items-center justify-center"
                        style={{ width: 80, height: 80, borderRadius: 8 }}
                    >
                        {team.logo_url ? (
                            <img
                                src={team.logo_url}
                                alt={team.team_name}
                                className="w-full h-full object-contain p-1"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <Users style={{ width: 32, height: 32, color: '#cbd5e1' }} />
                        )}
                    </div>

                    {/* Official badge */}
                    <span
                        style={{
                            backgroundColor: 'rgba(245,158,11,0.2)',
                            color: '#fcd34d',
                            border: '1px solid rgba(245,158,11,0.4)',
                            fontSize: 7.5,
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: 0.8,
                            padding: '3px 8px',
                            borderRadius: 4,
                        }}
                    >
                        OFFICIAL
                    </span>
                </div>

                {/* ── Right main content ── */}
                <div
                    className="absolute top-0 right-0 bottom-0 flex flex-col justify-between"
                    style={{ left: CARD_H * SCALE * 0.33 + 18, right: 0, paddingTop: 16, paddingBottom: 14, paddingRight: 16 }}
                >
                    {/* Header */}
                    <div>
                        <p style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                            AKREDITASI TIM RESMI
                        </p>
                        <h1 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginBottom: 3 }}>
                            {team.team_name}
                        </h1>
                        <p style={{ fontSize: 9, color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <School style={{ width: 10, height: 10, display: 'inline' }} />
                            {team.school_name}
                        </p>
                    </div>

                    {/* Officials grid */}
                    <div
                        style={{ backgroundColor: '#f8fafc', borderRadius: 6, padding: '6px 10px', borderLeft: '3px solid #f59e0b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}
                    >
                        <div>
                            <p style={{ fontSize: 6.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Head Coach</p>
                            <p style={{ fontSize: 9, fontWeight: 800, color: '#0f172a' }} className="truncate">{team.head_coach}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 6.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Manager</p>
                            <p style={{ fontSize: 9, fontWeight: 800, color: '#0f172a' }} className="truncate">{team.manager_name}</p>
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <p style={{ fontSize: 6.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Event</p>
                            <p style={{ fontSize: 8.5, fontWeight: 700, color: '#0f172a' }} className="truncate">{team.event_name}</p>
                        </div>
                    </div>

                    {/* Footer: reg number + QR */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>No. Tim</p>
                            <p style={{ fontSize: 10, fontWeight: 900, color: '#b45309', fontFamily: 'monospace' }}>
                                {team.registration_number}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <Shield style={{ width: 9, height: 9, color: '#22c55e' }} />
                                <p style={{ fontSize: 7, color: '#94a3b8' }}>Dok. Sah Panitia</p>
                            </div>
                        </div>

                        <div style={{ padding: 4, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                            <QRCodeSVG value={team.qr_token || team.registration_number} size={52} level="M" />
                        </div>
                    </div>
                </div>

                {/* Corner accent */}
                <div
                    className="absolute top-0 right-0 bg-amber-500 opacity-10"
                    style={{ width: 80, height: 80, borderRadius: '0 0 0 100%' }}
                />
            </div>

            <style>{`
                @media print {
                    @page { size: 85.6mm 54mm; margin: 0; }
                    html, body, #app { width: 85.6mm !important; height: 54mm !important; margin: 0 !important; overflow: hidden !important; }
                    .team-card-print-page { width: 85.6mm !important; height: 54mm !important; min-height: 0 !important; display: block !important; overflow: hidden !important; }
                    .team-card-print-surface {
                        width: ${CARD_W * SCALE}px !important;
                        height: ${CARD_H * SCALE}px !important;
                        margin: 0 !important;
                        transform: scale(0.333333);
                        transform-origin: top left;
                    }
                }
            `}</style>
        </div>
    );
}
