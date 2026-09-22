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
                className="h-10 px-3 flex items-center justify-between text-white"
                style={{ background: 'linear-gradient(110deg, #07152f 0%, #123b7a 68%, #2563eb 100%)' }}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <img
                        src="/images/saf_league_logo.png"
                        alt="SAF League"
                        className="w-7 h-7 object-contain shrink-0"
                        crossOrigin="anonymous"
                    />
                    <div className="min-w-0 leading-none">
                        <p className="text-[9px] font-black tracking-[0.12em] uppercase truncate">SAF League</p>
                        <p className="text-[6px] font-semibold text-blue-200 tracking-[0.08em] uppercase mt-1">Kartu Peserta Turnamen</p>
                    </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-[6px] font-black text-emerald-200 tracking-wider">
                    RESMI
                </span>
            </header>

            <div className="h-[164px] p-3 flex gap-3">
                <div className="w-[62px] shrink-0 flex flex-col gap-1.5">
                    <div className="h-[82px] rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
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
                    <span className="px-1 py-1 rounded bg-blue-50 border border-blue-100 text-[6px] leading-tight font-black text-blue-800 text-center uppercase truncate">
                        {participant.primary_position}
                    </span>
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div className="min-w-0">
                        <p className="text-[6px] uppercase tracking-[0.12em] text-slate-400 font-bold">Nama Peserta</p>
                        <h1 className="text-[12px] leading-tight font-black text-navy-950 truncate mt-0.5">
                            {participant.full_name}
                        </h1>
                        <p className="text-[7px] leading-tight text-slate-500 font-semibold truncate mt-1">
                            {participant.school_name || 'Sekolah belum dicantumkan'}
                        </p>
                    </div>

                    <div className="rounded-md bg-slate-50 border-l-[3px] border-blue-600 px-2 py-1.5 min-w-0">
                        <p className="text-[5.5px] uppercase tracking-wider text-slate-400 font-bold">Event</p>
                        <p className="text-[7px] font-extrabold text-slate-800 truncate">{participant.event_name}</p>
                        {participant.location && (
                            <p className="text-[6px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <MapPin className="w-2 h-2 shrink-0 text-blue-600" />
                                <span className="truncate">{participant.location}</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-[5.5px] uppercase tracking-wider text-slate-400 font-bold">Nomor Pendaftaran</p>
                        <p className="text-[9px] font-black font-mono text-blue-700 tracking-wide">{participant.registration_number}</p>
                        <p className="text-[5.5px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-2 h-2" />
                            <span>Terverifikasi oleh panitia</span>
                        </p>
                    </div>
                </div>

                <div className="w-[58px] shrink-0 flex flex-col items-center justify-end gap-1">
                    <div className="p-1 bg-white rounded-md border border-slate-200">
                        <QRCodeSVG value={participant.qr_token} size={48} level="M" />
                    </div>
                    <p className="text-[5.5px] leading-tight text-slate-400 font-semibold text-center">Pindai saat check-in</p>
                </div>
            </div>

            <div className="absolute right-0 top-10 w-10 h-10 opacity-[0.08] rounded-bl-full bg-blue-600" />
        </div>
    );
}
