import { useEffect, useState } from 'react';
import { getAuthUser } from '../services/authService';
import { getNFeByCpf } from '../services/danfeService';
import BreadcrumbNav from '../components/BreadcrumbNav';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate, formatCNPJ, formatChaveNFe } from '../utils/formatters';
import type { NFe } from '../types';

export default function DANFEPage() {
  const [nfes, setNfes] = useState<NFe[]>([]);
  const [selected, setSelected] = useState<NFe | null>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setNfes(getNFeByCpf(user.cpf));
    }
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <BreadcrumbNav items={[{ label: 'Início', to: '/' }, { label: 'DANFE' }]} />
        <h1>DANFE — Notas Fiscais Eletrônicas</h1>

        {nfes.length === 0 ? (
          <div className="alert alert-info">Nenhuma nota fiscal encontrada para o seu CPF.</div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Emitente</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {nfes.map((nfe) => (
                    <tr key={nfe.id}>
                      <td>{nfe.numero}</td>
                      <td>{nfe.emitente.razaoSocial}</td>
                      <td>{formatDate(nfe.dataEmissao)}</td>
                      <td>{formatCurrency(nfe.valorTotal)}</td>
                      <td><StatusBadge status={nfe.status} /></td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setSelected(nfe)}>Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <section className="detail-section">
                <h2>NF-e Nº {selected.numero}</h2>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>

                <div className="card">
                  <h3>Chave de Acesso</h3>
                  <p className="chave-nfe">{formatChaveNFe(selected.chaveAcesso)}</p>
                </div>

                <div className="grid grid-2">
                  <div className="card">
                    <h3>Emitente</h3>
                    <div className="info-row"><span className="info-label">Razão Social:</span><span className="info-value">{selected.emitente.razaoSocial}</span></div>
                    <div className="info-row"><span className="info-label">CNPJ:</span><span className="info-value">{formatCNPJ(selected.emitente.cnpj)}</span></div>
                    <div className="info-row"><span className="info-label">IE:</span><span className="info-value">{selected.emitente.inscricaoEstadual}</span></div>
                  </div>
                  <div className="card">
                    <h3>Informações</h3>
                    <div className="info-row"><span className="info-label">Série:</span><span className="info-value">{selected.serie}</span></div>
                    <div className="info-row"><span className="info-label">Emissão:</span><span className="info-value">{formatDate(selected.dataEmissao)}</span></div>
                    <div className="info-row"><span className="info-label">Natureza:</span><span className="info-value">{selected.naturezaOperacao}</span></div>
                    <div className="info-row"><span className="info-label">Valor Total:</span><span className="info-value">{formatCurrency(selected.valorTotal)}</span></div>
                  </div>
                </div>

                <h3>Itens</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Descrição</th><th>Qtd</th><th>Un.</th><th>Unitário</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                      {selected.itens.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.descricao}</td>
                          <td>{item.quantidade}</td>
                          <td>{item.unidade}</td>
                          <td>{formatCurrency(item.valorUnitario)}</td>
                          <td>{formatCurrency(item.valorTotal)}</td>
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
