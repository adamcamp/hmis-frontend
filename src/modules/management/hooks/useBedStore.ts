import { useEffect, useState } from 'react';

export interface Bed {
  id: string;
  name: string;
  shelterSite: 'family' | 'individual';
  occupantId: string | null;
  occupantName: string | null;
}

// Module-level shared state — survives re-renders, shared across all components
let _beds: Bed[] = [
  // Family shelter beds
  { id: 'f-101', name: '101', shelterSite: 'family', occupantId: '2', occupantName: 'Williams, Sarah' },
  { id: 'f-102', name: '102', shelterSite: 'family', occupantId: '4', occupantName: 'Garcia, Maria' },
  { id: 'f-103', name: '103', shelterSite: 'family', occupantId: null, occupantName: null },
  { id: 'f-104', name: '104', shelterSite: 'family', occupantId: null, occupantName: null },
  { id: 'f-105', name: '105', shelterSite: 'family', occupantId: null, occupantName: null },
  { id: 'f-106', name: '106', shelterSite: 'family', occupantId: null, occupantName: null },
  // Individual shelter beds
  { id: 'i-101', name: '101', shelterSite: 'individual', occupantId: '1', occupantName: 'Johnson, Robert' },
  { id: 'i-102', name: '102', shelterSite: 'individual', occupantId: '3', occupantName: 'Davis, Marcus' },
  { id: 'i-103', name: '103', shelterSite: 'individual', occupantId: null, occupantName: null },
  { id: 'i-104', name: '104', shelterSite: 'individual', occupantId: null, occupantName: null },
  { id: 'i-105', name: '105', shelterSite: 'individual', occupantId: null, occupantName: null },
  { id: 'i-106', name: '106', shelterSite: 'individual', occupantId: null, occupantName: null },
  { id: 'i-107', name: '107', shelterSite: 'individual', occupantId: null, occupantName: null },
  { id: 'i-108', name: '108', shelterSite: 'individual', occupantId: null, occupantName: null },
];

let _listeners: Array<() => void> = [];
const notify = () => _listeners.forEach((fn) => fn());

// TODO: Connect to real GraphQL mutations:
//   - useCreateUnitsMutation for addBeds
//   - enrollment update for assign/unassign
//   - useDeleteUnitsMutation for removeBed
export const bedStore = {
  getAll: (): Bed[] => _beds,
  getBySite: (site: 'family' | 'individual'): Bed[] =>
    _beds.filter((b) => b.shelterSite === site),
  getByOccupant: (occupantId: string): Bed | undefined =>
    _beds.find((b) => b.occupantId === occupantId),

  assign: (bedId: string, occupantId: string, occupantName: string) => {
    // Unassign any existing bed for this occupant first
    _beds = _beds.map((b) =>
      b.occupantId === occupantId
        ? { ...b, occupantId: null, occupantName: null }
        : b,
    );
    _beds = _beds.map((b) =>
      b.id === bedId ? { ...b, occupantId, occupantName } : b,
    );
    notify();
  },

  unassign: (bedId: string) => {
    _beds = _beds.map((b) =>
      b.id === bedId ? { ...b, occupantId: null, occupantName: null } : b,
    );
    notify();
  },

  addBeds: (site: 'family' | 'individual', count: number) => {
    const siteBeds = _beds.filter((b) => b.shelterSite === site);
    const prefix = site === 'family' ? 'f' : 'i';
    const start = siteBeds.length + 1;
    const newBeds: Bed[] = Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${start + i}`,
      name: String(start + i).padStart(3, '0'),
      shelterSite: site,
      occupantId: null,
      occupantName: null,
    }));
    _beds = [..._beds, ...newBeds];
    notify();
  },

  removeBed: (bedId: string) => {
    _beds = _beds.filter((b) => b.id !== bedId);
    notify();
  },

  subscribe: (fn: () => void) => {
    _listeners = [..._listeners, fn];
    return () => {
      _listeners = _listeners.filter((l) => l !== fn);
    };
  },
};

/** Hook that re-renders whenever beds change. Optionally filter by shelter site. */
export const useBeds = (site?: 'family' | 'individual'): Bed[] => {
  const [, tick] = useState(0);
  useEffect(() => bedStore.subscribe(() => tick((n) => n + 1)), []);
  const beds = bedStore.getAll();
  return site ? beds.filter((b) => b.shelterSite === site) : beds;
};
