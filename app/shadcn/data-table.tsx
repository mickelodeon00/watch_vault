'use client';

import { Button } from '@/components/ui/button';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { FaCheck } from 'react-icons/fa6';
import clsx from 'clsx';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import { createClient } from '@/utils/supabase/client';
import { usePathname, useSearchParams } from 'next/navigation';

// import { downloadCSV } from '../data-csv';
// import { Watches, watches } from '../data';

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type PaginationTableState = {
  pagination: PaginationState;
};

export type PaginationInitialTableState = {
  pagination?: Partial<PaginationState>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [newData, setNewData] = useState<TData[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setcolumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setcolumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const stepSizeArray = Array.from({ length: 10 }, (_, i) => (i + 1) * 5);
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  async function fetchData() {
    const supabase = createClient();
    const { data, count, error } = await supabase
      .from('watches_v2')
      .select('*', { count: 'exact' })
      .ilike('brand', `%${searchQuery}%`)
      .order((sortBy as string) || 'id', {
        ascending: sortOrder === 'asc' || false,
      })
      .range(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize - 1
      );
    if (!error) {
      setNewData(data ?? []);
      setRowCount(count ?? 0);
    }
  }
  useEffect(() => {
    // console.log(pagination);
    fetchData();
  }, [
    pagination?.pageIndex,
    pagination.pageSize,
    sortOrder,
    sortBy,
    searchQuery,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const table = useReactTable({
    data: newData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(), //maunualPagination
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setcolumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setcolumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    rowCount: rowCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  return (
    <div>
      {/* <button onClick={() => downloadCSV(watches)}>Download CSV</button> */}
      {/* <button onClick={() => fetchData()}>Download CSV</button> */}

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter brands..."
          value={searchQuery ?? ''}
          onChange={(e) => {
            handleSearch(e.currentTarget.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <span className="text-gray-500">
                <FaFilter />
              </span>
              <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground px-4 ">
        <p className="text-black">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} rows selected.
        </p>
        <div className="flex flex-row items-center gap-12 font-semibold ">
          <div>
            Rows per page{' '}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="">
                  <span>{pagination.pageSize} </span>
                  <span>
                    <MdOutlineKeyboardArrowDown />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {stepSizeArray.map((pageSize) => (
                  <DropdownMenuItem
                    className={clsx('', {
                      'bg-slate-100':
                        table.getState().pagination.pageSize === pageSize,
                    })}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: 0,
                        pageSize,
                      }))
                    }
                    key={pageSize}
                  >
                    <span className="w-4">
                      {pageSize === table.getState().pagination.pageSize && (
                        <FaCheck />
                      )}
                    </span>
                    {pageSize}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            page {table?.getState()?.pagination?.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center justify-end space-x-2 py-4  ">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: 0,
                }))
              }
              disabled={!table.getCanPreviousPage()}
            >
              <MdKeyboardDoubleArrowLeft className="scale-y-[1.5]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }))
              }
              disabled={!table.getCanPreviousPage()}
            >
              <MdKeyboardArrowLeft className="scale-y-[1.5]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={!table.getCanNextPage()}
            >
              <MdKeyboardArrowRight className="scale-y-[1.5]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: table?.getPageCount() - 1,
                }));
              }}
              disabled={!table.getCanNextPage()}
            >
              <MdKeyboardDoubleArrowRight className="scale-y-[1.5]" />
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <MdKeyboardDoubleArrowLeft className="scale-y-[1.5]" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <MdKeyboardArrowLeft className="scale-y-[1.5]" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <MdKeyboardArrowRight className="scale-y-[1.5]" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <MdKeyboardDoubleArrowRight className="scale-y-[1.5]" />
        </Button>
      </div>
    </div>
  );
}
