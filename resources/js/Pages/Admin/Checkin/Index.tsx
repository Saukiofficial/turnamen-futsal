import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { 
    ScanLine, 
    Search, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    ShieldCheck, 
    Camera, 
    CameraOff,
    Keyboard 
} from 'lucide-react';

interface CheckinProps {
    events: { id: number; name: string }[];
    selectedEventId: number;
    sessions: { id: number; name: string; date: string; start_time: string; end_time: string }[];
    stats: {
        total_eligible: number;
        present: number;
        late: number;
        unaccounted: number;
    };
    recentCheckins: {
        id: number;
        registration_number: string;
        full_name: string;
        position: string;
        status: string;
        checked_in_at: string;
        session_name: string;
        checked_in_by: string;
        photo_url: string | null;
    }[];
}

export default function CheckinIndex({
    events,
    selectedEventId,
    sessions,
    stats,
    recentCheckins,
}: CheckinProps) {
    const [keyword, setKeyword] = useState('');
    const [selectedSessionId, setSelectedSessionId] = useState<number | ''>(sessions[0]?.id || '');
    const [checkinStatus, setCheckinStatus] = useState<'hadir' | 'terlambat'>('hadir');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<any | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const lookupRegistration = async (value: string) => {
        const normalizedValue = value.trim();
        if (!normalizedValue) return;

        try {
            setLoading(true);
            setFeedbackMessage(null);
            setSearchResult(null);

            const response = await axios.post(route('admin.checkin.lookup'), {
                keyword: normalizedValue,
                event_id: selectedEventId,
            });

            setSearchResult(response.data);
        } catch (err: any) {
            setFeedbackMessage({
                type: 'error',
                text: err.response?.data?.message || 'Pendaftar tidak ditemukan atau terjadi kesalahan.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        void lookupRegistration(keyword);
    };

    const openScanner = async () => {
        setCameraError(null);

        if (! window.isSecureContext) {
            setCameraError('Kamera hanya dapat digunakan melalui HTTPS atau localhost.');
            return;
        }

        if (! await QrScanner.hasCamera()) {
            setCameraError('Kamera tidak ditemukan pada perangkat ini.');
            return;
        }

        setScannerOpen(true);
    };

    useEffect(() => {
        if (! scannerOpen || ! videoRef.current) {
            return;
        }

        let scannerIsActive = true;
        const scanner = new QrScanner(
            videoRef.current,
            (result) => {
                if (! scannerIsActive) {
                    return;
                }

                const scannedToken = result.data.trim();
                scannerIsActive = false;
                scanner.stop();
                setKeyword(scannedToken);
                setScannerOpen(false);
                navigator.vibrate?.(100);
                void lookupRegistration(scannedToken);
            },
            {
                preferredCamera: 'environment',
                maxScansPerSecond: 10,
                highlightScanRegion: true,
                highlightCodeOutline: true,
                returnDetailedScanResult: true,
            },
        );

        scanner.start().catch((error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            setCameraError(
                message.toLowerCase().includes('permission') || message.toLowerCase().includes('denied')
                    ? 'Izin kamera ditolak. Aktifkan izin kamera pada pengaturan browser lalu coba lagi.'
                    : 'Kamera tidak dapat dibuka. Pastikan kamera tidak sedang digunakan aplikasi lain.',
            );
            setScannerOpen(false);
        });

        return () => {
            scannerIsActive = false;
            scanner.destroy();
        };
    }, [scannerOpen, selectedEventId]);

    const handleConfirm = (registrationId: number, playerName: string) => {
        if (!registrationId) return;

        router.post(route('admin.checkin.confirm'), {
            registration_id: registrationId,
            session_id: selectedSessionId || null,
            status: checkinStatus,
        }, {
            onSuccess: () => {
                if (searchResult?.type === 'team') {
                    setSearchResult((current: any) => ({
                        ...current,
                        team: {
                            ...current.team,
                            players: current.team.players.map((player: any) => (
                                player.registration_id === registrationId
                                    ? { ...player, attendance: { status: checkinStatus, checked_in_at: 'Baru saja' } }
                                    : player
                            )),
                        },
                    }));
                } else {
                    setSearchResult(null);
                    setKeyword('');
                }

                setFeedbackMessage({
                    type: 'success',
                    text: `Identitas ${playerName} cocok dengan roster resmi. Check-in berhasil dicatat.`,
                });
            },
        });
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Check-in Turnamen' }]}>
            <Head title="Check-in Kehadiran Turnamen Futsal" />

            <PageHeader
                title="Check-in Kehadiran Turnamen"
                description="Pindai QR token pada kartu peserta atau cari berdasarkan nomor pendaftaran untuk mencatat kehadiran peserta di venue turnamen."
                action={
                    <select
                        value={selectedEventId}
                        onChange={(e) => router.get(route('admin.checkin.index'), { event_id: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                    >
                        {events.map((evt) => (
                            <option key={evt.id} value={evt.id}>{evt.name}</option>
                        ))}
                    </select>
                }
            />

            {/* Attendance Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">Peserta Lolos Administrasi</span>
                    <span className="text-2xl font-extrabold text-navy-950 font-mono mt-1 block">{stats.total_eligible}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-emerald-600 uppercase block">Sudah Hadir</span>
                    <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">{stats.present}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-amber-600 uppercase block">Terlambat</span>
                    <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">{stats.late}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block">Belum Hadir</span>
                    <span className="text-2xl font-extrabold text-slate-500 font-mono mt-1 block">{stats.unaccounted}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Scanner & Manual Input (Left 7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ScanLine className="w-5 h-5 text-brand-600" />
                                <h3 className="text-sm font-bold text-navy-950">Pencarian & Scan Kartu</h3>
                            </div>
                            <span className="text-xs text-slate-400">Kamera / Scanner USB / Keyboard</span>
                        </div>

                        <div className="space-y-3">
                            {!scannerOpen ? (
                                <button
                                    type="button"
                                    onClick={() => void openScanner()}
                                    className="w-full h-12 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                                >
                                    <Camera className="w-5 h-5" />
                                    <span>Buka Kamera & Pindai QR Kartu</span>
                                </button>
                            ) : (
                                <div className="relative overflow-hidden rounded-2xl bg-black border border-slate-800 aspect-[4/3]">
                                    <video
                                        ref={videoRef}
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between text-white">
                                        <span className="text-xs font-semibold">Arahkan QR kartu ke dalam kotak</span>
                                        <button
                                            type="button"
                                            onClick={() => setScannerOpen(false)}
                                            className="p-2 rounded-lg bg-black/50 hover:bg-black/70"
                                            aria-label="Tutup kamera"
                                        >
                                            <CameraOff className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {cameraError && (
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{cameraError}</span>
                                </div>
                            )}
                        </div>

                        {/* Search Input Form */}
                        <form onSubmit={handleLookup} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Pindai Token QR atau Masukkan Nomor Pendaftaran
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Keyboard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="Contoh: FTS-2026-000127 atau token QR..."
                                            className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 uppercase"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>{loading ? 'Mencari...' : 'Cari'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Session Selection */}
                            {sessions.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Sesi Turnamen</label>
                                        <select
                                            value={selectedSessionId}
                                            onChange={(e) => setSelectedSessionId(Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                        >
                                            {sessions.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kehadiran</label>
                                        <select
                                            value={checkinStatus}
                                            onChange={(e) => setCheckinStatus(e.target.value as any)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                        >
                                            <option value="hadir">Hadir Tepat Waktu</option>
                                            <option value="terlambat">Terlambat</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Feedback message */}
                        {feedbackMessage && (
                            <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                                feedbackMessage.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                                {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                                <span>{feedbackMessage.text}</span>
                            </div>
                        )}

                        {/* Search Result Box: Team Accreditation */}
                        {searchResult?.found && searchResult.type === 'team' && searchResult.team && (
                            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-4 animate-fadeIn">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-white border border-indigo-200 overflow-hidden shrink-0 flex items-center justify-center font-black text-indigo-600 text-lg shadow-xs">
                                        {searchResult.team.logo_url ? (
                                            <img src={searchResult.team.logo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            searchResult.team.team_name.charAt(0)
                                        )}
                                    </div>

                                    <div className="space-y-1 flex-1 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-indigo-700 block text-[11px]">
                                                {searchResult.team.registration_number}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                searchResult.team.is_eligible 
                                                    ? 'bg-emerald-100 text-emerald-800' 
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {searchResult.team.verification_status.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-bold text-navy-950">
                                            {searchResult.team.team_name}
                                        </h4>
                                        <p className="text-slate-600 font-semibold">{searchResult.team.school_name}</p>
                                        <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-[11px]">
                                            <span>Pelatih: <strong className="text-slate-700">{searchResult.team.head_coach || '-'}</strong></span>
                                            <span>Manajer: <strong className="text-slate-700">{searchResult.team.manager_name} ({searchResult.team.manager_phone})</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
                                    <Camera className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <span>
                                        Cocokkan wajah pemain dengan foto pendaftaran, lalu periksa NISN, tanggal lahir, dan sekolah sebelum menekan tombol verifikasi.
                                    </span>
                                </div>

                                {/* Squad Player Identity Verification List */}
                                <div className="pt-2 border-t border-indigo-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-navy-950">Verifikasi Identitas Roster Resmi:</span>
                                        <span className="text-[11px] font-semibold text-indigo-600">{searchResult.team.players.length} Pemain</span>
                                    </div>
                                    <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
                                        {searchResult.team.players.map((p: any) => (
                                            <div key={p.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-14 h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {p.photo_url ? (
                                                            <img src={p.photo_url} alt={`Foto ${p.full_name}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Camera className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div>
                                                            <span className="font-bold text-slate-900 block">{p.full_name}</span>
                                                            <span className="text-[10px] text-slate-500">{p.school_name}</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mt-2 text-[10px] text-slate-600">
                                                            <span>NISN: <strong className="font-mono text-slate-800">{p.nisn}</strong></span>
                                                            <span>Lahir: <strong className="text-slate-800">{p.birth_date}</strong></span>
                                                            <span>Posisi: <strong className="text-slate-800">{p.position}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {p.attendance ? (
                                                    <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                        <span className="font-semibold">Identitas terverifikasi dan check-in pada {p.attendance.checked_in_at}</span>
                                                    </div>
                                                ) : p.is_eligible && p.registration_id ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleConfirm(p.registration_id, p.full_name)}
                                                        className="mt-3 w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                        <span>Wajah & Identitas Cocok, Izinkan Masuk</span>
                                                    </button>
                                                ) : (
                                                    <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                                        <span>Pemain tidak memenuhi syarat roster dan tidak boleh masuk venue.</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                                    searchResult.team.is_eligible
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                        : 'bg-rose-50 border-rose-200 text-rose-800'
                                }`}>
                                    {searchResult.team.is_eligible ? (
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    )}
                                    <span>
                                        {searchResult.team.is_eligible
                                            ? 'Tim terverifikasi. Hanya pemain yang identitasnya cocok dengan roster di atas yang boleh memasuki venue.'
                                            : 'Tim belum disetujui. Seluruh pemain ditolak masuk sampai verifikasi administrasi tim selesai.'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Search Result Box: Individual Player */}
                        {searchResult?.found && (searchResult.type === 'player' || !searchResult.type) && searchResult.registration && (
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-28 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                                        {searchResult.registration.photo_url ? (
                                            <img src={searchResult.registration.photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-slate-400">Foto</span>
                                        )}
                                    </div>

                                    <div className="space-y-1 flex-1 text-xs">
                                        <span className="font-mono font-bold text-brand-600 block text-[11px]">
                                            {searchResult.registration.registration_number}
                                        </span>
                                        <h4 className="text-base font-bold text-navy-950">
                                            {searchResult.registration.full_name}
                                        </h4>
                                        <p className="text-slate-500 font-medium">{searchResult.registration.school_name}</p>
                                        <div className="pt-1 flex flex-wrap items-center gap-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800">
                                                Posisi: {searchResult.registration.primary_position}
                                            </span>
                                            {searchResult.registration.is_eligible ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                    Lolos Administrasi
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                                    Belum Lolos
                                                </span>
                                            )}
                                        </div>
                                        {searchResult.registration.team_name && (
                                            <p className="pt-1 text-[11px] text-slate-600">
                                                Roster: <strong>{searchResult.registration.team_name}</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {searchResult.already_checked_in ? (
                                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                        <span>Peserta ini sudah melakukan check-in pada: {searchResult.attendance?.checked_in_at}.</span>
                                    </div>
                                ) : searchResult.registration.is_eligible ? (
                                    <button
                                        type="button"
                                        onClick={() => handleConfirm(searchResult.registration.id, searchResult.registration.full_name)}
                                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Konfirmasi Kehadiran Peserta</span>
                                    </button>
                                ) : (
                                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
                                        {searchResult.registration.eligibility_message}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Check-ins List (Right 5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Check-in Terbaru
                            </h3>
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold">{recentCheckins.length} peserta</span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                        {recentCheckins.map((att) => (
                            <div key={att.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 text-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-500">
                                        {att.photo_url ? (
                                            <img src={att.photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            att.full_name.charAt(0)
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-bold text-navy-950 block truncate">{att.full_name}</span>
                                        <span className="text-[10px] text-slate-400 font-mono block">
                                            {att.registration_number} • {att.position}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right space-y-0.5">
                                    <span className="font-mono font-bold text-slate-700 block">{att.checked_in_at}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        att.status === 'hadir' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {att.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {recentCheckins.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-xs">
                                Belum ada kehadiran yang dicatat hari ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
