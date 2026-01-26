import React, { useState, useEffect } from "react";

export default function BreedingCalculator() {
  const [pals, setPals] = useState([]);
  const [passives, setPassives] = useState([]);
  const [parent1, setParent1] = useState(null);
  const [parent2, setParent2] = useState(null);
  const [parent1Passives, setParent1Passives] = useState([]);
  const [parent2Passives, setParent2Passives] = useState([]);
  const [offspring, setOffspring] = useState([]);

  // Fetch JSON data at runtime
  useEffect(() => {
    fetch("/data/pals.json")
      .then((res) => res.json())
      .then(setPals)
      .catch((err) => console.error("Failed to load pals.json", err));

    fetch("/data/passives.json")
      .then((res) => res.json())
      .then(setPassives)
      .catch((err) => console.error("Failed to load passives.json", err));
  }, []);

  // Update offspring probabilities
  useEffect(() => {
    if (!parent1 && !parent2) return;

    const allPassives = new Set([...parent1Passives, ...parent2Passives]);
    const offspringArray = passives.map((p) => {
      const inParent1 = parent1Passives.includes(p.name);
      const inParent2 = parent2Passives.includes(p.name);
      const chance = inParent1 && inParent2 ? 80 : inParent1 || inParent2 ? 40 : 10;
      return { name: p.name, chance };
    });
    setOffspring(offspringArray);
  }, [parent1Passives, parent2Passives, parent1, parent2, passives]);

  const togglePassive = (parentNum, passiveName) => {
    const setter = parentNum === 1 ? setParent1Passives : setParent2Passives;
    const selected = parentNum === 1 ? parent1Passives : parent2Passives;
    if (selected.includes(passiveName)) {
      setter(selected.filter((p) => p !== passiveName));
    } else if (selected.length < 4) {
      setter([...selected, passiveName]);
    }
  };

  return (
    <div className="p-4 font-sans max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Palworld Breeding Calculator</h1>

      {/* Parent Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((num) => (
          <div key={num} className="border p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Parent {num}</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-2">
              {pals.map((pal) => (
                <button
                  key={pal.name}
                  className={`border rounded p-1 flex flex-col items-center cursor-pointer hover:bg-gray-100 ${
                    (num === 1 ? parent1 : parent2)?.name === pal.name
                      ? "border-blue-500"
                      : ""
                  }`}
                  onClick={() => (num === 1 ? setParent1(pal) : setParent2(pal))}
                >
                  <img src={pal.image} alt={pal.name} className="w-12 h-12 object-contain" />
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

      {/* Offspring Chances */}
      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Offspring Passive Chances</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {offspring.map((o) => (
            <div key={o.name} className="border rounded p-2 flex flex-col items-center">
              <span className="text-sm">{o.name}</span>
              <span className="text-xs text-gray-600">{o.chance}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}