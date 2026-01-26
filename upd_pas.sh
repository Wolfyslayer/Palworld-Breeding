#!/bin/bash

echo "🧠 Generating full Palworld passives list..."

mkdir -p src/data

node << 'EOF'
const fs = require("fs");

// Full list of passives with placeholder descriptions
const passives = [
  { id:"001", name:"Abnormal", description:"10% decrease to incoming Neutral damage" },
  { id:"002", name:"Aggressive", description:"Attack +10%, Defense -10%" },
  { id:"003", name:"Artisan", description:"Work speed +50%" },
  { id:"004", name:"Blood of the Dragon", description:"Dragon attack damage +10%" },
  { id:"005", name:"Botanical Barrier", description:"Incoming Grass damage -10%" },
  { id:"006", name:"Bottomless Stomach", description:"Satiety decreases faster" },
  { id:"007", name:"Brave", description:"Attack +10%" },
  { id:"008", name:"Brittle", description:"Defense -20%" },
  { id:"009", name:"Burly Body", description:"Defense +20%" },
  { id:"010", name:"Capacitor", description:"Electric attack damage +10%" },
  { id:"011", name:"Celestial Emperor", description:"Neutral attack +20%" },
  { id:"012", name:"Cheery", description:"Incoming Dark damage -10%" },
  { id:"013", name:"Clumsy", description:"Work speed -10%" },
  { id:"014", name:"Coldblooded", description:"Ice attack damage +10%" },
  { id:"015", name:"Conceited", description:"Work speed +10%, Defense -10%" },
  { id:"016", name:"Coward", description:"Attack -10%" },
  { id:"017", name:"Dainty Eater", description:"Satiety decreases slower" },
  { id:"018", name:"Destructive", description:"Sanity drops faster" },
  { id:"019", name:"Diet Lover", description:"Hunger decreases slower" },
  { id:"020", name:"Dragonkiller", description:"Incoming Dragon damage -10%" },
  { id:"021", name:"Earth Emperor", description:"Ground attack damage +20%" },
  { id:"022", name:"Earthquake Resistant", description:"Incoming Ground damage -10%" },
  { id:"023", name:"Ferocious", description:"Attack +20%" },
  { id:"024", name:"Fragrant Foliage", description:"Grass attack damage +10%" },
  { id:"025", name:"Glutton", description:"Hunger decreases faster" },
  { id:"026", name:"Hard Skin", description:"Defense +10%" },
  { id:"027", name:"Heated Body", description:"Incoming Ice damage -10%" },
  { id:"028", name:"Hooligan", description:"Attack +15%, Work speed -10%" },
  { id:"029", name:"Hydromaniac", description:"Water attack damage +10%" },
  { id:"030", name:"Ice Emperor", description:"Ice attack +20%" },
  { id:"031", name:"Insulated Body", description:"Incoming Lightning damage -10%" },
  { id:"032", name:"Legend", description:"Attack +20%, Defense +20%, Movement +15%" },
  { id:"033", name:"Logging Foreman", description:"Logging efficiency +25%" },
  { id:"034", name:"Lucky", description:"Work speed +15%, Attack +15%" },
  { id:"035", name:"Masochist", description:"Defense +15%, Attack +15%" },
  { id:"036", name:"Mine Foreman", description:"Mining efficiency +25%" },
  { id:"037", name:"Motivational Leader", description:"Work speed +25%" },
  { id:"038", name:"Musclehead", description:"Attack +30%, Work speed -50%" },
  { id:"039", name:"Nimble", description:"Movement speed +10%" },
  { id:"040", name:"Pacifist", description:"Attack -20%" },
  { id:"041", name:"Positive Thinker", description:"Sanity drops slower" },
  { id:"042", name:"Power of Gaia", description:"Earth attack damage +10%" },
  { id:"043", name:"Pyromaniac", description:"Fire attack damage +10%" },
  { id:"044", name:"Runner", description:"Movement speed +20%" },
  { id:"045", name:"Sadist", description:"Attack +15%, Defense -15%" },
  { id:"046", name:"Serious", description:"Work speed +20%" },
  { id:"047", name:"Slacker", description:"Work speed -30%" },
  { id:"048", name:"Spirit Emperor", description:"Grass attack +20%" },
  { id:"049", name:"Suntan Lover", description:"Incoming Fire damage -10%" },
  { id:"050", name:"Swift", description:"Movement speed +30%" },
  { id:"051", name:"Stronghold Strategist", description:"Defense +10%" },
  { id:"052", name:"Unstable", description:"Sanity drops faster" },
  { id:"053", name:"Vampiric", description:"Steals damage as HP" },
  { id:"054", name:"Veil of Darkness", description:"Dark attack damage +10%" },
  { id:"055", name:"Waterproof", description:"Incoming Water damage -10%" },
  { id:"056", name:"Workaholic", description:"Sanity drops slower" },
  { id:"057", name:"Work Slave", description:"Work speed +30%, Attack -30%" },
  { id:"058", name:"Vanguard", description:"Attack +10%" },
  { id:"059", name:"Zen Mind", description:"Neutral attack damage +10%" }
];

// Add image URLs
const result = passives.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description,
  imageUrl: `https://palworld.gg/static/passive_icon/${p.name.toLowerCase().replace(/[^a-z0-9]+/g,"_")}.png`
}));

fs.writeFileSync("src/data/passives.json", JSON.stringify(result, null, 2));
console.log(`✅ Generated passives.json (${result.length} passives).`);
EOF
