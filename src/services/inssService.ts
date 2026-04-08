import type { BeneficioINSS } from '../types';
import inssData from '../mock/inss.json';

export function getBeneficiosByCpf(cpf: string): BeneficioINSS[] {
  return (inssData as BeneficioINSS[]).filter((item) => item.titularCpf === cpf);
}

export function getBeneficioById(id: string): BeneficioINSS | undefined {
  return (inssData as BeneficioINSS[]).find((item) => item.id === id);
}
