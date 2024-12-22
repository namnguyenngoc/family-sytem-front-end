import React from 'react';
import Button from '../atoms/Button';

const Form: React.FC = () => {
  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <form>
      {/* Form fields go here */}
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
  );
};

export default Form;
