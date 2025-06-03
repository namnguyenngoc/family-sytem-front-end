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
import { VideosAction } from '@/components/dashboard/videos/videos-action';
import { ChannelComponent } from '@/components/dashboard/videos/channel-component';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { gql, useMutation,useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import { EditVideoModal } from './Modal/EditVideoModal';
import { EditStatusModal } from './Modal/EditStatusModal';
import { useRouter } from 'next/navigation';


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
  onRefetch?: () => void; // Thêm prop này để gọi refetch từ cha
}


const COLUMN_CONFIG = [
  { key: 'ten_sanpham', label: 'SẢN PHẨM' },
  { key: 'trang_thai', label: 'TRẠNG THÁI' },
  { key: 'ngay_demo', label: 'NGÀY DEMO' },
  { key: 'remaining_time', label: 'T.GIAN CÒN LẠI' },
  { key: 'ngay_nhan_hang', label: 'NGÀY NHẬN HÀNG' },
  { key: 'ten_brand', label: 'BRAND' },
  { key: 'nen_tang_xa_hoi', label: 'KÊNH' },
];

const DEFAULT_COLUMNS = ['index', 'ten_sanpham', 'trang_thai', 'ngay_demo', 'remaining_time'];

const ENUM_LIST = gql`
  query EnumList {
    enumList {
      key
      values {
        label
        value
      }
    }
  }
`;

// Thêm mutation GraphQL cập nhật trạng thái video
const UPDATE_VIDEO_STATUS = gql`
  mutation UpdateVideoStatus($id: Float!, $trang_thai: String!, $ghi_chu: String) {
    updateVideoStatus(id: $id, trang_thai: $trang_thai, ghi_chu: $ghi_chu) {
      id
      trang_thai
      ghi_chu
    }
  }
`;

const UPDATE_OR_CREATE_TASK_INFO = gql`
  mutation UpdateOrCreateTaskInfo($createTaskInfoInput: CreateTaskInfoInput!) {
    updateOrCreateTaskInfo(createTaskInfoInput: $createTaskInfoInput) {
      id
      trang_thai
      ghi_chu
    }
  }
`;


export function VideoTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onRefetch, // nhận prop này
}: VideoTableProps): React.JSX.Element {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.down('sm'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const router = useRouter();
  console.log('isSmUp', isSmUp);

  const { data: enumData, loading: enumLoading, refetch } = useQuery(ENUM_LIST);

  // Helper to get enum values by key
  const getEnumValues = (key: string) =>
    enumData?.enumList?.find((item: any) => item.key === key)?.values || [];

  // State cho modal
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<VideoItem | null>(null);
  const [oldStatus, setOldStatus] = React.useState<string>('');

   // Hàm mở modal
  const handleOpenModal = (item: VideoItem) => {
    setSelectedItem(item);
    setOldStatus(item.trang_thai);
    setOpenModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

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

  function getStatusColor(status: string) {
    switch (status) {
      case 'Đã Nhận Hàng':
        return 'primary';
      case 'Đã Giao Hàng':
        return 'warning';
      default:
        return 'secondary';
    }
  }


  // State cho modal edit all fields
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editItem, setEditItem] = React.useState<VideoItem | null>(null);

  // Hàm mở modal edit all fields
  const handleOpenEditModal = (item: VideoItem) => {
    setEditItem(item);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditItem(null);
  };
  // Hàm lưu modal edit all fields
  const [updateOrCreateTaskInfo] = useMutation(UPDATE_OR_CREATE_TASK_INFO);
  const handleSaveEditModal = async (data: VideoItem) => {
    try {
      await updateOrCreateTaskInfo({
        variables: {
          createTaskInfoInput: {
            id: data.id,
            ten_brand: data.ten_brand,
            ten_sanpham: data.ten_sanpham,
            ngay_chot_don: data.ngay_chot_don,
            ngay_demo: data.ngay_demo,
            nen_tang_xa_hoi: data.nen_tang_xa_hoi,
            ghi_chu: data.ghi_chu,
            // add other fields as needed
          },
        },
      });
      setOpenEditModal(false);
      setEditItem(null);
      alert('Cập nhật thành công!');
      if (onRefetch) onRefetch(); // Gọi refetch từ cha nếu có
      // Update table data locally without full reload
      console.log('Cập nhật thành công!', data);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật chi tiết video!');
    }
  };

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
          cell: (info: any) => (
            <a
              href="#"
              style={{
                color: '#1976d2',
                fontWeight: 600,
                minWidth: 90,
                textDecoration: 'none',
                cursor: 'pointer',
                textTransform: 'none',
              }}
              onClick={e => {
                e.preventDefault();
                handleOpenEditModal(info.row.original);
              }}
            >
              {info.getValue()}
            </a>
          ),
        };
      }
      if (col.key === 'trang_thai') {
        return {
          accessorKey: 'trang_thai',
          header: 'TRẠNG THÁI',
          cell: (info: any) => (
            <Button
              variant="text"
              color={getStatusColor(info.getValue())}
              size="small"
              sx={{ minWidth: 90, fontWeight: 600, textTransform: 'none' }}
              onClick={() => handleOpenModal(info.row.original)}
            >
              {info.getValue()}
            </Button>
          ),
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


  // Mutation hook
  const [updateVideoStatus] = useMutation(UPDATE_VIDEO_STATUS);

  // Hàm cập nhật trạng thái video
  const handleChangeStatus = async () => {
    if (!selectedItem) return;
    try {
      await updateVideoStatus({
        variables: {
          id: selectedItem.id as number,
          trang_thai: selectedItem.trang_thai,
          ghi_chu: selectedItem.ghi_chu,
        },
        refetchQueries: [
          { query: ENUM_LIST }, // Thay bằng query lấy danh sách video nếu có, ví dụ: GET_VIDEOS
        ],
      });
      alert('Đã cập nhật');
      setOpenModal(false);
      setSelectedItem(null);
      // Nếu bạn có hàm reload data riêng, gọi ở đây
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật');
    }
  };

  // Định nghĩa các nhóm trạng thái
  // const groupStatus = {
  //   'Đơn hàng mới': [
  //     'Xem mẫu',
  //     'Xin mẫu',
  //     'Chờ Xác Nhận',
  //     'App/Shop Xác Nhận',
  //   ],
  //   'Vận chuyển': [
  //     'Chờ Lấy Hàng',
  //     'Đang Giao Hàng',
  //     'Đang Giao Hàng',
  //     'Đã Nhận Hàng',
  //   ],
  //   'Edit': [
  //     'Đang Quay',
  //     'Đã Quay',
  //     'Đang Edit',
  //     'Đã Xuất Clip',
  //   ],
  // };
  const groupStatus = {
    'Đơn hàng mới': [
      'Xem mẫu',
      'Xin mẫu',
      'Chờ Xác Nhận',
      'App/Shop Xác Nhận',
      'Chờ Lấy Hàng',
      'Đang Giao Hàng',
      'Đang Giao Hàng',
      'Đã Nhận Hàng',
      
    ],
    'Edit': [
      'Đang Quay',
      'Đã Quay',
      'Đang Edit',
      'Đã Xuất Clip',
    ]
    
  };
  const countByGroup = {
    'Đơn hàng mới': rows.filter(row => groupStatus['Đơn hàng mới'].includes(row.trang_thai)).length,
    'Edit': rows.filter(row => groupStatus['Edit'].includes(row.trang_thai)).length,
    'Chờ Demo': rows.filter(row =>
      !groupStatus['Đơn hàng mới'].includes(row.trang_thai) &&
      !groupStatus['Edit'].includes(row.trang_thai)
    ).length,
  };
  // Đếm số lượng đơn theo nhóm
  const countByChannel = {
    'Tiktok': rows.filter(row => row.nen_tang_xa_hoi === 'Tiktok').length,
    'AgentC': rows.filter(row => row.nen_tang_xa_hoi === 'AgentC').length,
    'uChoice': rows.filter(row => row.nen_tang_xa_hoi === 'uChoice').length,
  };

  
  return (
    <Card>
      <Box sx={{ p: 2, pb: 2, display: 'flex', alignItems: 'center' }}>
        <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1}>
            <ChannelComponent
              statusButtons={[
                { name: `Tiktok (${countByChannel['Tiktok'] ?? 0})`, color: 'info', action: () => {} },
                { name: `AgentC (${countByChannel['AgentC'] ?? 0})`, color: 'primary', action: () => {} },
                { name: `uChoice (${countByChannel['uChoice'] ?? 0})`, color: 'warning', action: () => {} },
              ]}
            />
          </Stack>
          <Divider />
          <Stack direction="row" spacing={1}>
            <VideosAction
              total={count}
              statusButtons={[
                { name: `Mới (${countByGroup['Đơn hàng mới'] ?? 0})`, color: 'info', action: () => {} },
                { name: `Editing (${countByGroup['Edit'] ?? 0})`, color: 'info', action: () => {} },
                { name: `Demo (${countByGroup['Chờ Demo'] ?? 0})`, color: 'success', action: () => {} },
              ]}
              onEyeClick={handleMenuOpen}
            />
          </Stack>
        </Stack>
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
        <Table sx={{ minWidth: '700px' }}>
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

      <EditStatusModal
        open={openModal}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        oldStatus={oldStatus}
        getEnumValues={getEnumValues}
        handleChangeStatus={handleChangeStatus}
        setSelectedItem={setSelectedItem}
      />

      <EditVideoModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        video={editItem}
        columns={COLUMN_CONFIG}
        enumValues={getEnumValues}
        onSave={handleSaveEditModal}
      />
    </Card>
  );
}
