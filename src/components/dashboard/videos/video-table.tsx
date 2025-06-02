'use client';

import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
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
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSelection } from '@/hooks/use-selection';
import IconButton from '@mui/material/IconButton';
import { EyeSlash as EyeSlash } from '@phosphor-icons/react/dist/ssr/EyeSlash';
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


const COLUMN_CONFIG = [
  { key: 'ten_sanpham', label: 'SẢN PHẨM' },
  { key: 'nhom_trang_thai', label: 'TRẠNG THÁI' },
  { key: 'ngay_demo', label: 'NGÀY DEMO' },
  { key: 'remaining_time', label: 'T.GIAN CÒN LẠI' },
  { key: 'ngay_nhan_hang', label: 'NGÀY NHẬN HÀNG' },
  { key: 'ten_brand', label: 'BRANCH' },
  { key: 'nen_tang_xa_hoi', label: 'KÊNH' },
];

const DEFAULT_COLUMNS = ['index', 'ten_sanpham', 'nhom_trang_thai', 'ngay_demo', 'remaining_time'];
export function VideoTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: VideoTableProps): React.JSX.Element {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.down('sm'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  console.log('isSmUp', isSmUp);

  // State for column visibility
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([
    ...DEFAULT_COLUMNS,
    // Nếu muốn mặc định hiện thêm cột nào, thêm key vào đây
  ]);


  // Toggle column visibility, chỉ cho phép ẩn/hiện các cột không mặc định
  const handleToggleColumn = (key: string) => {
    // if (DEFAULT_COLUMNS.includes(key)) return; // Không cho phép ẩn cột mặc định
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  function formatRemainingTime(ms: number): string {
    console.log('formatRemainingTime', ms);
    if (isNaN(ms) || ms <= 0) return 'Đã qua';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let result = '';
    if (days > 0) result += `${days} ngày `;
    if (hours > 0) result += `${hours} giờ `;
    if (minutes > 0) result += `${minutes} phút`;
    return result.trim();
  }

  const columns = React.useMemo<ColumnDef<VideoItem>[]>(() => [
    {
      id: 'index',
      header: 'STT',
      cell: ({ row }) => row.index + 1,
      enableSorting: true,
      enableColumnFilter: true,
      maxSize: 20,
      enableResizing: false,
    },
    ...COLUMN_CONFIG.filter(col => visibleColumns.includes(col.key)).map(col => {
      if (col.key === 'ten_sanpham') {
        return {
          accessorKey: 'ten_sanpham',
          header: 'SẢN PHẨM',
          cell: (info: any) => info.getValue(),
        };
      }
      if (col.key === 'nhom_trang_thai') {
        return {
          accessorKey: 'nhom_trang_thai',
          header: 'TRẠNG THÁI',
          cell: (info: any) => info.getValue(),
        };
      }
      if (col.key === 'ngay_demo') {
        return {
          accessorKey: 'ngay_demo',
          header: 'NGÀY DEMO',
          cell: (info: any) =>
            info.row.original.ngay_demo
              ? dayjs(info.row.original.ngay_demo).format('DD/MM/YYYY')
              : '-',
        };
      }
      if (col.key === 'remaining_time') {
        return {
          accessorKey: 'remaining_time',
          header: 'T.GIAN CÒN LẠI',
          cell: (info: any) =>
            info.row.original.remaining_time
              ? formatRemainingTime(info.row.original.remaining_time)
              : '-',
        };
      }
      if (col.key === 'ngay_nhan_hang') {
        return {
          accessorKey: 'ngay_nhan_hang',
          header: 'NGÀY NHẬN HÀNG',
          cell: (info: any) =>
            info.row.original.ngay_demo
              ? dayjs(info.row.original.ngay_demo).format('DD/MM/YYYY')
              : '-',
        };
      }
      if (col.key === 'ten_brand') {
        return {
          accessorKey: 'ten_brand',
          header: 'BRANCH',
          cell: (info: any) => info.getValue(),
        };
      }
      if (col.key === 'nen_tang_xa_hoi') {
        return {
          accessorKey: 'nen_tang_xa_hoi',
          header: 'KÊNH',
          cell: (info: any) => info.getValue(),
        };
      }
      return null;
    }).filter(Boolean) as ColumnDef<VideoItem>[],
  ], [visibleColumns]);

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

  // Dropdown state
 

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <Card>
      <Box sx={{ p: 2, pb: 0, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Danh sách video ({count})
        </Typography>
        {/* Dropdown for column config */}
        <IconButton onClick={handleMenuOpen}>
          <EyeSlash />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {COLUMN_CONFIG.map(col => (
            <MenuItem
              key={col.key}
              onClick={() => handleToggleColumn(col.key)}
            >
              <Checkbox
                checked={visibleColumns.includes(col.key)}
                size="small"
                sx={{ mr: 1 }}
              />
              {col.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    sx={{
                      textAlign:
                        header.column.id === 'index'
                          ? 'center'
                          : undefined,
                      width:
                       header.column.id === 'ten_sanpham' && isSmUp
                          ? 120
                          : header.column.id === 'index'
                          ? 60
                          : undefined,
                      maxWidth:
                        header.column.id === 'ten_sanpham' && isSmUp
                          ? 200
                          : undefined,
                      overflow:
                        header.column.id === 'ten_sanpham' && isSmUp
                          ? 'hidden'
                          : undefined,
                      textOverflow:
                        header.column.id === 'ten_sanpham' && isSmUp
                          ? 'ellipsis'
                          : undefined,
                      whiteSpace:
                        header.column.id === 'ten_sanpham' && isSmUp
                          ? 'nowrap'
                          : undefined,
                        
                    }}
                  >
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
                  <TableCell
                    key={cell.id}
                    sx={{
                      textAlign:
                        cell.column.id === 'index'
                          ? 'center'
                          : undefined,
                      width:
                        cell.column.id === 'ten_sanpham' && isSmUp
                          ? 120
                          : cell.column.id === 'index'
                          ? 60
                          : undefined,
                      maxWidth:
                        cell.column.id === 'ten_sanpham' && isSmUp
                          ? 200
                          : undefined,
                      overflow:
                        cell.column.id === 'ten_sanpham' && isSmUp
                          ? 'hidden'
                          : undefined,
                      textOverflow:
                        cell.column.id === 'ten_sanpham' && isSmUp
                          ? 'ellipsis'
                          : undefined,
                      whiteSpace:
                        cell.column.id === 'ten_sanpham' && isSmUp
                          ? 'nowrap'
                          : undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {/* <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
}
