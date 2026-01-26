export const pals = [
  "Anubis", "Relaxaurus", "Foxparks", "Pengullet", "Jormuntide", "Teafant"
];

export const breedingTable = {
  Anubis: { Relaxaurus: "Jormuntide" },
  Relaxaurus: { Anubis: "Jormuntide" },
  Foxparks: { Pengullet: "Teafant" },
  Pengullet: { Foxparks: "Teafant" }
};

export const passives = [
  { name: "Ferocious", rarity: "common", weight: 1 },
  { name: "Artisan", rarity: "common", weight: 1 },
  { name: "Musclehead", rarity: "common", weight: 0.8 },
  { name: "Lucky", rarity: "rare", weight: 0.2 }
];