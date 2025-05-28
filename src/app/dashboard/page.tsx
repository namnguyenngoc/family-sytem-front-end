"use client";  // Ensure this component runs in the browser

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { useQuery, gql } from '@apollo/client';

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

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

const GET_SUMMARY_TASK_INFO = gql`
  query SummaryTaskInfo {
    summaryTaskInfo {
      nhomTrangThai
      count
      taskList {
        ten_brand
        ten_sanpham
        trang_thai
        nhom_trang_thai
        nen_tang_xa_hoi
      }
    }
  }
`;

export default function Page(): React.JSX.Element {
  const { loading: loadingTaskList, error: errorTaskList, data: dataTaskList } = useQuery(GET_TASK_LIST);
  const { loading: loadingSummary, error: errorSummary, data: dataSummary } = useQuery(GET_SUMMARY_TASK_INFO);

  if (loadingSummary) return <p>Loading summary...</p>;
  if (errorSummary) return <p>Error loading summary: {errorSummary.message}</p>;

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" 
          _summaryTaskInfo = {dataSummary.summaryTaskInfo}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers 
          diff={16} 
          trend="down" 
          sx={{ height: '100%' }} 
          value="1.6k" 
          summamryTaskInfo= {dataSummary.summaryTaskInfo.filter((item: { nhomTrangThai: string }) => item.nhomTrangThai === 'DUNG_CLIP')[0]}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          data={ [...(dataTaskList?.getTaskInfos || [])] }
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              brank: {
                name: 'Cicook',
              },
              product: { name: 'Combo 2 lon sốt lẩu chua cay' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              brank: {
                name: 'Mood choco',
              },
              product: { name: 'socola đen' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              brank: {
                name: 'Cer',
              },
              product: { name: 'Kẹo dẻo Kera (combo 2 hộp)' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              brank: {
                name: 'Happy vitamin',
              },
              product: { name: 'Kẹo dẻo biotin (mua 2 tặng 1)' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              brank: {
                name: 'Mavin',
              },
              product: { name: 'Lạp xưởng tươi vị hongkong' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              brank: {
                name: 'One more bite (King Road)',
              },
              product: { name: 'Lạp xưởng tươi loại đặc biệt' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
          </Grid>
  );
}
