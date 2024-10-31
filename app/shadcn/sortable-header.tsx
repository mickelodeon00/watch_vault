'use client';

// import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';

type SortableHeaderProps = {
  column: Column<any, unknown>;
  accessorKey: string;
};

export default function SortableHeader({
  column,
  accessorKey,
}: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortOrder = searchParams.get('sortOrder');

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    router.push(`/shadcn?sortBy=${accessorKey}&sortOrder=${newSortOrder}`);
  };

  return (
    <Button variant="ghost" className="text-right" onClick={handleSort}>
      {accessorKey.charAt(0).toUpperCase() + accessorKey.slice(1)}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
