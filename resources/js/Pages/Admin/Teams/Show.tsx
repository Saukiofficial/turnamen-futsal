import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Users, 
    ArrowLeft, 
    School, 
    Phone, 
    FileText, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    ExternalLink, 
    Printer,
    Save,
    Shield,
    User
} from 'lucide-react';

interface TeamPlayer {
    id: number;
    nisn: string;
    jersey_number: string | null;
    name: string;
    school: string;
    position: string;
    photo_url: string | null;
    verified_status: string;
}

interface TeamShowProps {
    team: {
        id: number;
        registration_number: string;
        access_code: string;
        team_name: string;
        school_name: string;
        head_coach: string;
        manager_name: string;
        manager_phone: string;
        verification_status: string;
        verification_notes: string | null;
        submitted_at: string;
        verified_at: string | null;
        verified_by_name: string | null;
        logo_url: string | null;
        document_url: string | null;
        qr_token: string;
        event_name: string;
        players?: TeamPlayer[];
    };
}

export default function AdminTeamsShow({ team }: TeamShowProps) {
    const { data, setData, post, processing } = useForm({
        verification_status: team.verification_status,
        verification_notes: team.verification_notes || '',
    });

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.teams.verify', team.id));
    };

    const isPdf = team.document_url?.toLowerCase().endsWith('.pdf');

    return (
        <AdminShell
            title={`Verifikasi Tim - ${team.team_name}`}
            breadcrumbs={[
                { label: 'Admin', href: route('admin.dashboard') },
                { label: 'Pendaftar Tim', href: route('admin.teams.index') },
                { label: team.team_name },
            ]}
        >
            <Head title={`Verifikasi Tim ${team.team_name} - Admin`} />

            <div className="space-y-6">
                {/* Top Action & Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Link
                        href={route('admin.teams.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Tim</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={team.verification_status} size="md" />
                        {team.verification_status === 'lolos_administrasi' && (
                            <a
                                href={route('team.print-card', team.registration_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-navy-950 hover:bg-amber-400 text-xs font-bold shadow-xs transition-colors"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Kartu Akreditasi Tim</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Team Profile & Verification Form (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                                    {team.logo_url ? (
                                        <img src={team.logo_url} alt={team.team_name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Users className="w-8 h-8 text-slate-400" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">KONTINGEN SEKOLAH</span>
                                    <h2 className="text-lg font-black text-navy-950 truncate">{team.team_name}</h2>
                                    <p className="text-xs text-slate-600 flex items-center gap-1 font-medium truncate mt-0.5">
                                        <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{team.school_name}</span>
                                    </p>
                                </div>
                            </div>

                            <dl className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <dt className="text-slate-400 font-medium text-[10px] uppercase">No. Registrasi</dt>
                                    <dd className="font-mono font-bold text-slate-800 text-xs mt-0.5">{team.registration_number}</dd>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <dt className="text-slate-400 font-medium text-[10px] uppercase">Kode Akses</dt>
                                    <dd className="font-mono font-bold text-amber-700 text-xs mt-0.5">{team.access_code}</dd>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <dt className="text-slate-400 font-medium text-[10px] uppercase">Head Coach</dt>
                                    <dd className="font-bold text-slate-800 text-xs mt-0.5">{team.head_coach}</dd>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <dt className="text-slate-400 font-medium text-[10px] uppercase">Manager</dt>
                                    <dd className="font-bold text-slate-800 text-xs mt-0.5">{team.manager_name}</dd>
                                </div>
                            </dl>

                            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
                                <span className="text-emerald-800 font-semibold">WhatsApp Manager:</span>
                                <a 
                                    href={`https://wa.me/${team.manager_phone.replace(/\D/g, '')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="font-mono font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{team.manager_phone}</span>
                                </a>
                            </div>

                            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 space-y-1">
                                <div>Mendaftar pada: {team.submitted_at}</div>
                                {team.verified_at && (
                                    <div>Diverifikasi oleh: {team.verified_by_name || 'Admin'} ({team.verified_at})</div>
                                )}
                            </div>
                        </div>

                        {/* Verification Form Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
                                <Shield className="w-4 h-4 text-brand-600" />
                                <span>Formulir Keputusan Verifikasi</span>
                            </h3>

                            <form onSubmit={handleVerify} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                                        Status Administrasi Tim <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { val: 'lolos_administrasi', label: 'Lolos Administrasi (Sah Bertanding)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
                                            { val: 'perlu_perbaikan', label: 'Perlu Perbaikan (Berkas Belum Lengkap)', color: 'text-amber-700 bg-amber-50 border-amber-300' },
                                            { val: 'ditolak', label: 'Ditolak (Tidak Memenuhi Syarat)', color: 'text-rose-700 bg-rose-50 border-rose-300' },
                                        ].map((opt) => (
                                            <label 
                                                key={opt.val} 
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                                                    data.verification_status === opt.val ? `${opt.color} ring-1 ring-brand-500` : 'border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="verification_status"
                                                    value={opt.val}
                                                    checked={data.verification_status === opt.val}
                                                    onChange={(e) => setData('verification_status', e.target.value)}
                                                    className="w-4 h-4 text-brand-600"
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Catatan Verifikator untuk Manager Tim <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.verification_notes}
                                        onChange={(e) => setData('verification_notes', e.target.value)}
                                        placeholder="Contoh: Berkas surat rekomendasi sah dan daftar 12 pemain terverifikasi lengkap."
                                        className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{processing ? 'Menyimpan...' : 'Simpan Status Verifikasi'}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Document Viewer (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-bold text-navy-950">
                                    Dokumen Surat Rekomendasi & NISN Peserta
                                </h3>
                            </div>

                            {team.document_url && (
                                <a
                                    href={team.document_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                                >
                                    <span>Buka di Tab Baru</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>

                        {team.document_url ? (
                            <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[500px] flex items-center justify-center">
                                {isPdf ? (
                                    <iframe
                                        src={`${team.document_url}#toolbar=1`}
                                        title="Surat Rekomendasi & NISN Peserta"
                                        className="w-full h-[650px] rounded-xl border-none"
                                    />
                                ) : (
                                    <img
                                        src={team.document_url}
                                        alt="Surat Rekomendasi & NISN Peserta"
                                        className="max-w-full max-h-[650px] object-contain p-2"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="p-12 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                                Tidak ada dokumen yang dilampirkan.
                            </div>
                        )}
                    </div>
                </div>

                {/* Full-Width Squad Players Roster */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <Users className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
                                    Daftar Skuad Pemain Tim ({team.players?.length || 0} Atlet Terdaftar)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pemain dicocokkan otomatis via NISN dari pendaftaran perorangan Tahap 1.
                                </p>
                            </div>
                        </div>

                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                            Minimal 5 Atlet • Maksimal 14 Atlet
                        </span>
                    </div>

                    {team.players && team.players.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold text-[10px]">
                                        <th className="py-2.5 px-3">No</th>
                                        <th className="py-2.5 px-3">No. Jersey</th>
                                        <th className="py-2.5 px-3">Nama Atlet</th>
                                        <th className="py-2.5 px-3">NISN</th>
                                        <th className="py-2.5 px-3">Asal Sekolah</th>
                                        <th className="py-2.5 px-3">Posisi</th>
                                        <th className="py-2.5 px-3">Status Tahap 1</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {team.players.map((player, idx) => (
                                        <tr key={player.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3 px-3 font-semibold text-slate-500">
                                                #{idx + 1}
                                            </td>
                                            <td className="py-3 px-3">
                                                {player.jersey_number ? (
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-navy-950 text-white font-mono font-bold text-xs">
                                                        {player.jersey_number}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-mono">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {player.photo_url ? (
                                                            <img 
                                                                src={player.photo_url} 
                                                                alt={player.name} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        ) : (
                                                            <User className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">
                                                            {player.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            ID: #{player.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 font-mono font-bold text-slate-800">
                                                {player.nisn}
                                            </td>
                                            <td className="py-3 px-3 text-slate-600">
                                                {player.school}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                    {player.position}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <StatusBadge status={player.verified_status} size="sm" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-1">
                            <Users className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                            <p className="font-medium text-slate-600">Belum Ada Skuad Pemain yang Diinput</p>
                            <p className="text-[11px]">Tim ini belum melampirkan daftar NISN skuad pemain melalui sistem.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
