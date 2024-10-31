'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type Watches } from '../data';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import SortableHeader from './sortable-header';

export const columns: ColumnDef<Watches>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <SortableHeader column={column} accessorKey="brand" />
    ),
    cell: ({ row }) => {
      const brand = row.getValue('brand') as string;
      return <div className="text-right font-medium">{brand}</div>;
    },
  },
  {
    accessorKey: 'model',
    header: () => <div className="text-right">Model</div>,
    cell: ({ row }) => {
      const model = row.getValue('model') as string;
      return <div className="text-right font-medium">{model}</div>;
    },
  },
  {
    accessorKey: 'reference_number',
    header: () => <div className="text-right">Reference Number</div>,
    cell: ({ row }) => {
      const referenceNumber = row.getValue('reference_number') as string;
      return <div className="text-right font-medium">{referenceNumber}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: () => <div className="text-right">Type</div>,
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <div className="text-right font-medium">{type}</div>;
    },
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const watch = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(watch.id)}
            >
              Copy watch ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View watch details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
