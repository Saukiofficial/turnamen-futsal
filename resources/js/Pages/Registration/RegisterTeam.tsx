import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { 
    Users, 
    ArrowLeft, 
    ArrowRight, 
    Upload, 
    Check, 
    AlertCircle, 
    CheckCircle2, 
    Shield, 
    FileText, 
    Phone, 
    Award, 
    School, 
    User, 
    Image as ImageIcon,
    FileCheck,
    Plus,
    Trash2,
    Loader2,
    Shirt,
    UserCheck,
    UserX,
    ExternalLink,
    AlertTriangle,
    Info
} from 'lucide-react';

interface RegisterTeamProps {
    event: {
        id: number;
        name: string;
        organizer: string;
        location: string;
        registration_end_at: string;
    } | null;
}

interface SquadPlayer {
    nisn: string;
    jersey_number: string;
    status: 'idle' | 'checking' | 'valid' | 'not_found' | 'already_in_team' | 'error';
    message?: string;
    playerData?: {
        id: number;
        nisn: string;
        name: string;
        school: string;
        position: string;
        photo_url: string | null;
    } | null;
}

export default function RegisterTeam({ event }: RegisterTeamProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [documentName, setDocumentName] = useState<string | null>(null);
    const [squadError, setSquadError] = useState<string | null>(null);

    // Initial 5 squad player slots (minimum for a futsal team)
    const [players, setPlayers] = useState<SquadPlayer[]>([
        { nisn: '', jersey_number: '', status: 'idle' },
        { nisn: '', jersey_number: '', status: 'idle' },
        { nisn: '', jersey_number: '', status: 'idle' },
        { nisn: '', jersey_number: '', status: 'idle' },
        { nisn: '', jersey_number: '', status: 'idle' },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        event_id: event?.id || 1,
        team_name: '',
        school_name: '',
        head_coach: '',
        manager_name: '',
        manager_phone: '',
        logo: null as File | null,
        document: null as File | null,
        players: [] as Array<{ nisn: string; jersey_number: string }>,
        agreement: false,
    });

    // Synchronize valid players to useForm payload
    useEffect(() => {
        const payloadPlayers = players
            .filter(p => p.nisn.trim().length === 10)
            .map(p => ({
                nisn: p.nisn.trim(),
                jersey_number: p.jersey_number.trim(),
            }));
        setData('players', payloadPlayers);
    }, [players]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
            alert('Format logo harus JPG, PNG, atau WEBP.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file logo maksimal 2 MB.');
            return;
        }

        setData('logo', file);
        const reader = new FileReader();
        reader.onload = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran dokumen maksimal 5 MB.');
            return;
        }

        setData('document', file);
        setDocumentName(file.name);
    };

    // Verify player NISN with backend
    const verifyPlayerNisn = async (index: number, nisnToCheck: string) => {
        if (nisnToCheck.length !== 10) return;

        // Check if duplicate in another row
        const duplicateIndex = players.findIndex((p, idx) => idx !== index && p.nisn === nisnToCheck);
        if (duplicateIndex !== -1) {
            setPlayers(prev => {
                const next = [...prev];
                next[index] = {
                    ...next[index],
                    status: 'error',
                    message: `NISN ini sudah diinput pada Pemain #${duplicateIndex + 1}.`,
                    playerData: null,
                };
                return next;
            });
            return;
        }

        setPlayers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], status: 'checking', message: 'Memverifikasi NISN di database Tahap 1...' };
            return next;
        });

        try {
            const endpoint = typeof route === 'function' ? route('team.check-player-nisn') : '/api/teams/check-player-nisn';
            const response = await axios.post(endpoint, {
                nisn: nisnToCheck,
                event_id: event?.id || 1,
            });

            if (response.data.valid) {
                setPlayers(prev => {
                    const next = [...prev];
                    next[index] = {
                        ...next[index],
                        status: 'valid',
                        message: 'Pemain terverifikasi di Tahap 1',
                        playerData: response.data.player,
                    };
                    return next;
                });
            } else if (response.data.already_in_team) {
                setPlayers(prev => {
                    const next = [...prev];
                    next[index] = {
                        ...next[index],
                        status: 'already_in_team',
                        message: response.data.message,
                        playerData: null,
                    };
                    return next;
                });
            } else {
                setPlayers(prev => {
                    const next = [...prev];
                    next[index] = {
                        ...next[index],
                        status: 'not_found',
                        message: response.data.message || 'NISN belum terdaftar di Tahap 1.',
                        playerData: null,
                    };
                    return next;
                });
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || 'Gagal memverifikasi NISN. Pastikan NISN 10 digit.';
            setPlayers(prev => {
                const next = [...prev];
                next[index] = {
                    ...next[index],
                    status: 'error',
                    message: errMsg,
                    playerData: null,
                };
                return next;
            });
        }
    };

    const handlePlayerNisnChange = (index: number, value: string) => {
        const clean = value.replace(/\D/g, '').slice(0, 10);
        setSquadError(null);

        setPlayers(prev => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                nisn: clean,
                status: clean.length === 10 ? 'checking' : 'idle',
                message: clean.length > 0 && clean.length < 10 ? `Kurang ${10 - clean.length} digit lagi` : undefined,
                playerData: clean.length === 10 ? next[index].playerData : null,
            };
            return next;
        });

        if (clean.length === 10) {
            verifyPlayerNisn(index, clean);
        }
    };

    const handlePlayerJerseyChange = (index: number, value: string) => {
        const clean = value.replace(/\D/g, '').slice(0, 3);
        setPlayers(prev => {
            const next = [...prev];
            next[index] = { ...next[index], jersey_number: clean };
            return next;
        });
    };

    const addPlayerRow = () => {
        if (players.length >= 14) {
            alert('Maksimal skuad adalah 14 pemain.');
            return;
        }
        setPlayers(prev => [...prev, { nisn: '', jersey_number: '', status: 'idle' }]);
    };

    const removePlayerRow = (index: number) => {
        if (players.length <= 1) {
            alert('Minimal harus ada 1 baris input pemain.');
            return;
        }
        setPlayers(prev => prev.filter((_, idx) => idx !== index));
    };

    const verifiedCount = players.filter(p => p.status === 'valid').length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSquadError(null);

        if (!data.agreement) {
            alert('Harap centang persetujuan keabsahan dokumen tim.');
            return;
        }

        // Validation for linked 2-stage tournament:
        // Must have at least 5 verified players
        if (verifiedCount < 5) {
            setSquadError(`Tim futsal wajib memiliki minimal 5 pemain yang telah terdaftar & terverifikasi di Tahap 1 (Pendaftaran Individu). Saat ini baru ${verifiedCount} pemain yang valid.`);
            const el = document.getElementById('squad-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Check if there are invalid rows
        const hasUnverified = players.some(p => p.nisn.length > 0 && p.status !== 'valid');
        if (hasUnverified) {
            setSquadError('Masih terdapat baris pemain dengan NISN yang belum terverifikasi atau tidak valid. Silakan perbaiki atau hapus baris tersebut.');
            const el = document.getElementById('squad-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        post(route('team.store'));
    };

    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title={`Pendaftaran Tim Futsal - ${event?.name || 'SAF League 2026'}`} />
            <Navbar />

            {/* Event Masthead */}
            <section className="relative bg-navy-950 text-white pt-10 pb-20 sm:pb-28 border-b border-navy-900 overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <img 
                        src="/images/registration_banner.jpg" 
                        alt="Turnamen Futsal SAF League" 
                        className="w-full h-full object-cover object-center opacity-85 brightness-110 contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Link 
                                    href={route('home')} 
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Beranda</span>
                                </Link>
                                <span className="text-white/30 text-xs">•</span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-500/30">
                                    FORMULIR TIM RESMI
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                                Pendaftaran Tim Futsal Kontingen Sekolah
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                                {event?.name || 'Turnamen Futsal SAF League 2026'} — Daftarkan tim resmi sekolah Anda untuk berlaga pada turnamen bergengsi sistem gugur (knockout) SAF League.
                            </p>

                            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-200">
                                <span className="inline-flex items-center gap-1.5 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
                                    <School className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                                    <span>Khusus Sekolah / Madrasah</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs text-emerald-300">
                                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Akreditasi & Sertifikasi Resmi</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Form Container */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16 relative z-20">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                    {/* Switcher to Individual Registration */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-brand-600" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hanya Ingin Mendaftar Individu?</h4>
                                <p className="text-xs text-slate-500">
                                    Pemain perorangan yang ingin mengikuti talent scouting dapat menggunakan formulir individu.
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('registration.create')}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shrink-0 transition-colors shadow-xs"
                        >
                            <span>Formulir Individu</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                        {/* Section 1: Profil Tim & Sekolah */}
                        <div className="space-y-5">
                            <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                                <School className="w-5 h-5 text-amber-500" />
                                <h3 className="text-base font-bold text-navy-950 uppercase tracking-wide">
                                    1. Identitas Tim & Sekolah
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Nama Tim */}
                                <div>
                                    <label htmlFor="team_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nama Tim <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="team_name"
                                        type="text"
                                        required
                                        value={data.team_name}
                                        onChange={(e) => setData('team_name', e.target.value)}
                                        placeholder="Contoh: SMANSA Futsal Club"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                    {errors.team_name && <p className="text-xs text-rose-600 mt-1">{errors.team_name}</p>}
                                </div>

                                {/* Nama Sekolah */}
                                <div>
                                    <label htmlFor="school_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Nama Sekolah / Instansi <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="school_name"
                                        type="text"
                                        required
                                        value={data.school_name}
                                        onChange={(e) => setData('school_name', e.target.value)}
                                        placeholder="Contoh: SMA Negeri 1 Sumenep"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                    {errors.school_name && <p className="text-xs text-rose-600 mt-1">{errors.school_name}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Tim Pelatih & Official */}
                        <div className="space-y-5">
                            <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                                <Award className="w-5 h-5 text-brand-600" />
                                <h3 className="text-base font-bold text-navy-950 uppercase tracking-wide">
                                    2. Head Coach & Manager Tim
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {/* Head Coach */}
                                <div>
                                    <label htmlFor="head_coach" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Head Coach (Pelatih) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="head_coach"
                                        type="text"
                                        required
                                        value={data.head_coach}
                                        onChange={(e) => setData('head_coach', e.target.value)}
                                        placeholder="Nama Pelatih Kepala"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                    {errors.head_coach && <p className="text-xs text-rose-600 mt-1">{errors.head_coach}</p>}
                                </div>

                                {/* Manager Team */}
                                <div>
                                    <label htmlFor="manager_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Manager Team <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="manager_name"
                                        type="text"
                                        required
                                        value={data.manager_name}
                                        onChange={(e) => setData('manager_name', e.target.value)}
                                        placeholder="Nama Manager Tim"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                    {errors.manager_name && <p className="text-xs text-rose-600 mt-1">{errors.manager_name}</p>}
                                </div>

                                {/* WhatsApp Manager */}
                                <div>
                                    <label htmlFor="manager_phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        No. WhatsApp Manager <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                                        <input
                                            id="manager_phone"
                                            type="tel"
                                            required
                                            value={data.manager_phone}
                                            onChange={(e) => setData('manager_phone', e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">Digunakan untuk konfirmasi jadwal & Technical Meeting.</p>
                                    {errors.manager_phone && <p className="text-xs text-rose-600 mt-1">{errors.manager_phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Upload Berkas & Logo */}
                        <div className="space-y-5">
                            <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-navy-950 uppercase tracking-wide">
                                    3. Unggah Berkas & Logo
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Upload Logo Sekolah / Tim (5 Cols) */}
                                <div className="md:col-span-5 flex flex-col items-center p-5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        Logo Sekolah / Tim <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>

                                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center shadow-xs relative mb-3">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="text-slate-400 flex flex-col items-center">
                                                <ImageIcon className="w-8 h-8 stroke-1 mb-1" />
                                                <span className="text-[10px]">Logo Tim</span>
                                            </div>
                                        )}
                                    </div>

                                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors">
                                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Pilih Logo (PNG/JPG)</span>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-2">Maksimal 2 MB. Format transparan PNG direkomendasikan.</p>
                                    {errors.logo && <p className="text-xs text-rose-600 mt-1">{errors.logo}</p>}
                                </div>

                                {/* Upload Berkas Gabungan: Rekomendasi & NISN (7 Cols) */}
                                <div className="md:col-span-7 flex flex-col justify-between p-5 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-amber-500 text-navy-950 font-bold text-[10px] uppercase">Wajib Diunggah</span>
                                            <h4 className="text-sm font-bold text-navy-950">
                                                Surat Rekomendasi Sekolah & NISN Peserta
                                            </h4>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Jadikan <strong>1 file dokumen (PDF atau Foto)</strong> yang memuat:
                                        </p>
                                        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                            <li>Surat Rekomendasi / Keterangan resmi dari Kepala Sekolah.</li>
                                            <li>Daftar Nama & Nomor NISN pemain/skuad tim.</li>
                                        </ul>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-amber-200/80">
                                        <label className="cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-xl border border-amber-300 bg-white hover:bg-amber-50/80 transition-colors shadow-xs">
                                            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                                <FileCheck className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="text-center sm:text-left flex-1">
                                                <span className="text-xs font-bold text-slate-800 block">
                                                    {documentName ? documentName : 'Klik untuk Mengunggah Berkas (PDF / Gambar)'}
                                                </span>
                                                <span className="text-[11px] text-slate-500 block">
                                                    Maksimal ukuran file: 5 MB (Format PDF, JPG, PNG)
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                required
                                                accept=".pdf,image/jpeg,image/png"
                                                onChange={handleDocumentChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {errors.document && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.document}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Skuad & Roster Pemain Tim */}
                        <div id="squad-section" className="space-y-6 pt-4 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <Shirt className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <h3 className="text-base font-bold text-navy-950 uppercase tracking-wide">
                                            4. Skuad & Roster Pemain Tim
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Pemain wajib telah mendaftar di <strong>Tahap 1 (Formulir Individu)</strong> menggunakan NISN.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                        verifiedCount >= 5 
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}>
                                        {verifiedCount >= 5 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        <span>{verifiedCount} / 5 Min. Pemain Terverifikasi</span>
                                    </span>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-blue-950">
                                        Mekanisme Turnamen 2-Tahap Terhubung (NISN Validation):
                                    </p>
                                    <p className="text-blue-800">
                                        Setiap atlet futsal dari perwakilan sekolah Anda harus menyelesaikan <strong>Pendaftaran Individu</strong> terlebih dahulu. Masukkan 10 digit NISN atlet di bawah untuk memasukkan mereka ke skuad resmi tim. Sistem akan mencocokkan data secara realtime.
                                    </p>
                                    <div className="pt-1">
                                        <a 
                                            href={route('registration.create')} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline"
                                        >
                                            <span>Buka Formulir Pendaftaran Individu Tahap 1 (Tab Baru)</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Squad Error Banner */}
                            {squadError && (
                                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-xs text-rose-800">
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-rose-900">Perhatian Pendaftaran Skuad:</p>
                                        <p>{squadError}</p>
                                    </div>
                                </div>
                            )}

                            {/* Players List */}
                            <div className="space-y-4">
                                {players.map((player, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-4 rounded-xl border transition-all ${
                                            player.status === 'valid'
                                                ? 'bg-emerald-50/40 border-emerald-200'
                                                : player.status === 'not_found' || player.status === 'already_in_team' || player.status === 'error'
                                                ? 'bg-rose-50/40 border-rose-200'
                                                : 'bg-slate-50/80 border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                    Pemain #{index + 1} {index < 5 && <span className="text-amber-600 font-semibold">(Starting Five)</span>}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Status Indicator */}
                                                {player.status === 'checking' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full animate-pulse">
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        <span>Mengecek NISN...</span>
                                                    </span>
                                                )}
                                                {player.status === 'valid' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                        <UserCheck className="w-3 h-3" />
                                                        <span>Terverifikasi Tahap 1</span>
                                                    </span>
                                                )}
                                                {player.status === 'not_found' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                                                        <UserX className="w-3 h-3" />
                                                        <span>Belum Terdaftar</span>
                                                    </span>
                                                )}
                                                {player.status === 'already_in_team' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        <span>Sudah di Tim Lain</span>
                                                    </span>
                                                )}

                                                {/* Delete Row Button */}
                                                {players.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePlayerRow(index)}
                                                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                                                        title="Hapus baris pemain ini"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                                            {/* NISN Input */}
                                            <div className="sm:col-span-8">
                                                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                                    NISN Pemain (10 Digit) <span className="text-rose-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={10}
                                                        value={player.nisn}
                                                        onChange={(e) => handlePlayerNisnChange(index, e.target.value)}
                                                        placeholder="Masukkan 10 digit NISN..."
                                                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                                    />
                                                    {player.nisn.length === 10 && player.status !== 'checking' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => verifyPlayerNisn(index, player.nisn)}
                                                            className="absolute right-2 top-2 text-[10px] font-bold uppercase text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2 py-0.5 rounded border border-brand-200"
                                                        >
                                                            Cek Ulang
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Jersey Number */}
                                            <div className="sm:col-span-4">
                                                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                                    No. Punggung <span className="text-slate-400 font-normal">(1 - 99)</span>
                                                </label>
                                                <div className="relative">
                                                    <Shirt className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={3}
                                                        value={player.jersey_number}
                                                        onChange={(e) => handlePlayerJerseyChange(index, e.target.value)}
                                                        placeholder="e.g. 10"
                                                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Feedback / Verified Player Preview */}
                                        {player.status === 'valid' && player.playerData && (
                                            <div className="mt-3 p-3 rounded-lg bg-white border border-emerald-300/80 shadow-xs flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {player.playerData.photo_url ? (
                                                        <img 
                                                            src={player.playerData.photo_url} 
                                                            alt={player.playerData.name} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <User className="w-6 h-6 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="text-xs font-bold text-navy-950 truncate">
                                                            {player.playerData.name}
                                                        </h5>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                                                            {player.playerData.position}
                                                        </span>
                                                        {player.jersey_number && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white shrink-0">
                                                                #{player.jersey_number}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                        NISN: <span className="font-mono text-slate-700 font-semibold">{player.playerData.nisn}</span> • {player.playerData.school}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {player.status === 'not_found' && (
                                            <div className="mt-2.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
                                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                                <div className="space-y-0.5">
                                                    <p className="font-semibold">{player.message}</p>
                                                    <p className="text-[11px] text-rose-700">
                                                        Pemain harus mendaftar individu terlebih dahulu sebelum bisa dimasukkan ke dalam skuad tim.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {player.status === 'already_in_team' && (
                                            <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="font-medium">{player.message}</p>
                                            </div>
                                        )}

                                        {player.status === 'error' && player.message && (
                                            <div className="mt-2.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
                                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                                <p className="font-medium">{player.message}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Player Row Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={addPlayerRow}
                                    disabled={players.length >= 14}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4 text-brand-600" />
                                    <span>Tambah Pemain Skuad ({players.length}/14)</span>
                                </button>
                                <span className="text-xs text-slate-500">
                                    Minimal 5 pemain terverifikasi (Starting Five), maksimal 14 pemain.
                                </span>
                            </div>
                        </div>

                        {/* Section 5: Pernyataan & Kirim Formulir */}
                        <div className="pt-4 border-t border-slate-200 space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    required
                                    checked={data.agreement}
                                    onChange={(e) => setData('agreement', e.target.checked)}
                                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 mt-0.5"
                                />
                                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                                    Saya menyatakan sebagai perwakilan resmi sekolah dan bertanggung jawab penuh atas kebenaran berkas Surat Rekomendasi serta daftar NISN pemain yang dilampirkan.
                                </span>
                            </label>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                <Link
                                    href={route('home')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Batal</span>
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-amber-500 text-navy-950 hover:bg-amber-400 font-bold text-sm shadow-md transition-all disabled:opacity-50"
                                >
                                    {processing ? (
                                        <span>Mengirim Pendaftaran Tim...</span>
                                    ) : (
                                        <>
                                            <span>Kirim Pendaftaran Tim</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
