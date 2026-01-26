#!/bin/bash

echo "📍 Setting up Palworld Breeding Calculator for deployment..."

# -------------------------------
# 1️⃣ Ensure public/data exists
# -------------------------------
DEST="public/data"
mkdir -p "$DEST"
echo "✅ Ensured $DEST exists"

# -------------------------------
# 2️⃣ Move JSON files to public/data
# -------------------------------
SOURCE="./json_files_to_add" # change this to your folder with pals/passives JSON
if [ -d "$SOURCE" ]; then
    mv "$SOURCE"/*.json "$DEST"/ 2>/dev/null
    echo "✅ Moved JSON files from $SOURCE to $DEST"
else
    echo "⚠️ Source folder $SOURCE does not exist. Skipping move."
fi

# -------------------------------
# 3️⃣ Create/Update BreedingCalculator.jsx
# -------------------------------
BC="src/BreedingCalculator.jsx"
mkdir -p src

cat > "$BC" << 'EOF'
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
      <p>Make sure your JSON data exists in /public/data/.</p>
      <p>{palsData.length} pals and {passivesData.length} passives loaded.</p>
    </div>
  );
}
EOF

echo "✅ BreedingCalculator.jsx created/updated"

# -------------------------------
# 4️⃣ Ensure App.jsx uses BreedingCalculator
# -------------------------------
APP="src/App.jsx"
if [ ! -f "$APP" ]; then
    cat > "$APP" << 'EOF'
import BreedingCalculator from './BreedingCalculator';

export default function App() {
  return <BreedingCalculator />;
}
EOF
    echo "✅ Created App.jsx using BreedingCalculator"
else
    cp "$APP" "${APP}.bak"
    echo "💾 Backed up existing App.jsx → App.jsx.bak"
    if ! grep -q "BreedingCalculator" "$APP"; then
        sed -i "1i import BreedingCalculator from './BreedingCalculator';" "$APP"
        echo "✅ Added import for BreedingCalculator"
    fi
    sed -i "/export default function App/,/}/c\export default function App() { return <BreedingCalculator />; }" "$APP"
    echo "✅ App.jsx updated to use BreedingCalculator"
fi

echo "🎉 Setup complete! You can now run 'npm run dev' locally or deploy to Vercel."
