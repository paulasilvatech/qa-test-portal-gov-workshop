import type { IPTU } from '../types';
import iptuData from '../mock/iptu.json';

export function getIPTUByCpf(cpf: string): IPTU[] {
  return (iptuData as IPTU[]).filter((item) => item.proprietarioCpf === cpf);
}

export function getIPTUById(id: string): IPTU | undefined {
  return (iptuData as IPTU[]).find((item) => item.id === id);
}
