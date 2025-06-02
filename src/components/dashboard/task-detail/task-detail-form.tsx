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
import { gql, useMutation,useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';

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
        }
    }
`;

const ENUM_LIST = gql`
  query EnumList {
    enumList {
      key
      values {
        label
        value
      }
    }
  }
`;

const BRAND_LIST = gql`
  query Brands {
    brands {
      id
      ten_brand
      nen_tang_xa_hoi
      dia_chi
      so_dien_thoai
      thong_tin_lien_he
      ghi_chu
    }
  }
`;

export function TaskDetailForm(): React.JSX.Element {
  // Fetch enum list from GraphQL
  const { data: enumData, loading: enumLoading } = useQuery(ENUM_LIST);
  const { data: _BRAND_LIST, loading: brandLoading } = useQuery(BRAND_LIST);
  const router = useRouter();

  // Helper to get enum values by key
  const getEnumValues = (key: string) =>
    enumData?.enumList?.find((item: any) => item.key === key)?.values || [];

  // Helper to get enum values by key
  const brandOptions = _BRAND_LIST?.brands?.map((item: any) => ({
    key: item.ten_brand,
    value: item.ten_brand,
    info: item,
  }));
  const [estimateTime, setEstimateTime] = React.useState('');

  console.log("brandOptions", brandOptions);

  const [formData, setFormData] = useState({
    ten_brand: "",
    ten_sanpham: "",
    ghi_chu: "",
    nen_tang_xa_hoi: "Tiktok",
    ngay_chot_don: null,
    ngay_demo: null,
    ngay_giao_hang: null,
    ngay_xuat_video: null,
    status: "Xem mẫu",
    trang_thai: "Xem mẫu",
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

  /**
   * Tính toán thời gian ước tính dựa trên ngày demo 
   * @param name 
   * @param date 
   */
  const _handleDateChange = (name: string, date: any) => {
    setFormData({ ...formData, [name]: date });

    // Calculate estimate time when demo date is set
    if (name === 'ngay_demo' && date && formData.ngay_chot_don) {
      const chotDon = dayjs(formData.ngay_chot_don);
      const demo = dayjs(date);
      const diff = demo.diff(chotDon, 'minute');
      if (diff > 0) {
        const days = Math.floor(diff / 1440);
        const hours = Math.floor((diff % 1440) / 60);
        const minutes = diff % 60;
        let result = '';
        if (days > 0) result += `${days} ngày `;
        if (hours > 0) result += `${hours} giờ `;
        if (minutes > 0) result += `${minutes} phút`;
        setEstimateTime(result.trim());
      } else {
        setEstimateTime('Đã qua');
      }
    } else if (name === 'ngay_demo' && date) {
      setEstimateTime('Chưa có ngày chốt đơn');
    }
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
      alert("Đã tạo, hệ thống sẽ tự động chuyển sang trang quản lý video");
      router.push('/dashboard/videos');
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };
  // Sync default values from API when data loaded
  React.useEffect(() => {
    if (!brandLoading && brandOptions.length > 0 && !formData.ten_brand) {
      setFormData((prev) => ({
        ...prev,
        ten_brand: brandOptions[0].value
      }));
    }
    if (!enumLoading && getEnumValues('NEN_TANG_XA_HOI').length > 0 && !formData.nen_tang_xa_hoi) {
      setFormData((prev) => ({
        ...prev,
        nen_tang_xa_hoi: getEnumValues('NEN_TANG_XA_HOI')[0].label
      }));
    }
    if (!enumLoading && getEnumValues('VIDEO_STATUS_PROCESSING').length > 0 && !formData.status) {
      setFormData((prev) => ({
        ...prev,
        status: getEnumValues('VIDEO_STATUS_PROCESSING')[0].label
      }));
    }
  }, [brandLoading, enumLoading, brandOptions, enumData]);

  // Update estimateTime when ngay_demo or ngay_chot_don changes
  React.useEffect(() => {
    if (formData.ngay_demo && formData.ngay_chot_don) {
      const chotDon = dayjs(formData.ngay_chot_don);
      const demo = dayjs(formData.ngay_demo);
      const diff = demo.diff(chotDon, 'minute');
      if (diff > 0) {
        const days = Math.floor(diff / 1440);
        const hours = Math.floor((diff % 1440) / 60);
        const minutes = diff % 60;
        let result = '';
        if (days > 0) result += `${days} ngày `;
        if (hours > 0) result += `${hours} giờ `;
        if (minutes > 0) result += `${minutes} phút`;
        setEstimateTime(result.trim());
      } else {
        setEstimateTime('Đã qua');
      }
    } else if (formData.ngay_demo) {
      setEstimateTime('Chưa có ngày chốt đơn');
    } else {
      setEstimateTime('');
    }
  }, [formData.ngay_demo, formData.ngay_chot_don]);

  // ...rest of your code remains unchanged, but use brandOptions for Autocomplete...

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
              <OutlinedInput 
                name="ten_sanpham"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid md={12} xs={12}>
            <FormControl fullWidth required>
              <InputLabel shrink>Brand</InputLabel>
              <Autocomplete
                freeSolo
                options={brandOptions}
                getOptionLabel={(option) => option.label || option.value} // cách hiển thị trong dropdown
                value={
                  brandOptions?.find((opt: any) => opt.value === formData.ten_brand) || null
                  }
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, ten_brand: newValue?.value || '' })
                  }
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
            <Grid md={9} xs={5}>
             <FormControl fullWidth required>
              <InputLabel shrink>Kênh</InputLabel>
              <Autocomplete
                freeSolo
                options={getEnumValues('NEN_TANG_XA_HOI').map((option: any) => option.label)}
                value={formData.nen_tang_xa_hoi}
                onChange={(_, newValue) => setFormData({ ...formData, nen_tang_xa_hoi: newValue || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="nen_tang_xa_hoi"
                    label="Kênh"
                    value={formData.nen_tang_xa_hoi}
                    onChange={handleChange}
                  />
                )}
              />
            </FormControl>
            </Grid>
            <Grid md={3} xs={7}>
              <FormControl fullWidth>
                <InputLabel shrink>Trạng thái</InputLabel>
                <Autocomplete
                  freeSolo
                  options={getEnumValues('VIDEO_STATUS_PROCESSING').map((option: any) => option.label)}
                  value={formData.trang_thai}
                  onChange={(_, newValue) => setFormData({ ...formData, trang_thai: newValue || '' })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="status"
                      value={formData.trang_thai}
                      onChange={handleChange}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <DateTimePicker
                    label="Ngày chốt đơn"
                    value={formData.ngay_chot_don}
                    onChange={(date) => { _handleDateChange("ngay_chot_don", date); }}
                  />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày demo"
                  value={formData.ngay_demo}
                  onChange={(date) => { _handleDateChange("ngay_demo", date); }}
                />
                
              </FormControl>
              <Button
                variant="outlined"
                color={estimateTime === "Đã qua" ? "error" : "primary"}
                fullWidth
              >
                Thời gian ước tính{estimateTime ? `: ${estimateTime}` : ""}
              </Button>
              
            </Grid>
            
            <Grid md={6} xs={6}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày giao hàng"
                  value={formData.ngay_giao_hang}
                  onChange={(date) => { handleDateChange("ngay_giao_hang", date); }}
                />
              </FormControl>
            </Grid>   
            <Grid md={6} xs={6}>
              <FormControl fullWidth required>
                <DateTimePicker
                  label="Ngày xuất video"
                  value={formData.ngay_xuat_video}
                  onChange={(date) => { handleDateChange("ngay_xuat_video", date); }}
                />
              </FormControl>
            </Grid> 

            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Ghi chú</InputLabel>
                <OutlinedInput 
                  defaultValue="" 
                  label="Last name"
                  onChange={handleChange}
                  name="ghi_chu" />
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
