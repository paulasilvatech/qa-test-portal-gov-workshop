import { useState } from 'react';
import { formatCPF } from '../utils/formatters';
import { validateCPF } from '../utils/validators';

interface LoginFormProps {
  onLogin: (cpf: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setCpf(raw);
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateCPF(cpf)) {
      setError('CPF inválido. Verifique os dígitos informados.');
      return;
    }
    onLogin(cpf);
  }

  return (
    <div className="login-form-container">
      <div className="login-form card">
        <div className="login-header">
          <span className="login-icon">🏛️</span>
          <h2>Acesso gov.br</h2>
          <p>Informe seu CPF para acessar os serviços</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cpf" className="form-label">CPF</label>
            <input
              id="cpf"
              type="text"
              className={`form-input ${error ? 'form-input-error' : ''}`}
              placeholder="000.000.000-00"
              value={formatCPF(cpf)}
              onChange={handleCpfChange}
              maxLength={14}
              autoComplete="off"
              inputMode="numeric"
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Entrar
          </button>
        </form>

        <p className="login-hint">
          CPFs de teste: 529.982.247-25, 111.444.777-35, 987.654.321-00
        </p>
      </div>
    </div>
  );
}
