import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const pals = pgTable("pals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
  breedingPower: integer("breeding_power").notNull(),
  types: text("types").array().notNull(), // e.g., ["Dragon", "Fire"]
  isRare: boolean("is_rare").default(false), // Legendary/Special
});

export const passives = pgTable("passives", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  tier: integer("tier").default(1), // -3 to 3 (Rainbow can be 4 or handled via type)
  description: text("description").notNull(),
  effects: jsonb("effects").$type<Record<string, string>>().notNull(), // e.g. { "attack": "+20%" }
});

export const specialCombos = pgTable("special_combos", {
  id: serial("id").primaryKey(),
  parent1: text("parent1").notNull(),
  parent2: text("parent2").notNull(),
  result: text("result").notNull(),
});

// === SCHEMAS ===

export const insertPalSchema = createInsertSchema(pals);
export const insertPassiveSchema = createInsertSchema(passives);
export const insertSpecialComboSchema = createInsertSchema(specialCombos);

// === EXPLICIT TYPES ===

export type Pal = typeof pals.$inferSelect;
export type Passive = typeof passives.$inferSelect;
export type SpecialCombo = typeof specialCombos.$inferSelect;

export type BreedingResult = {
  child: Pal;
  isSpecial: boolean;
};

export type ProbabilityResult = {
  passives: string[];
  probability: number;
};
