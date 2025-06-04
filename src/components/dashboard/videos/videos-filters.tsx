import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export interface VideoFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export function VideoFilters({ value, onChange }: VideoFiltersProps): React.JSX.Element {
  return (
    <OutlinedInput
        value={value}
        onChange={e => onChange(e.target.value)}
        fullWidth
        placeholder="Sản phẩm, brand, kênh..."
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
      />
  );
}
