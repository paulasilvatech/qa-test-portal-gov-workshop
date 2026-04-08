import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getCNHByCpf } from '../services/cnhService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import { formatCPF, formatCurrency, formatDate } from '../utils/formatters';
import type { CNH } from '../types';

export default function CNHDigitalPage() {
  const [cnh, setCnh] = useState<CNH | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      const data = getCNHByCpf(user.cpf);
      setCnh(data ?? null);
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'CNH Digital' }]} />
        <h1>CNH Digital — Carteira Nacional de Habilitação</h1>

        {!cnh ? (
          <div className="alert alert-info">Nenhuma CNH encontrada para o seu CPF.</div>
        ) : (
          <>
            <div className="card cnh-card">
              <div className="cnh-header">
                <h2>CARTEIRA NACIONAL DE HABILITAÇÃO</h2>
                <StatusBadge status={cnh.situacao} />
              </div>

              <div className="grid grid-2">
                <div>
                  <div className="info-row"><span className="info-label">CPF:</span><span className="info-value">{formatCPF(cnh.titularCpf)}</span></div>
                  <div className="info-row"><span className="info-label">Nº Registro:</span><span className="info-value">{cnh.numeroRegistro}</span></div>
                  <div className="info-row"><span className="info-label">Nº PGU:</span><span className="info-value">{cnh.numeroPGU}</span></div>
                  <div className="info-row"><span className="info-label">Categoria:</span><span className="info-value">{cnh.categoria}</span></div>
                </div>
                <div>
                  <div className="info-row"><span className="info-label">Primeira Habilitação:</span><span className="info-value">{formatDate(cnh.dataPrimeiraHabilitacao)}</span></div>
                  <div className="info-row"><span className="info-label">Emissão:</span><span className="info-value">{formatDate(cnh.dataEmissao)}</span></div>
                  <div className="info-row"><span className="info-label">Validade:</span><span className="info-value">{formatDate(cnh.dataValidade)}</span></div>
                  <div className="info-row"><span className="info-label">Órgão Emissor:</span><span className="info-value">{cnh.orgaoEmissor}</span></div>
                </div>
              </div>

              {cnh.observacoes && (
                <div className="info-row"><span className="info-label">Observações:</span><span className="info-value">{cnh.observacoes}</span></div>
              )}

              <div className="info-row"><span className="info-label">Local Emissão:</span><span className="info-value">{cnh.localEmissao} — {cnh.uf}</span></div>
            </div>

            <div className="card">
              <h3>Pontuação</h3>
              <div className="pontuacao-display">
                <span className={`pontuacao-valor ${cnh.pontuacao >= 20 ? 'pontuacao-alta' : ''}`}>{cnh.pontuacao}</span>
                <span className="pontuacao-label">/ 20 pontos</span>
              </div>
              {cnh.pontuacao >= 20 && (
                <div className="alert alert-danger">Limite de pontos atingido. CNH pode ser suspensa.</div>
              )}
            </div>

            {cnh['infrações'].length > 0 && (
              <>
                <h3>Infrações</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Data</th><th>Descrição</th><th>Gravidade</th><th>Pontos</th><th>Valor</th><th>Placa</th><th>Local</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {cnh['infrações'].map((inf) => (
                        <tr key={inf.autoInfracao}>
                          <td>{formatDate(inf.dataInfracao)}</td>
                          <td>{inf.descricao}</td>
                          <td>{inf.gravidade}</td>
                          <td>{inf.pontos}</td>
                          <td>{formatCurrency(inf.valorMulta)}</td>
                          <td>{inf.placa}</td>
                          <td>{inf.local}</td>
                          <td><StatusBadge status={inf.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
