import { db } from "./db";
import { pals, passives, specialCombos, type Pal, type Passive, type SpecialCombo } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getPals(): Promise<Pal[]>;
  getPal(id: number): Promise<Pal | undefined>;
  getPassives(): Promise<Passive[]>;
  getSpecialCombos(): Promise<SpecialCombo[]>;
  
  // Seeding
  createPal(pal: typeof pals.$inferInsert): Promise<Pal>;
  createPassive(passive: typeof passives.$inferInsert): Promise<Passive>;
  createSpecialCombo(combo: typeof specialCombos.$inferInsert): Promise<SpecialCombo>;
}

export class DatabaseStorage implements IStorage {
  async getPals(): Promise<Pal[]> {
    return await db.select().from(pals).orderBy(asc(pals.name));
  }

  async getPal(id: number): Promise<Pal | undefined> {
    const [pal] = await db.select().from(pals).where(eq(pals.id, id));
    return pal;
  }

  async getPassives(): Promise<Passive[]> {
    return await db.select().from(passives).orderBy(asc(passives.name));
  }

  async getSpecialCombos(): Promise<SpecialCombo[]> {
    return await db.select().from(specialCombos);
  }

  async createPal(pal: typeof pals.$inferInsert): Promise<Pal> {
    const [newPal] = await db.insert(pals).values(pal).returning();
    return newPal;
  }

  async createPassive(passive: typeof passives.$inferInsert): Promise<Passive> {
    const [newPassive] = await db.insert(passives).values(passive).returning();
    return newPassive;
  }

  async createSpecialCombo(combo: typeof specialCombos.$inferInsert): Promise<SpecialCombo> {
    const [newCombo] = await db.insert(specialCombos).values(combo).returning();
    return newCombo;
  }
}

export const storage = new DatabaseStorage();
