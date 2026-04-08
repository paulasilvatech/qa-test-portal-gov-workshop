import type { NFe } from '../types';
import danfeData from '../mock/danfe.json';

export function getNFeByCpf(cpf: string): NFe[] {
  return (danfeData as NFe[]).filter((item) => item.destinatarioCpf === cpf);
}

export function getNFeById(id: string): NFe | undefined {
  return (danfeData as NFe[]).find((item) => item.id === id);
}

export function getNFeByChave(chave: string): NFe | undefined {
  return (danfeData as NFe[]).find((item) => item.chaveAcesso === chave);
}
