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
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Tên sản phẩm</InputLabel>
                <OutlinedInput name="ten_brand" value={formData.ten_brand} onChange={handleChange} />
                <OutlinedInput defaultValue="" label="Tên sản phẩm" name="ten_sanpham" />
              </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Brand</InputLabel>
                <OutlinedInput name="ten_brand" value={formData.ten_brand} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nội dung</InputLabel>
                <OutlinedInput defaultValue="" label="Last name" name="NoiDung" />
              </FormControl>
            </Grid>
            <Grid md={5} xs={5}>
              <FormControl fullWidth required>
                <DateTimePicker
                    label="Ngày chốt đơn"
                    value={formData.ngay_chot_don}
                    onChange={(date) => { handleDateChange("ngay_chot_don", date); }}
                  />
              </FormControl>
            </Grid>
            <Grid md={5} xs={5}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày Demo"
                  value={formData.ngay_demo}
                  onChange={(date) => { handleDateChange("ngay_demo", date); }}
                />
              </FormControl>
            </Grid>
            <Grid md={2} xs={2}>
              <FormControl fullWidth required>
                <InputLabel>Tổng time (hour)</InputLabel>
                <OutlinedInput defaultValue="Rivers" label="Last name" name="lastName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue="New York" label="State" name="state" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput label="City" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            variant="contained"
            onClick={handleSave}
          >Save</Button>
        </CardActions>
      </Card>
    </form>
  );
}
