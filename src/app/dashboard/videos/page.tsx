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
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { VideoTable }  from '@/components/dashboard/videos/video-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import type { VideoItem } from '@/components/dashboard/videos/video-table';

import { useQuery, gql } from '@apollo/client';

// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'USR-010',
    name: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    email: 'alcides.antonio@devias.io',
    phone: '908-691-3242',
    address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-009',
    name: 'Marcus Finn',
    avatar: '/assets/avatar-9.png',
    email: 'marcus.finn@devias.io',
    phone: '415-907-2647',
    address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-008',
    name: 'Jie Yan',
    avatar: '/assets/avatar-8.png',
    email: 'jie.yan.song@devias.io',
    phone: '770-635-2682',
    address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-007',
    name: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    email: 'nasimiyu.danai@devias.io',
    phone: '801-301-7894',
    address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-006',
    name: 'Iulia Albu',
    avatar: '/assets/avatar-6.png',
    email: 'iulia.albu@devias.io',
    phone: '313-812-8947',
    address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-005',
    name: 'Fran Perez',
    avatar: '/assets/avatar-5.png',
    email: 'fran.perez@devias.io',
    phone: '712-351-5711',
    address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },

  {
    id: 'USR-004',
    name: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    email: 'penjani.inyene@devias.io',
    phone: '858-602-3409',
    address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-003',
    name: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    email: 'carson.darrin@devias.io',
    phone: '304-428-3097',
    address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-002',
    name: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    email: 'siegbert.gottfried@devias.io',
    phone: '702-661-1654',
    address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-001',
    name: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    email: 'miron.vitold@devias.io',
    phone: '972-333-4106',
    address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Customer[];

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
      <CustomersFilters />
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
