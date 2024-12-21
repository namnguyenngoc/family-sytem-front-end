// src/pages/HomePage/HomePage.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } 
from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

export const GET_CHI_TIEUS = gql`
  query GetChiTieus {
    data {
      id
      noi_dung
      so_tien
      ghi_chu
    }
  }
`;

export const CREATE_CHI_TIEU = gql`
  mutation CreateChiTieu($chiTieuDto: ChiTieuDto!) {
    createChiTieu(chiTieuDto: $chiTieuDto) {
      id
      noi_dung
      so_tien
      ghi_chu
    }
  }
`;

export default function HomePage() {
  const [formState, setFormState] = useState({
    noi_dung: '',
    bank: { noi_dung: '', id: '' },
    bank_id: '',
    so_tien: '',
    ghi_chu: ''
  });

  const { data: queryData, error: queryError, loading: queryLoading } = useQuery(GET_CHI_TIEUS);
  const [createChiTieu, { data: mutationData, error: mutationError, loading: mutationLoading }] = useMutation(CREATE_CHI_TIEU);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChangeSelect = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    if (name.startsWith('bank.')) {
      const bankField = name.split('.')[1];
      setFormState({
        ...formState,
        bank: {
          ...formState.bank,
          [bankField]: value
        }
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createChiTieu({
        variables: {
          chiTieuDto: {
            noi_dung: formState.noi_dung,
            bank: {
              noi_dung: formState.bank.noi_dung,
              id: parseInt(formState.bank.id)
            },
            bank_id: parseInt(formState.bank_id),
            so_tien: parseFloat(formState.so_tien),
            ghi_chu: formState.ghi_chu
          }
        }
      });
      alert('Chi Tieu created successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  if (queryLoading) return <div>Loading...</div>;
  if (queryError) return <div>Error: {queryError.message}</div>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Chi Tieu
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Noi Dung"
          name="noi_dung"
          value={formState.noi_dung}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Bank Noi Dung"
          name="bank.noi_dung"
          value={formState.bank.noi_dung}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChangeSelect}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Bank ID"
          name="bank.id"
          value={formState.bank.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Bank ID"
          name="bank_id"
          value={formState.bank_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="So Tien"
          name="so_tien"
          value={formState.so_tien}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ghi Chu"
          name="ghi_chu"
          value={formState.ghi_chu}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={mutationLoading}
        >
          {mutationLoading ? 'Submitting...' : 'Submit'}
        </Button>
        {mutationError && <Typography color="error">Error: {mutationError.message}</Typography>}
      </form>
      {mutationData && (
        <div>
          <Typography variant="h6" component="h2" gutterBottom>
            Created Chi Tieu
          </Typography>
          <Typography>ID: {mutationData.createChiTieu.id}</Typography>
          <Typography>Noi Dung: {mutationData.createChiTieu.noi_dung}</Typography>
          <Typography>So Tien: {mutationData.createChiTieu.so_tien}</Typography>
          <Typography>Ghi Chu: {mutationData.createChiTieu.ghi_chu}</Typography>
        </div>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Noi Dung</TableCell>
              <TableCell>So Tien</TableCell>
              <TableCell>Ghi Chu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queryData.data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.noi_dung}</TableCell>
                <TableCell>{item.so_tien}</TableCell>
                <TableCell>{item.ghi_chu}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}