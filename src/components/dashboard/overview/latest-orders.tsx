"use client";  // Ensure this component runs in the browser

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card'; // Ensure Card is imported
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { useQuery, gql } from '@apollo/client';

// Add this check to ensure the React version supports hooks

const statusMap = {
  pending: { label: 'Đang Dựng Clip', color: 'warning' },
  delivered: { label: 'Đang Chờ Duyệt', color: 'success' },
  refunded: { label: 'Đơn Lỗi', color: 'error' },
} as const;

export interface Order {
  id: string;
  customer?: { 
    name: string 
  };
  product?: { 
    name: string 
  };
  brank: {
    name: string,
  },
  amount: number;
  status: 'pending' | 'delivered' | 'refunded';
  createdAt: Date;
}

const GET_TASK_LIST_2 = gql`
  query GetTaskInfos($nhomTrangThai: GROUP_STATUS) {
    getTaskInfos(nhomTrangThai: $nhomTrangThai) {
      id
      ten_brand
      ten_sanpham
      nen_tang_xa_hoi
      trang_thai
      nhom_trang_thai
      ngay_chot_don
      ngay_hen_giao_san_pham
      ngay_giao_hang
      ngay_demo
      ngay_air
      ghi_chu
    }
  }
`;

interface TaskInfo {
  id: number;
  ten_brand: string;
  ten_sanpham: string;
  ngay_demo: string;
  trang_thai: string;
}


export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ orders = [], sx }: LatestOrdersProps): React.JSX.Element {
  const nhomTrangThai = "NHAN_DON"; // Replace with the actual value or state

  const { loading, error, data } = useQuery(GET_TASK_LIST_2, {
    variables: { nhomTrangThai },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card sx={sx}>
      <CardHeader title="Tiến độ công việc" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Sản Phẩm</TableCell>
              <TableCell sortDirection="desc">Ngày Demo</TableCell>
              <TableCell>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.getTaskInfos.map((item: any, index: number) => (
              <TableRow hover key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.ten_brand}</TableCell>
                <TableCell>{item.ten_sanpham}</TableCell>
                <TableCell>{dayjs(item.ngay_demo).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  <Chip color={"success"} label={item.trang_thai} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
