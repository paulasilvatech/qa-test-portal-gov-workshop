import type { BolsaFamilia } from '../types';
import bolsaData from '../mock/bolsa-familia.json';

export function getBolsaFamiliaByCpf(cpf: string): BolsaFamilia | undefined {
  return (bolsaData as BolsaFamilia[]).find((item) => item.titularCpf === cpf);
}
