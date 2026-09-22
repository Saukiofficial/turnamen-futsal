import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Trophy, 
    Save, 
    Search, 
    CheckCircle2, 
    Clock, 
    User, 
    FileSpreadsheet, 
    SlidersHorizontal,
    Star
} from 'lucide-react';

interface AssessmentIndexProps {
    events: { id: number; name: string }[];
    selectedEventId: number;
    criteria: {
        id: number;
        name: string;
        weight: number;
        min_score: number;
        max_score: number;
    }[];
    candidates: {
        id: number;
        registration_number: string;
        full_name: string;
        school_name: string;
        primary_position: string;
        selection_status: string;
        is_present: boolean;
        photo_url: string | null;
        assessments: Record<number, number>;
        calculated_score: number;
    }[];
    filters: {
        position?: string;
        search?: string;
    };
}

export default function AssessmentIndex({
    events,
    selectedEventId,
    criteria,
    candidates,
    filters,
}: AssessmentIndexProps) {
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(candidates[0]?.id || null);
    const [grades, setGrades] = useState<Record<number, number>>({});
    const [coachNote, setCoachNote] = useState('');
    const [saving, setSaving] = useState(false);

    const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

    // Load initial grades when switching candidate
    React.useEffect(() => {
        if (activeCandidate) {
            const initial: Record<number, number> = {};
            criteria.forEach(crit => {
                initial[crit.id] = activeCandidate.assessments[crit.id] ?? 75;
            });
            setGrades(initial);
        }
    }, [selectedCandidateId]);

    const handleGradeChange = (criterionId: number, val: number) => {
        setGrades(prev => ({
            ...prev,
            [criterionId]: Math.max(0, Math.min(100, val)),
        }));
    };

    // Calculate live score
    const currentScore = criteria.reduce((sum, crit) => {
        const val = grades[crit.id] ?? 0;
        return sum + (val * (crit.weight / 100));
    }, 0);

    const handleSaveGrades = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCandidate) return;

        setSaving(true);
        const formattedGrades = Object.entries(grades).map(([criterionId, score]) => ({
            criterion_id: Number(criterionId),
            score: score,
        }));

        router.post(route('admin.assessment.grades'), {
            registration_id: activeCandidate.id,
            grades: formattedGrades,
            note: coachNote,
        }, {
            onSuccess: () => {
                setSaving(false);
                alert('Nilai berhasil disimpan.');
            },
            onError: () => setSaving(false),
        });
    };

    const handleSetStatus = (status: string) => {
        if (!activeCandidate) return;
        if (confirm(`Tetapkan hasil seleksi pemain ini sebagai "${status.replace('_', ' ').toUpperCase()}"?`)) {
            router.post(route('admin.assessment.status'), {
                registration_id: activeCandidate.id,
                status: status,
            });
        }
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Penilaian Seleksi' }]}>
            <Head title="Penilaian & Hasil Seleksi Pemain" />

            <PageHeader
                title="Penilaian Kemampuan Pemain"
                description="Input nilai per kriteria seleksi, catat evaluasi pelatih, dan tentukan hasil seleksi pemain tim futsal."
                action={
                    <select
                        value={selectedEventId}
                        onChange={(e) => router.get(route('admin.assessment.index'), { event_id: e.target.value })}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                    >
                        {events.map((evt) => (
                            <option key={evt.id} value={evt.id}>{evt.name}</option>
                        ))}
                    </select>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Candidate List (Left 5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Daftar Pemain Diuji ({candidates.length})
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
                        {candidates.map((cand) => {
                            const isSelected = activeCandidate?.id === cand.id;
                            return (
                                <button
                                    key={cand.id}
                                    type="button"
                                    onClick={() => setSelectedCandidateId(cand.id)}
                                    className={`w-full p-3.5 text-left transition-colors flex items-center justify-between ${
                                        isSelected ? 'bg-brand-50/80 border-l-4 border-brand-600' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-500 text-xs">
                                            {cand.photo_url ? (
                                                <img src={cand.photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                cand.full_name.charAt(0)
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <span className={`text-xs font-bold block truncate ${isSelected ? 'text-brand-700' : 'text-navy-950'}`}>
                                                {cand.full_name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono block">
                                                {cand.registration_number} • {cand.primary_position}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right space-y-0.5">
                                        <span className="font-mono font-bold text-xs text-brand-600 block">
                                            {cand.calculated_score > 0 ? `${cand.calculated_score} pts` : '-'}
                                        </span>
                                        <StatusBadge status={cand.selection_status} size="sm" showIcon={false} />
                                    </div>
                                </button>
                            );
                        })}

                        {candidates.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-xs">
                                Belum ada peserta yang Lolos Administrasi untuk dinilai.
                            </div>
                        )}
                    </div>
                </div>

                {/* Grading Workspace (Right 7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                    {activeCandidate ? (
                        <>
                            {/* Candidate Header Summary */}
                            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-extrabold text-navy-950">{activeCandidate.full_name}</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 font-mono">
                                            {activeCandidate.primary_position}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono">{activeCandidate.registration_number} • {activeCandidate.school_name}</p>
                                </div>

                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Nilai Akhir Terbobot</span>
                                    <span className="text-2xl font-black text-brand-600 font-mono">
                                        {Math.round(currentScore * 100) / 100}
                                    </span>
                                </div>
                            </div>

                            {/* Scoring Form */}
                            <form onSubmit={handleSaveGrades} className="space-y-4">
                                <div className="space-y-3">
                                    {criteria.map((crit) => (
                                        <div key={crit.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-800">
                                                    {crit.name} <span className="text-slate-400 font-normal">({crit.weight}%)</span>
                                                </span>
                                                <span className="font-mono font-bold text-brand-600 text-sm">
                                                    {grades[crit.id] ?? 0} / 100
                                                </span>
                                            </div>

                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={grades[crit.id] ?? 0}
                                                onChange={(e) => handleGradeChange(crit.id, Number(e.target.value))}
                                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Evaluasi Pelatih</label>
                                    <textarea
                                        rows={2}
                                        value={coachNote}
                                        onChange={(e) => setCoachNote(e.target.value)}
                                        placeholder="Catatan kekuatan, visi bermain, atau rekomendasi spesifik untuk pemain ini..."
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? 'Menyimpan...' : 'Simpan Nilai Kriteria'}</span>
                                    </button>

                                    {/* Final Status Decision Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSetStatus('lolos_seleksi')}
                                            className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                                        >
                                            Lolos Skuad
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSetStatus('cadangan')}
                                            className="px-3 py-2 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600"
                                        >
                                            Cadangan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSetStatus('tidak_lolos')}
                                            className="px-3 py-2 rounded-lg bg-slate-600 text-white font-bold text-xs hover:bg-slate-700"
                                        >
                                            Tidak Lolos
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="py-20 text-center text-slate-400 text-xs">
                            Pilih pemain dari daftar sebelah kiri untuk memulai penilaian.
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
