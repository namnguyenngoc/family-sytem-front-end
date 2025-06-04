"use client";  // Ensure this component runs in the browser

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { config } from '@/config';
import { VideoFilters } from '@/components/dashboard/videos/videos-filters';

import { VideoTable }  from '@/components/dashboard/videos/video-table';
import type { VideoItem } from '@/components/dashboard/videos/video-table';

import { useQuery, gql } from '@apollo/client';

// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

// type VideoItem = {
//   id: number;
//   ten_brand: string;
//   ten_sanpham: string;
//   trang_thai: string;
//   nhom_trang_thai: string;
//   ghi_chu: string;
//   nen_tang_xa_hoi: string;
//   ngay_air: string;
//   ngay_chot_don: string;
//   ngay_demo: string;
//   ngay_giao_hang: string;
//   ngay_hen_giao_san_pham: string;
// };

const GET_TASK_LIST = gql`
  query GetTaskInfos {
    getTaskInfos {
      ghi_chu
      id
      nen_tang_xa_hoi
      ngay_air
      ngay_chot_don
      ngay_demo
      ngay_giao_hang
      ngay_hen_giao_san_pham
      nhom_trang_thai
      ten_brand
      ten_sanpham
      trang_thai
      remaining_time
      thong_tin_lien_he
    }
  }
`;

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const page = 0;
  const rowsPerPage = 1000;
  const { loading: loadingTaskList, error: errorTaskList, data: dataTaskList, refetch } = useQuery(GET_TASK_LIST);

  const videoItemList = dataTaskList?.getTaskInfos satisfies VideoItem[];

  const [filter, setFilter] = React.useState('');

  // Filter logic: match tên_san_phẩm, brand, or kênh (case-insensitive, partial)
  const filteredList = React.useMemo(() => {
    if (!filter) return videoItemList || [];
    const lower = filter.toLowerCase();
    return (videoItemList || []).filter((item: VideoItem) =>
      (item.ten_sanpham && item.ten_sanpham.toLowerCase().includes(lower)) ||
      (item.ten_brand && item.ten_brand.toLowerCase().includes(lower)) ||
      (item.nen_tang_xa_hoi && item.nen_tang_xa_hoi.toLowerCase().includes(lower))
    );
  }, [filter, videoItemList]);

  const paginatedCustomers = applyPagination(filteredList, page, rowsPerPage);

  // Move all hooks to the top, before any early returns
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (type: string) => {
    setAnchorEl(null);
    router.push(`/dashboard/task-detail?type=${type}`);
  };

  if (loadingTaskList) return <p>Loading summary...</p>;

  return (
    <Stack spacing={3} sx={{ px: 1, py: 3 }}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Video List</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button 
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
            variant="contained"
            onClick={handleMenuOpen}
          >
            Thêm mới
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleMenuClick('tiktok')}>Tiktok</MenuItem>
            <MenuItem onClick={() => handleMenuClick('agentc')}>AgentC</MenuItem>
            <MenuItem onClick={() => handleMenuClick('uchoice')}>uChoice</MenuItem>
          </Menu>
        </div>
      </Stack>
      
      <VideoFilters value={filter} onChange={setFilter} />
      
      <VideoTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onRefetch={refetch} // Truyền refetch xuống VideoTable
      />
    </Stack>
  );
}
function applyPagination(rows: VideoItem[], page: number, rowsPerPage: number): VideoItem[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


// function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
//   return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
// }
