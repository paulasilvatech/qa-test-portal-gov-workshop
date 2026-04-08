import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getBeneficiosByCpf } from '../services/inssService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { BeneficioINSS } from '../types';

export default function INSSPage() {
  const [beneficios, setBeneficios] = useState<BeneficioINSS[]>([]);
  const [selected, setSelected] = useState<BeneficioINSS | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setBeneficios(getBeneficiosByCpf(user.cpf));
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'INSS' }]} />
        <h1>INSS — Benefícios Previdenciários</h1>

        {beneficios.length === 0 ? (
          <div className="alert alert-info">Nenhum benefício INSS encontrado para o seu CPF.</div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nº Benefício</th>
                    <th>Tipo</th>
                    <th>Valor Mensal</th>
                    <th>Início</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficios.map((b) => (
                    <tr key={b.id}>
                      <td>{b.numeroBeneficio}</td>
                      <td>{b.tipo}</td>
                      <td>{formatCurrency(b.valorMensal)}</td>
                      <td>{formatDate(b.dataConcessao)}</td>
                      <td><StatusBadge status={b.situacao} /></td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setSelected(b)}>Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <section className="detail-section">
                <h2>Benefício {selected.numeroBeneficio}</h2>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>

                <div className="grid grid-2">
                  <div className="card">
                    <h3>Dados do Benefício</h3>
                    <div className="info-row"><span className="info-label">Tipo:</span><span className="info-value">{selected.tipo}</span></div>
                    <div className="info-row"><span className="info-label">Início:</span><span className="info-value">{formatDate(selected.dataConcessao)}</span></div>
                    {selected.dataFim && <div className="info-row"><span className="info-label">Fim:</span><span className="info-value">{formatDate(selected.dataFim)}</span></div>}
                    <div className="info-row"><span className="info-label">Valor Mensal:</span><span className="info-value">{formatCurrency(selected.valorMensal)}</span></div>
                  </div>
                  <div className="card">
                    <h3>Pagamento</h3>
                    <div className="info-row"><span className="info-label">Banco:</span><span className="info-value">{selected.banco}</span></div>
                    <div className="info-row"><span className="info-label">Agência:</span><span className="info-value">{selected.agencia}</span></div>
                    <div className="info-row"><span className="info-label">Conta:</span><span className="info-value">{selected.conta}</span></div>
                  </div>
                </div>

                <h3>Últimas Competências</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Competência</th><th>Valor Bruto</th><th>Desconto IR</th><th>Valor Líquido</th><th>Data Pgto</th></tr>
                    </thead>
                    <tbody>
                      {selected.competencias.map((c) => (
                        <tr key={c.mesAno}>
                          <td>{c.mesAno}</td>
                          <td>{formatCurrency(c.valorBruto)}</td>
                          <td>{formatCurrency(c.descontoIR)}</td>
                          <td>{formatCurrency(c.valorLiquido)}</td>
                          <td>{formatDate(c.dataPagamento)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
