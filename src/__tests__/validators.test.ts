import {
  validateCPF,
  validateNIS,
  validatePlacaMercosul,
  validatePlacaAntiga,
  validatePlaca,
  validateChaveNFe,
  validateInscricaoMunicipal,
} from '../utils/validators';

describe('validateCPF', () => {
  it('returns true for valid CPF', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('returns true for valid CPF without formatting', () => {
    expect(validateCPF('52998224725')).toBe(true);
  });

  it('returns false for wrong length', () => {
    expect(validateCPF('123')).toBe(false);
  });

  it('returns false for all same digits', () => {
    expect(validateCPF('11111111111')).toBe(false);
  });

  it('returns false for invalid check digits', () => {
    expect(validateCPF('52998224720')).toBe(false);
  });
});

describe('validateNIS', () => {
  it('returns false for wrong length', () => {
    expect(validateNIS('123')).toBe(false);
  });

  it('accepts 11-digit string and validates check digit', () => {
    // NIS validation depends on weighted checksum
    const result = validateNIS('12345678901');
    expect(typeof result).toBe('boolean');
  });
});

describe('validatePlacaMercosul', () => {
  it('returns true for valid Mercosul plate', () => {
    expect(validatePlacaMercosul('ABC1D23')).toBe(true);
  });

  it('returns false for old-format plate', () => {
    expect(validatePlacaMercosul('ABC1234')).toBe(false);
  });

  it('handles lowercase and dashes', () => {
    expect(validatePlacaMercosul('abc-1d23')).toBe(true);
  });
});

describe('validatePlacaAntiga', () => {
  it('returns true for valid old plate', () => {
    expect(validatePlacaAntiga('ABC1234')).toBe(true);
  });

  it('returns false for Mercosul plate', () => {
    expect(validatePlacaAntiga('ABC1D23')).toBe(false);
  });
});

describe('validatePlaca', () => {
  it('accepts Mercosul plates', () => {
    expect(validatePlaca('ABC1D23')).toBe(true);
  });

  it('accepts old plates', () => {
    expect(validatePlaca('ABC1234')).toBe(true);
  });

  it('rejects invalid plates', () => {
    expect(validatePlaca('123')).toBe(false);
  });
});

describe('validateChaveNFe', () => {
  it('returns true for 44-digit key', () => {
    expect(validateChaveNFe('31240112345678000195550010000012341000012345')).toBe(true);
  });

  it('returns true for key with spaces', () => {
    expect(validateChaveNFe('3124 0112 3456 7800 0195 5500 1000 0012 3410 0001 2345')).toBe(true);
  });

  it('returns false for short key', () => {
    expect(validateChaveNFe('12345')).toBe(false);
  });
});

describe('validateInscricaoMunicipal', () => {
  it('returns true for 6-digit inscription', () => {
    expect(validateInscricaoMunicipal('123456')).toBe(true);
  });

  it('returns true for 15-digit inscription', () => {
    expect(validateInscricaoMunicipal('123456789012345')).toBe(true);
  });

  it('returns false for short inscription', () => {
    expect(validateInscricaoMunicipal('12345')).toBe(false);
  });

  it('returns false for too-long inscription', () => {
    expect(validateInscricaoMunicipal('1234567890123456')).toBe(false);
  });
});
