import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, ShieldCheck, UserRound } from 'lucide-react';

export const PARTICIPANT_CARD_WIDTH = 323;
export const PARTICIPANT_CARD_HEIGHT = 204;

export interface ParticipantCardData {
    registration_number: string;
    full_name: string;
    school_name: string;
    primary_position: string;
    photo_url: string | null;
    qr_token: string;
    event_name: string;
    location?: string;
}

interface ParticipantCardDesignProps {
    participant: ParticipantCardData;
}

function shortenText(value: string, maximumLength: number): string {
    return value.length > maximumLength
        ? `${value.slice(0, maximumLength - 3)}...`
        : value;
}

export default function ParticipantCardDesign({ participant }: ParticipantCardDesignProps) {
    return (
        <div
            className="participant-card-design print-color-exact relative overflow-hidden bg-white text-slate-900"
            style={{
                width: PARTICIPANT_CARD_WIDTH,
                height: PARTICIPANT_CARD_HEIGHT,
                fontFamily: "Inter, 'Segoe UI', sans-serif",
                borderRadius: 10,
                border: '1px solid #cbd5e1',
            }}
        >
            <header
                className="h-10 px-3.5 flex items-center justify-between text-white"
                style={{ background: 'linear-gradient(110deg, #07152f 0%, #123b7a 68%, #2563eb 100%)' }}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <img
                        src="/images/saf_league_logo.png"
                        alt="SAF League"
                        className="w-7 h-7 object-contain shrink-0"
                        crossOrigin="anonymous"
                    />
                    <div className="min-w-0">
                        <p className="text-[9px] leading-[13px] font-black tracking-[0.1em] uppercase whitespace-nowrap">SAF League</p>
                        <p className="text-[5.5px] leading-[8px] font-semibold text-blue-200 tracking-[0.08em] uppercase">Kartu Peserta Turnamen</p>
                    </div>
                </div>
                <div className="w-[38px] h-[17px] rounded-full bg-emerald-400/15 border border-emerald-300/50 flex items-center justify-center">
                    <span className="block text-[5.5px] leading-[8px] font-black text-emerald-200 tracking-[0.08em]">RESMI</span>
                </div>
            </header>

            <div className="relative h-[164px]">
                <div className="absolute left-3 top-3 w-[62px] rounded-md bg-white border border-slate-200 shadow-sm">
                    <div className="h-[82px] rounded-t-[5px] bg-slate-100 overflow-hidden flex items-center justify-center">
                        {participant.photo_url ? (
                            <img
                                src={participant.photo_url}
                                alt={`Foto ${participant.full_name}`}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <UserRound className="w-6 h-6 text-slate-300" />
                        )}
                    </div>
                    <div className="h-[18px] px-1 bg-blue-50 border-t border-blue-100 rounded-b-[5px] flex items-center justify-center">
                        <span className="block text-[5.5px] leading-[8px] font-black text-blue-800 uppercase tracking-[0.04em] whitespace-nowrap">
                            {shortenText(participant.primary_position, 14)}
                        </span>
                    </div>
                </div>

                <div className="absolute left-[86px] right-[82px] top-3 bottom-3 min-w-0 flex flex-col justify-between">
                    <div className="min-w-0">
                        <p className="text-[6px] leading-[9px] uppercase tracking-[0.12em] text-slate-400 font-bold">Nama Peserta</p>
                        <h1 className="text-[12px] leading-[17px] font-black text-navy-950 whitespace-nowrap">
                            {shortenText(participant.full_name, 25)}
                        </h1>
                        <p className="text-[7px] leading-[13px] text-slate-500 font-semibold whitespace-nowrap mt-0.5">
                            {shortenText(participant.school_name || 'Sekolah belum dicantumkan', 38)}
                        </p>
                    </div>

                    <div className="rounded-md bg-slate-50 border border-slate-100 border-l-[3px] border-l-blue-600 px-2 py-1.5 min-w-0">
                        <p className="text-[5.5px] leading-[8px] uppercase tracking-wider text-slate-400 font-bold">Event</p>
                        <p className="text-[7px] leading-[12px] font-extrabold text-slate-800 whitespace-nowrap">
                            {shortenText(participant.event_name, 39)}
                        </p>
                        {participant.location && (
                            <p className="relative h-[11px] text-[6px] leading-[11px] text-slate-500 whitespace-nowrap">
                                <MapPin className="absolute left-0 top-[1px] w-2 h-2 text-blue-600" />
                                <span className="block pl-3">{shortenText(participant.location, 33)}</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-[5.5px] leading-[8px] uppercase tracking-wider text-slate-400 font-bold">Nomor Pendaftaran</p>
                        <p className="text-[9px] leading-[13px] font-black font-mono text-blue-700 tracking-wide">{participant.registration_number}</p>
                        <p className="relative h-[10px] text-[5.5px] leading-[10px] text-emerald-700 font-bold whitespace-nowrap">
                            <ShieldCheck className="absolute left-0 top-[1px] w-2 h-2" />
                            <span className="block pl-3">Terverifikasi oleh panitia</span>
                        </p>
                    </div>
                </div>

                <div className="absolute right-3 top-[55px] w-[58px] flex flex-col items-center gap-1.5">
                    <div className="p-1 bg-white rounded-md border border-slate-200 shadow-sm">
                        <QRCodeSVG value={participant.qr_token} size={48} level="M" />
                    </div>
                    <p className="text-[5px] leading-[8px] text-slate-400 font-semibold text-center whitespace-nowrap">Pindai saat check-in</p>
                </div>
            </div>

            <div className="absolute right-0 top-10 w-10 h-10 opacity-[0.08] rounded-bl-full bg-blue-600" />
        </div>
    );
}
