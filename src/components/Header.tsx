import { Link, NavLink } from 'react-router-dom';

const navLinkClass =
  'text-sm font-medium text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-lg';

function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-white/60 shadow-[0_6px_30px_-12px_rgba(15,23,42,0.25)]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-2xl shadow-lg shadow-primary/30">
            🐾
          </div>
          <div>
            <p className="text-sm text-slate-500">Plataforma de Adoção e Denúncias</p>
            <h1 className="text-2xl font-semibold text-slate-900">fantAUstico</h1>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-slate-100 text-slate-900' : ''}`}>
            Casos
          </NavLink>
          <NavLink to="/campanhas" className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-slate-100 text-slate-900' : ''}`}>
            Campanhas
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/doacao"
            className="rounded-full border border-secondary/30 px-5 py-2 text-secondary font-medium hover:bg-secondary/10 transition"
          >
            Nova Doação
          </Link>
          <Link
            to="/registrar"
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-white font-semibold shadow-lg shadow-primary/30"
          >
            Novo Registro
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
