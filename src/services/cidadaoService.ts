import type { Cidadao } from '../types';
import cidadaosData from '../mock/cidadaos.json';

export function getCidadaoByCpf(cpf: string): Cidadao | undefined {
  return (cidadaosData as Cidadao[]).find((c) => c.cpf === cpf);
}

export function getAllCidadaos(): Cidadao[] {
  return cidadaosData as Cidadao[];
}
