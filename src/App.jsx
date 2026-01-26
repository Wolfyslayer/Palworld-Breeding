import { useState } from 'react'
import { pals, breedingTable, passives } from './data'
import { calculateChances } from './math'

export default function App() {
  const [a,setA] = useState('')
  const [b,setB] = useState('')
  const [pa,setPa] = useState([])
  const [pb,setPb] = useState([])

  const result = breedingTable[a]?.[b] || '—'
  const chances = calculateChances(pa,pb,passives)

  const toggle = (list,set,val) =>
    set(list.includes(val)?list.filter(x=>x!==val):[...list,val])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Palworld Breeding Calculator</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[['Parent A',setA,pa,setPa],['Parent B',setB,pb,setPb]].map(([t,setPal,list,setList])=>(
          <div key={t} className="bg-slate-800 p-4 rounded-xl shadow-xl">
            <h2 className="text-xl mb-2">{t}</h2>
            <select className="w-full p-2 text-black" onChange={e=>setPal(e.target.value)}>
              <option value="">Select Pal</option>
              {pals.map(p=><option key={p}>{p}</option>)}
            </select>
            {passives.map(p=>(
              <label key={p.name} className="block mt-1">
                <input type="checkbox" onChange={()=>toggle(list,setList,p.name)} /> {p.name}
              </label>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto mt-6 bg-slate-800 p-4 rounded-xl shadow-xl">
        <h2 className="text-xl">Result</h2>
        <p className="text-2xl">{result}</p>
      </div>

      <div className="max-w-2xl mx-auto mt-6 bg-slate-800 p-4 rounded-xl shadow-xl">
        <h2 className="text-xl mb-2">Passive Chances</h2>
        {Object.entries(chances).map(([k,v])=>(
          <div key={k} className="mb-2">
            <div className="flex justify-between">
              <span>{k}</span>
              <span>{v}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded">
              <div className="h-2 rounded bg-emerald-400" style={{width:`${v}%`}} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Probabilities are community-estimated.
      </p>
    </div>
  )
}