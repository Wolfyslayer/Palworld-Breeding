import React from 'react';
export default function PalSelector({pals,onSelect,label}){
  return (<div>
    <h3>{label}</h3>
    <select onChange={e=>onSelect(pals.find(p=>p.id==e.target.value))}>
      <option value="">--Select--</option>
      {pals.map(p=><option key={p.id} value={p.id}>{p.name} ({p.rarity})</option>)}
    </select>
  </div>);
}
