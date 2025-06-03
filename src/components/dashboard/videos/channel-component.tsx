import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface ChannelButton {
  name: string;
  color: 'info' | 'primary' | 'warning' | 'success' | 'secondary' | 'error';
  action: () => void;
}

interface ChannelComponentProps {
  statusButtons: ChannelButton[];
}

export function ChannelComponent({ statusButtons }: ChannelComponentProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
      {statusButtons.map((btn, idx) => (
        <Button
          key={btn.name + idx}
          variant="text"
          color={btn.color}
          onClick={btn.action}
          sx={{ fontWeight: 600, textTransform: 'none' }}
        >
          {btn.name}
        </Button>
      ))}
    </Stack>
  );
}
