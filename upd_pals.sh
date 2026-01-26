#!/bin/bash

echo "🐾 Updating full Palworld Pal list (forced clean parse)..."

mkdir -p src/data

curl -L \
https://raw.githubusercontent.com/Palworld-Tools/paldeck-data/main/pals.json \
-o src/data/pals_source.txt

if [ ! -s src/data/pals_source.txt ]; then
  echo "❌ Failed to download pal data"
  exit 1
fi

node <<'EOF'
const fs = require("fs");

let text = fs.readFileSync("src/data/pals_source.txt", "utf8");

// 🔥 HARD CLEAN: remove everything before first [
const start = text.indexOf("[");
if (start === -1) {
  console.error("❌ Invalid pal data (no JSON array found)");
  process.exit(1);
}

text = text.slice(start);

// Parse safely
const raw = JSON.parse(text);

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

fs.unlinkSync("src/data/pals_source.txt");

console.log(`✅ pals.json generated (${pals.length} pals)`);
EOF
