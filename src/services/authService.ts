import type { AuthUser } from '../types';
import { getCidadaoByCpf } from './cidadaoService';

const AUTH_KEY = 'gov_auth_user';

export function login(cpf: string): AuthUser | null {
  const cidadao = getCidadaoByCpf(cpf);
  if (!cidadao) return null;

  const user: AuthUser = {
    cpf: cidadao.cpf,
    nome: cidadao.nome,
    isAuthenticated: true,
  };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function getAuthUser(): AuthUser | null {
  const stored = sessionStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}
