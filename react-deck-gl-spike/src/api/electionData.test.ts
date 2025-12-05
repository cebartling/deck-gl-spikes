import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCountyVotingData } from './electionData';

declare const global: typeof globalThis;

// Mock TopoJSON data (minimal structure for testing)
const mockTopoJson = {
  type: 'Topology',
  objects: {
    counties: {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Polygon',
          id: '01001',
          properties: { name: 'Autauga' },
          arcs: [[0]],
        },
        {
          type: 'Polygon',
          id: '06001',
          properties: { name: 'Alameda' },
          arcs: [[1]],
        },
      ],
    },
  },
  arcs: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
    [
      [2, 2],
      [3, 2],
      [3, 3],
      [2, 3],
      [2, 2],
    ],
  ],
  transform: {
    scale: [0.01, 0.01],
    translate: [-122, 37],
  },
};

// Mock CSV data
const mockCsvData = `state_name,county_fips,county_name,votes_gop,votes_dem,total_votes,diff,per_gop,per_dem,per_point_diff
Alabama,01001,Autauga,20484,7439,28190,13045,0.727,0.264,0.463
California,06001,Alameda,130000,350000,500000,-220000,0.26,0.7,-0.44`;

describe('electionData', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('fetchCountyVotingData', () => {
    it('fetches and merges county geometry with election data', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockCsvData),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(2);
    });

    it('returns correct properties for Alabama county', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockCsvData),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();
      const autauga = result.features.find(
        (f) => f.properties.fips === '01001'
      );

      expect(autauga).toBeDefined();
      expect(autauga?.properties.name).toBe('Autauga');
      expect(autauga?.properties.state).toBe('AL');
      expect(autauga?.properties.stateFips).toBe('01');
      expect(autauga?.properties.republicanVotes).toBe(20484);
      expect(autauga?.properties.democratVotes).toBe(7439);
      expect(autauga?.properties.totalVotes).toBe(28190);
    });

    it('calculates margin correctly for Republican-leaning county', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockCsvData),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();
      const autauga = result.features.find(
        (f) => f.properties.fips === '01001'
      );

      // Margin = demVotes - gopVotes = 7439 - 20484 = -13045 (negative = GOP lead)
      expect(autauga?.properties.margin).toBe(-13045);
      // marginPercent is negated per_point_diff * 100
      // per_point_diff = 0.463, so marginPercent = -46.3
      expect(autauga?.properties.marginPercent).toBeCloseTo(-46.3, 1);
    });

    it('calculates margin correctly for Democratic-leaning county', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockCsvData),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();
      const alameda = result.features.find(
        (f) => f.properties.fips === '06001'
      );

      // Margin = demVotes - gopVotes = 350000 - 130000 = 220000 (positive = DEM lead)
      expect(alameda?.properties.margin).toBe(220000);
      // per_point_diff = -0.44, so marginPercent = 44
      expect(alameda?.properties.marginPercent).toBeCloseTo(44, 1);
    });

    it('throws error when TopoJSON fetch fails', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: false,
            statusText: 'Not Found',
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockCsvData),
        });
      });

      await expect(fetchCountyVotingData()).rejects.toThrow(
        'Failed to fetch TopoJSON'
      );
    });

    it('throws error when election CSV fetch fails', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: false,
            statusText: 'Not Found',
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      await expect(fetchCountyVotingData()).rejects.toThrow(
        'Failed to fetch election data'
      );
    });

    it('excludes counties without election data', async () => {
      const topoWithExtraCounty = {
        ...mockTopoJson,
        objects: {
          counties: {
            type: 'GeometryCollection',
            geometries: [
              ...mockTopoJson.objects.counties.geometries,
              {
                type: 'Polygon',
                id: '99999',
                properties: { name: 'Unknown' },
                arcs: [[0]],
              },
            ],
          },
        },
      };

      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(topoWithExtraCounty),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockCsvData),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();

      // Only counties with matching election data should be included
      expect(result.features).toHaveLength(2);
      expect(
        result.features.find((f) => f.properties.fips === '99999')
      ).toBeUndefined();
    });

    it('calculates other votes correctly', async () => {
      const csvWithOtherVotes = `state_name,county_fips,county_name,votes_gop,votes_dem,total_votes,diff,per_gop,per_dem,per_point_diff
Alabama,01001,Autauga,1000,1000,2500,0,0.4,0.4,0`;

      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(csvWithOtherVotes),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();
      const autauga = result.features.find(
        (f) => f.properties.fips === '01001'
      );

      // otherVotes = totalVotes - gopVotes - demVotes = 2500 - 1000 - 1000 = 500
      expect(autauga?.properties.otherVotes).toBe(500);
    });

    it('pads FIPS codes to 5 digits', async () => {
      const csvWithShortFips = `state_name,county_fips,county_name,votes_gop,votes_dem,total_votes,diff,per_gop,per_dem,per_point_diff
Alabama,1001,Autauga,20484,7439,28190,13045,0.727,0.264,0.463`;

      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('counties-10m.json')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTopoJson),
          });
        }
        if (url.includes('Presidential_Results.csv')) {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(csvWithShortFips),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const result = await fetchCountyVotingData();
      const autauga = result.features.find(
        (f) => f.properties.fips === '01001'
      );

      expect(autauga).toBeDefined();
      expect(autauga?.properties.fips).toBe('01001');
    });
  });
});
