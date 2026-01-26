import { useState } from 'react';
import { pals, passives, breedingTable } from './data';
import { calculateChances } from './math';

export default function BreedingCalculator() {
  const [parent1, setParent1] = useState(null);
  const [parent2, setParent2] = useState(null);
  const [parent1Passives, setParent1Passives] = useState([]);
  const [parent2Passives, setParent2Passives] = useState([]);

  const togglePassive = (parentNum, passive) => {
    const current = parentNum === 1 ? parent1Passives : parent2Passives;
    const setter = parentNum === 1 ? setParent1Passives : setParent2Passives;

    if (current.includes(passive)) {
      setter(current.filter((p) => p !== passive));
    } else {
      if (current.length < 4) {
        setter([...current, passive]);
      }
    }
  };

  const getOffspringChances = () => {
    if (!parent1 || !parent2) return [];
    return calculateChances(parent1, parent2, parent1Passives, parent2Passives);
  };

  const offspring = getOffspringChances();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Palworld Breeding Calculator</h1>

      {/* Parent Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((num) => (
          <div key={num} className="border p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Parent {num}</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-2">
              {pals.map((pal) => (
                <button
                  key={pal.id}
                  className={`border rounded p-1 flex flex-col items-center cursor-pointer hover:bg-gray-100 ${
                    (num === 1 ? parent1 : parent2)?.id === pal.id ? 'border-blue-500' : ''
                  }`}
                  onClick={() => (num === 1 ? setParent1(pal) : setParent2(pal))}
                >
                  <img
                    src={pal.imageUrl} // ✅ Use imageUrl from pals.json
                    alt={pal.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs mt-1 text-center">{pal.name}</span>
                </button>
              ))}
            </div>

            {/* Passives */}
            <div>
              <h3 className="text-sm font-medium mb-1">Select up to 4 passives</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {passives.map((p) => (
                  <label
                    key={p.name}
                    className="text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(num === 1 ? parent1Passives : parent2Passives).includes(p.name)}
                      onChange={() => togglePassive(num, p.name)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Offspring Section */}
      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Offspring Chances</h2>
        {offspring.length === 0 ? (
          <p className="text-sm">Select both parents to see possible offspring.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {offspring.map((off) => (
              <div key={off.id} className="flex flex-col items-center">
                <img
                  src={off.imageUrl} // Use imageUrl here as well
                  alt={off.name}
                  className="w-16 h-16 object-contain mb-1"
                />
                <span className="text-sm text-center">{off.name}</span>
                <span className="text-xs text-gray-600">{off.chance}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}