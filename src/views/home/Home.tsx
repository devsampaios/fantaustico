
const stats = [
  { label: 'Denúncias', value: 1, color: 'bg-rose-100 text-rose-600', badge: 'bg-rose-500/10 text-rose-600' },
  { label: 'Pets Perdidos', value: 1, color: 'bg-amber-100 text-amber-600', badge: 'bg-amber-500 text-white' },
  { label: 'Pets Encontrados', value: 1, color: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-500 text-white' },
  { label: 'Para Adoção', value: 1, color: 'bg-blue-100 text-blue-600', badge: 'bg-blue-500 text-white' },
];

const pets = [
  {
    id: '1',
    name: 'Thor',
    breed: 'Labrador',
    age: '3 anos',
    species: 'Cachorro',
    status: 'Perdido',
    statusColor: 'bg-amber-500',
    image:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    location: 'Jardim Paulista, São Paulo',
    date: '14/11/2025',
    description: 'Porte grande, cor amarela, amigável. Usava coleira azul.',
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Persa',
    age: '2 anos',
    species: 'Gato',
    status: 'Encontrado',
    statusColor: 'bg-emerald-500',
    image: '',
    location: 'Vila Mariana, São Paulo',
    date: '15/11/2025',
    description: 'Gata branca de pelo longo, dócil. Encontrada próximo ao parque.',
  },
  {
    id: '3',
    name: 'Mel',
    breed: 'SRD (Vira-lata)',
    age: '1 ano',
    species: 'Cachorro',
    status: 'Para Adoção',
    statusColor: 'bg-blue-600',
    image:
      'https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80',
    location: 'Pinheiros, São Paulo',
    date: '09/11/2025',
    description: 'Porte médio, carinhosa e brincalhona. Vacinada e castrada.',
  },
];

function Home() {
  return (
    <div className="min-h-screen pb-12 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="glass rounded-2xl p-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl font-medium text-white bg-slate-900">
              Casos e Denúncias
            </button>
            <button className="px-4 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 transition">
              Doações
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-6 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.label} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.badge}`}>
                {item.label.includes('Adoção') ? 'Adoção' : item.label.split(' ')[1] || item.label}
              </span>
            </div>
          ))}
        </section>

        <section className="glass rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
                <span className="text-slate-400">🔍</span>
                <input
                  className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  placeholder="Buscar..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <select className="bg-slate-100 text-sm text-slate-700 rounded-xl px-3 py-2 outline-none">
                <option>Todos os tipos</option>
                <option>Perdido</option>
                <option>Encontrado</option>
                <option>Adoção</option>
              </select>
              <select className="bg-slate-100 text-sm text-slate-700 rounded-xl px-3 py-2 outline-none">
                <option>Todos os status</option>
              </select>
              <select className="bg-slate-100 text-sm text-slate-700 rounded-xl px-3 py-2 outline-none">
                <option>Todas as espécies</option>
                <option>Cachorro</option>
                <option>Gato</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">4 Casos encontrados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <article key={pet.id} className="glass rounded-2xl overflow-hidden flex flex-col">
                <div className="relative h-60 bg-slate-100">
                  {pet.image ? (
                    <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-3xl">
                      🖼️
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-slate-800 text-sm font-medium shadow">
                      {pet.species}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${pet.statusColor}`}>
                      {pet.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
                    <p className="text-sm text-slate-600">
                      {pet.breed} • {pet.age}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span>📍</span>
                    {pet.location}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span>📅</span>
                    {pet.date}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">{pet.description}</p>
                </div>
                <div className="p-4">
                  <button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 shadow-lg shadow-primary/30">
                    Entrar em Contato
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
