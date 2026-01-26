#!/bin/bash

echo "🐾 Updating full Palworld Pal list (stable JSON source)..."

mkdir -p src/data

# Download clean JSON (no JS, no comments, no BOM)
curl -L \
https://raw.githubusercontent.com/Palworld-Tools/paldeck-data/main/pals.json \
-o src/data/pals_source.json

if [ ! -s src/data/pals_source.json ]; then
  echo "❌ Failed to download pal data"
  exit 1
fi

node <<'EOF'
const fs = require("fs");

const raw = JSON.parse(
  fs.readFileSync("src/data/pals_source.json", "utf8")
);

// Normalize into your app format
const pals = raw.map(p => {
  const slug = p.slug.replace(/-/g, "_");

  return {
    id: String(p.paldeck),
    name: p.name,
    imageUrl: `https://palworld.gg/static/pal_icon/${slug}.png`
  };
});

fs.writeFileSync(
  "src/data/pals.json",
  JSON.stringify(pals, null, 2)
);

fs.unlinkSync("src/data/pals_source.json");

console.log(`✅ pals.json generated (${pals.length} pals)`);
EOF
