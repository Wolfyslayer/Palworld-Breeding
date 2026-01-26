#!/bin/bash

set -e

echo "🐾 Updating full Palworld pal list (max compatibility mode)..."

mkdir -p src/data

URL="https://raw.githubusercontent.com/Palworld-Tools/paldeck-data/main/pals.json"
OUT="src/data/pals_source.raw"

curl -L --fail "$URL" -o "$OUT"

if [ ! -s "$OUT" ]; then
  echo "❌ Download failed or file empty"
  exit 1
fi

node <<'EOF'
const fs = require("fs");

let text = fs.readFileSync("src/data/pals_source.raw", "utf8");

// 1️⃣ Remove BOM
text = text.replace(/^\uFEFF/, "");

// 2️⃣ If HTML, try to recover JSON inside
if (text.trim().startsWith("<")) {
  console.log("⚠️ HTML detected, attempting JSON recovery...");

  // Try to extract first {...} or [...]
  const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!match) {
    console.error("❌ Could not recover JSON from HTML");
    process.exit(1);
  }
  text = match[1];
}

// 3️⃣ Trim garbage before first { or [
const firstBrace = Math.min(
  ...["{", "["]
    .map(c => text.indexOf(c))
    .filter(i => i !== -1)
);

if (firstBrace > 0) {
  text = text.slice(firstBrace);
}

// 4️⃣ Parse JSON
let data;
try {
  data = JSON.parse(text);
} catch (e) {
  console.error("❌ JSON parse failed even after cleanup");
  console.error(e.message);
  process.exit(1);
}

// 5️⃣ Locate pal list
let list =
  Array.isArray(data) ? data :
  data.pals ||
  data.Pals ||
  data.data?.pals ||
  data.data;

if (!Array.isArray(list)) {
  console.error("❌ Pal list not found");
  console.error("Top-level keys:", Object.keys(data));
  process.exit(1);
}

// 6️⃣ Normalize pals
const pals = list.map(p => {
  const name = p.name?.trim();
  if (!name) return null;

  const slug = (p.slug || name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");

  return {
    id: String(p.paldeck ?? p.id ?? name),
    name,
    imageUrl: `https://palworld.gg/static/pal_icon/${slug}.png`
  };
}).filter(Boolean);

// 7️⃣ Write output
fs.writeFileSync(
  "src/data/pals.json",
  JSON.stringify(pals, null, 2)
);

fs.unlinkSync("src/data/pals_source.raw");

console.log(`✅ pals.json generated (${pals.length} pals)`);
EOF
