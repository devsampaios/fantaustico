function Footer() {
  return (
    <footer className="mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xl shadow-lg shadow-primary/20">
              🐾
            </div>
            <div>
              <p className="text-sm text-slate-500">Uma iniciativa para conectar pessoas e pets</p>
              <p className="text-sm font-medium text-slate-800">fantAUstico © {new Date().getFullYear()}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            <a className="hover:text-slate-900 transition" href="#termos">
              Termos
            </a>
            <a className="hover:text-slate-900 transition" href="#privacidade">
              Privacidade
            </a>
            <a className="hover:text-slate-900 transition" href="#contato">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
