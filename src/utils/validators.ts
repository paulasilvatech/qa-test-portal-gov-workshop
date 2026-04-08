export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(digits.charAt(10));
}

export function validateNIS(nis: string): boolean {
  const digits = nis.replace(/\D/g, '');
  if (digits.length !== 11) return false;

  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * weights[i];
  }
  const remainder = sum % 11;
  const digit = remainder < 2 ? 0 : 11 - remainder;
  return digit === parseInt(digits.charAt(10));
}

export function validatePlacaMercosul(placa: string): boolean {
  const clean = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean);
}

export function validatePlacaAntiga(placa: string): boolean {
  const clean = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return /^[A-Z]{3}[0-9]{4}$/.test(clean);
}

export function validatePlaca(placa: string): boolean {
  return validatePlacaMercosul(placa) || validatePlacaAntiga(placa);
}

export function validateChaveNFe(chave: string): boolean {
  const digits = chave.replace(/\D/g, '');
  return digits.length === 44;
}

export function validateInscricaoMunicipal(inscricao: string): boolean {
  const digits = inscricao.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15;
}
