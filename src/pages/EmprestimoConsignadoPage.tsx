import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getEmprestimosByCpf } from '../services/emprestimoService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { EmprestimoConsignado } from '../types';

export default function EmprestimoConsignadoPage() {
  const [emprestimos, setEmprestimos] = useState<EmprestimoConsignado[]>([]);
  const [selected, setSelected] = useState<EmprestimoConsignado | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setEmprestimos(getEmprestimosByCpf(user.cpf));
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'Empréstimo Consignado' }]} />
        <h1>Empréstimo Consignado</h1>

        {emprestimos.length === 0 ? (
          <div className="alert alert-info">Nenhum empréstimo consignado encontrado para o seu CPF.</div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Contrato</th>
                    <th>Banco</th>
                    <th>Valor</th>
                    <th>Parcelas</th>
                    <th>Taxa</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimos.map((e) => (
                    <tr key={e.id}>
                      <td>{e.numeroContrato}</td>
                      <td>{e.instituicao}</td>
                      <td>{formatCurrency(e.valorEmprestimo)}</td>
                      <td>{e.parcelasPagas}/{e.prazoMeses}</td>
                      <td>{e.taxaJurosMensal}% a.m.</td>
                      <td><StatusBadge status={e.situacao} /></td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setSelected(e)}>Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <section className="detail-section">
                <h2>Contrato {selected.numeroContrato}</h2>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>

                <div className="grid grid-2">
                  <div className="card">
                    <h3>Dados do Contrato</h3>
                    <div className="info-row"><span className="info-label">Instituição:</span><span className="info-value">{selected.instituicao}</span></div>
                    <div className="info-row"><span className="info-label">Contratação:</span><span className="info-value">{formatDate(selected.dataContratacao)}</span></div>
                    <div className="info-row"><span className="info-label">Valor Emprestado:</span><span className="info-value">{formatCurrency(selected.valorEmprestimo)}</span></div>
                    <div className="info-row"><span className="info-label">Taxa de Juros:</span><span className="info-value">{selected.taxaJurosMensal}% a.m.</span></div>
                    <div className="info-row"><span className="info-label">CET:</span><span className="info-value">{selected.cetAnual}% a.a.</span></div>
                  </div>
                  <div className="card">
                    <h3>Situação</h3>
                    <div className="info-row"><span className="info-label">Parcelas:</span><span className="info-value">{selected.parcelasPagas} de {selected.prazoMeses}</span></div>
                    <div className="info-row"><span className="info-label">Valor Parcela:</span><span className="info-value">{formatCurrency(selected.valorParcela)}</span></div>
                    <div className="info-row"><span className="info-label">Saldo Devedor:</span><span className="info-value">{formatCurrency(selected.saldoDevedor)}</span></div>
                    <div className="info-row"><span className="info-label">Margem Consignável:</span><span className="info-value">{formatCurrency(selected.margemConsignavel)}</span></div>
                    <div className="info-row"><span className="info-label">Margem Utilizada:</span><span className="info-value">{formatCurrency(selected.margemUtilizada)}</span></div>
                  </div>
                </div>

                <h3>Parcelas</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Nº</th><th>Valor</th><th>Vencimento</th><th>Amortização</th><th>Juros</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {selected.parcelas.map((p) => (
                        <tr key={p.numero}>
                          <td>{p.numero}</td>
                          <td>{formatCurrency(p.valor)}</td>
                          <td>{formatDate(p.vencimento)}</td>
                          <td>{formatCurrency(p.amortizacao)}</td>
                          <td>{formatCurrency(p.juros)}</td>
                          <td><StatusBadge status={p.status} /></td>
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
