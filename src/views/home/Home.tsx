import { useEffect, useMemo, useState } from 'react';
import api from '../../service/api';
import type { Pet } from '../../types/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const typeLabels: Record<string, string> = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adocao: 'Adoção',
  denuncia: 'Denúncia',
};

const Home = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', status: 'all', species: 'all', search: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getPets();
        setPets(
          data.map((p: any) => ({
            ...p,
            status: p.status || 'perdido',
            type: p.type || 'perdido',
          })),
        );
      } catch (err) {
        console.error('Erro ao carregar pets', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesType = filters.type === 'all' || pet.type === filters.type;
      const matchesStatus = filters.status === 'all' || pet.status === filters.status;
      const matchesSpecies = filters.species === 'all' || pet.species?.toLowerCase() === filters.species;
      const search = filters.search.trim().toLowerCase();
      const matchesSearch =
        !search ||
        pet.name.toLowerCase().includes(search) ||
        (pet.description || '').toLowerCase().includes(search) ||
        (pet.location || '').toLowerCase().includes(search);
      return matchesType && matchesStatus && matchesSpecies && matchesSearch;
    });
  }, [filters, pets]);

  return (
    <div className="min-h-screen pb-12 text-slate-900 relative z-10">
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        <section className="glass rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 text-sm" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  placeholder="Buscar..."
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              <select
                className="bg-slate-100 text-sm text-slate-700 rounded-xl px-3 py-2 outline-none"
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="all">Todos os tipos</option>
                <option value="perdido">Perdido</option>
                <option value="encontrado">Encontrado</option>
                <option value="adocao">Adoção</option>
                <option value="denuncia">Denúncia</option>
              </select>
              <select
                className="bg-slate-100 text-sm text-slate-700 rounded-xl px-3 py-2 outline-none"
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="all">Todos os status</option>
                <option value="perdido">Perdido</option>
                <option value="encontrado">Encontrado</option>
                <option value="para_adocao">Para Adoção</option>
              </select>
              <select
                className="bg-slate-100 text-sm text-slate-700 rounded-xl px-3 py-2 outline-none"
                value={filters.species}
                onChange={(e) => setFilters((f) => ({ ...f, species: e.target.value.toLowerCase() }))}
              >
                <option value="all">Todas as espécies</option>
                <option value="cachorro">Cachorro</option>
                <option value="gato">Gato</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="glass rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Registros</h2>
                <p className="text-sm text-slate-500">Casos de adoção, perdidos e denúncias.</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Carregando registros...</p>
          </section>
        ) : (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              {`${filteredPets.length} Casos encontrados`}
            </h2>
            {!loading && filteredPets.length === 0 && (
              <div className="glass rounded-2xl p-6 text-slate-600">Nenhum registro encontrado.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPets.map((pet) => (
                <article key={pet.id} className="glass rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative h-60 bg-slate-100">
                    {pet.imageUrl ? (
                      <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-3xl">
                        🖼️
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/90 text-slate-800 text-sm font-medium shadow">
                        {pet.species || 'Pet'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-white text-sm font-semibold bg-slate-800">
                        {typeLabels[pet.type] || 'Registro'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
                      <p className="text-sm text-slate-600">
                        {[pet.breed, pet.ageLabel].filter(Boolean).join(' • ') || 'Sem detalhes'}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLocationDot} className="text-slate-500" />
                      {pet.location || 'Local não informado'}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {pet.description || 'Sem descrição'}
                    </p>
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
        )}
      </main>
    </div>
  );
};

export default Home;
