import React from 'react';
import { 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    XCircle, 
    RefreshCw, 
    Trophy,
    ShieldCheck
} from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md';
    showIcon?: boolean;
}

export default function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
    const s = (status || '').toLowerCase();

    let text = status;
    let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    let Icon = Clock;

    switch (s) {
        case 'lolos_administrasi':
            text = 'Lolos Administrasi';
            colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            Icon = CheckCircle2;
            break;
        case 'menunggu_verifikasi':
            text = 'Menunggu Verifikasi';
            colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
            Icon = Clock;
            break;
        case 'dikirim_ulang':
            text = 'Dikirim Ulang';
            colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
            Icon = RefreshCw;
            break;
        case 'perlu_perbaikan':
            text = 'Perlu Perbaikan';
            colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
            Icon = AlertTriangle;
            break;
        case 'ditolak':
            text = 'Ditolak';
            colorClasses = 'bg-red-50 text-red-700 border-red-200';
            Icon = XCircle;
            break;
        case 'open':
        case 'dibuka':
            text = 'Pendaftaran Dibuka';
            colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            Icon = CheckCircle2;
            break;
        case 'paused':
        case 'dijeda':
            text = 'Pendaftaran Dijeda';
            colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
            Icon = AlertTriangle;
            break;
        case 'closed':
        case 'ditutup':
            text = 'Pendaftaran Ditutup';
            colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
            Icon = XCircle;
            break;
        case 'lolos_seleksi':
            text = 'Lolos Seleksi';
            colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
            Icon = Trophy;
            break;
        case 'cadangan':
            text = 'Daftar Cadangan';
            colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
            Icon = Clock;
            break;
        case 'tidak_lolos':
            text = 'Tidak Lolos';
            colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
            Icon = XCircle;
            break;
        case 'menunggu_seleksi':
            text = 'Menunggu Seleksi';
            colorClasses = 'bg-slate-50 text-slate-700 border-slate-200';
            Icon = Clock;
            break;
        case 'hadir':
            text = 'Hadir';
            colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            Icon = ShieldCheck;
            break;
        case 'terlambat':
            text = 'Terlambat';
            colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
            Icon = Clock;
            break;
    }

    const paddingClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${paddingClasses} ${colorClasses}`}>
            {showIcon && <Icon className={`${iconSize} shrink-0`} />}
            <span>{text}</span>
        </span>
    );
}
