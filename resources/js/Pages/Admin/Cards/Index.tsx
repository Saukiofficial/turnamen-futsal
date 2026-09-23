import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import ParticipantCardDesign from '@/Components/ParticipantCardDesign';
import { Printer, Eye, Search, X } from 'lucide-react';

interface CardsIndexProps {
    events: { id: number; name: string; code: string }[];
    selectedEventId: number;
    registrations: {
        data: {
            id: number;
            registration_number: string;
            full_name: string;
            school_name: string;
            primary_position: string;
            photo_url: string | null;
            qr_token: string;
            event_name: string;
            organizer?: string;
            location: string;
            selection_schedule: string;
        }[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
    previewRegistration: {
        id: number;
        registration_number: string;
        full_name: string;
        school_name: string;
        primary_position: string;
        photo_url: string | null;
        qr_token: string;
        event_name: string;
        organizer: string;
        location: string;
        selection_schedule: string;
    } | null;
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function CardsIndex({
    events,
    selectedEventId,
    registrations,
    previewRegistration,
    filters,
}: CardsIndexProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [activePreview, setActivePreview] = useState(
        previewRegistration || (registrations.data.length > 0 ? registrations.data[0] : null)
    );

    // Sync activePreview if page or previewRegistration changes
    useEffect(() => {
        if (previewRegistration) {
            setActivePreview(previewRegistration);
        } else if (registrations.data.length > 0) {
            setActivePreview((prev) => {
                if (prev && registrations.data.some((r) => r.id === prev.id)) {
                    return prev;
                }
                return registrations.data[0];
            });
        } else {
            setActivePreview(null);
        }
    }, [registrations.data, previewRegistration]);

    // Clear selection when page or event changes
    useEffect(() => {
        setSelectedIds([]);
    }, [registrations.current_page, selectedEventId]);

    const handleToggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === registrations.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(registrations.data.map(r => r.id));
        }
    };

    const handleBulkPrint = () => {
        if (selectedIds.length === 0) {
            alert('Pilih minimal satu peserta untuk cetak massal.');
            return;
        }
        router.post(route('admin.cards.bulk-print'), { ids: selectedIds });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.cards.index'), {
            event_id: selectedEventId,
            search: searchTerm.trim() || undefined,
            per_page: filters.per_page || 50,
        }, { preserveState: true });
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        router.get(route('admin.cards.index'), {
            event_id: selectedEventId,
            per_page: filters.per_page || 50,
        }, { preserveState: true });
    };

    return (
        <AdminShell breadcrumbs={[{ label: 'Kartu Peserta' }]}>
            <Head title="Penerbitan Kartu Peserta Seleksi" />

            <PageHeader
                title="Penerbitan Kartu Peserta"
                description="Cetak kartu identitas seleksi ber-QR token untuk peserta yang telah Lolos Administrasi (50 ID Card per halaman)."
                action={
                    <div className="flex items-center gap-2.5">
                        <select
                            value={selectedEventId}
                            onChange={(e) => router.get(route('admin.cards.index'), { event_id: e.target.value, per_page: filters.per_page || 50 })}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white shadow-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        >
                            {events.map((evt) => (
                                <option key={evt.id} value={evt.id}>{evt.name}</option>
                            ))}
                        </select>

                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                onClick={handleBulkPrint}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700 transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Cetak {selectedIds.length} Kartu Terpilih</span>
                            </button>
                        )}
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Candidates List (Left 7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {/* Search and Action Bar */}
                    <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama atau nomor pendaftaran..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-xs"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleResetSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                                    title="Hapus pencarian"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                50 kartu / halaman
                            </span>
                        </div>
                    </div>

                    {/* Batch Selection Bar */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="select-all-page"
                                checked={registrations.data.length > 0 && selectedIds.length === registrations.data.length}
                                onChange={handleSelectAll}
                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                            />
                            <label htmlFor="select-all-page" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                                Pilih Halaman Ini ({registrations.data.length})
                            </label>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                            Total: <strong className="text-slate-800 font-bold">{registrations.total}</strong> peserta lolos
                        </span>
                    </div>

                    {/* Candidates List Items */}
                    <div className="divide-y divide-slate-100">
                        {registrations.data.map((reg) => {
                            const isSelected = selectedIds.includes(reg.id);
                            const isCurrentPreview = activePreview?.id === reg.id;

                            return (
                                <div
                                    key={reg.id}
                                    onClick={() => setActivePreview(reg)}
                                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                                        isCurrentPreview
                                            ? 'bg-brand-50/50 ring-1 ring-inset ring-brand-300/40'
                                            : 'hover:bg-slate-50/80'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleSelect(reg.id)}
                                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                                            />
                                        </div>

                                        <div className="w-10 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                                            {reg.photo_url ? (
                                                <img src={reg.photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-[10px] text-slate-400 text-center pt-2 font-medium">Foto</div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-navy-950 truncate">{reg.full_name}</span>
                                                {isCurrentPreview && (
                                                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 shrink-0">
                                                        Preview
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] font-mono text-brand-600 font-semibold">{reg.registration_number}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[11px] text-slate-500 font-medium">{reg.primary_position}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 block truncate mt-0.5">{reg.school_name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 ml-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => setActivePreview(reg)}
                                            className={`p-1.5 rounded-lg border transition-colors ${
                                                isCurrentPreview
                                                    ? 'bg-brand-600 text-white border-brand-600'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                            title="Lihat Preview Kartu"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={route('registration.print-card', reg.registration_number)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200 transition-colors"
                                            title="Cetak Langsung Kartu Ini"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}

                        {registrations.data.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-xs">
                                {filters.search
                                    ? `Tidak ditemukan peserta dengan kata kunci "${filters.search}".`
                                    : 'Belum ada peserta yang Lolos Administrasi untuk dicetak kartunya.'}
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {registrations.last_page > 1 && (
                        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
                            <span className="font-medium text-slate-600">
                                Menampilkan <strong className="text-slate-900 font-bold">{registrations.from}–{registrations.to}</strong> dari <strong className="text-slate-900 font-bold">{registrations.total}</strong> kartu peserta
                            </span>

                            <div className="flex flex-wrap items-center gap-1">
                                {registrations.links.map((link, index) => {
                                    const isPrev = link.label.includes('&laquo;') || link.label.toLowerCase().includes('previous');
                                    const isNext = link.label.includes('&raquo;') || link.label.toLowerCase().includes('next');
                                    const label = isPrev ? '« Sebelumnya' : isNext ? 'Selanjutnya »' : link.label;

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                className="min-w-8 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-300 text-xs font-semibold cursor-not-allowed select-none bg-slate-50/70"
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`min-w-8 px-2.5 py-1.5 rounded-lg border text-center text-xs font-semibold transition-all ${
                                                link.active
                                                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                                                    : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Card Live Preview (5 Cols) - Sticky */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 lg:sticky lg:top-24">
                    <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Preview Kartu ID Card</h3>
                            {activePreview && (
                                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[220px]">
                                    {activePreview.full_name} ({activePreview.registration_number})
                                </p>
                            )}
                        </div>
                        {activePreview && (
                            <a
                                href={route('registration.print-card', activePreview.registration_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Cetak Kartu Ini</span>
                            </a>
                        )}
                    </div>

                    {activePreview ? (
                        <div className="w-full overflow-x-auto pb-2">
                            <div className="w-max mx-auto shadow-md rounded-[10px]">
                                <ParticipantCardDesign participant={activePreview} />
                            </div>
                        </div>
                    ) : (
                        <div className="py-16 text-center text-slate-400 text-xs">
                            Pilih peserta dari daftar untuk melihat preview kartu.
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
