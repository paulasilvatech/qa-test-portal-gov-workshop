import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getIPVAByCpf } from '../services/ipvaService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import BoletoViewer from '../components/BoletoViewer';
import { formatCurrency, formatDate, formatPlaca } from '../utils/formatters';
import type { IPVA } from '../types';

export default function IPVAPage() {
  const [ipvas, setIpvas] = useState<IPVA[]>([]);
  const [selected, setSelected] = useState<IPVA | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      const data = getIPVAByCpf(user.cpf);
      setIpvas(data);
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[
          { label: 'Início', to: '/' },
          { label: 'IPVA' },
        ]} />

        <h1>IPVA — Imposto sobre Veículos</h1>

        {ipvas.length === 0 ? (
          <div className="alert alert-info">Nenhum veículo encontrado para o seu CPF.</div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>Ano</th>
                    <th>Exercício</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ipvas.map((ipva) => (
                    <tr key={ipva.id}>
                      <td>{formatPlaca(ipva.veiculo.placa)}</td>
                      <td>{ipva.veiculo.modelo}</td>
                      <td>{ipva.veiculo.anoModelo}</td>
                      <td>{ipva.anoExercicio}</td>
                      <td>{formatCurrency(ipva.valorTotal)}</td>
                      <td><StatusBadge status={ipva.status} /></td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setSelected(ipva)}>
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <section className="detail-section">
                <h2>Detalhes — {selected.veiculo.modelo} ({formatPlaca(selected.veiculo.placa)})</h2>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>

                <div className="grid grid-2">
                  <div className="card">
                    <h3>Veículo</h3>
                    <div className="info-row"><span className="info-label">Marca:</span><span className="info-value">{selected.veiculo.marca}</span></div>
                    <div className="info-row"><span className="info-label">Cor:</span><span className="info-value">{selected.veiculo.cor}</span></div>
                    <div className="info-row"><span className="info-label">RENAVAM:</span><span className="info-value">{selected.veiculo.renavam}</span></div>
                    <div className="info-row"><span className="info-label">Combustível:</span><span className="info-value">{selected.veiculo.combustivel}</span></div>
                  </div>
                  <div className="card">
                    <h3>Imposto</h3>
                    <div className="info-row"><span className="info-label">Exercício:</span><span className="info-value">{selected.anoExercicio}</span></div>
                    <div className="info-row"><span className="info-label">Valor Total:</span><span className="info-value">{formatCurrency(selected.valorTotal)}</span></div>
                    <div className="info-row"><span className="info-label">Status:</span><span className="info-value"><StatusBadge status={selected.status} /></span></div>
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
                          <td>{p.numero}ª</td>
                          <td>{formatCurrency(p.valor)}</td>
                          <td>{formatDate(p.vencimento)}</td>
                          <td><StatusBadge status={p.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selected.status !== 'pago' && selected.parcelas.some(p => p.codigoBarras) && (() => {
                  const pendente = selected.parcelas.find(p => p.codigoBarras && p.status !== 'pago');
                  return pendente ? (
                    <BoletoViewer
                      codigoBarras={pendente.codigoBarras!}
                      valor={pendente.valor}
                      vencimento={pendente.vencimento}
                      beneficiario="Secretaria de Estado de Fazenda de MG"
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
