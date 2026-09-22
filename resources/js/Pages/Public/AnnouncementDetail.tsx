import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';

interface AnnouncementDetailProps {
    announcement: {
        id: number;
        title: string;
        slug: string;
        content: string;
        publish_at: string;
    };
}

export default function AnnouncementDetail({ announcement }: AnnouncementDetailProps) {
    return (
        <div className="min-h-screen bg-page flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Head title={`${announcement.title} - Pengumuman`} />
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-6">
                <div>
                    <Link
                        href={route('announcements.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Daftar Pengumuman</span>
                    </Link>
                </div>

                <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
                    <div className="space-y-3 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar className="w-4 h-4 text-brand-600" />
                            <span>
                                {new Date(announcement.publish_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight leading-tight">
                            {announcement.title}
                        </h1>
                    </div>

                    <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                        {announcement.content}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Diterbitkan oleh Panitia Pelaksana Turnamen Futsal SAF League</span>
                        <button
                            type="button"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: announcement.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Tautan pengumuman berhasil disalin.');
                                }
                            }}
                            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-brand-600 font-semibold"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Bagikan</span>
                        </button>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
