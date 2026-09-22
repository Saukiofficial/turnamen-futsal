import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '@/Layouts/AdminShell';
import PageHeader from '@/Components/Admin/PageHeader';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Search, Shield, Eye } from 'lucide-react';

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
            location: string;
            selection_schedule: string;
        }[];
        links: any[];
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

    return (
        <AdminShell breadcrumbs={[{ label: 'Kartu Peserta' }]}>
            <Head title="Penerbitan Kartu Peserta Seleksi" />

            <PageHeader
                title="Penerbitan Kartu Peserta"
                description="Cetak kartu identitas seleksi ber-QR token untuk peserta yang telah Lolos Administrasi."
                action={
                    <div className="flex items-center gap-2.5">
                        <select
                            value={selectedEventId}
                            onChange={(e) => router.get(route('admin.cards.index'), { event_id: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                        >
                            {events.map((evt) => (
                                <option key={evt.id} value={evt.id}>{evt.name}</option>
                            ))}
                        </select>

                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                onClick={handleBulkPrint}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm"
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
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedIds.length > 0 && selectedIds.length === registrations.data.length}
                                onChange={handleSelectAll}
                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                            />
                            <span className="text-xs font-bold text-slate-700">
                                Pilih Semua ({registrations.data.length})
                            </span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {registrations.data.map((reg) => {
                            const isSelected = selectedIds.includes(reg.id);
                            return (
                                <div key={reg.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleSelect(reg.id)}
                                            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                                        />
                                        <div className="w-9 h-11 rounded bg-slate-200 overflow-hidden shrink-0">
                                            {reg.photo_url ? (
                                                <img src={reg.photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-[10px] text-slate-400 text-center pt-2">Foto</div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-xs font-bold text-navy-950 block truncate">{reg.full_name}</span>
                                            <span className="text-[11px] font-mono text-brand-600 block">{reg.registration_number}</span>
                                            <span className="text-[10px] text-slate-400 block truncate">{reg.school_name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => router.get(route('admin.cards.index'), { event_id: selectedEventId, selected_id: reg.id }, { preserveState: true })}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                                            title="Preview Kartu"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={route('registration.print-card', reg.registration_number)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200"
                                            title="Cetak Langsung"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}

                        {registrations.data.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-xs">
                                Belum ada peserta yang Lolos Administrasi untuk dicetak kartunya.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Card Live Preview (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Preview Kartu</h3>
                        {previewRegistration && (
                            <a
                                href={route('registration.print-card', previewRegistration.registration_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Cetak Kartu Ini</span>
                            </a>
                        )}
                    </div>

                    {previewRegistration ? (
                        <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden">
                            <div className="bg-navy-950 text-white px-4 py-3 flex items-center justify-between border-b border-brand-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center text-white">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">KARTU SELEKSI</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                    RESMI
                                </span>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-20 h-28 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                                        {previewRegistration.photo_url ? (
                                            <img src={previewRegistration.photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-slate-400">3×4</span>
                                        )}
                                    </div>

                                    <div className="space-y-1 min-w-0 flex-1 text-xs">
                                        <span className="font-mono font-bold text-brand-600 block text-[11px]">
                                            {previewRegistration.registration_number}
                                        </span>
                                        <h4 className="font-bold text-navy-950 truncate text-sm">
                                            {previewRegistration.full_name}
                                        </h4>
                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                                            {previewRegistration.primary_position}
                                        </span>
                                        <p className="text-[11px] text-slate-500 truncate">{previewRegistration.school_name}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                    <div className="text-[10px] text-slate-400">
                                        <span>Pindai saat check-in</span>
                                    </div>
                                    <div className="p-1 bg-white rounded border border-slate-200">
                                        <QRCodeSVG value={previewRegistration.qr_token} size={48} />
                                    </div>
                                </div>
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
