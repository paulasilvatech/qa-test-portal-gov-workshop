import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="gov-footer">
      <div className="container">
        <div className="gov-footer-content">
          <div className="gov-footer-section">
            <h4>Serviços</h4>
            <ul>
              <li><Link to="/ipva">IPVA</Link></li>
              <li><Link to="/iptu">IPTU</Link></li>
              <li><Link to="/danfe">DANFE</Link></li>
              <li><Link to="/inss">INSS</Link></li>
              <li><Link to="/fgts">FGTS</Link></li>
              <li><Link to="/emprestimo-consignado">Empréstimo Consignado</Link></li>
              <li><Link to="/bolsa-familia">Bolsa Família</Link></li>
              <li><Link to="/cnh">CNH Digital</Link></li>
            </ul>
          </div>
          <div className="gov-footer-section">
            <h4>Sobre</h4>
            <ul>
              <li><a href="#acessibilidade">Acessibilidade</a></li>
              <li><a href="#mapa-do-site">Mapa do Site</a></li>
              <li><a href="#termos-de-uso">Termos de Uso</a></li>
              <li><a href="#privacidade">Política de Privacidade</a></li>
            </ul>
          </div>
          <div className="gov-footer-section">
            <h4>Redes Sociais</h4>
            <ul>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#youtube">YouTube</a></li>
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#instagram">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="gov-footer-bottom">
          <p>Portal de Serviços do Cidadão — Projeto demonstrativo</p>
          <p>Desenvolvido com React + TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
