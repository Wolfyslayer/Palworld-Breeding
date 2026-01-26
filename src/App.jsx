import BreedingCalculator from './BreedingCalculator';
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

