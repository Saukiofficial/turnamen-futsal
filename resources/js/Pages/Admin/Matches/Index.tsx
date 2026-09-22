import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import { 
    Trophy, 
    Play, 
    CheckCircle2, 
    Clock, 
    Edit2, 
    Sparkles, 
    Calendar, 
    MapPin, 
    AlertCircle, 
    Shield, 
    Save, 
    X,
    Users,
    Swords,
    Radio,
    Tv,
    Flame,
    Minus,
    Plus,
    ExternalLink,
    Shuffle,
    Eye,
    RefreshCw
} from 'lucide-react';

interface TeamData {
    id: number;
    name: string;
    school: string;
    logo_url?: string | null;
}

interface MatchItem {
    id: number;
    round: 'perempat_final' | 'semifinal' | 'final' | 'juara_3';
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
    team_a: TeamData | null;
    team_b: TeamData | null;
    winner_id: number | null;
    next_match_id: number | null;
}

interface MatchupConfig {
    order: number;
    team_a_id: number | '';
    team_b_id: number | '';
    court_name: string;
    match_time: string;
}

interface AdminMatchesProps {
    event: {
        id: number;
        name: string;
    } | null;
    verifiedTeams: TeamData[];
    matches: MatchItem[];
}

export default function AdminMatchesIndex({ event, verifiedTeams, matches }: AdminMatchesProps) {
    const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
    const [isBracketBuilderOpen, setIsBracketBuilderOpen] = useState(false);
    const [isSubmittingBracket, setIsSubmittingBracket] = useState(false);

    // Default console match: pick currently live match, or first scheduled match, or first match
    const initialMatchId = matches.find(m => m.status === 'live')?.id 
        || matches.find(m => m.status === 'scheduled')?.id 
        || matches[0]?.id 
        || null;

    const [activeConsoleMatchId, setActiveConsoleMatchId] = useState<number | null>(initialMatchId);

    const activeMatch = matches.find(m => m.id === activeConsoleMatchId) || null;

    // Matchup builder state for 4 Quarterfinal matches
    const [builderMatchups, setBuilderMatchups] = useState<MatchupConfig[]>([
        { order: 1, team_a_id: '', team_b_id: '', court_name: 'Lapangan 1', match_time: '' },
        { order: 2, team_a_id: '', team_b_id: '', court_name: 'Lapangan 1', match_time: '' },
        { order: 3, team_a_id: '', team_b_id: '', court_name: 'Lapangan 2', match_time: '' },
        { order: 4, team_a_id: '', team_b_id: '', court_name: 'Lapangan 2', match_time: '' },
    ]);

    // Form for Live Console Operator
    const liveForm = useForm({
        score_a: (activeMatch?.score_a ?? 0) as number | '',
        score_b: (activeMatch?.score_b ?? 0) as number | '',
        penalty_a: (activeMatch?.penalty_a ?? '') as number | '',
        penalty_b: (activeMatch?.penalty_b ?? '') as number | '',
        status: (activeMatch?.status ?? 'scheduled') as 'scheduled' | 'live' | 'completed',
        live_period: activeMatch?.live_period ?? 'Babak 1',
        live_minute: activeMatch?.live_minute ?? "1'",
        live_stream_url: activeMatch?.live_stream_url ?? '',
        court_name: activeMatch?.court_name ?? 'Lapangan Utama',
    });

    // Sync live form whenever activeMatch changes or matches update
    useEffect(() => {
        if (activeMatch) {
            liveForm.setData({
                score_a: activeMatch.score_a ?? 0,
                score_b: activeMatch.score_b ?? 0,
                penalty_a: activeMatch.penalty_a ?? '',
                penalty_b: activeMatch.penalty_b ?? '',
                status: activeMatch.status,
                live_period: activeMatch.live_period || (activeMatch.status === 'live' ? 'Babak 1' : 'Babak 1'),
                live_minute: activeMatch.live_minute || '',
                live_stream_url: activeMatch.live_stream_url || '',
                court_name: activeMatch.court_name || 'Lapangan Utama',
            });
        }
    }, [activeConsoleMatchId, activeMatch?.id]);

    // Form for updating match score & status via Modal
    const updateForm = useForm({
        score_a: 0 as number | '',
        score_b: 0 as number | '',
        penalty_a: '' as number | '',
        penalty_b: '' as number | '',
        status: 'scheduled' as 'scheduled' | 'live' | 'completed',
        live_period: '',
        live_minute: '',
        live_stream_url: '',
        court_name: '',
        match_time: '',
    });

    const handleOpenEdit = (match: MatchItem) => {
        setSelectedMatch(match);
        updateForm.setData({
            score_a: match.score_a ?? '',
            score_b: match.score_b ?? '',
            penalty_a: match.penalty_a ?? '',
            penalty_b: match.penalty_b ?? '',
            status: match.status,
            live_period: match.live_period ?? '',
            live_minute: match.live_minute ?? '',
            live_stream_url: match.live_stream_url ?? '',
            court_name: match.court_name ?? '',
            match_time: match.match_time ?? '',
        });
    };

    const handleSaveScore = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMatch) return;

        updateForm.put(route('admin.matches.update', selectedMatch.id), {
            onSuccess: () => {
                setSelectedMatch(null);
            },
        });
    };

    const initializeBuilder = () => {
        const quarters = matches.filter(m => m.round === 'perempat_final').sort((a, b) => a.match_order - b.match_order);
        if (quarters.length === 4) {
            setBuilderMatchups(quarters.map(q => ({
                order: q.match_order,
                team_a_id: q.team_a?.id ?? '',
                team_b_id: q.team_b?.id ?? '',
                court_name: q.court_name ?? `Lapangan ${q.match_order % 2 === 1 ? '1' : '2'}`,
                match_time: q.match_time ?? '',
            })));
        } else if (verifiedTeams.length >= 2) {
            handleAutoDraw();
        }
    };

    const handleAutoDraw = () => {
        const shuffled = [...verifiedTeams].sort(() => 0.5 - Math.random());
        setBuilderMatchups([
            { order: 1, team_a_id: shuffled[0]?.id ?? '', team_b_id: shuffled[1]?.id ?? '', court_name: 'Lapangan 1', match_time: builderMatchups[0]?.match_time || '' },
            { order: 2, team_a_id: shuffled[2]?.id ?? '', team_b_id: shuffled[3]?.id ?? '', court_name: 'Lapangan 1', match_time: builderMatchups[1]?.match_time || '' },
            { order: 3, team_a_id: shuffled[4]?.id ?? '', team_b_id: shuffled[5]?.id ?? '', court_name: 'Lapangan 2', match_time: builderMatchups[2]?.match_time || '' },
            { order: 4, team_a_id: shuffled[6]?.id ?? '', team_b_id: shuffled[7]?.id ?? '', court_name: 'Lapangan 2', match_time: builderMatchups[3]?.match_time || '' },
        ]);
    };

    const updateBuilderMatchup = (index: number, field: keyof MatchupConfig, value: any) => {
        setBuilderMatchups(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    // Check for duplicate teams in builder
    const selectedTeamIds = builderMatchups.flatMap(m => [m.team_a_id, m.team_b_id]).filter(id => id !== '');
    const hasDuplicateTeams = new Set(selectedTeamIds).size !== selectedTeamIds.length;

    const handleSaveBracket = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasDuplicateTeams) {
            alert('Ada tim yang terpilih lebih dari satu kali. Pastikan setiap tim hanya bermain dalam 1 pertandingan perempat final.');
            return;
        }

        if (matches.length > 0) {
            if (!confirm('Perhatian: Menyimpan susunan bagan baru akan mengatur ulang skor dan laga yang sudah ada. Lanjutkan?')) {
                return;
            }
        }

        setIsSubmittingBracket(true);
        router.post(route('admin.matches.setup-bracket'), {
            event_id: event?.id || 1,
            bracket_size: 8,
            matchups: builderMatchups.map(m => ({
                order: m.order,
                team_a_id: m.team_a_id || null,
                team_b_id: m.team_b_id || null,
                court_name: m.court_name || null,
                match_time: m.match_time || null,
            })),
        }, {
            onFinish: () => {
                setIsSubmittingBracket(false);
                setIsBracketBuilderOpen(false);
            }
        });
    };

    const handleScoreDelta = (team: 'a' | 'b', delta: number) => {
        if (team === 'a') {
            const current = typeof liveForm.data.score_a === 'number' ? liveForm.data.score_a : 0;
            const updated = Math.max(0, current + delta);
            liveForm.setData('score_a', updated);
        } else {
            const current = typeof liveForm.data.score_b === 'number' ? liveForm.data.score_b : 0;
            const updated = Math.max(0, current + delta);
            liveForm.setData('score_b', updated);
        }
    };

    const handleStartLive = () => {
        if (!activeMatch) return;
        const scoreA = liveForm.data.score_a === '' ? 0 : liveForm.data.score_a;
        const scoreB = liveForm.data.score_b === '' ? 0 : liveForm.data.score_b;
        const period = liveForm.data.live_period || 'Babak 1';
        
        liveForm.transform((data) => ({
            ...data,
            status: 'live',
            score_a: scoreA,
            score_b: scoreB,
            live_period: period,
        }));
        
        liveForm.put(route('admin.matches.update', activeMatch.id));
    };

    const handleSaveLiveUpdate = () => {
        if (!activeMatch) return;
        liveForm.transform((data) => ({
            ...data,
        }));
        liveForm.put(route('admin.matches.update', activeMatch.id));
    };

    const handleCompleteMatch = () => {
        if (!activeMatch) return;
        if (confirm('Konfirmasi menyelesaikan pertandingan ini? Pemenang akan otomatis melaju ke bagan babak berikutnya.')) {
            liveForm.transform((data) => ({
                ...data,
                status: 'completed',
                live_period: 'Selesai',
            }));
            liveForm.put(route('admin.matches.update', activeMatch.id));
        }
    };

    const handleRevertToScheduled = () => {
        if (!activeMatch) return;
        if (confirm('Kembalikan status pertandingan ini ke Terjadwal?')) {
            liveForm.transform((data) => ({
                ...data,
                status: 'scheduled',
            }));
            liveForm.put(route('admin.matches.update', activeMatch.id));
        }
    };

    const handleSelectMatchForConsole = (match: MatchItem) => {
        setActiveConsoleMatchId(match.id);
        const consoleElem = document.getElementById('live-console');
        if (consoleElem) {
            consoleElem.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getRoundTitle = (round: string) => {
        switch (round) {
            case 'perempat_final': return 'Perempat Final (8 Besar)';
            case 'semifinal': return 'Semifinal (4 Besar)';
            case 'final': return 'Grand Final (Perebutan Juara 1 & 2)';
            case 'juara_3': return 'Perebutan Tempat Ketiga (Juara 3)';
            default: return round;
        }
    };

    const getTeamById = (id: number | '') => {
        if (!id) return null;
        return verifiedTeams.find(t => t.id === Number(id)) || null;
    };

    return (
        <AdminShell 
            title="Bagan & Hasil Pertandingan"
            breadcrumbs={[
                { label: 'Admin', href: route('admin.dashboard') },
                { label: 'Bagan & Pertandingan' },
            ]}
        >
            <Head title="Manajemen Bagan & Pertandingan - Admin" />

            <div className="space-y-8">
                {/* Header with Stats & Bracket Generator Action */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h1 className="text-xl font-bold text-navy-950">
                                Bagan & Meja Operator Pertandingan Turnamen
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xl">
                            Susun bagan pertandingan (tentukan lawan & jadwal dengan preview interaktif), kontrol skor live realtime dari Meja Operator, dan otomatis majukan pemenang ke babak berikutnya.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tim Lolos Adm</span>
                            <span className="font-bold text-slate-800">{verifiedTeams.length} Tim Siap Tanding</span>
                        </div>

                        <button
                            type="button"
                            disabled={verifiedTeams.length < 2}
                            onClick={() => {
                                initializeBuilder();
                                setIsBracketBuilderOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-navy-950 hover:bg-amber-400 font-bold text-xs shadow-xs transition-all disabled:opacity-50"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>{matches.length > 0 ? 'Kelola & Susun Ulang Bagan' : 'Susun Bagan 8 Tim'}</span>
                        </button>
                    </div>
                </div>

                {/* LIVE MATCH OPERATOR CONSOLE */}
                {matches.length > 0 && (
                    <div id="live-console" className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden text-white">
                        {/* Console Header Bar */}
                        <div className="bg-slate-950/90 px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                                    <Radio className="w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-bold text-white tracking-wide">
                                            Console Operator Pertandingan & Live Score
                                        </h2>
                                        {activeMatch?.status === 'live' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                SEDANG ON-AIR (LIVE)
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Pilih pertandingan di bawah ini untuk memperbarui skor realtime, babak, menit, dan link siaran langsung (YouTube).
                                    </p>
                                </div>
                            </div>

                            {/* Match Selector Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Pilih Laga:</span>
                                <select
                                    value={activeConsoleMatchId ?? ''}
                                    onChange={(e) => setActiveConsoleMatchId(Number(e.target.value))}
                                    className="bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-semibold px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none max-w-xs truncate"
                                >
                                    {matches.map((m) => {
                                        const statusTag = m.status === 'live' ? '🔴 LIVE' : m.status === 'completed' ? '🏁 Selesai' : '⏳ Terjadwal';
                                        const teamAText = m.team_a?.name || 'TBD';
                                        const teamBText = m.team_b?.name || 'TBD';
                                        return (
                                            <option key={m.id} value={m.id}>
                                                [{statusTag}] Laga #{m.match_order} ({getRoundTitle(m.round)}): {teamAText} vs {teamBText}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {activeMatch ? (
                            <div className="p-6 space-y-6">
                                {/* Match Information Strip */}
                                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                            {getRoundTitle(activeMatch.round)}
                                        </span>
                                        <span className="text-slate-400">
                                            Laga #{activeMatch.match_order} • {activeMatch.court_name || 'Lapangan Utama'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 font-medium">Status Pertandingan:</span>
                                        {activeMatch.status === 'live' ? (
                                            <span className="px-2.5 py-1 rounded-lg bg-red-600/30 text-red-300 border border-red-500/40 font-bold flex items-center gap-1.5">
                                                <Flame className="w-3.5 h-3.5 text-red-400" /> LIVE BERLANGSUNG
                                            </span>
                                        ) : activeMatch.status === 'completed' ? (
                                            <span className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SELESAI
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" /> TERJADWAL
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Main Interactive Scoreboard Deck */}
                                <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
                                    {/* Team A Card */}
                                    <div className="lg:col-span-4 bg-slate-950/60 rounded-2xl border border-slate-800 p-5 flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 p-1.5 flex items-center justify-center">
                                            {activeMatch.team_a?.logo_url ? (
                                                <img src={activeMatch.team_a.logo_url} alt={activeMatch.team_a.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <Shield className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-white truncate max-w-[220px]">
                                                {activeMatch.team_a?.name || 'Menunggu Lawan'}
                                            </h3>
                                            <p className="text-xs text-slate-400 truncate max-w-[220px]">
                                                {activeMatch.team_a?.school || 'Sekolah / Perwakilan'}
                                            </p>
                                        </div>

                                        {/* Digital Score Display & Stepper */}
                                        <div className="w-full pt-2 flex flex-col items-center space-y-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SKOR GOL</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleScoreDelta('a', -1)}
                                                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all disabled:opacity-40"
                                                    disabled={Number(liveForm.data.score_a) <= 0}
                                                    title="Kurangi 1 Gol"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <div className="w-20 h-16 rounded-2xl bg-navy-950 border-2 border-slate-700 flex items-center justify-center font-mono text-3xl font-black text-amber-400 shadow-inner">
                                                    {liveForm.data.score_a === '' ? 0 : liveForm.data.score_a}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleScoreDelta('a', 1)}
                                                    className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black flex items-center justify-center shadow-md transition-all active:scale-95"
                                                    title="Tambah 1 Gol"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Penalty A (optional) */}
                                            <div className="pt-2 w-full flex items-center justify-center gap-2 text-xs">
                                                <span className="text-slate-400 text-[11px]">Penalti:</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="-"
                                                    value={liveForm.data.penalty_a}
                                                    onChange={(e) => liveForm.setData('penalty_a', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                    className="w-14 px-2 py-1 text-center bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Column: VS, Period, Minute */}
                                    <div className="lg:col-span-3 flex flex-col items-center justify-center text-center space-y-4 py-2">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-400">
                                            VS
                                        </div>

                                        {/* Period Selector Pills */}
                                        <div className="w-full space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Babak / Periode
                                            </span>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {['Babak 1', 'Istirahat (HT)', 'Babak 2', 'Adu Penalti'].map((p) => {
                                                    const isSelected = liveForm.data.live_period === p;
                                                    return (
                                                        <button
                                                            key={p}
                                                            type="button"
                                                            onClick={() => liveForm.setData('live_period', p)}
                                                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                                                isSelected 
                                                                    ? 'bg-amber-500 text-navy-950 shadow-xs' 
                                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                                            }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Minute Input */}
                                        <div className="w-full space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Menit Berjalan / Catatan Waktu
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: 12', 35', HT"
                                                value={liveForm.data.live_minute}
                                                onChange={(e) => liveForm.setData('live_minute', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-center text-white focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Team B Card */}
                                    <div className="lg:col-span-4 bg-slate-950/60 rounded-2xl border border-slate-800 p-5 flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 p-1.5 flex items-center justify-center">
                                            {activeMatch.team_b?.logo_url ? (
                                                <img src={activeMatch.team_b.logo_url} alt={activeMatch.team_b.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <Shield className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-white truncate max-w-[220px]">
                                                {activeMatch.team_b?.name || 'Menunggu Lawan'}
                                            </h3>
                                            <p className="text-xs text-slate-400 truncate max-w-[220px]">
                                                {activeMatch.team_b?.school || 'Sekolah / Perwakilan'}
                                            </p>
                                        </div>

                                        {/* Digital Score Display & Stepper */}
                                        <div className="w-full pt-2 flex flex-col items-center space-y-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SKOR GOL</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleScoreDelta('b', -1)}
                                                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all disabled:opacity-40"
                                                    disabled={Number(liveForm.data.score_b) <= 0}
                                                    title="Kurangi 1 Gol"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <div className="w-20 h-16 rounded-2xl bg-navy-950 border-2 border-slate-700 flex items-center justify-center font-mono text-3xl font-black text-amber-400 shadow-inner">
                                                    {liveForm.data.score_b === '' ? 0 : liveForm.data.score_b}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleScoreDelta('b', 1)}
                                                    className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black flex items-center justify-center shadow-md transition-all active:scale-95"
                                                    title="Tambah 1 Gol"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Penalty B (optional) */}
                                            <div className="pt-2 w-full flex items-center justify-center gap-2 text-xs">
                                                <span className="text-slate-400 text-[11px]">Penalti:</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="-"
                                                    value={liveForm.data.penalty_b}
                                                    onChange={(e) => liveForm.setData('penalty_b', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                    className="w-14 px-2 py-1 text-center bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Streaming URL & Court Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                            <Tv className="w-3.5 h-3.5 text-red-400" />
                                            <span>Link Siaran Langsung (YouTube / Live Stream URL)</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                placeholder="https://www.youtube.com/watch?v=... atau live link"
                                                value={liveForm.data.live_stream_url}
                                                onChange={(e) => liveForm.setData('live_stream_url', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-amber-500"
                                            />
                                            {liveForm.data.live_stream_url && (
                                                <a
                                                    href={liveForm.data.live_stream_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>Tes Link</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Nama Lapangan / Court</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Lapangan Utama"
                                            value={liveForm.data.court_name}
                                            onChange={(e) => liveForm.setData('court_name', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                {/* Operator Actions Command Bar */}
                                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {activeMatch.status !== 'live' ? (
                                            <button
                                                type="button"
                                                onClick={handleStartLive}
                                                disabled={liveForm.processing || !activeMatch.team_a || !activeMatch.team_b}
                                                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 flex items-center gap-2 transition-all disabled:opacity-50"
                                            >
                                                <Radio className="w-4 h-4 animate-pulse" />
                                                <span>Mulai Laga & Siarkan LIVE</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleRevertToScheduled}
                                                disabled={liveForm.processing}
                                                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                                            >
                                                Kembalikan ke Terjadwal
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleSaveLiveUpdate}
                                            disabled={liveForm.processing}
                                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>{liveForm.processing ? 'Menyimpan...' : 'Simpan Update Realtime'}</span>
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleCompleteMatch}
                                            disabled={liveForm.processing || !activeMatch.team_a || !activeMatch.team_b}
                                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Selesaikan Laga & Majukan Pemenang</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                Silakan pilih pertandingan terlebih dahulu untuk memulai kontrol live score.
                            </div>
                        )}
                    </div>
                )}

                {/* Match Lists Grouped By Round */}
                {['perempat_final', 'semifinal', 'final', 'juara_3'].map((roundKey) => {
                    const roundMatches = matches.filter((m) => m.round === roundKey);
                    if (roundMatches.length === 0) return null;

                    return (
                        <div key={roundKey} className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <Swords className="w-4 h-4 text-brand-600" />
                                    <span>{getRoundTitle(roundKey)}</span>
                                </h3>
                                <span className="text-xs text-slate-400">{roundMatches.length} Pertandingan</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roundMatches.map((m) => {
                                    const isLive = m.status === 'live';
                                    const isCompleted = m.status === 'completed';
                                    const isSelectedInConsole = activeConsoleMatchId === m.id;

                                    return (
                                        <div 
                                            key={m.id} 
                                            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                                                isLive 
                                                    ? 'border-red-500 ring-2 ring-red-500/10' 
                                                    : isSelectedInConsole
                                                    ? 'border-amber-500 ring-2 ring-amber-500/20'
                                                    : 'border-slate-200'
                                            }`}
                                        >
                                            {/* Match Card Top */}
                                            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <span className="font-bold text-slate-700">Laga #{m.match_order}</span>
                                                    <span>•</span>
                                                    <span>{m.court_name || 'Lapangan 1'}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {isLive && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                                                            <Radio className="w-3 h-3" />
                                                            LIVE
                                                        </span>
                                                    )}
                                                    {isCompleted && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                                            SELESAI
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(m)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                                                        title="Edit Pengaturan Laga"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Match Competitors & Scores */}
                                            <div className="space-y-3">
                                                {/* Team A */}
                                                <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                                                    m.winner_id === m.team_a?.id 
                                                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold' 
                                                        : 'bg-slate-50/70 border-slate-100 text-slate-800'
                                                }`}>
                                                    <div className="flex items-center gap-2.5 truncate pr-2">
                                                        <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                                                        <span className="text-xs truncate">
                                                            {m.team_a?.name || 'Menunggu Hasil'}
                                                        </span>
                                                    </div>
                                                    <div className="font-mono text-sm font-bold flex items-center gap-1">
                                                        <span>{m.score_a ?? '-'}</span>
                                                        {m.penalty_a !== null && (
                                                            <span className="text-[10px] text-slate-500">({m.penalty_a})</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Team B */}
                                                <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                                                    m.winner_id === m.team_b?.id 
                                                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold' 
                                                        : 'bg-slate-50/70 border-slate-100 text-slate-800'
                                                }`}>
                                                    <div className="flex items-center gap-2.5 truncate pr-2">
                                                        <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                                                        <span className="text-xs truncate">
                                                            {m.team_b?.name || 'Menunggu Hasil'}
                                                        </span>
                                                    </div>
                                                    <div className="font-mono text-sm font-bold flex items-center gap-1">
                                                        <span>{m.score_b ?? '-'}</span>
                                                        {m.penalty_b !== null && (
                                                            <span className="text-[10px] text-slate-500">({m.penalty_b})</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Action */}
                                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                                                <span>{m.match_time ? new Date(m.match_time).toLocaleString('id-ID') : 'Jadwal fleksibel'}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectMatchForConsole(m)}
                                                    className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                                                >
                                                    <Radio className="w-3 h-3" />
                                                    <span>Kontrol Live &rarr;</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {matches.length === 0 && (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-navy-950">Belum Ada Bagan Pertandingan</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                Klik tombol <strong>"Susun Bagan 8 Tim"</strong> di atas untuk mengatur pasangan lawan, jadwal tanding, dan melihat pratinjau bagan secara interaktif.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* BRACKET BUILDER & MATCHUP SCHEDULER MODAL */}
            {isBracketBuilderOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full overflow-hidden animate-in zoom-in-95 max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-navy-950 text-white flex items-center justify-between shrink-0 border-b border-navy-900">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        Susun & Jadwalkan Bagan Pertandingan (Bracket Builder)
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Tentukan tim yang saling berhadapan, atur tanggal/jam & lapangan, serta lihat pratinjau bagan secara realtime.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsBracketBuilderOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body: 2 Columns (Left: Matchup Configs, Right: Visual Tree Preview) */}
                        <form onSubmit={handleSaveBracket} className="flex-1 overflow-hidden flex flex-col">
                            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* LEFT COLUMN (7 Cols): Matchup Configs */}
                                <div className="lg:col-span-7 space-y-5">
                                    {/* Action bar inside form */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                        <div className="text-xs">
                                            <span className="font-bold text-slate-800 block">Sistem Gugur (8 Tim)</span>
                                            <span className="text-slate-500">4 Laga Perempat Final &rarr; Semifinal &rarr; Final</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAutoDraw}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all shadow-xs"
                                            title="Acak tim otomatis dari daftar lolos administrasi"
                                        >
                                            <Shuffle className="w-3.5 h-3.5" />
                                            <span>Acak Tim Otomatis (Auto-Draw)</span>
                                        </button>
                                    </div>

                                    {hasDuplicateTeams && (
                                        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>Perhatian: Terdapat tim yang dipilih lebih dari satu kali. Setiap tim hanya boleh bertanding di satu slot perempat final.</span>
                                        </div>
                                    )}

                                    {/* 4 Quarterfinal Matchup Cards */}
                                    <div className="space-y-4">
                                        {builderMatchups.map((matchup, idx) => (
                                            <div key={matchup.order} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                                                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                                    <span className="font-black text-navy-950">
                                                        Laga #{matchup.order} (Perempat Final {matchup.order})
                                                    </span>
                                                    <span className="text-[11px] text-brand-600 font-semibold">
                                                        Pemenang melaju ke Semifinal {matchup.order <= 2 ? '1' : '2'}
                                                    </span>
                                                </div>

                                                {/* Select Team A & Team B */}
                                                <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
                                                    <div className="sm:col-span-5 space-y-1">
                                                        <label className="text-[10px] font-bold uppercase text-slate-500 block">
                                                            Tim A
                                                        </label>
                                                        <select
                                                            value={matchup.team_a_id}
                                                            onChange={(e) => updateBuilderMatchup(idx, 'team_a_id', e.target.value === '' ? '' : Number(e.target.value))}
                                                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-brand-500 truncate"
                                                        >
                                                            <option value="">-- Pilih Tim A --</option>
                                                            {verifiedTeams.map((t) => (
                                                                <option key={t.id} value={t.id}>
                                                                    {t.name} ({t.school})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="sm:col-span-1 text-center font-bold text-xs text-slate-400">
                                                        VS
                                                    </div>

                                                    <div className="sm:col-span-5 space-y-1">
                                                        <label className="text-[10px] font-bold uppercase text-slate-500 block">
                                                            Tim B
                                                        </label>
                                                        <select
                                                            value={matchup.team_b_id}
                                                            onChange={(e) => updateBuilderMatchup(idx, 'team_b_id', e.target.value === '' ? '' : Number(e.target.value))}
                                                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-brand-500 truncate"
                                                        >
                                                            <option value="">-- Pilih Tim B --</option>
                                                            {verifiedTeams.map((t) => (
                                                                <option key={t.id} value={t.id}>
                                                                    {t.name} ({t.school})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Match Schedule & Court */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-50 text-xs">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                                                            Jadwal & Waktu Pertandingan
                                                        </label>
                                                        <input
                                                            type="datetime-local"
                                                            value={matchup.match_time}
                                                            onChange={(e) => updateBuilderMatchup(idx, 'match_time', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                                                            Lapangan / Venue
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={matchup.court_name}
                                                            onChange={(e) => updateBuilderMatchup(idx, 'court_name', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                                                            placeholder="Lapangan 1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN (5 Cols): Live Visual Tree Preview */}
                                <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white flex flex-col space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-amber-400" />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                                Pratinjau Alur Bagan (Live Preview)
                                            </h4>
                                        </div>
                                        <span className="text-[10px] text-slate-400">Update otomatis</span>
                                    </div>

                                    {/* Mini Bracket Tree Visualizer */}
                                    <div className="space-y-4 overflow-y-auto text-xs pr-1">
                                        {/* Semifinal 1 bracket section */}
                                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                                            <span className="text-[10px] font-bold text-amber-400 uppercase block">Jalur Semifinal 1</span>
                                            
                                            {/* QF 1 */}
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-400">
                                                    <span>QF 1 ({builderMatchups[0]?.court_name})</span>
                                                    <span>{builderMatchups[0]?.match_time ? new Date(builderMatchups[0].match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Jam: -'}</span>
                                                </div>
                                                <div className="font-bold text-white text-xs truncate">
                                                    {getTeamById(builderMatchups[0]?.team_a_id)?.name || 'Tim A'} <span className="text-slate-500 font-normal">vs</span> {getTeamById(builderMatchups[0]?.team_b_id)?.name || 'Tim B'}
                                                </div>
                                            </div>

                                            {/* QF 2 */}
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-400">
                                                    <span>QF 2 ({builderMatchups[1]?.court_name})</span>
                                                    <span>{builderMatchups[1]?.match_time ? new Date(builderMatchups[1].match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Jam: -'}</span>
                                                </div>
                                                <div className="font-bold text-white text-xs truncate">
                                                    {getTeamById(builderMatchups[1]?.team_a_id)?.name || 'Tim A'} <span className="text-slate-500 font-normal">vs</span> {getTeamById(builderMatchups[1]?.team_b_id)?.name || 'Tim B'}
                                                </div>
                                            </div>

                                            <div className="text-center text-[10px] text-brand-400 font-bold py-0.5">
                                                &darr; Pemenang bertemu di Semifinal 1 &darr;
                                            </div>
                                        </div>

                                        {/* Semifinal 2 bracket section */}
                                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                                            <span className="text-[10px] font-bold text-amber-400 uppercase block">Jalur Semifinal 2</span>
                                            
                                            {/* QF 3 */}
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-400">
                                                    <span>QF 3 ({builderMatchups[2]?.court_name})</span>
                                                    <span>{builderMatchups[2]?.match_time ? new Date(builderMatchups[2].match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Jam: -'}</span>
                                                </div>
                                                <div className="font-bold text-white text-xs truncate">
                                                    {getTeamById(builderMatchups[2]?.team_a_id)?.name || 'Tim A'} <span className="text-slate-500 font-normal">vs</span> {getTeamById(builderMatchups[2]?.team_b_id)?.name || 'Tim B'}
                                                </div>
                                            </div>

                                            {/* QF 4 */}
                                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-400">
                                                    <span>QF 4 ({builderMatchups[3]?.court_name})</span>
                                                    <span>{builderMatchups[3]?.match_time ? new Date(builderMatchups[3].match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Jam: -'}</span>
                                                </div>
                                                <div className="font-bold text-white text-xs truncate">
                                                    {getTeamById(builderMatchups[3]?.team_a_id)?.name || 'Tim A'} <span className="text-slate-500 font-normal">vs</span> {getTeamById(builderMatchups[3]?.team_b_id)?.name || 'Tim B'}
                                                </div>
                                            </div>

                                            <div className="text-center text-[10px] text-brand-400 font-bold py-0.5">
                                                &darr; Pemenang bertemu di Semifinal 2 &darr;
                                            </div>
                                        </div>

                                        {/* Grand Final Card */}
                                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                                            <Trophy className="w-5 h-5 text-amber-400 mx-auto" />
                                            <span className="text-xs font-black text-amber-300 block">
                                                GRAND FINAL
                                            </span>
                                            <span className="text-[11px] text-slate-300 block">
                                                Pemenang Semifinal 1 vs Pemenang Semifinal 2
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                                <span className="text-xs text-slate-500">
                                    {verifiedTeams.length} tim terverifikasi tersedia untuk bagan.
                                </span>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsBracketBuilderOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingBracket || hasDuplicateTeams}
                                        className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                                    >
                                        {isSubmittingBracket ? 'Menyimpan Bagan...' : 'Simpan & Terapkan Bagan'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Score & Match Update Modal (Secondary/Detail Editor) */}
            {selectedMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 bg-navy-950 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-bold text-white">Detail & Pengaturan Laga</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedMatch(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveScore} className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Competitor match banner */}
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">{getRoundTitle(selectedMatch.round)}</span>
                                <div className="text-sm font-black text-navy-950 flex items-center justify-center gap-2">
                                    <span>{selectedMatch.team_a?.name || 'Tim A'}</span>
                                    <span className="text-slate-400 text-xs">VS</span>
                                    <span>{selectedMatch.team_b?.name || 'Tim B'}</span>
                                </div>
                            </div>

                            {/* Regular Time Scores */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Skor {selectedMatch.team_a?.name || 'Tim A'}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={updateForm.data.score_a}
                                        onChange={(e) => updateForm.setData('score_a', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                        className="w-full px-3 py-2 text-center text-lg font-mono font-bold rounded-lg border border-slate-300"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Skor {selectedMatch.team_b?.name || 'Tim B'}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={updateForm.data.score_b}
                                        onChange={(e) => updateForm.setData('score_b', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                        className="w-full px-3 py-2 text-center text-lg font-mono font-bold rounded-lg border border-slate-300"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Penalty Scores (Optional if tied) */}
                            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                                <span className="text-[11px] font-bold text-amber-900 block">Skor Adu Penalti (Jika Seri / Imbang)</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={updateForm.data.penalty_a}
                                            onChange={(e) => updateForm.setData('penalty_a', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                            className="w-full px-3 py-1.5 text-center font-mono rounded-lg border border-amber-300 bg-white text-xs"
                                            placeholder="Penalti A"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={updateForm.data.penalty_b}
                                            onChange={(e) => updateForm.setData('penalty_b', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                            className="w-full px-3 py-1.5 text-center font-mono rounded-lg border border-amber-300 bg-white text-xs"
                                            placeholder="Penalti B"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status, Period, Minute */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Status Pertandingan
                                    </label>
                                    <select
                                        value={updateForm.data.status}
                                        onChange={(e) => updateForm.setData('status', e.target.value as any)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                                    >
                                        <option value="scheduled">Terjadwal</option>
                                        <option value="live">Sedang Berlangsung (LIVE)</option>
                                        <option value="completed">Selesai (Completed)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Babak / Periode
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.data.live_period}
                                        onChange={(e) => updateForm.setData('live_period', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                        placeholder="Contoh: Babak 1, Babak 2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Menit Pertandingan
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.data.live_minute}
                                        onChange={(e) => updateForm.setData('live_minute', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                        placeholder="Contoh: 15', 38'"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nama Lapangan / Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.data.court_name}
                                        onChange={(e) => updateForm.setData('court_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                        placeholder="Contoh: Lapangan Utama"
                                    />
                                </div>
                            </div>

                            {/* Stream URL */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Link Siaran Langsung (YouTube Live)
                                </label>
                                <input
                                    type="url"
                                    value={updateForm.data.live_stream_url}
                                    onChange={(e) => updateForm.setData('live_stream_url', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                    placeholder="https://www.youtube.com/..."
                                />
                            </div>

                            {/* Match Time */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Jadwal Pertandingan (Waktu)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={updateForm.data.match_time}
                                    onChange={(e) => updateForm.setData('match_time', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMatch(null)}
                                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateForm.processing}
                                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs"
                                >
                                    {updateForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
