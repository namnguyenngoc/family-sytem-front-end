// src/components/molecules/Form.tsx
import React, { useState } from 'react';
import Button from '../../atoms/Button/Button';

interface FormProps {
  onSubmit: (value: string) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
      />
      <Button label="Submit" onClick={() => handleSubmit} />
    </form>
  );
};

export default Form;