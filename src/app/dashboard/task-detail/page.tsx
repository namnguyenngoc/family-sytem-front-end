import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { TaskDetailForm } from '@/components/dashboard/task-detail/task-detail-form';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} sx={{ px: 1, py: 3 }}>
      <div>
        <Typography variant="h4">Thêm video mới</Typography>
      </div>
      <Grid container spacing={3} sx={{ m: 0, p: 0 }}>
        <Grid lg={12} md={12} xs={12}>
          <TaskDetailForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
