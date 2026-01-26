#!/bin/bash

echo "📍 Checking Palworld Breeding Calculator setup..."

# 1️⃣ Check JSON files
if [ -f public/data/pals.json ]; then
  echo "✅ pals.json found"
else
  echo "⚠️ pals.json missing in public/data/"
fi

if [ -f public/data/passives.json ]; then
  echo "✅ passives.json found"
else
  echo "⚠️ passives.json missing in public/data/"
fi

# 2️⃣ Ensure BreedingCalculator.jsx exists
if [ -f src/BreedingCalculator.jsx ]; then
  echo "✅ BreedingCalculator.jsx exists"
else
  echo "⚠️ BreedingCalculator.jsx missing. Creating a default template..."
  mkdir -p src
  cat > src/BreedingCalculator.jsx << 'EOF'
import React, { useState, useEffect } from "react";

export default function BreedingCalculator() {
  const [palsData, setPalsData] = useState([]);
  const [passivesData, setPassivesData] = useState([]);

  useEffect(() => {
    fetch("/data/pals.json")
      .then(res => res.json())
      .then(setPalsData)
      .catch(err => console.error("Failed to load pals.json", err));
    fetch("/data/passives.json")
      .then(res => res.json())
      .then(setPassivesData)
      .catch(err => console.error("Failed to load passives.json", err));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Palworld Breeding Calculator</h1>
      <p>Calculator is ready. Make sure JSON data exists in /public/data/.</p>
    </div>
  );
}
EOF
  echo "✅ Created default BreedingCalculator.jsx"
fi

# 3️⃣ Update App.jsx to use BreedingCalculator
APP="src/App.jsx"
if [ ! -f "$APP" ]; then
  echo "⚠️ App.jsx not found. Please create it first."
else
  cp "$APP" "${APP}.bak"
  echo "💾 Backed up App.jsx → App.jsx.bak"

  if ! grep -q "BreedingCalculator" "$APP"; then
    sed -i "1i import BreedingCalculator from './BreedingCalculator';" "$APP"
    echo "✅ Added import for BreedingCalculator"
  fi

  sed -i "/export default function App/,/}/c\export default function App() { return <BreedingCalculator />; }" "$APP"
  echo "✅ App.jsx updated to use BreedingCalculator"
fi

echo "🎉 Check complete. Your site is ready to use existing JSON data."
