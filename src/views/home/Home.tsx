import { useEffect, useState } from 'react';
import api from '../../service/api';
import type { Pet } from '../../types/models';

const Home = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getPets();
        setPets(data as Pet[]);
      } catch (err) {
        console.error('Erro ao carregar pets para adoção', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pb-12 text-slate-900 relative z-10">
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        <section className="glass rounded-3xl p-6 md:p-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Adoção</h2>
          <p className="text-lg text-slate-500">Encontre um novo amigo que precisa de um lar.</p>
        </section>

        <section className="glass rounded-3xl p-6 md:p-8">
          {loading ? (
            <p className="text-lg text-slate-500">Carregando pets para adoção...</p>
          ) : pets.length === 0 ? (
            <p className="text-lg text-slate-600">Nenhum pet para adoção encontrado.</p>
          ) : (
            <div className="space-y-4">
              {pets.map((pet) => (
                <div key={campaign.id} className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900">{pet.name}</h3>
                  <p className="text-sm text-slate-500">{pet.description || 'Sem descrição'}</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Local: <span className="font-semibold text-slate-800">{pet.location || 'Não informado'}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
