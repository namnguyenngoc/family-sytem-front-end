// src/components/templates/MainTemplate.tsx
import React from 'react';
import Card from '../../molecules/Card/Card';

const MainTemplate: React.FC = () => {
  const handleFormSubmit = (data: string) => {
    console.log('Form submitted with data:', data);
  };

  return (
    <div className="main-template">
      <Card title="My Card" onSubmit={handleFormSubmit} />
    </div>
  );
};

export default MainTemplate;