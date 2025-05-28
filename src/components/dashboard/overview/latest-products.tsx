// "use client";  // Ensure this component runs in the browser

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import { CheckCircle as CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { XCircle as XCircle } from '@phosphor-icons/react/dist/ssr/XCircle';
import dayjs from 'dayjs';
import { UserCheck as UserCheck } from '@phosphor-icons/react/dist/ssr/UserCheck';
import { ChatCentered as ChatCentered } from '@phosphor-icons/react/dist/ssr/ChatCentered';

// import { useQuery, gql } from '@apollo/client';

// const GET_TASK_LIST = gql`
//   query GetTaskInfos {
//     getTaskInfos {
//       ghi_chu
//       id
//       nen_tang_xa_hoi
//       ngay_air
//       ngay_chot_don
//       ngay_demo
//       ngay_giao_hang
//       ngay_hen_giao_san_pham
//       nhom_trang_thai
//       ten_brand
//       ten_sanpham
//       trang_thai
//     }
//   }
// `;

const statusMap = {
  pending: { label: 'Đang Dựng', color: 'warning' },
  delivered: { label: 'Đã Giao', color: 'success' },
  refunded: { label: 'Error', color: 'error' },
} as const;


export interface TaskInfo {
  id: string,
  ten_brand: string,
  ten_sanpham: string,
  nen_tang_xa_hoi: string,
  trang_thai: string,
  nhom_trang_thai: string,
  ngay_chot_don: Date,
  ngay_hen_giao_san_pham: Date,
  ngay_giao_hang: Date,
  ngay_demo: Date,
  ngay_air: Date,
  ghi_chu: string,
  image?: string,
}

export interface LatestProductsProps {
  data?: TaskInfo[];
  sx?: SxProps;
}


export function LatestProducts({ data = [], sx }: LatestProductsProps): React.JSX.Element {
  // const { label, color } = statusMap["Đang Dựng"] ?? { label: 'Đã Giao', color: 'success' };
  // const { loading, error, data } = useQuery(GET_TASK_LIST);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <Card sx={sx}>
      <CardHeader title="Đơn hàng mới" />
      <Divider />
      <List>
        {data.map((item, index) => (

          <ListItem divider={index < data.length - 1} key={item.id}>
            <ListItemAvatar>
              {
              item.image ? (
                <Box component="img" src={item.image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={item.ten_brand}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Updated ${dayjs(item.ngay_chot_don).format('MMM D, YYYY')}`}
              secondaryTypographyProps={{ variant: 'body2' }}
            />
              <IconButton size="large">
                {index % 2 === 0 ? (
                  <UserCheck weight="bold"  color="mangeta"/>
                ) : <ChatCentered weight="bold"  color="green"/>
                }
                
              </IconButton>
            <Divider orientation="vertical" flexItem />

            {/* <Chip color={"success"} label={"BÁNH"} size="small" /> */}
            <IconButton edge="end">
              <CheckCircle weight="bold"  color="green"/>
            </IconButton>
            <IconButton edge="end">
              <XCircle weight="bold" color="red"/>
            </IconButton>
          </ListItem>
        ))}
      </List>
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
