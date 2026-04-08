import type { ContaFGTS } from '../types';
import fgtsData from '../mock/fgts.json';

export function getContasFGTSByCpf(cpf: string): ContaFGTS[] {
  return (fgtsData as ContaFGTS[]).filter((item) => item.titularCpf === cpf);
}

export function getContaFGTSById(id: string): ContaFGTS | undefined {
  return (fgtsData as ContaFGTS[]).find((item) => item.id === id);
}
