import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { VideoItem } from '../video-table';

interface EditStatusModalProps {
  open: boolean;
  onClose: () => void;
  selectedItem: VideoItem | null;
  oldStatus: string;
  getEnumValues: (key: string) => any[];
  handleChangeStatus: () => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<VideoItem | null>>;
}

export function EditStatusModal({
  open,
  onClose,
  selectedItem,
  oldStatus,
  getEnumValues,
  handleChangeStatus,
  setSelectedItem,
}: EditStatusModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa trạng thái video</DialogTitle>
      <DialogContent>
        {selectedItem && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <span style={{ fontWeight: 500 }}>Trạng thái hiện tại:&nbsp;</span>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                {selectedItem.trang_thai}
              </span>
            </Box>
            <Autocomplete
              freeSolo
              options={getEnumValues('VIDEO_STATUS_PROCESSING').map((option: any) => option.label)}
              value={selectedItem.trang_thai || ''}
              onChange={(_, newValue) => {
                setSelectedItem(prev =>
                  prev
                    ? {
                        ...prev,
                        trang_thai: newValue || '',
                        ghi_chu:
                          newValue && newValue !== oldStatus
                            ? `Chuyển từ: ${oldStatus} --> ${newValue}`
                            : prev.ghi_chu,
                      }
                    : prev
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Trạng thái"
                />
              )}
            />
            <TextField
              label="Ghi chú"
              value={selectedItem.ghi_chu}
              onChange={e =>
                setSelectedItem(prev => prev ? { ...prev, ghi_chu: e.target.value } : prev)
              }
              multiline
              rows={2}
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleChangeStatus}
          variant="contained"
          disabled={!selectedItem || oldStatus === selectedItem.trang_thai}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
