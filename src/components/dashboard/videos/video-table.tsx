'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface VideoItem {
  id: number;
  ten_brand: string;
  ten_sanpham: string;
  trang_thai: string;
  nhom_trang_thai: string;
  ghi_chu: string;
  nen_tang_xa_hoi: string;
  ngay_air: string;
  ngay_chot_don: string;
  ngay_demo: string;
  ngay_giao_hang: string;
  ngay_hen_giao_san_pham: string;
}

interface VideoTableProps {
  count?: number;
  page?: number;
  rows?: VideoItem[];
  rowsPerPage?: number;
}

const columns: ColumnDef<VideoItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    size: 48,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'ten_sanpham',
    header: 'SẢN PHẨM',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'nhom_trang_thai',
    header: 'TRẠNG THÁI',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'ngay_demo',
    header: 'NGÀY GIAO',
    cell: info => info.row.original.ngay_demo
      ? dayjs(info.row.original.ngay_demo).format('DD/MM/YYYY')
      : 'Chưa có',
  },
  {
    accessorKey: 'ten_brand',
    header: 'BRANCH',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'nen_tang_xa_hoi',
    header: 'KÊNH',
    cell: info => info.getValue(),
  },
];

export function VideoTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: VideoTableProps): React.JSX.Element {

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
