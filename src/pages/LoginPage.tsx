import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

interface LoginPageProps {
  onLogin: (cpf: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  function handleLogin(cpf: string) {
    const user = login(cpf);
    if (user) {
      onLogin(cpf);
      navigate('/');
    }
  }

  return (
    <div className="page-content">
      <div className="container">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
