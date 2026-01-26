#!/bin/bash

set -e

echo "🐾 Updating full Palworld pal list (official source)..."

mkdir -p src/data

curl -sL https://palworld.gg/api/paldeck -o src/data/pals_source.json

if [ ! -s src/data/pals_source.json ]; then
  echo "❌ Failed to download paldeck data"
  exit 1
fi

node <<'EOF'
const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync("src/data/pals_source.json", "utf8")
);

if (!Array.isArray(data)) {
  console.error("❌ Unexpected API format");
  process.exit(1);
}

const pals = data.map(p => {
  const slug = p.slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");

  return {
    id: String(p.id),
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
