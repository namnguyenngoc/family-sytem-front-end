// src/components/organisms/Card.tsx
import React from 'react';
import Form from '../FormGroup/Form';

interface CardProps {
  title: string;
  onSubmit: (value: string) => void;
}

const Card: React.FC<CardProps> = ({ title, onSubmit }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <Form onSubmit={onSubmit} />
    </div>
  );
};

export default Card;