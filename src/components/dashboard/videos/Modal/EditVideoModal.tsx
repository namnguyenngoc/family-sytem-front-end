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

  const handleSave = async () => {
    await onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin video</DialogTitle>
      <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {columns.map(col => {
            switch (col.key) {
              case 'trang_thai':
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
              case 'nen_tang_xa_hoi':
                return (
                  <Autocomplete
                    key={col.key}
                    options={enumValues('NEN_TANG_XA_HOI').map((option: any) => option.label)}
                    value={form.nen_tang_xa_hoi || ''}
                    onChange={(_, newValue) => handleChange('nen_tang_xa_hoi', newValue || '')}
                    renderInput={params => (
                      <TextField {...params} label={col.label} />
                    )}
                  />
                );
              case 'nhom_trang_thai':
                return (
                  <Autocomplete
                    key={col.key}
                    options={enumValues('NHOM_TRANG_THAI').map((option: any) => option.label)}
                    value={form.nhom_trang_thai || ''}
                    onChange={(_, newValue) => handleChange('nhom_trang_thai', newValue || '')}
                    renderInput={params => (
                      <TextField {...params} label={col.label} />
                    )}
                  />
                );
              case 'ngay_chot_don':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    type="date"
                    value={form.ngay_chot_don ? form.ngay_chot_don.slice(0, 10) : ''}
                    onChange={e => handleChange('ngay_chot_don', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                );
              case 'ngay_hen_giao_san_pham':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    type="date"
                    value={form.ngay_hen_giao_san_pham ? form.ngay_hen_giao_san_pham.slice(0, 10) : ''}
                    onChange={e => handleChange('ngay_hen_giao_san_pham', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                );
              case 'ngay_giao_hang':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    type="date"
                    value={form.ngay_giao_hang ? form.ngay_giao_hang.slice(0, 10) : ''}
                    onChange={e => handleChange('ngay_giao_hang', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                );
              case 'ngay_demo':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    type="date"
                    value={form.ngay_demo ? form.ngay_demo.slice(0, 10) : ''}
                    onChange={e => handleChange('ngay_demo', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                );
              
              case 'ghi_chu':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    value={form.ghi_chu || ''}
                    onChange={e => handleChange('ghi_chu', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                );
              case 'ten_sanpham':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    value={form.ten_sanpham || ''}
                    onChange={e => handleChange('ten_sanpham', e.target.value)}
                    fullWidth
                  />
                );
              case 'ten_brand':
                return (
                  <TextField
                    key={col.key}
                    label={col.label}
                    value={form.ten_brand || ''}
                    onChange={e => handleChange('ten_brand', e.target.value)}
                    fullWidth
                  />
                );
              
              case 'id':
                return null; // id is not editable
              default:
                return null;
            }
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
