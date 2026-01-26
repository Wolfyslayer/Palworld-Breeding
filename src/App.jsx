import BreedingCalculator from './BreedingCalculator';
import { useState } from 'react';
import { pals, breedingTable, passives } from './data';
import { calculateChances } from './math';

export default function App() {
  return (
    <div>
      <BreedingCalculator />
    </div>
  );
}