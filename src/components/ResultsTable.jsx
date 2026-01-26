import React from 'react';
export default function ResultsTable({results}){
  if(!results.length)return null;
  return (<table border="1"><thead><tr><th>Passive</th><th>Parent</th><th>Mutation</th><th>Total</th></tr></thead>
  <tbody>{results.map(r=><tr key={r.name}><td>{r.name}</td><td>{r.parentChance}%</td><td>{r.mutationChance}%</td><td>{r.total}%</td></tr>)}</tbody></table>);
}
