const campaigns = [
  {
    id: '1',
    orgName: 'ONG Patas Solidárias',
    title: 'Resgate e Tratamento Veterinário',
    description: 'Arrecadação para custear cirurgias e tratamentos de animais resgatados.',
    goal: 5000,
    raised: 3200,
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    orgName: 'Abrigo Vira-Lata Feliz',
    title: 'Construção de Novo Abrigo',
    description: 'Ajude-nos a construir um novo espaço para abrigar mais animais abandonados.',
    goal: 15000,
    raised: 8500,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  },
];

function Campaigns() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <p className="text-sm text-slate-500">Campanhas Ativas</p>
          <p className="text-2xl font-semibold text-slate-900">2</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-sm text-slate-500">Total Arrecadado</p>
          <p className="text-2xl font-semibold text-slate-900">R$ 11.700</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-sm text-slate-500">Meta Total</p>
          <p className="text-2xl font-semibold text-slate-900">R$ 20.000</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((campaign) => {
          const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
          return (
            <article key={campaign.id} className="glass rounded-2xl overflow-hidden">
              <div className="h-56 bg-slate-100">
                <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{campaign.orgName}</h3>
                <p className="text-sm text-slate-600">{campaign.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{campaign.description}</p>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                  <span>R$ {campaign.raised.toLocaleString('pt-BR')}</span>
                  <span>R$ {campaign.goal.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">{progress}% arrecadado</p>
                <button className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 shadow-lg shadow-primary/30">
                  Contribuir
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Campaigns;
