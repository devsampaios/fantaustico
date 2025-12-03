import { useEffect, useState } from 'react';
import api from '../../service/api';
import type { Report } from '../../types/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMessage } from '@fortawesome/free-solid-svg-icons';

const formatDate = (value: Report['createdAt']) => {
  if (!value) return '—';
  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toLocaleString('pt-BR');
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

  const buildContactLinks = (contact?: string) => {
    if (!contact) return { telHref: '', whatsappHref: '' };
    const digits = contact.replace(/\D/g, '');
    const telHref = digits ? `tel:${digits}` : '';
    const whatsappHref = digits ? `https://wa.me/${digits}` : '';
    return { telHref, whatsappHref };
  };

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
    <div className="min-h-screen pb-16 text-slate-900 relative z-10">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <section className="glass rounded-3xl p-6 md:p-10 space-y-3 fade-in-up">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Casos e Denúncias</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-heading)]">Proteção e investigação</h1>
          <p className="text-[var(--color-muted)]">Relatos da comunidade sobre maus-tratos e situações de risco.</p>
          {loading && <p className="text-sm text-[var(--color-muted)]">Carregando casos...</p>}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in-up">
          {!loading && reports.length === 0 && (
            <div className="glass rounded-2xl p-6 text-slate-600 col-span-full">Nenhum caso encontrado.</div>
          )}
          {reports.map((report) => (
            <div key={report.id} className="glass rounded-2xl p-4 space-y-3 shadow-sm card-hover">
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

              <div className="flex flex-col gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    report.resolved
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}
                >
                  {report.resolved ? 'Resolvido' : 'Em aberto'}
                </span>

                {(() => {
                  const { telHref, whatsappHref } = buildContactLinks(report.contact);
                  return (
                    <div className="grid grid-cols-1 gap-2">
                      {telHref && (
                        <a
                          href={telHref}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white font-semibold py-2 shadow"
                        >
                          <FontAwesomeIcon icon={faPhone} />
                          Ligar
                        </a>
                      )}
                      {whatsappHref && (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 text-white font-semibold py-2 shadow"
                        >
                          <FontAwesomeIcon icon={faMessage} />
                          WhatsApp
                        </a>
                      )}
                      {!telHref && !whatsappHref && (
                        <div className="text-sm text-slate-500 text-center">Contato não informado.</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Reports;
