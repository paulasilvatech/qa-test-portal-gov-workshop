import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import IPVAPage from './pages/IPVAPage';
import IPTUPage from './pages/IPTUPage';
import DANFEPage from './pages/DANFEPage';
import INSSPage from './pages/INSSPage';
import FGTSPage from './pages/FGTSPage';
import EmprestimoConsignadoPage from './pages/EmprestimoConsignadoPage';
import BolsaFamiliaPage from './pages/BolsaFamiliaPage';
import CNHDigitalPage from './pages/CNHDigitalPage';
import { getAuthUser, logout as authLogout } from './services/authService';
import type { AuthUser } from './types';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getAuthUser();
    if (stored) setUser(stored);
  }, []);

  const handleLogin = (_cpf: string) => {
    const stored = getAuthUser();
    if (stored) setUser(stored);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/ipva" element={<IPVAPage />} />
          <Route path="/iptu" element={<IPTUPage />} />
          <Route path="/danfe" element={<DANFEPage />} />
          <Route path="/inss" element={<INSSPage />} />
          <Route path="/fgts" element={<FGTSPage />} />
          <Route path="/emprestimo-consignado" element={<EmprestimoConsignadoPage />} />
          <Route path="/bolsa-familia" element={<BolsaFamiliaPage />} />
          <Route path="/cnh" element={<CNHDigitalPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
