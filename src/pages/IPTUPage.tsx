import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getIPTUByCpf } from '../services/iptuService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import BoletoViewer from '../components/BoletoViewer';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { IPTU } from '../types';

export default function IPTUPage() {
  const [iptus, setIptus] = useState<IPTU[]>([]);
  const [selected, setSelected] = useState<IPTU | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setIptus(getIPTUByCpf(user.cpf));
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'IPTU' }]} />
        <h1>IPTU — Imposto Predial e Territorial Urbano</h1>

        {iptus.length === 0 ? (
          <div className="alert alert-info">Nenhum imóvel encontrado para o seu CPF.</div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Inscrição</th>
                    <th>Endereço</th>
                    <th>Exercício</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {iptus.map((iptu) => (
                    <tr key={iptu.id}>
                      <td>{iptu.inscricaoMunicipal}</td>
                      <td>{iptu.imovel.endereco}</td>
                      <td>{iptu.anoExercicio}</td>
                      <td>{formatCurrency(iptu.valorTotal)}</td>
                      <td><StatusBadge status={iptu.status} /></td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setSelected(iptu)}>Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <section className="detail-section">
                <h2>Detalhes — Inscrição {selected.inscricaoMunicipal}</h2>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>

                <div className="grid grid-2">
                  <div className="card">
                    <h3>Imóvel</h3>
                    <div className="info-row"><span className="info-label">Tipo:</span><span className="info-value">{selected.imovel.tipo}</span></div>
                    <div className="info-row"><span className="info-label">Área Terreno:</span><span className="info-value">{selected.imovel.areaTerreno} m²</span></div>
                    <div className="info-row"><span className="info-label">Área Construída:</span><span className="info-value">{selected.imovel.areaConstruida} m²</span></div>
                    <div className="info-row"><span className="info-label">Endereço:</span><span className="info-value">{selected.imovel.endereco} — {selected.imovel.bairro}</span></div>
                    <div className="info-row"><span className="info-label">Valor Venal:</span><span className="info-value">{formatCurrency(selected.valorVenal)}</span></div>
                  </div>
                  <div className="card">
                    <h3>Imposto</h3>
                    <div className="info-row"><span className="info-label">Exercício:</span><span className="info-value">{selected.anoExercicio}</span></div>
                    <div className="info-row"><span className="info-label">Alíquota:</span><span className="info-value">{(selected.aliquota * 100).toFixed(2)}%</span></div>
                    <div className="info-row"><span className="info-label">Valor Total:</span><span className="info-value">{formatCurrency(selected.valorTotal)}</span></div>
                  </div>
                </div>

                <h3>Parcelas</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Parcela</th><th>Valor</th><th>Vencimento</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {selected.parcelas.map((p) => (
                        <tr key={p.numero}>
                          <td>{p.numero === 0 ? 'Cota Única' : `${p.numero}ª`}</td>
                          <td>{formatCurrency(p.valor)}</td>
                          <td>{formatDate(p.vencimento)}</td>
                          <td><StatusBadge status={p.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(() => {
                  const pendente = selected.parcelas.find((p) => p.status === 'pendente' && p.codigoBarras);
                  return pendente ? (
                    <BoletoViewer
                      codigoBarras={pendente.codigoBarras!}
                      valor={pendente.valor}
                      vencimento={pendente.vencimento}
                      beneficiario="Prefeitura Municipal de Belo Horizonte"
                    />
                  ) : null;
                })()}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
