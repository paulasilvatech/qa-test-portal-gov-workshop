// ---- Cidadão (base user) ----
export interface Cidadao {
  cpf: string;
  nome: string;
  nis: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

// ---- IPVA ----
export interface Veiculo {
  placa: string;
  renavam: string;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  cor: string;
  combustivel: string;
  proprietarioCpf: string;
}

export interface IPVA {
  id: string;
  veiculo: Veiculo;
  anoExercicio: number;
  valorTotal: number;
  parcelas: ParcelaIPVA[];
  status: 'pago' | 'pendente' | 'vencido' | 'parcelado';
}

export interface ParcelaIPVA {
  numero: number;
  valor: number;
  vencimento: string;
  status: 'pago' | 'pendente' | 'vencido';
  codigoBarras?: string;
  qrCodePix?: string;
}

// ---- IPTU ----
export interface Imovel {
  tipo: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  areaTerreno: number;
  areaConstruida: number;
}

export interface IPTU {
  id: string;
  inscricaoMunicipal: string;
  proprietarioCpf: string;
  imovel: Imovel;
  anoExercicio: number;
  valorVenal: number;
  aliquota: number;
  valorIPTU: number;
  taxaColeta: number;
  valorTotal: number;
  parcelas: ParcelaIPTU[];
  status: 'pago' | 'pendente' | 'vencido' | 'parcelado';
}

export interface ParcelaIPTU {
  numero: number;
  valor: number;
  vencimento: string;
  status: 'pago' | 'pendente' | 'vencido';
  codigoBarras?: string;
}

// ---- DANFE / NF-e ----
export interface ItemNFe {
  descricao: string;
  ncm: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  unidade?: string;
}

export interface NFe {
  id: string;
  chaveAcesso: string;
  numero: number;
  serie: number;
  dataEmissao: string;
  naturezaOperacao?: string;
  emitente: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
    inscricaoEstadual?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
  };
  destinatarioCpf: string;
  itens: ItemNFe[];
  valorProdutos?: number;
  valorFrete?: number;
  valorDesconto?: number;
  valorTotal: number;
  icms?: number;
  status: 'autorizada' | 'cancelada' | 'denegada';
  protocolo?: string;
}

// ---- INSS ----
export interface BeneficioINSS {
  id: string;
  numeroBeneficio: string;
  titularCpf: string;
  tipo: string;
  situacao: string;
  dataConcessao: string;
  dataFim?: string;
  valorMensal: number;
  banco: string;
  agencia: string;
  conta: string;
  competencias: CompetenciaINSS[];
}

export interface CompetenciaINSS {
  mesAno: string;
  valorBruto: number;
  descontoIR: number;
  valorLiquido: number;
  dataPagamento: string;
}

// ---- FGTS ----
export interface ContaFGTS {
  id: string;
  titularCpf: string;
  empresa: string;
  cnpj: string;
  dataAdmissao: string;
  dataDemissao?: string | null;
  situacao: string;
  saldoTotal: number;
  saldoDisponivel: number;
  optanteSaqueAniversario: boolean;
  mesSaqueAniversario: string | null;
  movimentacoes: MovimentacaoFGTS[];
}

export interface MovimentacaoFGTS {
  data: string;
  tipo: string;
  descricao: string;
  valor: number;
  saldoApos: number;
}

// ---- Empréstimo Consignado ----
export interface EmprestimoConsignado {
  id: string;
  titularCpf: string;
  numeroContrato: string;
  instituicao: string;
  cnpjInstituicao: string;
  dataContratacao: string;
  valorEmprestimo: number;
  taxaJurosMensal: number;
  taxaJurosAnual: number;
  cetAnual: number;
  prazoMeses: number;
  valorParcela: number;
  parcelasPagas: number;
  parcelasRestantes: number;
  saldoDevedor: number;
  margemConsignavel: number;
  margemUtilizada: number;
  margemDisponivel: number;
  situacao: string;
  parcelas: ParcelaConsignado[];
}

export interface ParcelaConsignado {
  numero: number;
  vencimento: string;
  valor: number;
  amortizacao: number;
  juros: number;
  status: string;
}

// ---- Bolsa Família ----
export interface BolsaFamilia {
  id: string;
  titularCpf: string;
  nis: string;
  valorMensal: number;
  situacao: string;
  dataConcessao: string;
  motivoSuspensao?: string;
  finalNIS: number;
  composicaoFamiliar: MembroFamiliar[];
  calendario: CalendarioBolsa[];
  extratos: ExtratoBolsa[];
}

export interface MembroFamiliar {
  nome: string;
  parentesco: string;
  cpf?: string | null;
  dataNascimento: string;
  escola?: string | null;
}

export interface CalendarioBolsa {
  mesReferencia: string;
  dataPagamento: string;
  valor: number;
  status: string;
}

export interface ExtratoBolsa {
  mesReferencia: string;
  dataPagamento: string;
  valor: number;
  parcelas: { tipo: string; valor: number }[];
}

// ---- CNH Digital ----
export interface CNH {
  id: string;
  titularCpf: string;
  numeroRegistro: string;
  numeroPGU: string;
  categoria: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';
  dataEmissao: string;
  dataValidade: string;
  dataPrimeiraHabilitacao: string;
  orgaoEmissor: string;
  localEmissao: string;
  uf: string;
  observacoes: string | null;
  pontuacao: number;
  situacao: 'regular' | 'suspensa' | 'cassada' | 'vencida';
  'infrações': InfracaoCNH[];
}

export interface InfracaoCNH {
  autoInfracao: string;
  dataInfracao: string;
  descricao: string;
  codigoInfracao: string;
  gravidade: 'leve' | 'media' | 'grave' | 'gravissima';
  pontos: number;
  valorMulta: number;
  placa: string;
  local: string;
  status: 'pago' | 'pendente' | 'recurso';
}

// ---- Auth ----
export interface AuthUser {
  cpf: string;
  nome: string;
  isAuthenticated: boolean;
}

// ---- Notification ----
export interface Notificacao {
  id: string;
  tipo: 'vencimento' | 'info' | 'alerta';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  servico: string;
}
