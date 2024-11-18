// src/App.tsx
import React from 'react';
import { Container, Button, Typography } from '@mui/material';
import HomePage from './pages/HomePage/HomePage';

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to My App
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
      <HomePage />
    </Container>
  );
};

export default App;