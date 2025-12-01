import { Link, NavLink } from 'react-router-dom';

const navLinkClass =
  'text-sm font-medium text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-lg';

const Header = () => {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-white/60 shadow-[0_6px_30px_-12px_rgba(15,23,42,0.25)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/fant.png"
              alt="fantAUstico"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl object-contain shadow-lg shadow-primary/30"
            />
            <div>
              <p className="text-xs sm:text-sm text-slate-500 leading-tight">Plataforma de Adoção e Denúncias para Cães</p>
              <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 leading-tight">fantAUstico</h1>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-slate-100 text-slate-900' : ''}`}
          >
            Adoção
          </NavLink>
          <NavLink
            to="/campanhas"
            className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-slate-100 text-slate-900' : ''}`}
          >
            Campanhas
          </NavLink>
          <NavLink
            to="/casos"
            className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-slate-100 text-slate-900' : ''}`}
          >
            Casos
          </NavLink>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/doacao"
            className="rounded-full border border-secondary/30 px-4 py-2 text-secondary text-sm font-medium hover:bg-secondary/10 transition w-full sm:w-auto text-center"
          >
            Nova Campanha
          </Link>
          <Link
            to="/registrar"
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-white text-sm font-semibold shadow-lg shadow-primary/30 w-full sm:w-auto text-center"
          >
            Novo Caso ou Adoção
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
