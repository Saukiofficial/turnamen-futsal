import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminShell from '../../../Layouts/AdminShell';
import PageHeader from '../../../Components/Admin/PageHeader';
import { Settings, Save, CheckCircle, ShieldAlert, Building, Phone, Mail, Clock, CreditCard } from 'lucide-react';

interface SettingData {
  app_name: string;
  organizer_name: string;
  contact_email: string;
  contact_phone: string;
  timezone: string;
  default_quota: number;
  auto_close_when_full: boolean;
  id_card_format: string;
}

interface Props {
  settings: SettingData;
}

export default function SettingsIndex({ settings }: Props) {
  const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
    organizer_name: settings.organizer_name,
    contact_email: settings.contact_email,
    contact_phone: settings.contact_phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/admin/settings');
  };

  return (
    <AdminShell>
      <Head title="Pengaturan Sistem - FutsalReg" />

      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi identitas organisasi, kontak bantuan, dan parameter kartu pendaftaran"
      />

      {recentlySuccessful && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Pengaturan sistem berhasil disimpan dan diperbarui.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" />
              Identitas & Kontak Panitia Penyelenggara
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Nama Organisasi / Panitia <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={data.organizer_name}
                  onChange={(e) => setData('organizer_name', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                  placeholder="cth: Asosiasi Futsal Kabupaten / Pengurus Seleksi 2026"
                  required
                />
              </div>
              {errors.organizer_name && <p className="text-xs text-rose-600 mt-1">{errors.organizer_name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Bantuan / Helpdesk <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={data.contact_email}
                    onChange={(e) => setData('contact_email', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                    placeholder="bantuan@futsalreg.test"
                    required
                  />
                </div>
                {errors.contact_email && <p className="text-xs text-rose-600 mt-1">{errors.contact_email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  WhatsApp / Call Center <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={data.contact_phone}
                    onChange={(e) => setData('contact_phone', e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                    placeholder="0812-3456-7890"
                    required
                  />
                </div>
                {errors.contact_phone && <p className="text-xs text-rose-600 mt-1">{errors.contact_phone}</p>}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Perubahan akan langsung terlihat pada portal peserta & footer sistem.
              </span>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/25 transition"
              >
                <Save className="w-4 h-4" />
                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: System Readonly Specs */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              Format Penomoran Registrasi
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Pola Kode Peserta:</p>
              <p className="text-sm font-mono font-bold text-brand-700">{settings.id_card_format}</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Format otomatis berurutan per tahun kalender (contoh: <code>FTS-2026-000001</code>).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Parameter Server
            </h4>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500">Aplikasi</dt>
                <dd className="font-semibold text-slate-800">{settings.app_name}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500">Zona Waktu</dt>
                <dd className="font-semibold text-slate-800">{settings.timezone}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <dt className="text-slate-500">Validasi Identitas Siswa</dt>
                <dd className="font-semibold text-emerald-600">10-Digit NISN Kemdikbud</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-slate-500">Proteksi QR</dt>
                <dd className="font-semibold text-emerald-600">Dynamic 40-Char Token</dd>
              </div>
            </dl>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 text-amber-900 text-xs flex gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p>
              Perubahan konfigurasi database dan integrasi storage S3/Cloudflare R2 dapat dilakukan melalui file <code>.env</code> server produksi.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
