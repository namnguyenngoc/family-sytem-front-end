import React, { useState } from 'react';
import './App.css';
import { useMutation, useQuery, gql } from '@apollo/client';

// Define GraphQL query
const GET_CHI_TIEUS = gql`
  query GetChiTieus {
    data {
        id
        noi_dung
        so_tien
        ghi_chu
    }
  }
`;

const CREATE_CHI_TIEU = gql`
  mutation CreateChiTieu($chiTieuDto: ChiTieuDto!) {
    createChiTieu(chiTieuDto: $chiTieuDto) {
      id
      noi_dung
      so_tien
      ghi_chu
    }
  }
`;

function App() {

  // Use Apollo Client's useQuery hook
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_CHI_TIEUS);
  
  const [formState, setFormState] = useState({
    noi_dung: '',
    bank: { noi_dung: '', id: '' },
    bank_id: '',
    so_tien: '',
    ghi_chu: ''
  });

  const [createChiTieu, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(CREATE_CHI_TIEU);

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
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
 
  // // Handle loading state
  // if (queryLoading) return (
  //   <div className="flex items-center justify-center h-screen">
  //     <p className="text-xl">Loading...</p>
  //   </div>
  // );

  // // Handle error state
  // if (queryError) return (
  //   <div className="flex items-center justify-center h-screen">
  //     <p className="text-xl text-red-500">Error: {queryError.message}</p>
  //   </div>
  // );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Chi Tieu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Noi Dung</label>
          <input
            type="text"
            name="noi_dung"
            value={formState.noi_dung}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Noi Dung</label>
          <input
            type="text"
            name="bank.noi_dung"
            value={formState.bank.noi_dung}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank ID</label>
          <input
            type="text"
            name="bank.id"
            value={formState.bank.id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank ID</label>
          <input
            type="text"
            name="bank_id"
            value={formState.bank_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">So Tien</label>
          <input
            type="text"
            name="so_tien"
            value={formState.so_tien}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ghi Chu</label>
          <input
            type="text"
            name="ghi_chu"
            value={formState.ghi_chu}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm"
          disabled={mutationLoading}
        >
          {mutationLoading ? 'Submitting...' : 'Submit'}
        </button>
        {mutationError && <p className="text-red-500 mt-2">Error: {mutationError.message}</p>}
      </form>
      {mutationData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Created Chi Tieu</h2>
          <p>ID: {mutationData.createChiTieu.id}</p>
          <p>Noi Dung: {mutationData.createChiTieu.noi_dung}</p>
          <p>So Tien: {mutationData.createChiTieu.so_tien}</p>
          <p>Ghi Chu: {mutationData.createChiTieu.ghi_chu}</p>
        </div>
      )}
      </div>
  );
}

export default App;
