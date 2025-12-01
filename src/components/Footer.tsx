const Footer = () => {
  return (
    <footer className="mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/fant.png" alt="fantAUstico" className="h-10 w-10 rounded-2xl object-contain shadow-lg shadow-primary/20" />
            <div>
              <p className="text-sm text-slate-500">Uma iniciativa para conectar pessoas e pets</p>
              <p className="text-sm font-medium text-slate-800">fantAUstico © {new Date().getFullYear()}</p>
            </div>
          </div>
          <a href="https://devsampaio.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:opacity-90 transition">
            <img
              src="/logo-light2.png"
              alt="Sampaio Dev"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
