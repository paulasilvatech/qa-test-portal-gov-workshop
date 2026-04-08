import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

const SERVICES = [
  { titulo: 'IPVA', descricao: 'Consulte e pague seu IPVA. Veja parcelas, débitos e emita boletos.', icone: '🚗', rota: '/ipva', cor: '#1351B4' },
  { titulo: 'IPTU', descricao: 'Consulte e pague seu IPTU. Parcelas, descontos e segunda via.', icone: '🏠', rota: '/iptu', cor: '#168821' },
  { titulo: 'DANFE', descricao: 'Consulte suas Notas Fiscais Eletrônicas e visualize DANFEs.', icone: '📄', rota: '/danfe', cor: '#FFCD07' },
  { titulo: 'INSS', descricao: 'Extrato de benefícios, pagamentos e competências do INSS.', icone: '🏥', rota: '/inss', cor: '#1351B4' },
  { titulo: 'FGTS', descricao: 'Saldo, extrato e movimentações do Fundo de Garantia.', icone: '💼', rota: '/fgts', cor: '#168821' },
  { titulo: 'Empréstimo Consignado', descricao: 'Contratos, parcelas e margem consignável.', icone: '🏦', rota: '/emprestimo-consignado', cor: '#1351B4' },
  { titulo: 'Bolsa Família', descricao: 'Benefício, calendário de pagamentos e composição familiar.', icone: '👨‍👩‍👧‍👦', rota: '/bolsa-familia', cor: '#168821' },
  { titulo: 'CNH Digital', descricao: 'Situação da habilitação, pontuação e infrações.', icone: '🪪', rota: '/cnh', cor: '#FFCD07' },
];

export default function HomePage() {
  const [filteredServices, setFilteredServices] = useState(SERVICES);

  function handleSearch(query: string) {
    if (!query) {
      setFilteredServices(SERVICES);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredServices(SERVICES.filter((s) =>
      s.titulo.toLowerCase().includes(lower) || s.descricao.toLowerCase().includes(lower)
    ));
  }

  return (
    <div className="page-content">
      <div className="container">
        <section className="home-hero">
          <h1>Portal de Serviços do Cidadão</h1>
          <p>Acesse serviços públicos digitais de forma rápida e segura.</p>
          <SearchBar placeholder="Buscar serviço (ex: IPVA, FGTS, CNH...)" onSearch={handleSearch} />
        </section>

        <section className="home-services">
          <h2>Serviços Disponíveis</h2>
          <div className="grid grid-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.rota} {...service} />
            ))}
          </div>
          {filteredServices.length === 0 && (
            <p className="home-no-results">Nenhum serviço encontrado para a sua busca.</p>
          )}
        </section>
      </div>
    </div>
  );
}
