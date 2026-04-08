import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getContasFGTSByCpf } from '../services/fgtsService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { ContaFGTS } from '../types';

export default function FGTSPage() {
  const [contas, setContas] = useState<ContaFGTS[]>([]);
  const [selected, setSelected] = useState<ContaFGTS | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setContas(getContasFGTSByCpf(user.cpf));
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'FGTS' }]} />
        <h1>FGTS — Fundo de Garantia</h1>

        {contas.length === 0 ? (
          <div className="alert alert-info">Nenhuma conta FGTS encontrada para o seu CPF.</div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Admissão</th>
                    <th>Saldo</th>
                    <th>Saque Aniversário</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.empresa}</td>
                      <td>{formatDate(c.dataAdmissao)}</td>
                      <td>{formatCurrency(c.saldoTotal)}</td>
                      <td>{c.optanteSaqueAniversario ? 'Sim' : 'Não'}</td>
                      <td><StatusBadge status={c.situacao} /></td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setSelected(c)}>Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <section className="detail-section">
                <h2>Conta FGTS — {selected.empresa}</h2>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>

                <div className="grid grid-2">
                  <div className="card">
                    <h3>Empresa</h3>
                    <div className="info-row"><span className="info-label">Razão Social:</span><span className="info-value">{selected.empresa}</span></div>
                    <div className="info-row"><span className="info-label">CNPJ:</span><span className="info-value">{selected.cnpj}</span></div>
                    <div className="info-row"><span className="info-label">Admissão:</span><span className="info-value">{formatDate(selected.dataAdmissao)}</span></div>
                    {selected.dataDemissao && <div className="info-row"><span className="info-label">Demissão:</span><span className="info-value">{formatDate(selected.dataDemissao)}</span></div>}
                  </div>
                  <div className="card">
                    <h3>Saldo e Opções</h3>
                    <div className="info-row"><span className="info-label">Saldo Total:</span><span className="info-value">{formatCurrency(selected.saldoTotal)}</span></div>
                    <div className="info-row"><span className="info-label">Saldo Disponível:</span><span className="info-value">{formatCurrency(selected.saldoDisponivel)}</span></div>
                    <div className="info-row"><span className="info-label">Saque Aniversário:</span><span className="info-value">{selected.optanteSaqueAniversario ? 'Ativado' : 'Desativado'}</span></div>
                    {selected.mesSaqueAniversario && (
                      <div className="info-row"><span className="info-label">Mês Saque Aniv.:</span><span className="info-value">{selected.mesSaqueAniversario}</span></div>
                    )}
                  </div>
                </div>

                <h3>Movimentações</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Data</th><th>Tipo</th><th>Valor</th><th>Saldo Após</th></tr>
                    </thead>
                    <tbody>
                      {selected.movimentacoes.map((m, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(m.data)}</td>
                          <td>{m.tipo.replace(/_/g, ' ')}</td>
                          <td>{formatCurrency(m.valor)}</td>
                          <td>{formatCurrency(m.saldoApos)}</td>
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
