'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { gql, useMutation } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

const CREATE_TASK = gql`
    mutation CreateTaskInfo($createTaskInfoInput: CreateTaskInfoInput!) {
        createTaskInfo(createTaskInfoInput: $createTaskInfoInput) {
            id
            ngay_chot_don
            ngay_demo
            ngay_giao_hang
            ngay_xuat_video
            status
            ten_brand
            trangthai_delivery
            trangthai_editing
            trangthai_pickup
        }
    }
`;

export function TaskDetailForm(): React.JSX.Element {
  
  const [formData, setFormData] = useState({
    ten_brand: "",
    ten_sanpham: "",
    ghi_chu: "",
    nen_tang_xa_hoi: "",
    trang_thai: "",
    ngay_chot_don: null,
    ngay_demo: null,
    ngay_giao_hang: null,
    ngay_xuat_video: null,
    status: "ACTIVE",
    trangthai_delivery: "PENDING",
    trangthai_editing: "NOT_STARTED",
    trangthai_pickup: "PENDING"
  });

  const [createTask, { loading, error }] = useMutation(CREATE_TASK);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDateChange = (name: any, date: any) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSave = async () => {
    try {
      await createTask({
        variables: {
          createTaskInfoInput: {
            ...formData
          }
        }
      });
      alert("Task created successfully!");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="Thông tin về sản phẩm" title="Thông tin" />
        <Divider />
        <CardContent sx={{ pt: 3, pr: 2, pl: 2 }}>
          <Grid container spacing={2}>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Tên sản phẩm</InputLabel>
                <OutlinedInput  defaultValue="" name="ten_sanpham" value={formData.ten_sanpham}/>
              </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
             <FormControl fullWidth required>
              <InputLabel shrink>Brand</InputLabel>
              <Autocomplete
                freeSolo
                options={states.map((option) => option.label)}
                value={formData.ten_brand}
                onChange={(_, newValue) => setFormData({ ...formData, ten_brand: newValue || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="ten_brand"
                    label="Brand"
                    value={formData.ten_brand}
                    onChange={handleChange}
                  />
                )}
              />
            </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Ghi chú</InputLabel>
                <OutlinedInput defaultValue="" label="Last name" name="NoiDung" />
              </FormControl>
            </Grid>
            <Grid md={5} xs={12}>
              <FormControl fullWidth required>
                <DateTimePicker
                    label="Ngày chốt đơn"
                    value={formData.ngay_chot_don}
                    onChange={(date) => { handleDateChange("ngay_chot_don", date); }}
                  />
              </FormControl>
            </Grid>
            <Grid md={5} xs={8}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày demo"
                  value={formData.ngay_demo}
                  onChange={(date) => { handleDateChange("ngay_demo", date); }}
                />
              </FormControl>
            </Grid>
            <Grid md={2} xs={4}>
              <FormControl fullWidth required>
                <InputLabel>Tổng</InputLabel>
                <OutlinedInput defaultValue="0" label="" name="" />
              </FormControl>
            </Grid>
            <Grid md={5} xs={6}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày xuất video"
                  value={formData.ngay_xuat_video}
                  onChange={(date) => { handleDateChange("ngay_xuat_video", date); }}
                />
              </FormControl>
            </Grid>       
            <Grid md={5} xs={6}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày giao hàng"
                  value={formData.ngay_giao_hang}
                  onChange={(date) => { handleDateChange("ngay_giao_hang", date); }}
                />
              </FormControl>
            </Grid>            
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select defaultValue="New York" label="Trạng thái" name="status" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
           
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            variant="contained"
            color='error'
            onClick={handleSave}
          >
            Hủy
          </Button>
          <Button 
            variant="contained"
            onClick={handleSave}
          >
            Lưu
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
