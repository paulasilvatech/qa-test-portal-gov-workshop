import { formatCurrency, formatDate } from '../utils/formatters';

interface BoletoViewerProps {
  codigoBarras: string;
  valor: number;
  vencimento: string;
  beneficiario?: string;
  qrCodePix?: string;
}

export default function BoletoViewer({ codigoBarras, valor, vencimento, beneficiario, qrCodePix }: BoletoViewerProps) {
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="boleto-viewer card">
      <h4 className="boleto-title">Boleto de Pagamento</h4>

      {beneficiario && (
        <div className="info-row">
          <span className="info-label">Beneficiário</span>
          <span className="info-value">{beneficiario}</span>
        </div>
      )}
      <div className="info-row">
        <span className="info-label">Valor</span>
        <span className="info-value" style={{ fontWeight: 700, color: 'var(--gov-blue-primary)' }}>
          {formatCurrency(valor)}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Vencimento</span>
        <span className="info-value">{formatDate(vencimento)}</span>
      </div>

      <div className="boleto-barcode">
        <label className="form-label">Código de Barras</label>
        <div className="boleto-barcode-row">
          <code className="boleto-barcode-code">{codigoBarras}</code>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleCopy(codigoBarras)}
            title="Copiar código"
          >
            Copiar
          </button>
        </div>
      </div>

      {qrCodePix && (
        <div className="boleto-pix">
          <label className="form-label">QR Code PIX (Copia e Cola)</label>
          <div className="boleto-barcode-row">
            <code className="boleto-barcode-code boleto-pix-code">{qrCodePix}</code>
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleCopy(qrCodePix)}
              title="Copiar PIX"
            >
              Copiar PIX
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
