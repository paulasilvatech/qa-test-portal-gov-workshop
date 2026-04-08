import { getCidadaoByCpf, getAllCidadaos } from '../services/cidadaoService';
import { getIPVAByCpf, getIPVAById } from '../services/ipvaService';
import { getIPTUByCpf, getIPTUById } from '../services/iptuService';
import { getNFeByCpf, getNFeById, getNFeByChave } from '../services/danfeService';
import { getBeneficiosByCpf, getBeneficioById } from '../services/inssService';
import { getContasFGTSByCpf, getContaFGTSById } from '../services/fgtsService';
import { getEmprestimosByCpf, getEmprestimoById } from '../services/emprestimoService';
import { getBolsaFamiliaByCpf } from '../services/bolsaFamiliaService';
import { getCNHByCpf } from '../services/cnhService';

describe('cidadaoService', () => {
  it('returns a citizen by valid CPF', () => {
    const cidadao = getCidadaoByCpf('52998224725');
    expect(cidadao).toBeDefined();
    expect(cidadao!.cpf).toBe('52998224725');
  });

  it('returns undefined for unknown CPF', () => {
    expect(getCidadaoByCpf('00000000000')).toBeUndefined();
  });

  it('returns all citizens', () => {
    const all = getAllCidadaos();
    expect(all.length).toBeGreaterThan(0);
  });
});

describe('ipvaService', () => {
  it('returns IPVA records for a known CPF', () => {
    const records = getIPVAByCpf('52998224725');
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].veiculo.proprietarioCpf).toBe('52998224725');
  });

  it('returns empty array for unknown CPF', () => {
    expect(getIPVAByCpf('00000000000')).toEqual([]);
  });

  it('finds IPVA by ID', () => {
    const records = getIPVAByCpf('52998224725');
    if (records.length > 0) {
      const found = getIPVAById(records[0].id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(records[0].id);
    }
  });

  it('returns undefined for unknown ID', () => {
    expect(getIPVAById('nonexistent')).toBeUndefined();
  });
});

describe('iptuService', () => {
  it('returns IPTU records for a known CPF', () => {
    const records = getIPTUByCpf('52998224725');
    expect(records.length).toBeGreaterThan(0);
  });

  it('returns empty array for unknown CPF', () => {
    expect(getIPTUByCpf('00000000000')).toEqual([]);
  });

  it('returns undefined for unknown ID', () => {
    expect(getIPTUById('nonexistent')).toBeUndefined();
  });
});

describe('danfeService', () => {
  it('returns NF-e records for a known CPF', () => {
    const records = getNFeByCpf('52998224725');
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].destinatarioCpf).toBe('52998224725');
  });

  it('returns empty array for unknown CPF', () => {
    expect(getNFeByCpf('00000000000')).toEqual([]);
  });

  it('finds NF-e by ID', () => {
    const found = getNFeById('nfe-001');
    expect(found).toBeDefined();
  });

  it('finds NF-e by chave', () => {
    const found = getNFeByChave('31260212345678000195550010000001231123456789');
    expect(found).toBeDefined();
    expect(found!.id).toBe('nfe-001');
  });

  it('returns undefined for unknown ID', () => {
    expect(getNFeById('nonexistent')).toBeUndefined();
  });

  it('returns undefined for unknown chave', () => {
    expect(getNFeByChave('00000000000000000000000000000000000000000000')).toBeUndefined();
  });
});

describe('inssService', () => {
  it('returns benefits for a known CPF', () => {
    const records = getBeneficiosByCpf('52998224725');
    expect(records.length).toBeGreaterThan(0);
  });

  it('returns empty for unknown CPF', () => {
    expect(getBeneficiosByCpf('00000000000')).toEqual([]);
  });

  it('returns undefined for unknown benefit ID', () => {
    expect(getBeneficioById('nonexistent')).toBeUndefined();
  });
});

describe('fgtsService', () => {
  it('returns FGTS accounts for a known CPF', () => {
    const records = getContasFGTSByCpf('52998224725');
    expect(records.length).toBeGreaterThan(0);
  });

  it('returns empty for unknown CPF', () => {
    expect(getContasFGTSByCpf('00000000000')).toEqual([]);
  });

  it('returns undefined for unknown account ID', () => {
    expect(getContaFGTSById('nonexistent')).toBeUndefined();
  });
});

describe('emprestimoService', () => {
  it('returns loans for a known CPF', () => {
    const records = getEmprestimosByCpf('52998224725');
    expect(records.length).toBeGreaterThan(0);
  });

  it('returns empty for unknown CPF', () => {
    expect(getEmprestimosByCpf('00000000000')).toEqual([]);
  });

  it('returns undefined for unknown loan ID', () => {
    expect(getEmprestimoById('nonexistent')).toBeUndefined();
  });
});

describe('bolsaFamiliaService', () => {
  it('returns Bolsa Família for a known CPF', () => {
    const record = getBolsaFamiliaByCpf('21436587009');
    expect(record).toBeDefined();
    expect(record!.titularCpf).toBe('21436587009');
  });

  it('returns undefined for unknown CPF', () => {
    expect(getBolsaFamiliaByCpf('00000000000')).toBeUndefined();
  });
});

describe('cnhService', () => {
  it('returns CNH for a known CPF', () => {
    const record = getCNHByCpf('52998224725');
    expect(record).toBeDefined();
    expect(record!.titularCpf).toBe('52998224725');
  });

  it('returns undefined for unknown CPF', () => {
    expect(getCNHByCpf('00000000000')).toBeUndefined();
  });
});
