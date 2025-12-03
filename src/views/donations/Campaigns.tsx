import { useEffect, useState } from 'react';
import api from '../../service/api';
import type { Campaign } from '../../types/models';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
        const data = await api.getCampaigns();
        setCampaigns(
          data.map((c: any) => ({
            ...c,
            amountRaised: c.amountRaised ?? 0,
          })),
        );
      } catch (err) {
        console.error('Erro ao carregar campanhas', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Campanhas</h2>
            <p className="text-sm text-slate-500">Projetos de arrecadação da comunidade.</p>
          </div>
        </div>
        {loading && <p className="text-sm text-slate-500">Carregando campanhas...</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!loading && campaigns.length === 0 && (
          <div className="glass rounded-2xl p-6 text-slate-600">Nenhuma campanha encontrada.</div>
        )}
        {campaigns.map((campaign) => {
          const progress = campaign.goal ? Math.min(100, Math.round((campaign.amountRaised / campaign.goal) * 100)) : 0;
          const { telHref, whatsappHref } = buildContactLinks(campaign.contact);
          return (
            <article key={campaign.id} className="glass rounded-2xl overflow-hidden">
              <div className="h-56 bg-slate-100">
                {campaign.imageUrl ? (
                  <img src={campaign.imageUrl} alt={campaign.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400 text-3xl">🖼️</div>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{campaign.orgName}</h3>
                <p className="text-sm text-slate-600">{campaign.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{campaign.description}</p>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>R$ {campaign.amountRaised.toLocaleString('pt-BR')}</span>
                  <span>R$ {campaign.goal.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">{progress}% arrecadado</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {telHref && (
                    <a
                      href={telHref}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white font-semibold py-3 shadow-lg shadow-slate-900/30"
                    >
                      Ligar
                    </a>
                  )}
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 text-white font-semibold py-3 shadow-lg shadow-green-500/30"
                    >
                      WhatsApp
                    </a>
                  )}
                  {!telHref && !whatsappHref && (
                    <div className="text-sm text-slate-500 text-center">Contato não informado.</div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Campaigns;
