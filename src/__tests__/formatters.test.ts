import {
  formatCPF,
  formatCNPJ,
  formatPlaca,
  formatCurrency,
  formatDate,
  formatNIS,
  formatChaveNFe,
  formatPhone,
  formatCEP,
} from '../utils/formatters';

describe('formatCPF', () => {
  it('formats 11 digits with dots and dash', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25');
  });

  it('strips non-digit characters before formatting', () => {
    expect(formatCPF('529.982.247-25')).toBe('529.982.247-25');
  });
});

describe('formatCNPJ', () => {
  it('formats 14 digits with dots, slash, and dash', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });
});

describe('formatPlaca', () => {
  it('formats Mercosul plate with dash', () => {
    expect(formatPlaca('ABC1D23')).toBe('ABC-1D23');
  });

  it('formats old-style plate with dash', () => {
    expect(formatPlaca('ABC1234')).toBe('ABC-1234');
  });

  it('uppercases lowercase input', () => {
    expect(formatPlaca('abc1d23')).toBe('ABC-1D23');
  });

  it('returns as-is if not 7 chars', () => {
    expect(formatPlaca('AB')).toBe('AB');
  });
});

describe('formatCurrency', () => {
  it('formats number as BRL currency', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1.234,56');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to pt-BR format', () => {
    expect(formatDate('2024-01-15')).toBe('15/01/2024');
  });
});

describe('formatNIS', () => {
  it('formats 11-digit NIS with dots and dash', () => {
    expect(formatNIS('12345678901')).toBe('123.45678.90-1');
  });
});

describe('formatChaveNFe', () => {
  it('splits 44-digit key into groups of 4', () => {
    const chave = '31240112345678000195550010000012341000012345';
    const result = formatChaveNFe(chave);
    expect(result.split(' ').length).toBe(11); // 44 / 4 = 11 groups
    expect(result.split(' ')[0]).toBe('3124');
  });
});

describe('formatPhone', () => {
  it('formats 11-digit mobile phone', () => {
    expect(formatPhone('31999887766')).toBe('(31) 99988-7766');
  });

  it('formats 10-digit landline', () => {
    expect(formatPhone('3133445566')).toBe('(31) 3344-5566');
  });
});

describe('formatCEP', () => {
  it('formats 8-digit CEP with dash', () => {
    expect(formatCEP('30130000')).toBe('30130-000');
  });

  it('strips non-digits before formatting', () => {
    expect(formatCEP('30130-000')).toBe('30130-000');
  });
});
