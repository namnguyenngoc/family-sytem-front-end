// src/pages/HomePage/HomePage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import HomePage, { GET_CHI_TIEUS, CREATE_CHI_TIEU } from './HomePage';

const mocks = [
  {
    request: {
      query: GET_CHI_TIEUS,
    },
    result: {
      data: {
        data: [
          { id: '1', noi_dung: 'Test 1', so_tien: 1000, ghi_chu: 'Note 1' },
          { id: '2', noi_dung: 'Test 2', so_tien: 2000, ghi_chu: 'Note 2' },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_CHI_TIEU,
      variables: {
        chiTieuDto: {
          noi_dung: 'Test 3',
          bank: { noi_dung: 'Bank 3', id: 3 },
          bank_id: 3,
          so_tien: 3000,
          ghi_chu: 'Note 3',
        },
      },
    },
    result: {
      data: {
        createChiTieu: {
          id: '3',
          noi_dung: 'Test 3',
          so_tien: 3000,
          ghi_chu: 'Note 3',
        },
      },
    },
  },
];

describe('HomePage', () => {
  it('displays data correctly in the table', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>
    );

    await waitFor(() => expect(screen.getByText('Test 1')).toBeInTheDocument());
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });
  it('displays loading state initially', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomePage />
      </MockedProvider>
    );

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    const errorMock = [
      {
        request: {
          query: GET_CHI_TIEUS,
        },
        error: new Error('An error occurred'),
      },
    ];

    const { getByText } = render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <HomePage />
      </MockedProvider>
    );

    await waitFor(() => expect(getByText('Error: An error occurred')).toBeInTheDocument());
  });

  it('displays data correctly in the table', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>
    );

    await waitFor(() => expect(screen.getByText('Test 1')).toBeInTheDocument());
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  it('creates a new Chi Tieu', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Noi Dung/i), { target: { value: 'Test 3' } });
    fireEvent.change(screen.getByLabelText(/Bank Noi Dung/i), { target: { value: 'Bank 3' } });
    fireEvent.change(screen.getByLabelText(/Bank ID/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/So Tien/i), { target: { value: '3000' } });
    fireEvent.change(screen.getByLabelText(/Ghi Chu/i), { target: { value: 'Note 3' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => expect(screen.getByText('Chi Tieu created successfully!')).toBeInTheDocument());
    expect(screen.getByText('ID: 3')).toBeInTheDocument();
    expect(screen.getByText('Noi Dung: Test 3')).toBeInTheDocument();
    expect(screen.getByText('So Tien: 3000')).toBeInTheDocument();
    expect(screen.getByText('Ghi Chu: Note 3')).toBeInTheDocument();
  });

 
});



