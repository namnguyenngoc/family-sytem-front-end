import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { EyeSlash as EyeSlash } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import Divider from '@mui/material/Divider';

interface StatusButton {
  name: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  action: () => void;
}

interface VideosActionProps {
  statusButtons: StatusButton[];
  total?: number;
  onEyeClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onStatusClick?: (status: string) => void; // Thêm prop callback cho filter
}

export function VideosAction({ statusButtons, total, onEyeClick, onStatusClick }: VideosActionProps): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {/* Total */}
      {/* <Typography variant="subtitle1" sx={{ mr: 2 }}>
        Total{typeof total === 'number' ? ` (${total})` : ''}
      </Typography> */}
      {/* Status buttons */}
      <Stack direction="row" spacing={1} mr={2}>
        {statusButtons.map((btn) => (
          <Button
            key={btn.name}
            variant="text"
            color={btn.color}
            onClick={() => {
              btn.action();
              if (onStatusClick) onStatusClick(btn.name);
            }}
          >
            {btn.name}
          </Button>
        ))}
      </Stack>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      {/* Eye IconButton */}
      {onEyeClick && (
        <IconButton onClick={onEyeClick} sx={{ ml: 'auto' }}>
          <EyeSlash />
        </IconButton>
      )}
    </Box>
  );
}