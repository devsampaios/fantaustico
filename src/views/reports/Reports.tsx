import { useEffect, useState } from 'react';
import api from '../../service/api';
import type { Report } from '../../types/models';

const formatDate = (value: Report['createdAt']) => {
  if (!value) return '—';
  if (typeof (value as any).toDate === 'function') {
    return (value as any).toDate().toLocaleString('pt-BR');
  }
  try {
    return new Date(value as string).toLocaleString('pt-BR');
  } catch {
    return '—';
  }
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getReports();
        setReports(data as Report[]);
      } catch (err) {
        console.error('Erro ao carregar casos', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Casos</h2>
            <p className="text-sm text-slate-500">Denúncias e relatos enviados pela comunidade.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Carregando casos...</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum caso encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-xl border border-slate-100 bg-white/70 p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {report.type ? report.type : report.targetType === 'campaign' ? 'Campanha' : 'Pet'}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(report.createdAt)}</span>
                </div>

                {report.imageUrl && (
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-100">
                    <img src={report.imageUrl} alt={report.name || report.reason} className="h-full w-full object-cover" />
                  </div>
                )}

                <div className="space-y-1">
                  {report.name && <p className="text-sm font-semibold text-slate-900">{report.name}</p>}
                  {report.reason && <p className="text-sm text-slate-600">Motivo: {report.reason}</p>}
                  {report.description && <p className="text-sm text-slate-600">{report.description}</p>}
                  {report.location && <p className="text-sm text-slate-600">Localização: {report.location}</p>}
                  {report.contact && (
                    <p className="text-sm text-slate-500">
                      Contato: <span className="font-medium text-slate-700">{report.contact}</span>
                    </p>
                  )}
                  {report.contactEmail && <p className="text-sm text-slate-500">Email: {report.contactEmail}</p>}
                  {report.contactName && <p className="text-sm text-slate-500">Pessoa: {report.contactName}</p>}
                  {report.targetId && (
                    <p className="text-xs text-slate-400">
                      ID alvo: <span className="font-mono text-slate-800">{report.targetId}</span>
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    report.resolved
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}
                >
                  {report.resolved ? 'Resolvido' : 'Em aberto'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
