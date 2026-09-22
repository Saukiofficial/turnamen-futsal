import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { 
    Trophy, 
    Calendar, 
    MapPin, 
    Clock, 
    ArrowRight, 
    Flame, 
    Shield, 
    CheckCircle2, 
    Sparkles, 
    Medal,
    Swords,
    RefreshCw,
    Radio,
    Tv,
    ExternalLink,
    ArrowDown
} from 'lucide-react';

interface TeamInfo {
    id: number;
    name: string;
    school: string;
    logo_url: string | null;
}

interface MatchItem {
    id: number;
    round: string;
    match_order: number;
    status: 'scheduled' | 'live' | 'completed';
    live_period?: string | null;
    live_minute?: string | null;
    live_stream_url?: string | null;
    court_name: string | null;
    match_time: string | null;
    score_a: number | null;
    score_b: number | null;
    penalty_a: number | null;
    penalty_b: number | null;
    team_a: TeamInfo | null;
    team_b: TeamInfo | null;
    winner_id: number | null;
    next_match_id: number | null;
}

interface MatchesPageProps {
    event: {
        id: number;
        name: string;
        organizer: string;
        location: string;
    } | null;
    rounds: {
        perempat_final: MatchItem[];
        semifinal: MatchItem[];
        final: MatchItem[];
        juara_3: MatchItem[];
    };
    stats: {
        total_matches: number;
        completed_matches: number;
        live_matches: number;
    };
    liveMatches: MatchItem[];
}

export default function MatchesIndex({ 
    event, 
    rounds = {
        perempat_final: [],
        semifinal: [],
        final: [],
        juara_3: [],
    }, 
    stats = {
        total_matches: 0,
        completed_matches: 0,
        live_matches: 0,
    },
    liveMatches = []
}: Partial<MatchesPageProps> & { matches?: MatchItem[] }) {
    const [viewMode, setViewMode] = useState<'bracket' | 'list'>('bracket');

    // Auto-polling every 10 seconds so visitors always see live updates without manual refresh
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['rounds', 'stats', 'liveMatches', 'matches'] });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const safeRounds = {
        perempat_final: rounds?.perempat_final || [],
        semifinal: rounds?.semifinal || [],
        final: rounds?.final || [],
        juara_3: rounds?.juara_3 || [],
    };

    const safeStats = {
        total_matches: stats?.total_matches || 0,
        completed_matches: stats?.completed_matches || 0,
        live_matches: stats?.live_matches || 0,
    };

    const mobileRounds = [
        {
            key: 'perempat-final',
            title: 'Perempat Final',
            subtitle: '8 Tim Terbaik',
            matches: safeRounds.perempat_final,
            emptyMessage: 'Bagan belum dibuat oleh admin.',
        },
        {
            key: 'semifinal',
            title: 'Semifinal',
            subtitle: 'Perebutan Tiket Final',
            matches: safeRounds.semifinal,
            emptyMessage: 'Menunggu hasil perempat final.',
        },
        {
            key: 'grand-final',
            title: 'Grand Final',
            subtitle: 'Perebutan Gelar Juara',
            matches: safeRounds.final,
            emptyMessage: 'Menunggu hasil semifinal.',
        },
        {
            key: 'juara-tiga',
            title: 'Perebutan Juara 3',
            subtitle: 'Penentuan Tempat Ketiga',
            matches: safeRounds.juara_3,
            emptyMessage: 'Menunggu tim gugur di semifinal.',
        },
    ];

    // Find champion team if final is completed
    const finalMatch = safeRounds.final?.[0];
    const championTeam = finalMatch?.winner_id 
        ? (finalMatch.team_a?.id === finalMatch.winner_id ? finalMatch.team_a : finalMatch.team_b)
        : null;

    const getRoundTitle = (round: string) => {
        switch (round) {
            case 'perempat_final': return 'Perempat Final';
            case 'semifinal': return 'Semifinal';
            case 'final': return 'Grand Final';
            case 'juara_3': return 'Perebutan Juara 3';
            default: return round;
        }
    };

    const renderTeamSlot = (team: TeamInfo | null, isWinner: boolean, isDefeated: boolean, score: number | null, penalty: number | null) => {
        return (
            <div className={`flex items-center justify-between px-3.5 py-2.5 transition-all ${
                isWinner ? 'bg-amber-500/10 font-bold' : isDefeated ? 'opacity-40 line-through grayscale' : ''
            }`}>
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative">
                        {team?.logo_url ? (
                            <>
                                <img 
                                    src={team.logo_url} 
                                    alt={team.name} 
                                    className="w-full h-full object-contain" 
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const sibling = e.currentTarget.nextElementSibling;
                                        if (sibling) sibling.classList.remove('hidden');
                                    }}
                                />
                                <Shield className="w-4 h-4 text-slate-400 hidden" />
                            </>
                        ) : (
                            <Shield className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                    <div className="truncate">
                        <span className={`text-xs block truncate ${isWinner ? 'text-amber-950 font-bold' : 'text-slate-800 font-medium'}`}>
                            {team ? team.name : 'Menunggu Pemenang'}
                        </span>
                        {team && (
                            <span className="text-[10px] text-slate-500 block truncate -mt-0.5">{team.school}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                    {score !== null ? (
                        <>
                            <span className={`w-6 h-6 flex items-center justify-center rounded font-bold ${
                                isWinner ? 'bg-amber-500 text-navy-950 shadow-xs' : 'bg-slate-100 text-slate-800'
                            }`}>
                                {score}
                            </span>
                            {penalty !== null && (
                                <span className="text-[10px] text-slate-500" title="Adu Penalti">
                                    ({penalty})
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-slate-300">-</span>
                    )}
                </div>
            </div>
        );
    };

    const renderMatchCard = (match: MatchItem) => {
        const isLive = match.status === 'live';
        const isCompleted = match.status === 'completed';
        const teamAWins = isCompleted && match.winner_id === match.team_a?.id;
        const teamBWins = isCompleted && match.winner_id === match.team_b?.id;

        return (
            <div 
                key={match.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden ${
                    isLive 
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : isCompleted
                        ? 'border-slate-200'
                        : 'border-slate-200/90'
                }`}
            >
                {/* Match Card Header */}
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium truncate pr-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{match.match_time || 'Jadwal Menyusul'}</span>
                        {match.court_name && (
                            <span className="text-slate-400 hidden sm:inline">• {match.court_name}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {isLive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                                <Radio className="w-2.5 h-2.5" />
                                <span>{match.live_period || 'LIVE'} {match.live_minute ? `• ${match.live_minute}` : ''}</span>
                            </span>
                        ) : isCompleted ? (
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                                SELESAI
                            </span>
                        ) : (
                            <span className="text-[10px] font-semibold text-slate-400">
                                TERJADWAL
                            </span>
                        )}

                        {match.live_stream_url && (
                            <a
                                href={match.live_stream_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                                title="Buka Siaran Langsung"
                            >
                                <Tv className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Match Competitors */}
                <div className="divide-y divide-slate-100">
                    {renderTeamSlot(
                        match.team_a, 
                        teamAWins, 
                        teamBWins, 
                        match.score_a, 
                        match.penalty_a
                    )}
                    {renderTeamSlot(
                        match.team_b, 
                        teamBWins, 
                        teamAWins, 
                        match.score_b, 
                        match.penalty_b
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title={`Bagan & Hasil Pertandingan - ${event?.name || 'SAF League 2026'}`} />
            <Navbar />

            {/* Cinematic Hero Header */}
            <section className="relative bg-navy-950 text-white pt-12 pb-20 border-b border-navy-900 overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <img 
                        src="/images/hero_futsal_action.webp" 
                        alt="SAF League Match Bracket" 
                        className="w-full h-full object-cover object-center opacity-40 brightness-75 contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>SISTEM GUGUR (KNOCKOUT TOURNAMENT)</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-xs">
                        Bagan & Hasil Pertandingan Real-Time
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Pantau seluruh laga turnamen {event?.name || 'SAF League Turnamen Futsal 2026'} secara langsung dari babak Perempat Final, Semifinal, hingga perebutan Mahkota Juara.
                    </p>

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <div className="px-4 py-2 rounded-xl bg-navy-900/90 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="font-semibold text-slate-300">Laga Berlangsung:</span>
                            <span className="font-bold font-mono text-red-400">{safeStats.live_matches} Live</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-navy-900/90 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                            <span className="font-semibold text-slate-300">Pertandingan Selesai:</span>
                            <span className="font-bold font-mono text-white">{safeStats.completed_matches} / {safeStats.total_matches}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE MATCH SHOWCASE BANNER (Prominent Live Scoreboard for Spectators) */}
            {liveMatches && liveMatches.length > 0 && (
                <section className="bg-slate-900 border-b border-slate-800 text-white py-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-red-600/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                                    <span>Sedang Bertanding Sekarang (LIVE)</span>
                                </h2>
                            </div>
                            <span className="text-xs text-red-400 font-semibold flex items-center gap-1.5 animate-pulse">
                                <Radio className="w-3.5 h-3.5" />
                                <span>Realtime Score</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {liveMatches.map((liveMatch) => (
                                <div 
                                    key={liveMatch.id}
                                    className="bg-slate-950/80 rounded-3xl border border-red-500/40 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6"
                                >
                                    {/* Top Bar: Round, Court, Live Period & Minute */}
                                    <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                                {getRoundTitle(liveMatch.round)}
                                            </span>
                                            <span>•</span>
                                            <span>{liveMatch.court_name || 'Lapangan Utama'}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[11px] flex items-center gap-1 animate-pulse">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                {liveMatch.live_period || 'Babak 1'}
                                                {liveMatch.live_minute ? ` • ${liveMatch.live_minute}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Scoreboard Arena */}
                                    <div className="grid grid-cols-9 gap-2 items-center text-center">
                                        {/* Team A */}
                                        <div className="col-span-3 flex flex-col items-center space-y-2">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shadow-md overflow-hidden relative">
                                                {liveMatch.team_a?.logo_url ? (
                                                    <>
                                                        <img 
                                                            src={liveMatch.team_a.logo_url} 
                                                            alt={liveMatch.team_a.name} 
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const sibling = e.currentTarget.nextElementSibling;
                                                                if (sibling) sibling.classList.remove('hidden');
                                                            }}
                                                        />
                                                        <Shield className="w-8 h-8 text-slate-400 hidden" />
                                                    </>
                                                ) : (
                                                    <Shield className="w-8 h-8 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <h4 className="text-sm font-black text-white truncate">
                                                    {liveMatch.team_a?.name || 'Tim A'}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 truncate">
                                                    {liveMatch.team_a?.school || ''}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Score Display Center */}
                                        <div className="col-span-3 flex flex-col items-center justify-center space-y-1">
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="text-4xl sm:text-5xl font-mono font-black text-amber-400">
                                                    {liveMatch.score_a ?? 0}
                                                </span>
                                                <span className="text-xl sm:text-2xl font-bold text-slate-600">:</span>
                                                <span className="text-4xl sm:text-5xl font-mono font-black text-amber-400">
                                                    {liveMatch.score_b ?? 0}
                                                </span>
                                            </div>

                                            {(liveMatch.penalty_a !== null || liveMatch.penalty_b !== null) && (
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    Penalti: ({liveMatch.penalty_a ?? 0} - {liveMatch.penalty_b ?? 0})
                                                </span>
                                            )}
                                        </div>

                                        {/* Team B */}
                                        <div className="col-span-3 flex flex-col items-center space-y-2">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shadow-md overflow-hidden relative">
                                                {liveMatch.team_b?.logo_url ? (
                                                    <>
                                                        <img 
                                                            src={liveMatch.team_b.logo_url} 
                                                            alt={liveMatch.team_b.name} 
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const sibling = e.currentTarget.nextElementSibling;
                                                                if (sibling) sibling.classList.remove('hidden');
                                                            }}
                                                        />
                                                        <Shield className="w-8 h-8 text-slate-400 hidden" />
                                                    </>
                                                ) : (
                                                    <Shield className="w-8 h-8 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <h4 className="text-sm font-black text-white truncate">
                                                    {liveMatch.team_b?.name || 'Tim B'}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 truncate">
                                                    {liveMatch.team_b?.school || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Streaming Button */}
                                    {liveMatch.live_stream_url ? (
                                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                                                <span>Update langsung dari operator</span>
                                            </span>
                                            <a
                                                href={liveMatch.live_stream_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all hover:scale-105"
                                            >
                                                <Tv className="w-4 h-4" />
                                                <span>Tonton Siaran Langsung</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="pt-2 border-t border-slate-800/80 text-center">
                                            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                                                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                                                <span>Skor diperbarui secara realtime dari meja operator turnamen</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Champion Showcase Banner (if Champion exists) */}
            {championTeam && (
                <section className="bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 text-navy-950 py-6 border-b border-amber-400 shadow-md">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                            {championTeam.logo_url ? (
                                <>
                                    <img 
                                        src={championTeam.logo_url} 
                                        alt={championTeam.name} 
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const sibling = e.currentTarget.nextElementSibling;
                                            if (sibling) sibling.classList.remove('hidden');
                                        }}
                                    />
                                    <Trophy className="w-8 h-8 text-amber-500 hidden" />
                                </>
                            ) : (
                                <Trophy className="w-8 h-8 text-amber-500" />
                            )}
                        </div>
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-navy-900/80 block">
                                SANG JUARA TURNAMEN SAF LEAGUE 2026
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
                                {championTeam.name}
                            </h2>
                            <p className="text-xs font-semibold text-navy-900/90">
                                {championTeam.school} — Selamat atas gelar kampiun SAF League!
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Interactive Bracket Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
                {/* View switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode('bracket')}
                            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                viewMode === 'bracket' 
                                    ? 'bg-navy-950 text-white shadow-xs' 
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <span className="sm:hidden">Bagan Turnamen</span>
                            <span className="hidden sm:inline">Bagan Turnamen (Interactive Bracket)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                viewMode === 'list' 
                                    ? 'bg-navy-950 text-white shadow-xs' 
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <span className="sm:hidden">Jadwal & Skor</span>
                            <span className="hidden sm:inline">Daftar Jadwal & Skor</span>
                        </button>
                    </div>

                    <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Diperbarui langsung dari meja operator turnamen</span>
                    </span>
                </div>

                {/* BRACKET VIEW */}
                {viewMode === 'bracket' && (
                    <div>
                        {/* Mobile bracket: rounds flow vertically so every match remains readable. */}
                        <div className="space-y-3 lg:hidden">
                            {mobileRounds.map((round, index) => (
                                <React.Fragment key={round.key}>
                                    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                                        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
                                            <div>
                                                <h3 className={`text-sm font-black uppercase tracking-wider ${
                                                    round.key === 'grand-final' ? 'text-amber-600' : 'text-navy-950'
                                                }`}>
                                                    {round.title}
                                                </h3>
                                                <span className="text-[11px] text-slate-500 font-medium">{round.subtitle}</span>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 shrink-0">
                                                {round.matches.length} Laga
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {round.matches.length > 0 ? (
                                                round.matches.map((match) => renderMatchCard(match))
                                            ) : (
                                                <div className="p-5 rounded-xl bg-white border border-dashed border-slate-300 text-center text-xs text-slate-400">
                                                    {round.emptyMessage}
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {index < mobileRounds.length - 1 && (
                                        <div className="flex justify-center" aria-hidden="true">
                                            <span className="w-8 h-8 rounded-full bg-navy-950 text-white flex items-center justify-center shadow-sm">
                                                <ArrowDown className="w-4 h-4" />
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Desktop bracket: preserve the side-by-side tournament tree. */}
                        <div className="hidden lg:block w-full overflow-x-auto pb-8">
                        <div className="min-w-[960px] grid grid-cols-3 gap-8 items-stretch pt-2">
                            {/* Column 1: Perempat Final (Quarterfinals) */}
                            <div className="space-y-4">
                                <div className="text-center pb-2 border-b-2 border-slate-200">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                                        Perempat Final
                                    </h3>
                                    <span className="text-[11px] text-slate-400 font-medium">8 Tim Terbaik</span>
                                </div>

                                <div className="space-y-6 pt-2">
                                    {safeRounds.perempat_final?.length > 0 ? (
                                        safeRounds.perempat_final.map((m) => renderMatchCard(m))
                                    ) : (
                                        <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-xs text-slate-400">
                                            Bagan belum dibuat oleh admin.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Column 2: Semifinal */}
                            <div className="space-y-4 flex flex-col justify-around">
                                <div>
                                    <div className="text-center pb-2 border-b-2 border-brand-500">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-brand-700">
                                            Semifinal
                                        </h3>
                                        <span className="text-[11px] text-brand-500 font-medium">Perebutan Tiket Final</span>
                                    </div>

                                    <div className="space-y-16 pt-12">
                                        {safeRounds.semifinal?.length > 0 ? (
                                            safeRounds.semifinal.map((m) => renderMatchCard(m))
                                        ) : (
                                            <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-xs text-slate-400">
                                                Menunggu hasil perempat final.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Grand Final & Juara 3 */}
                            <div className="space-y-6 flex flex-col justify-between">
                                {/* Grand Final */}
                                <div className="space-y-3">
                                    <div className="text-center pb-2 border-b-2 border-amber-500 flex items-center justify-center gap-2">
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                        <h3 className="text-sm font-black uppercase tracking-wider text-amber-600">
                                            Grand Final
                                        </h3>
                                    </div>

                                    <div className="pt-2">
                                        {safeRounds.final?.length > 0 ? (
                                            safeRounds.final.map((m) => renderMatchCard(m))
                                        ) : (
                                            <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-xs text-slate-400">
                                                Menunggu hasil semifinal.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Perebutan Juara 3 */}
                                <div className="space-y-3 pt-6 border-t border-slate-200">
                                    <div className="text-center pb-1 flex items-center justify-center gap-1.5">
                                        <Medal className="w-4 h-4 text-slate-400" />
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Perebutan Tempat Ketiga (Juara 3)
                                        </h4>
                                    </div>

                                    <div>
                                        {safeRounds.juara_3?.length > 0 ? (
                                            safeRounds.juara_3.map((m) => renderMatchCard(m))
                                        ) : (
                                            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                                                Menunggu tim gugur di Semifinal.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                )}

                {/* LIST VIEW */}
                {viewMode === 'list' && (
                    <div className="space-y-8">
                        {/* Perempat Final List */}
                        <div className="space-y-3">
                            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                                <Swords className="w-4 h-4 text-brand-600" />
                                <span>Babak Perempat Final (8 Besar)</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {safeRounds.perempat_final?.map((m) => renderMatchCard(m))}
                            </div>
                        </div>

                        {/* Semifinal List */}
                        <div className="space-y-3">
                            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-500" />
                                <span>Babak Semifinal (4 Besar)</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {safeRounds.semifinal?.map((m) => renderMatchCard(m))}
                            </div>
                        </div>

                        {/* Final & Juara 3 */}
                        <div className="space-y-3">
                            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span>Babak Final & Perebutan Juara 3</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {safeRounds.final?.map((m) => renderMatchCard(m))}
                                {safeRounds.juara_3?.map((m) => renderMatchCard(m))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
