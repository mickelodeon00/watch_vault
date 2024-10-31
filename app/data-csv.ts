'use client';

type WatchData = {
  id: string;
  brand: string;
  model: string;
  referenceNumber: string;
  price: number;
  type: string;
};

const data: WatchData[] = [
  {
    id: 'W1',
    brand: 'Rolex',
    model: 'Submariner',
    referenceNumber: '114060',
    price: 8500,
    type: 'automatic',
  },
  {
    id: 'W2',
    brand: 'Omega',
    model: 'Speedmaster',
    referenceNumber: '311.30.42.30.01.005',
    price: 6200,
    type: 'mechanical',
  },
  // Add the rest of your data here
];

export function downloadCSV(data: WatchData[]): void {
  if (typeof document === 'undefined') return; // Check if running in a browser

  const headers = Object.keys(data[0]) as (keyof WatchData)[];
  const rows = data.map((obj) =>
    headers.map((header) => JSON.stringify(obj[header] || ''))
  );

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'watches_data.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
