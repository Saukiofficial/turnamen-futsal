import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <div className="flex items-center gap-3 shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}
