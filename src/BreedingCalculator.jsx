import { useState, useEffect } from 'react';
import { calculateChances } from './math';

export default function BreedingCalculator() {
  const [pals, setPals] = useState([]);
  const [passives, setPassives] = useState([]);
  const [breedingTable, setBreedingTable] = useState([]);

  const [parent1, setParent1] = useState(null);
  const [parent2, setParent2] = useState(null);
  const [parent1Passives, setParent1Passives] = useState([]);
  const [parent2Passives, setParent2Passives] = useState([]);

  // Load data from public folder
  useEffect(() => {
  fetch('/pals.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch pals.json');
      return res.json();
    })
    .then(setPals)
    .catch((err) => console.error('Error loading pals:', err));

  fetch('/passives.json')
    .then((res) => res.json())
    .then(setPassives)
    .catch(console.error);

  fetch('/breedingTable.json')
    .then((res) => res.json())
    .then(setBreedingTable)
    .catch(console.error);
}, []);

  const togglePassive = (parentNum, passive) => {
    const current = parentNum === 1 ? parent1Passives : parent2Passives;
    const setter = parentNum === 1 ? setParent1Passives : setParent2Passives;

    if (current.includes(passive)) {
      setter(current.filter((p) => p !== passive));
    } else {
      if (current.length < 4) setter([...current, passive]);
    }
  };

  const getOffspringChances = () => {
    if (!parent1 || !parent2) return [];
    return calculateChances(parent1, parent2, parent1Passives, parent2Passives, breedingTable);
  };

  const offspring = getOffspringChances();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Palworld Breeding Calculator</h1>

      {/* Parents Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {[1, 2].map((num) => {
          const selected = num === 1 ? parent1 : parent2;
          const selectedPassives = num === 1 ? parent1Passives : parent2Passives;
          const setSelected = num === 1 ? setParent1 : setParent2;

          return (
            <div key={num} className="flex-1 border rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">Parent {num}</h2>

              {/* Selected Pal Display */}
              {selected ? (
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                  <span className="font-medium">{selected.name}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center mb-4">Select a pal below</p>
              )}

              {/* Pal Selection Grid */}
              <div className="grid grid-cols-4 md:grid-cols-5 gap-2 overflow-y-auto max-h-64 mb-4">
                {pals.map((pal) => (
                  <button
                    key={pal.id}
                    className={`border rounded p-1 flex flex-col items-center cursor-pointer hover:bg-gray-100 ${
                      selected?.id === pal.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelected(pal)}
                  >
                    <img
                      src={pal.imageUrl}
                      alt={pal.name}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-xs mt-1 text-center">{pal.name}</span>
                  </button>
                ))}
              </div>

              {/* Passives Selection */}
              <div>
                <h3 className="text-sm font-medium mb-1 text-center">Select up to 4 passives</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                  {passives.map((p) => (
                    <label key={p.name} className="text-xs flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPassives.includes(p.name)}
                        onChange={() => togglePassive(num, p.name)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offspring Section */}
      <div className="border rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Offspring Chances</h2>
        {offspring.length === 0 ? (
          <p className="text-sm text-center text-gray-500">
            Select both parents to see possible offspring.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {offspring.map((off) => (
              <div
                key={off.id}
                className="flex flex-col items-center p-2 border rounded hover:shadow-md transition"
              >
                <img
                  src={off.imageUrl}
                  alt={off.name}
                  className="w-20 h-20 object-contain mb-1"
                />
                <span className="text-sm font-medium text-center">{off.name}</span>
                <span className="text-xs text-gray-600">{off.chance}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}