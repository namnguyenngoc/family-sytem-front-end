import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export interface EditVideoModalProps {
  open: boolean;
  onClose: () => void;
  video: any;
  columns: Array<{ key: string; label: string }>;
  enumValues: (key: string) => Array<{ label: string; value: string }>;
  onSave: (data: any) => void;
}

export function EditVideoModal({ open, onClose, video, columns, enumValues, onSave }: EditVideoModalProps) {
  const [form, setForm] = React.useState<any>(video || {});

  React.useEffect(() => {
    setForm(video || {});
  }, [video]);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin video</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {columns.map(col => {
            if (col.key === 'trang_thai') {
              return (
                <Autocomplete
                  key={col.key}
                  options={enumValues('VIDEO_STATUS_PROCESSING').map((option: any) => option.label)}
                  value={form.trang_thai || ''}
                  onChange={(_, newValue) => handleChange('trang_thai', newValue || '')}
                  renderInput={params => (
                    <TextField {...params} label={col.label} />
                  )}
                />
              );
            }
            return (
              <TextField
                key={col.key}
                label={col.label}
                value={form[col.key] || ''}
                onChange={e => handleChange(col.key, e.target.value)}
                fullWidth
                multiline={col.key === 'ghi_chu'}
                rows={col.key === 'ghi_chu' ? 2 : 1}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
