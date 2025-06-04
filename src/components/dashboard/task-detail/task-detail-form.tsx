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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { gql, useMutation,useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

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
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

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

  type FormDataType = {
    ten_brand: string;
    ten_sanpham: string;
    ghi_chu: string;
    nen_tang_xa_hoi: string;
    ngay_chot_don: any;
    ngay_demo: any;
    ngay_giao_hang: any;
    ngay_xuat_video: any;
    status: string;
    trang_thai: string;
    trangthai_delivery: string;
    trangthai_editing: string;
    trangthai_pickup: string;
    thong_tin_lien_he: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
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
    trangthai_pickup: "PENDING",
    thong_tin_lien_he: "",
  });

  const [highlightFields, setHighlightFields] = React.useState<{[key:string]: boolean}>({
    ngay_chot_don: true,
    ngay_demo: true,
    ngay_xuat_video: true,
    thong_tin_lien_he: false,
  });

  const [errors, setErrors] = useState<{[key:string]: string}>({});

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
  const calculateEstimateTime = (data: typeof formData) => {
    let chotDon = data.ngay_chot_don;
    let soSanh: any = null;
    if (data.nen_tang_xa_hoi === 'AgentC') {
      // Nếu là AgentC, so sánh ngày chốt đơn và ngày demo
      soSanh = data.ngay_demo;
    } else {
      // Ngược lại, so sánh ngày chốt đơn và ngày upload video
      soSanh = data.ngay_xuat_video;
    }
    if (chotDon && soSanh) {
      const d1 = dayjs(chotDon);
      const d2 = dayjs(soSanh);
      const diff = d2.diff(d1, 'minute');
      if (diff > 0) {
        const days = Math.floor(diff / 1440);
        const hours = Math.floor((diff % 1440) / 60);
        const minutes = diff % 60;
        let result = '';
        if (days > 0) result += `${days} ngày `;
        if (hours > 0) result += `${hours} giờ `;
        if (minutes > 0) result += `${minutes} phút`;
        return result.trim();
      } else {
        if (diff == 0) {
          return 'Trong ngày';
        }
        return 'Đã qua';
      }
    } else if ((data.nen_tang_xa_hoi === 'AgentC' && data.ngay_demo) ||
               (data.nen_tang_xa_hoi !== 'AgentC' && data.ngay_xuat_video)) {
      return 'Chưa có ngày chốt đơn';
    } else {
      return '';
    }
  };

  // Sửa _handleDateChange để luôn tính lại estimateTime
  const _handleDateChange = (name: string, date: any) => {
    const newForm = { ...formData, [name]: date };
    setFormData(newForm);
    setEstimateTime(calculateEstimateTime(newForm));
  };

  const validate = () => {
    const newErrors: {[key:string]: string} = {};
    if (!formData.ten_brand) newErrors.ten_brand = 'Vui lòng chọn Brand';
    if (!formData.ten_sanpham) newErrors.ten_sanpham = 'Vui lòng nhập tên sản phẩm';
    if (!formData.nen_tang_xa_hoi) newErrors.nen_tang_xa_hoi = 'Vui lòng chọn kênh';
    if (!formData.trang_thai) newErrors.trang_thai = 'Vui lòng chọn trạng thái';
    if (!formData.ngay_chot_don) newErrors.ngay_chot_don = 'Vui lòng chọn ngày chốt đơn';
    if (highlightFields.ngay_demo && !formData.ngay_demo && formData.nen_tang_xa_hoi === 'AgentC') newErrors.ngay_demo = 'Vui lòng chọn ngày demo';
    if (highlightFields.ngay_xuat_video && !formData.ngay_xuat_video && formData.nen_tang_xa_hoi !== 'AgentC') newErrors.ngay_xuat_video = 'Vui lòng chọn ngày upload';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      await createTask({
        variables: {
          createTaskInfoInput: {
            ...formData
          }
        }
      });
      enqueueSnackbar('Đã tạo, hệ thống sẽ tự động chuyển sang trang quản lý video', { variant: 'success' });
      router.push('/dashboard/videos');
    } catch (err: any) {
      // Show toast error message
      let message = 'Đã xảy ra lỗi khi tạo task';
      if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
        message = err.graphQLErrors.map((e: any) => e.message).join(', ');
      } else if (err?.message) {
        message = err.message;
      }
      enqueueSnackbar(message, { variant: 'error' });
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

  // Tự động tính lại estimateTime khi load trang và khi các trường liên quan thay đổi
  React.useEffect(() => {
    setEstimateTime(calculateEstimateTime(formData));
  }, [formData.ngay_chot_don, formData.ngay_demo, formData.ngay_xuat_video, formData.nen_tang_xa_hoi]);

  // Đảm bảo highlight đúng khi load page hoặc khi thay đổi kênh
  React.useEffect(() => {
    if (formData.nen_tang_xa_hoi === 'AgentC') {
      setHighlightFields({ ngay_chot_don: true, ngay_demo: true, ngay_xuat_video: false, thong_tin_lien_he: true });
    } else {
      setHighlightFields({ ngay_chot_don: true, ngay_demo: false, ngay_xuat_video: true, thong_tin_lien_he: false });
    }
    // No return statement here!
  }, [formData.nen_tang_xa_hoi]);

  // List of required field names for validation
  const requiredFields = [
    'ten_brand',
    'ten_sanpham',
    'nen_tang_xa_hoi',
    'trang_thai',
    'ngay_chot_don',
    'ngay_giao_hang'
  ];

  // Validate a single field on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    if (requiredFields.includes(name)) {
      setErrors(prev => ({
        ...prev,
        [name]: formData[name as keyof FormDataType] ? '' :
          (name === 'ten_brand' ? 'Vui lòng chọn Brand' :
          name === 'ten_sanpham' ? 'Vui lòng nhập tên sản phẩm' :
          name === 'nen_tang_xa_hoi' ? 'Vui lòng chọn kênh' :
          name === 'trang_thai' ? 'Vui lòng chọn trạng thái' :
          name === 'ngay_chot_don' ? 'Vui lòng chọn ngày chốt đơn' :
          name === 'ngay_giao_hang' ? 'Vui lòng chọn ngày giao hàng' :
          '')
      }));
    }
  };

  const brandInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const ntxh = getEnumValues('NEN_TANG_XA_HOI');
    const type = searchParams?.get('type');
    if (ntxh && ntxh.length > 0 && type) {
      const foundNtxh = ntxh.find(
        (b: any) => b.value?.toLowerCase() === type.toLowerCase()
      );
      if (foundNtxh && formData.nen_tang_xa_hoi !== foundNtxh.label) {
        setFormData((prev) => ({
          ...prev,
          nen_tang_xa_hoi: foundNtxh.label,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandLoading, brandOptions, searchParams]);
  // Focus Brand input after nen_tang_xa_hoi is set or on page load
  React.useEffect(() => {
    if (brandInputRef.current) {
      setTimeout(() => {
        brandInputRef.current?.focus();
      }, 100);
    }
  }, [formData.nen_tang_xa_hoi, searchParams]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader 
          subheader={`Thời gian ước tính: ${estimateTime ?  estimateTime : "" }` }
          color={estimateTime === "Đã qua" ? "error" : "primary"}
          title="Thông tin" />

        <Divider />
        <CardContent sx={{ pt: 3, pr: 2, pl: 2 }}>
          <Grid container spacing={2}>
            <Grid md={9} xs={5}>
                <FormControl fullWidth required>
                  <InputLabel shrink>Kênh</InputLabel>
                  <Autocomplete
                    freeSolo
                    options={getEnumValues('NEN_TANG_XA_HOI').map((option: any) => option.label)}
                    value={formData.nen_tang_xa_hoi}
                    onChange={(_, newValue) => {
                      const newForm = { ...formData, nen_tang_xa_hoi: newValue || '' };
                      setFormData(newForm);
                      setEstimateTime(calculateEstimateTime(newForm));
                      if (newValue === 'AgentC') {
                        setHighlightFields({ ngay_chot_don: true, ngay_demo: true, ngay_xuat_video: false, thong_tin_lien_he: true });
                      } else {
                        setHighlightFields({ ngay_chot_don: true, ngay_demo: false, ngay_xuat_video: true, thong_tin_lien_he: false });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="nen_tang_xa_hoi"
                        label="Kênh"
                        value={formData.nen_tang_xa_hoi}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ backgroundColor: '#fffbe6' }}
                        error={!!errors.nen_tang_xa_hoi}
                        helperText={errors.nen_tang_xa_hoi}
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
                      onBlur={handleBlur}
                      sx={{ backgroundColor: '#fffbe6' }}
                      error={!!errors.trang_thai}
                      helperText={errors.trang_thai}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Brand</InputLabel>
                <Autocomplete
                  freeSolo
                  options={brandOptions}
                  getOptionLabel={(option) => option.label || option.value}
                  value={
                    brandOptions?.find((opt: any) => opt.value === formData.ten_brand) || null
                  }
                  onChange={(_, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      ten_brand: newValue?.value || '',
                      thong_tin_lien_he: newValue?.info?.thong_tin_lien_he || ''
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="ten_brand"
                      label="Brand"
                      value={formData.ten_brand}
                      onChange={e => {
                        setFormData(prev => ({
                          ...prev,
                          ten_brand: e.target.value,
                          thong_tin_lien_he: '' // reset thong_tin_lien_he nếu user tự sửa
                        }));
                      }}
                      onBlur={handleBlur}
                      sx={{ backgroundColor: '#fffbe6' }}
                      error={!!errors.ten_brand}
                      helperText={errors.ten_brand}
                      inputRef={brandInputRef}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Thông tin liên hệ (shop)</InputLabel>
                <OutlinedInput 
                  name="thong_tin_lien_he"
                  value={formData.thong_tin_lien_he} // <-- Thêm dòng này
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={highlightFields.thong_tin_lien_he ? { backgroundColor: '#fffbe6' } : {}}
                />
              </FormControl>
            </Grid>
            <Grid md={12} xs={12}>
            
              <FormControl fullWidth required>
                <InputLabel shrink>Tên sản phẩm</InputLabel>
                <OutlinedInput 
                  name="ten_sanpham"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ backgroundColor: '#fffbe6' }}
                  error={!!errors.ten_sanpham}
                />
                {errors.ten_sanpham && <span style={{color:'red',fontSize:12}}>{errors.ten_sanpham}</span>}
              </FormControl>
            </Grid>
            
              
              
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <DatePicker
                      label="Ngày chốt đơn"
                      value={formData.ngay_chot_don}
                      onChange={(date) => { _handleDateChange("ngay_chot_don", date); }}
                      slotProps={{ textField: { error: !!errors.ngay_chot_don, helperText: errors.ngay_chot_don, required: true, 
                                  InputProps: { sx: highlightFields.ngay_chot_don ? { backgroundColor: '#fffbe6' } : {} }, name: 'ngay_chot_don', onBlur: handleBlur } }}
                    />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <DatePicker
                    label="Ngày demo"
                    value={formData.ngay_demo}
                    onChange={(date) => { _handleDateChange("ngay_demo", date); }}
                    slotProps={{ textField: { error: !!errors.ngay_demo, helperText: errors.ngay_demo, required: true, 
                                  InputProps: { sx: highlightFields.ngay_demo ? { backgroundColor: '#fffbe6' } : {} }, name: 'ngay_demo', onBlur: handleBlur } }}
                    
                  />
                </FormControl>
                
              </Grid>
              <Grid md={6} xs={6}>
                <FormControl fullWidth required>
                  <DatePicker
                    label="Ngày upload video"
                    value={formData.ngay_xuat_video}
                    onChange={(date) => { _handleDateChange("ngay_xuat_video", date); }}
                    slotProps={{ textField: { error: !!errors.ngay_xuat_video, helperText: errors.ngay_xuat_video, required: true, 
                                  InputProps: { sx: highlightFields.ngay_xuat_video ? { backgroundColor: '#fffbe6' } : {} }, name: 'ngay_xuat_video', onBlur: handleBlur } }}
                  />
                </FormControl>
              </Grid> 

              <Grid md={6} xs={6}>
                <FormControl fullWidth required>
                  <DatePicker
                    label="Ngày giao hàng"
                    value={formData.ngay_giao_hang}
                    slotProps={{ textField: { error: !!errors.ngay_giao_hang, helperText: errors.ngay_giao_hang, required: true, 
                                  InputProps: { sx: highlightFields.ngay_giao_hang ? { backgroundColor: '#fffbe6' } : {} }, name: 'ngay_giao_hang', onBlur: handleBlur } }}
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
              onClick={() => router.push('/dashboard/videos')}
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
