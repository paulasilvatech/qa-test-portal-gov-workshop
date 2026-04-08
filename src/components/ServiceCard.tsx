import { Link } from 'react-router-dom';

interface ServiceCardProps {
  titulo: string;
  descricao: string;
  icone: string;
  rota: string;
  cor?: string;
}

export default function ServiceCard({ titulo, descricao, icone, rota, cor }: ServiceCardProps) {
  return (
    <Link to={rota} className="service-card card" style={cor ? { borderTop: `4px solid ${cor}` } : undefined}>
      <div className="service-card-icon">{icone}</div>
      <h3 className="service-card-title">{titulo}</h3>
      <p className="service-card-desc">{descricao}</p>
      <span className="service-card-link">Acessar serviço →</span>
    </Link>
  );
}
