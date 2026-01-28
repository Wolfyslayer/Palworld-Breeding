# Custom Database Setup Guide

## Current Database Structure

### Tables
- `pals`: Pal creature data (name, image, breeding power, types, rarity)
- `passives`: Passive skill data (name, tier, description, effects)
- `special_combos`: Special breeding combinations

## Image Storage Setup

### Local Images
All Pal images are now stored locally in `client/public/pals/`:
- **114 Pal images** sourced from official PalDex API
- **Local paths** (e.g., `/pals/jetragon-image.png`)
- **No external dependencies** on image URLs

### Adding New Pal Images
1. Place image files in `client/public/pals/`
2. Use naming convention: `{palname}-image.png`
3. Update database with local path: `/pals/{palname}-image.png`

## Adding Your Own Data

### Method 1: Direct SQL Insert
```sql
-- Add new Pals
INSERT INTO pals (name, image, breeding_power, types, is_rare) 
VALUES ('YourPal', '/pals/yourpal-image.png', 500, ARRAY['Fire', 'Dragon'], false);

-- Add new Passives
INSERT INTO passives (name, tier, description, effects) 
VALUES ('YourPassive', 2, 'Custom description', '{"attack": "+15%"}');

-- Add Special Combos
INSERT INTO special_combos (parent1, parent2, result) 
VALUES ('Parent1', 'Parent2', 'ResultPal');
```

### Method 2: Modify Seed Data
Edit `server/routes.ts` in the `seedData()` function:
- Add to `palsData` array for new Pals
- Add to `passivesData` array for new passives  
- Add to `combosData` array for special combinations

### Method 3: API Endpoints
Use existing API endpoints:
- `POST /api/pals` - Create new Pal
- `POST /api/passives` - Create new passive
- `POST /api/special-combos` - Create new combo

## Complete Pal Database

Your project now includes **139 Pals** from the official PalDex API:
- **All base game Pals** (excluding bosses and tower bosses)
- **25 Pals with multiple variations** (Noct, Lux, Aqua, Cryst, Ignis, Terra forms)
- **Correct breeding power values** from official game data
- **Accurate typing information** for all variations
- **Local image storage** with proper fallback handling
- **Proper rarity classification** based on in-game rarity

### Pal Variations Included
- **Noct variations**: Frostallion Noct, Blazehowl Noct, Pyrin Noct, etc.
- **Elemental variants**: Suzaku Aqua, Broncherry Aqua, etc.
- **Crystal forms**: Hangyu Cryst, Jolthog Cryst, Mau Cryst, etc.
- **Lux variants**: Dinossom Lux, Relaxaurus Lux, Mossanda Lux
- **Terra forms**: Eikthyrdeer Terra, Robinquill Terra, Surfent Terra
- **Ignis forms**: Gobfin Ignis, Kelpsea Ignis, Leezpunk Ignis

## Database Migration
```bash
# Push schema changes
npm run db:push

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## Custom Effects Format
Passive effects use JSON format:
```json
{
  "attack": "+20%",
  "defense": "+15%", 
  "work_speed": "+30%",
  "fire_damage": "+25%",
  "hunger_drain": "-10%"
}
```

## Tier System
- 3: Legendary/Rainbow (Legend, Lucky, Artisan, Swift)
- 2: Gold (Musclehead, Burly Body, Work Slave)
- 1: Silver (Brave, Hard Skin, Serious)
- 0: Common (default tier)
- -1: Bronze negative (Coward, Masochist)
- -2: Silver negative (Pacifist, Unstable)
- -3: Gold negative (rare penalties)
