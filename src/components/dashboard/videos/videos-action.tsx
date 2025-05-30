import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export function VideosAction(): React.JSX.Element {
  return (
    <Card sx={{ p: 2, overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Left: Status buttons */}
        <Stack direction="row" spacing={1} mr={2}>
          <Button variant="outlined" color="primary">Mới</Button>
          <Button variant="outlined" color="warning">Đã nhận hàng</Button>
          <Button variant="outlined" color="success">Đã edit</Button>
        </Stack>
      </Box>
    </Card>
  );
}