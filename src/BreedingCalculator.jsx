import React, { useState } from "react";
import palsData from "./data/pals.json";
import passivesData from "./data/passives.json";

export default function BreedingCalculator() {
  const [parent1, setParent1] = useState("");
  const [parent2, setParent2] = useState("");
  const [passives1, setPassives1] = useState([]);
  const [passives2, setPassives2] = useState([]);
  const [result, setResult] = useState([]);

  const togglePassive = (arr, setArr, name) => {
    if (arr.includes(name)) setArr(arr.filter(p => p !== name));
    else if (arr.length < 4) setArr([...arr, name]);
  };

  const calculate = () => {
    const chances = passivesData.map(p => {
      const in1 = passives1.includes(p.name);
      const in2 = passives2.includes(p.name);
      const chance = in1 && in2 ? 75 : in1 || in2 ? 50 : 0;
      return { name: p.name, chance, imageUrl: p.imageUrl };
    });
    setResult(chances);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Palworld Breeding Calculator</h1>

      <div>
        <label>Parent 1:</label>
        <select value={parent1} onChange={e => setParent1(e.target.value)}>
          <option value="">Select Parent 1</option>
          {palsData.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Parent 2:</label>
        <select value={parent2} onChange={e => setParent2(e.target.value)}>
          <option value="">Select Parent 2</option>
          {palsData.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3>Parent 1 Passives (max 4)</h3>
        {passivesData.map(p => (
          <label key={p.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={passives1.includes(p.name)}
              onChange={() => togglePassive(passives1, setPassives1, p.name)}
              disabled={!passives1.includes(p.name) && passives1.length >= 4}
            />
            <img src={p.imageUrl} width={24} alt={p.name} /> {p.name}
          </label>
        ))}
      </div>

      <div>
        <h3>Parent 2 Passives (max 4)</h3>
        {passivesData.map(p => (
          <label key={p.id} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={passives2.includes(p.name)}
              onChange={() => togglePassive(passives2, setPassives2, p.name)}
              disabled={!passives2.includes(p.name) && passives2.length >= 4}
            />
            <img src={p.imageUrl} width={24} alt={p.name} /> {p.name}
          </label>
        ))}
      </div>

      <button onClick={calculate} style={{ marginTop: 20 }}>Calculate</button>

      {result.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Inheritance Chances</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Passive</th>
                <th>Chance (%)</th>
                <th>Icon</th>
              </tr>
            </thead>
            <tbody>
              {result.map(r => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.chance}</td>
                  <td><img src={r.imageUrl} alt={r.name} width={24} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
