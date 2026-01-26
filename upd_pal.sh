#!/bin/bash

echo "🐾 Updating full Palworld Pal list (object-aware parser)..."

mkdir -p src/data

curl -L \
https://raw.githubusercontent.com/Palworld-Tools/paldeck-data/main/pals.json \
-o src/data/pals_source.json

if [ ! -s src/data/pals_source.json ]; then
  echo "❌ Failed to download pal data"
  exit 1
fi

node <<'EOF'
const fs = require("fs");

const rawText = fs.readFileSync("src/data/pals_source.json", "utf8");

// Remove BOM if present
const cleaned = rawText.replace(/^\uFEFF/, "");

const data = JSON.parse(cleaned);

// 🔍 Locate pal array safely
let list =
  data.pals ||
  data.Pals ||
  data.data?.pals ||
  data.data ||
  null;

if (!Array.isArray(list)) {
  console.error("❌ Could not locate pal list in source JSON");
  console.error("Top-level keys:", Object.keys(data));
  process.exit(1);
}

const pals = list.map(p => {
  const slug = (p.slug || p.name.toLowerCase().replace(/\s+/g, "_"))
    .replace(/-/g, "_");

  return {
    id: String(p.paldeck ?? p.id),
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
