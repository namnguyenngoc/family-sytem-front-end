import React from 'react';
// import Label from '@src/components/atoms/Label/Label';
// import Input from '@src/components/atoms/Input/Input';
import Button from '../../atoms/Button/Button';

const FormGroup: React.FC = () => (
  <div>
    {/* <Label text="Username" />
    <Input placeholder="Enter your username" /> */}
    <Button label="Submit" onClick={() => alert('Submitted')} />
  </div>
);

export default FormGroup;
