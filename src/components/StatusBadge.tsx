type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

const STATUS_MAP: Record<string, BadgeVariant> = {
  pago: 'success',
  ativo: 'success',
  regular: 'success',
  autorizada: 'success',
  quitado: 'success',
  disponivel: 'success',
  pendente: 'warning',
  parcelado: 'warning',
  'em-analise': 'warning',
  registrada: 'warning',
  recurso: 'warning',
  vencido: 'danger',
  vencida: 'danger',
  suspenso: 'danger',
  suspensa: 'danger',
  cancelada: 'danger',
  cancelado: 'danger',
  cassada: 'danger',
  cessado: 'info',
  denegada: 'danger',
  bloqueado: 'danger',
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant ?? STATUS_MAP[status] ?? 'info';
  return (
    <span className={`badge badge-${resolvedVariant}`}>
      {status.replace(/-/g, ' ')}
    </span>
  );
}
