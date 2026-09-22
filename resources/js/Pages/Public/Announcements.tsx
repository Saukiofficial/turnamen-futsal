import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Calendar, ArrowRight, ChevronRight, Megaphone } from 'lucide-react';

interface AnnouncementsProps {
    announcements: {
        data: {
            id: number;
            title: string;
            slug: string;
            content: string;
            publish_at: string;
        }[];
        links: any[];
    };
}

export default function Announcements({ announcements }: AnnouncementsProps) {
    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title="Pengumuman Resmi Turnamen Futsal" />
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                        INFORMASI TERKINI
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                        Pengumuman Turnamen Futsal SAF League
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Pemberitahuan resmi mengenai jadwal pertandingan, ketentuan turnamen, dan informasi resmi SAF League.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {announcements.data.map((ann) => (
                        <Link
                            key={ann.id}
                            href={route('announcements.show', ann.slug)}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>
                                        {new Date(ann.publish_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-navy-950 group-hover:text-brand-600 transition-colors line-clamp-2">
                                    {ann.title}
                                </h3>
                                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                    {ann.content}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                                <span>Baca Pengumuman</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </Link>
                    ))}
                </div>

                {announcements.data.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                        <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
                        <h3 className="text-base font-bold text-navy-950">Belum Ada Pengumuman</h3>
                        <p className="text-xs text-slate-500">Pengumuman resmi dari panitia akan tampil di halaman ini.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
