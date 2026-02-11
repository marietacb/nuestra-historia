
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Nueva contraseña: 25092022 (Vuestro aniversario)
    if (code === '25092022') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background-light p-6">
      <div className="w-full max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-4">
          <div className="inline-flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
            <span className="material-symbols-outlined text-5xl filled">favorite</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main">Nuestro Espacio</h1>
          <p className="text-text-muted text-lg">Introduce nuestro código secreto para entrar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input 
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nuestro código..."
              className={`w-full px-6 py-4 text-center text-2xl font-black rounded-3xl bg-white border-2 transition-all outline-none tracking-[0.5em] ${
                error ? 'border-primary shake animate-bounce' : 'border-gray-100 focus:border-primary/50'
              }`}
              autoFocus
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
          >
            Entrar a Nuestro Mundo
          </button>
        </form>

        <p className="text-xs text-text-muted">
          Pista: Es la fecha de nuestro aniversario (DDMMAAAA) ❤️
        </p>
      </div>
    </div>
  );
};

export default Login;
