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

const statusMap = {
  pending: { label: 'Đang Dựng', color: 'warning' },
  delivered: { label: 'Đã Giao', color: 'success' },
  refunded: { label: 'Error', color: 'error' },
} as const;


export interface Product {
  id: string;
  image: string;
  name: string;
  updatedAt: Date;
}

export interface LatestProductsProps {
  products?: Product[];
  sx?: SxProps;
}


export function LatestProducts({ products = [], sx }: LatestProductsProps): React.JSX.Element {
  // const { label, color } = statusMap["Đang Dựng"] ?? { label: 'Đã Giao', color: 'success' };
  return (
    <Card sx={sx}>
      <CardHeader title="Đơn hàng mới" />
      <Divider />
      <List>
        {products.map((product, index) => (

          <ListItem divider={index < products.length - 1} key={product.id}>
            <ListItemAvatar>
              {
              product.image ? (
                <Box component="img" src={product.image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
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
              primary={product.name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Updated ${dayjs(product.updatedAt).format('MMM D, YYYY')}`}
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
