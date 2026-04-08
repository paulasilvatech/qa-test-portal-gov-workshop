import type { CNH } from '../types';
import cnhData from '../mock/cnh.json';

export function getCNHByCpf(cpf: string): CNH | undefined {
  return (cnhData as CNH[]).find((item) => item.titularCpf === cpf);
}
