import { Link, useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types';

interface HeaderProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="gov-header">
      <div className="gov-header-top">
        <div className="container gov-header-top-content">
          <span className="gov-header-system">Portal de Serviços do Cidadão</span>
          {user?.isAuthenticated && (
            <div className="gov-header-user">
              <span>Olá, {user.nome.split(' ')[0]}</span>
              <button className="gov-header-logout" onClick={onLogout}>Sair</button>
            </div>
          )}
        </div>
      </div>
      <div className="gov-header-main">
        <div className="container gov-header-main-content">
          <Link to="/" className="gov-header-logo">
            <span className="gov-header-logo-icon">🏛️</span>
            <div>
              <strong>gov.br</strong>
              <span className="gov-header-subtitle">Serviços Digitais</span>
            </div>
          </Link>
          <nav className="gov-header-nav">
            <Link to="/">Início</Link>
            {user?.isAuthenticated ? (
              <>
                <Link to="/ipva">IPVA</Link>
                <Link to="/iptu">IPTU</Link>
                <Link to="/danfe">DANFE</Link>
                <Link to="/inss">INSS</Link>
                <Link to="/fgts">FGTS</Link>
              </>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
                Entrar com gov.br
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
