#!/bin/bash

echo "🐾 Updating full Palworld Pal list (HTML-proof)..."

mkdir -p src/data

curl -L \
  -H "Accept: application/json" \
  https://raw.githubusercontent.com/Palworld-Tools/paldeck-data/main/pals.json \
  -o src/data/pals_source.json

# Detect HTML (hard stop if wrong)
if grep -qi "<html" src/data/pals_source.json; then
  echo "❌ GitHub returned HTML instead of JSON (rate limit or redirect)"
  echo "⏳ Wait 1–2 minutes and run the script again"
  exit 1
fi

node <<'EOF'
const fs = require("fs");

const text = fs.readFileSync("src/data/pals_source.json", "utf8").trim();

// Remove BOM if present
const cleaned = text.replace(/^\uFEFF/, "");

const data = JSON.parse(cleaned);

// Source structure: array OR object
const list = Array.isArray(data)
  ? data
  : data.pals || data.data || [];

if (!Array.isArray(list) || list.length === 0) {
  console.error("❌ Pal list not found in JSON");
  process.exit(1);
}

const pals = list.map(p => {
  const slug = (p.slug || p.name.toLowerCase())
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

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
