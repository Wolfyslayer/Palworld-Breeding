import React from 'react';
export default function PassiveSelector({passives,selected,setSelected}){
  const toggle=name=>{if(selected.includes(name))setSelected(selected.filter(x=>x!==name));
  else if(selected.length<4)setSelected([...selected,name]);};
  return (<div>
    <h3>Select up to 4 passives</h3>
    {passives.map(p=><button key={p.name} onClick={()=>toggle(p.name)}>{p.name}</button>)}
  </div>);
}
