import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    meta?: string;
    icon: LucideIcon;
    variant?: 'blue' | 'amber' | 'emerald' | 'rose';
}

export default function StatCard({ title, value, meta, icon: Icon, variant = 'blue' }: StatCardProps) {
    const tileStyles = {
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tileStyles[variant]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-500 truncate block">
                    {title}
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight font-mono">
                    {value}
                </div>
                {meta && (
                    <p className="text-[11px] text-slate-400 truncate">
                        {meta}
                    </p>
                )}
            </div>
        </div>
    );
}
