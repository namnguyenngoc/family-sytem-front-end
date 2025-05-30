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

import { config } from '@/config';
import { VideoFilters } from '@/components/dashboard/videos/videos-filters';

import { VideoTable }  from '@/components/dashboard/videos/video-table';
import type { VideoItem } from '@/components/dashboard/videos/video-table';
import { VideosAction } from '@/components/dashboard/videos/videos-action';

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
    }
  }
`;

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const { loading: loadingTaskList, error: errorTaskList, data: dataTaskList } = useQuery(GET_TASK_LIST);
  
  const videoItemList = dataTaskList?.getTaskInfos satisfies VideoItem[];

  if (loadingTaskList) return <p>Loading summary...</p>;
  
  const paginatedCustomers = applyPagination(videoItemList, page, rowsPerPage);

  return (
    <Stack spacing={3}>
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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      
      <VideoFilters />
      <VideosAction />
      
      <VideoTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
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
