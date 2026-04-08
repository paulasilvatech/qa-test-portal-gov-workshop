import type { EmprestimoConsignado } from '../types';
import emprestimoData from '../mock/emprestimo-consignado.json';

export function getEmprestimosByCpf(cpf: string): EmprestimoConsignado[] {
  return (emprestimoData as EmprestimoConsignado[]).filter((item) => item.titularCpf === cpf);
}

export function getEmprestimoById(id: string): EmprestimoConsignado | undefined {
  return (emprestimoData as EmprestimoConsignado[]).find((item) => item.id === id);
}
