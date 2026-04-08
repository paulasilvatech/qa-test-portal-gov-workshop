import type { IPVA } from '../types';
import ipvaData from '../mock/ipva.json';

export function getIPVAByCpf(cpf: string): IPVA[] {
  return (ipvaData as IPVA[]).filter((item) => item.veiculo.proprietarioCpf === cpf);
}

export function getIPVAById(id: string): IPVA | undefined {
  return (ipvaData as IPVA[]).find((item) => item.id === id);
}
