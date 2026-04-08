import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getBolsaFamiliaByCpf } from '../services/bolsaFamiliaService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate, formatNIS } from '../utils/formatters';
import type { BolsaFamilia } from '../types';

export default function BolsaFamiliaPage() {
  const [beneficio, setBeneficio] = useState<BolsaFamilia | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      const data = getBolsaFamiliaByCpf(user.cpf);
      setBeneficio(data ?? null);
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'Bolsa Família' }]} />
        <h1>Bolsa Família</h1>

        {!beneficio ? (
          <div className="alert alert-info">Nenhum benefício Bolsa Família encontrado para o seu CPF.</div>
        ) : (
          <>
            <div className="grid grid-2">
              <div className="card">
                <h3>Dados do Benefício</h3>
                <div className="info-row"><span className="info-label">NIS:</span><span className="info-value">{formatNIS(beneficio.nis)}</span></div>
                <div className="info-row"><span className="info-label">Valor Mensal:</span><span className="info-value">{formatCurrency(beneficio.valorMensal)}</span></div>
                <div className="info-row"><span className="info-label">Status:</span><span className="info-value"><StatusBadge status={beneficio.situacao} /></span></div>
                <div className="info-row"><span className="info-label">Concessão:</span><span className="info-value">{formatDate(beneficio.dataConcessao)}</span></div>
                {beneficio.motivoSuspensao && <div className="info-row"><span className="info-label">Motivo Suspensão:</span><span className="info-value">{beneficio.motivoSuspensao}</span></div>}
              </div>
            </div>

            <h3>Composição Familiar</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Nome</th><th>Parentesco</th><th>Nascimento</th><th>Escola</th></tr>
                </thead>
                <tbody>
                  {beneficio.composicaoFamiliar.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.nome}</td>
                      <td>{m.parentesco}</td>
                      <td>{formatDate(m.dataNascimento)}</td>
                      <td>{m.escola ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Calendário de Pagamentos</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Mês</th><th>Data Pagamento</th><th>Valor</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {beneficio.calendario.map((c) => (
                    <tr key={c.mesReferencia}>
                      <td>{c.mesReferencia}</td>
                      <td>{formatDate(c.dataPagamento)}</td>
                      <td>{formatCurrency(c.valor)}</td>
                      <td><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Extrato de Pagamentos</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Referência</th><th>Data Pgto</th><th>Valor</th><th>Parcelas</th></tr>
                </thead>
                <tbody>
                  {beneficio.extratos.map((e, idx) => (
                    <tr key={idx}>
                      <td>{e.mesReferencia}</td>
                      <td>{formatDate(e.dataPagamento)}</td>
                      <td>{formatCurrency(e.valor)}</td>
                      <td>{e.parcelas.map(p => `${p.tipo}: ${formatCurrency(p.valor)}`).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
