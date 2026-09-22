import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminShell from '../../../Layouts/AdminShell';
import PageHeader from '../../../Components/Admin/PageHeader';
import { Shield, Search, Eye, X, Activity, Filter } from 'lucide-react';

interface LogItem {
  id: number;
  action: string;
  user_name: string;
  auditable_type: string;
  auditable_id: number | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

interface PaginationProps {
  data: LogItem[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  total: number;
}

interface Props {
  logs: PaginationProps;
  filters: {
    action: string | null;
    search: string | null;
  };
}

export default function AuditLogsIndex({ logs, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [action, setAction] = useState(filters.action || '');
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/audit-logs', { search, action }, { preserveState: true });
  };

  const getActionBadge = (act: string) => {
    if (act.includes('created') || act.includes('register')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">CREATE</span>;
    }
    if (act.includes('verified') || act.includes('approved')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">VERIFY</span>;
    }
    if (act.includes('rejected') || act.includes('deleted')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">DELETE/REJECT</span>;
    }
    if (act.includes('score') || act.includes('assess')) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">ASSESS</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{act.toUpperCase()}</span>;
  };

  return (
    <AdminShell>
      <Head title="Audit Log - FutsalReg" />

      <PageHeader
        title="Audit Log & Keamanan"
        description="Riwayat aktivitas penting, perubahan data, dan verifikasi untuk akuntabilitas sistem"
      />

      {/* Filter Bar */}
      <form onSubmit={handleFilter} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aksi, pengguna, atau IP..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="w-48">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Semua Jenis Aksi</option>
              <option value="registrant_created">Registrant Created</option>
              <option value="registration_verified">Verified</option>
              <option value="registration_rejected">Rejected</option>
              <option value="score_saved">Score Saved</option>
              <option value="attendance_marked">Check-in Marked</option>
              <option value="settings_updated">Settings Updated</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </form>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu (WIB)</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Aksi</th>
                <th className="px-6 py-4">Entitas Target</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-pulse" />
                    Belum ada riwayat aktivitas yang tercatat.
                  </td>
                </tr>
              ) : (
                logs.data.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {log.created_at}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {log.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getActionBadge(log.action)}
                        <span className="text-xs font-mono text-slate-600">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {log.auditable_type ? `${log.auditable_type} #${log.auditable_id || '-'}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(log.old_values || log.new_values) && (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1 text-xs text-brand-600 font-semibold hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Lihat Payload
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logs.links.length > 3 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Menampilkan {logs.data.length} dari total {logs.total} log aktivitas
            </span>
            <div className="flex gap-1">
              {logs.links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => link.url && router.get(link.url)}
                  disabled={!link.url}
                  className={`px-3 py-1 text-xs rounded-md ${
                    link.active
                      ? 'bg-brand-600 text-white font-bold'
                      : link.url
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Detail Payload Log #{selectedLog.id}</h3>
                <p className="text-xs text-slate-500">{selectedLog.action} oleh {selectedLog.user_name} ({selectedLog.created_at})</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 text-xs">
              {selectedLog.old_values && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-1">Nilai Lama (Before):</h4>
                  <pre className="p-3 bg-rose-50 text-rose-900 rounded-lg font-mono border border-rose-200 overflow-x-auto">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-1">Nilai Baru / Request Payload (After):</h4>
                  <pre className="p-3 bg-emerald-50 text-emerald-900 rounded-lg font-mono border border-emerald-200 overflow-x-auto">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
