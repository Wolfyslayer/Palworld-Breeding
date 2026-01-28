import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

// --- DATA SEEDING (Simplified for this file, ideally in a separate script) ---
async function seedData() {
  const existingPals = await storage.getPals();
  if (existingPals.length === 0) {
    console.log("Seeding Pals...");
    // Load complete Pal data from external file
    const { palsData } = await import('./complete_pals_data.ts');

    for (const p of palsData) {
      await storage.createPal(p);
    }
    console.log("Pals seeded.");
  }

  const existingPassives = await storage.getPassives();
  if (existingPassives.length === 0) {
    console.log("Seeding Passives...");
    const passivesData = [
      { name: "Legend", tier: 3, description: "Balanced legendary boost", effects: { attack: "+20%", defense: "+20%", movement_speed: "+15%" } },
      { name: "Lucky", tier: 3, description: "Versatile boost", effects: { attack: "+15%", work_speed: "+15%" } },
      { name: "Musclehead", tier: 2, description: "Major attack boost", effects: { attack: "+30%", work_speed: "-50%" } },
      { name: "Ferocious", tier: 3, description: "Top-tier attack boost", effects: { attack: "+20%" } },
      { name: "Burly Body", tier: 2, description: "Solid defensive boost", effects: { defense: "+20%" } },
      { name: "Artisan", tier: 3, description: "Major work efficiency", effects: { work_speed: "+50%" } },
      { name: "Serious", tier: 1, description: "Moderate work speed", effects: { work_speed: "+20%" } },
      { name: "Swift", tier: 3, description: "Significant movement speed", effects: { movement_speed: "+30%" } },
      { name: "Runner", tier: 2, description: "Notable movement speed", effects: { movement_speed: "+20%" } },
      { name: "Nimble", tier: 1, description: "Basic movement speed", effects: { movement_speed: "+10%" } },
      { name: "Work Slave", tier: 2, description: "High work, low attack", effects: { work_speed: "+30%", attack: "-30%" } },
      { name: "Hooligan", tier: 1, description: "Attack boost, work penalty", effects: { attack: "+15%", work_speed: "-10%" } },
      { name: "Brave", tier: 1, description: "Moderate attack", effects: { attack: "+10%" } },
      { name: "Hard Skin", tier: 1, description: "Basic defense", effects: { defense: "+10%" } },
      { name: "Logistics", tier: 2, description: "Improved carrying capacity", effects: { carry_capacity: "+20%" } },
      { name: "Mining Foreman", tier: 2, description: "Mining speed boost", effects: { mining_speed: "+30%" } },
      { name: "No. 1", tier: 3, description: "Elite work boost", effects: { work_speed: "+40%", attack: "+10%" } },
      { name: "VIP", tier: 3, description: "Premium benefits", effects: { work_speed: "+25%", defense: "+15%" } },
      { name: "Acid Rain", tier: 1, description: "Corrosive damage", effects: { acid_damage: "+15%" } },
      { name: "Sanguine", tier: 2, description: "Life steal effect", effects: { life_steal: "+10%" } },
      { name: "Demonic Force", tier: 3, description: "Dark power boost", effects: { dark_damage: "+25%", attack: "+15%" } },
      { name: "Knight", tier: 2, description: "Mounted combat boost", effects: { mounted_attack: "+20%", defense: "+10%" } },
      { name: "Masochist", tier: -1, description: "Reduced defense", effects: { defense: "-15%" } },
      { name: "Coward", tier: -1, description: "Reduced attack", effects: { attack: "-10%" } },
      { name: "Pacifist", tier: -2, description: "Significant attack reduction", effects: { attack: "-20%" } },
      { name: "Dainty Eater", tier: 1, description: "Slight hunger reduction", effects: { hunger_drain: "-10%" } },
      { name: "Diet Lover", tier: 2, description: "Reduced food consumption", effects: { hunger_drain: "-15%" } },
      { name: "Glutton", tier: -1, description: "Increased food consumption", effects: { hunger_drain: "+10%" } },
      { name: "Bottomless Stomach", tier: -2, description: "Major hunger increase", effects: { hunger_drain: "+15%" } },
      { name: "Workaholic", tier: 2, description: "Reduced sanity drain", effects: { sanity_drain: "-15%" } },
      { name: "Positive Thinker", tier: 1, description: "Reduced sanity drain slightly", effects: { sanity_drain: "-10%" } },
      { name: "Unstable", tier: -2, description: "Increased sanity drain", effects: { sanity_drain: "+10%" } },
      { name: "Destructive", tier: -2, description: "Increased sanity drain major", effects: { sanity_drain: "+15%" } },
      { name: "Flame Emperor", tier: 3, description: "Fire damage boost", effects: { fire_damage: "+20%" } },
      { name: "Spirit Emperor", tier: 3, description: "Grass damage boost", effects: { grass_damage: "+20%" } },
      { name: "Lord of Lightning", tier: 3, description: "Electric damage boost", effects: { electric_damage: "+20%" } },
      { name: "Lord of the Sea", tier: 3, description: "Water damage boost", effects: { water_damage: "+20%" } },
      { name: "Ice Emperor", tier: 3, description: "Ice damage boost", effects: { ice_damage: "+20%" } },
      { name: "Earth Emperor", tier: 3, description: "Ground damage boost", effects: { ground_damage: "+20%" } },
      { name: "Lord of the Underworld", tier: 3, description: "Dark damage boost", effects: { dark_damage: "+20%" } },
      { name: "Divine Dragon", tier: 3, description: "Dragon damage boost", effects: { dragon_damage: "+20%" } },
      { name: "Celestial Emperor", tier: 3, description: "Neutral damage boost", effects: { neutral_damage: "+20%" } },
    ];

    for (const p of passivesData) {
      await storage.createPassive(p);
    }
    console.log("Passives seeded.");
  }

  const existingCombos = await storage.getSpecialCombos();
  if (existingCombos.length === 0) {
    console.log("Seeding Special Combos...");
    const combosData = [
      { parent1: "Grizzbolt", parent2: "Relaxaurus", result: "Orserk" },
      { parent1: "Kitsun", parent2: "Astegon", result: "Shadowbeak" },
      { parent1: "Vanwyrn", parent2: "Cinnamoth", result: "Anubis" },
      { parent1: "Helzephyr", parent2: "Orserk", result: "Astegon" },
      { parent1: "Lullu", parent2: "Grintale", result: "Blazehowl" }, // Note: Lullu/Grintale not in seed list, but keeping for reference logic
    ];
    for (const c of combosData) {
      await storage.createSpecialCombo(c);
    }
    console.log("Special Combos seeded.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  seedData();

  // Chain breeding calculator
  app.get("/api/breeding/chain/:startPalId/:targetPalId", async (req, res) => {
    try {
      const startPalId = parseInt(req.params.startPalId);
      const targetPalId = parseInt(req.params.targetPalId);
      const allPals = await storage.getPals();
      const specialCombos = await storage.getSpecialCombos();
      
      const startPal = allPals.find(p => p.id === startPalId);
      const targetPal = allPals.find(p => p.id === targetPalId);
      
      if (!startPal || !targetPal) {
        return res.status(404).json({ message: "Pal not found" });
      }

      const paths: any[] = [];

      // Helper function to find compatible parents
      const findCompatibleParent = (pal1: any, target: any): any => {
        const targetPower = (pal1.breedingPower + target.breedingPower) / 2;
        return allPals.filter(p => 
          p.id !== pal1.id && 
          p.id !== target.id &&
          Math.abs(p.breedingPower - targetPower) < 150
        );
      };

      // Helper function to calculate breeding confidence
      const calculateConfidence = (parent1: any, parent2: any, child: any): number => {
        const avgPower = (parent1.breedingPower + parent2.breedingPower) / 2;
        const powerDiff = Math.abs(avgPower - child.breedingPower);
        return Math.max(0.1, 1 - (powerDiff / 200));
      };

      // Path 1: Direct breeding check
      const directParents = findCompatibleParent(startPal, targetPal);
      if (directParents.length > 0) {
        const bestParent = directParents[0];
        paths.push({
          steps: [{
            parent1: startPal.name,
            parent2: bestParent.name,
            child: targetPal.name,
            generation: 1,
            special: false,
            confidence: calculateConfidence(startPal, bestParent, targetPal)
          }],
          totalSteps: 1,
          successRate: Math.max(30, Math.round(100 - Math.abs(startPal.breedingPower - targetPal.breedingPower) / 2)),
          estimatedTime: "~10 minutes"
        });
      }

      // Check special combinations for target
      const targetSpecialCombo = specialCombos.find(combo => 
        combo.result.toLowerCase() === targetPal.name.toLowerCase()
      );
      
      if (targetSpecialCombo) {
        const parent1 = allPals.find(p => p.name.toLowerCase() === targetSpecialCombo.parent1.toLowerCase());
        const parent2 = allPals.find(p => p.name.toLowerCase() === targetSpecialCombo.parent2.toLowerCase());
        
        if (parent1 && parent2) {
          // Check if we can reach either parent from start
          const canReachParent1 = findCompatibleParent(startPal, parent1).length > 0;
          const canReachParent2 = findCompatibleParent(startPal, parent2).length > 0;
          
          if (canReachParent1 || canReachParent2) {
            const intermediateParent = canReachParent1 ? parent1 : parent2;
            const helperParent = findCompatibleParent(startPal, intermediateParent)[0];
            
            if (helperParent) {
              paths.push({
                steps: [
                  {
                    parent1: startPal.name,
                    parent2: helperParent.name,
                    child: intermediateParent.name,
                    generation: 1,
                    special: false,
                    confidence: calculateConfidence(startPal, helperParent, intermediateParent)
                  },
                  {
                    parent1: intermediateParent.name,
                    parent2: canReachParent1 ? parent2.name : parent1.name,
                    child: targetPal.name,
                    generation: 2,
                    special: true,
                    confidence: 0.9 // Special combos have high confidence
                  }
                ],
                totalSteps: 2,
                successRate: 75,
                estimatedTime: "~20 minutes"
              });
            }
          }
        }
      }

      // Path 2: Two-step through intermediate
      const intermediatePower = Math.round((startPal.breedingPower + targetPal.breedingPower) / 2);
      const intermediates = allPals.filter(p => 
        p.id !== startPal.id && 
        p.id !== targetPal.id &&
        Math.abs(p.breedingPower - intermediatePower) < 100
      );

      for (const intermediate of intermediates.slice(0, 3)) {
        const step1Parents = findCompatibleParent(startPal, intermediate);
        const step2Parents = findCompatibleParent(intermediate, targetPal);
        
        if (step1Parents.length > 0 && step2Parents.length > 0) {
          paths.push({
            steps: [
              {
                parent1: startPal.name,
                parent2: step1Parents[0].name,
                child: intermediate.name,
                generation: 1,
                special: intermediate.isRare,
                confidence: calculateConfidence(startPal, step1Parents[0], intermediate)
              },
              {
                parent1: intermediate.name,
                parent2: step2Parents[0].name,
                child: targetPal.name,
                generation: 2,
                special: targetPal.isRare,
                confidence: calculateConfidence(intermediate, step2Parents[0], targetPal)
              }
            ],
            totalSteps: 2,
            successRate: 45 + (intermediate.isRare ? 10 : 0),
            estimatedTime: "~25 minutes"
          });
        }
      }

      // Sort by success rate and confidence
      paths.sort((a, b) => {
        const aAvgConfidence = a.steps.reduce((acc: number, step: any) => acc + step.confidence, 0) / a.steps.length;
        const bAvgConfidence = b.steps.reduce((acc: number, step: any) => acc + step.confidence, 0) / b.steps.length;
        return (b.successRate * bAvgConfidence) - (a.successRate * aAvgConfidence);
      });

      res.json(paths.slice(0, 5)); // Return top 5 paths
    } catch (error) {
      console.error("Chain breeding error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reverse breeding calculator
  app.get("/api/breeding/reverse/:targetPalId", async (req, res) => {
    try {
      const targetPalId = parseInt(req.params.targetPalId);
      const allPals = await storage.getPals();
      const specialCombos = await storage.getSpecialCombos();
      
      const targetPal = allPals.find(p => p.id === targetPalId);
      if (!targetPal) {
        return res.status(404).json({ message: "Target Pal not found" });
      }

      const combinations: any[] = [];

      // Check special combinations first
      const specialCombo = specialCombos.find(combo => 
        combo.result.toLowerCase() === targetPal.name.toLowerCase()
      );
      
      if (specialCombo) {
        const parent1 = allPals.find(p => p.name.toLowerCase() === specialCombo.parent1.toLowerCase());
        const parent2 = allPals.find(p => p.name.toLowerCase() === specialCombo.parent2.toLowerCase());
        
        if (parent1 && parent2) {
          combinations.push({
            parent1: parent1.name,
            parent2: parent2.name,
            child: targetPal.name,
            special: true,
            parent1Power: parent1.breedingPower,
            parent2Power: parent2.breedingPower,
          });
        }
      }

      // Generate regular combinations based on breeding power
      const targetPower = targetPal.breedingPower;
      const suitableParents = allPals.filter(p => 
        p.id !== targetPalId && 
        p.breedingPower < targetPower + 200 && 
        p.breedingPower > Math.max(10, targetPower - 500)
      );

      // Generate combinations (simplified algorithm)
      for (let i = 0; i < Math.min(15, suitableParents.length); i++) {
        for (let j = i + 1; j < Math.min(i + 3, suitableParents.length); j++) {
          const parent1 = suitableParents[i];
          const parent2 = suitableParents[j];
          
          // Check if this combination could produce the target
          const avgPower = Math.round((parent1.breedingPower + parent2.breedingPower) / 2);
          const powerDiff = Math.abs(avgPower - targetPower);
          
          if (powerDiff < 100) { // Within reasonable range
            combinations.push({
              parent1: parent1.name,
              parent2: parent2.name,
              child: targetPal.name,
              special: false,
              parent1Power: parent1.breedingPower,
              parent2Power: parent2.breedingPower,
              confidence: Math.max(0.1, 1 - (powerDiff / 100))
            });
          }
        }
      }

      // Sort by confidence (special combos first, then by power proximity)
      combinations.sort((a, b) => {
        if (a.special && !b.special) return -1;
        if (!a.special && b.special) return 1;
        return (b.confidence || 0) - (a.confidence || 0);
      });

      res.json(combinations.slice(0, 20)); // Return top 20 combinations
    } catch (error) {
      console.error("Reverse breeding error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.pals.list.path, async (req, res) => {
    const pals = await storage.getPals();
    res.json(pals);
  });

  app.get(api.pals.get.path, async (req, res) => {
    const pal = await storage.getPal(Number(req.params.id));
    if (!pal) return res.status(404).json({ message: "Pal not found" });
    res.json(pal);
  });

  app.get(api.passives.list.path, async (req, res) => {
    const passives = await storage.getPassives();
    res.json(passives);
  });

  app.post(api.breeding.calculate.path, async (req, res) => {
    try {
      const input = api.breeding.calculate.input.parse(req.body);
      
      // 1. Get Parents
      const p1 = await storage.getPal(input.parent1Id);
      const p2 = await storage.getPal(input.parent2Id);
      
      if (!p1 || !p2) {
        return res.status(404).json({ message: "One or more parents not found" });
      }

      // 2. Determine Child Species
      let child: Pal | undefined;
      const specialCombos = await storage.getSpecialCombos();
      
      // Check special combos (bidirectional)
      const special = specialCombos.find(c => 
        (c.parent1 === p1.name && c.parent2 === p2.name) ||
        (c.parent1 === p2.name && c.parent2 === p1.name)
      );

      if (special) {
        const allPals = await storage.getPals();
        child = allPals.find(p => p.name === special.result);
      }
      
      if (!child) {
        // Use Breeding Power formula
        const targetPower = Math.floor((p1.breedingPower + p2.breedingPower + 1) / 2);
        const allPals = await storage.getPals();
        
        // Find closest breeding power
        // Sort by diff
        const sorted = [...allPals].sort((a, b) => {
          const diffA = Math.abs(a.breedingPower - targetPower);
          const diffB = Math.abs(b.breedingPower - targetPower);
          if (diffA === diffB) {
            // Tie breaker: Usually ID or Name. Using ID for consistency.
            return a.id - b.id; 
          }
          return diffA - diffB;
        });
        
        // Filter out Legends/Special if they can't be bred normally (usually they have power 10 and only breed with themselves)
        // For simplicity, we assume the sorted list logic holds.
        // Rule: Legends (Power 10) can only be bred from same parents. 
        // If calculated power is close to 10, it should NOT return a Legend unless parents are that legend.
        // We will skip "isRare" pals from the result unless it's a special combo (already checked) or parents are same species.
        
        if (p1.name === p2.name) {
             child = p1; // Same species = Same child (usually)
        } else {
             // Filter out rare pals from generic breeding
             const candidates = sorted.filter(p => !p.isRare);
             child = candidates[0] || sorted[0];
        }
      }

      if (!child) {
        return res.status(500).json({ message: "Could not determine child species" });
      }

      // 3. Calculate Probabilities
      // Based on community research and game data analysis:
      // Palworld uses a two-roll system:
      // 1. Inheritance Roll - determines how many passives come from parents
      // 2. Mutation Roll - fills remaining slots with random passives
      //
      // Accurate probability table from community testing:
      // 0 skills inherited: ~33% (child gets random/mutation only)
      // 1 skill inherited: ~31%
      // 2 skills inherited: ~20%
      // 3 skills inherited: ~10%
      // 4 skills inherited: ~6%
      //
      // Key finding: ~46% chance any single passive is inherited
      // When pool has exactly 4 unique skills, 10% chance to get all 4
      
      const uniquePassives = Array.from(new Set([...input.parent1Passives, ...input.parent2Passives])).filter(Boolean);
      const results: { passives: string[], probability: number }[] = [];
      
      function getCombinations(arr: string[], k: number) {
        const result: string[][] = [];
        function combo(start: number, current: string[]) {
          if (current.length === k) {
            result.push([...current]);
            return;
          }
          for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            combo(i + 1, current);
            current.pop();
          }
        }
        combo(0, []);
        return result;
      }

      // Updated weights based on community research and male parent bias
      const weights: Record<number, number> = {
        0: 0.30,  // 30% chance no passives inherited (reduced from 33%)
        1: 0.32,  // 32% chance 1 passive inherited
        2: 0.22,  // 22% chance 2 passives inherited
        3: 0.11,  // 11% chance 3 passives inherited
        4: 0.05   // 5% chance 4 passives inherited
      };
      
      // Special case: if exactly 4 unique passives in pool, 10% chance for perfect inheritance
      if (uniquePassives.length === 4) {
        results.push({ passives: [...uniquePassives], probability: 0.10 });
        
        // Remaining combinations for partial inheritance
        for (let k = 3; k >= 1; k--) {
          const combos = getCombinations(uniquePassives, k);
          // Distribute remaining probability accounting for perfect case
          const adjustedWeight = weights[k] * 0.9; // Reduce since perfect takes 10%
          const probPerCombo = adjustedWeight / combos.length;
          combos.forEach(c => {
            results.push({ passives: c, probability: probPerCombo });
          });
        }
        
        // Mutation/random case
        results.push({ passives: ["(Random/Mutation)"], probability: weights[0] });
      } else {
        // Standard case: distribute probabilities across combinations
        let coveredProb = weights[0]; // Start with 0-inheritance probability
        
        for (let k = 1; k <= 4; k++) {
          if (k > uniquePassives.length) continue;
          
          const combos = getCombinations(uniquePassives, k);
          const probPerCombo = weights[k] / combos.length;
          
          combos.forEach(c => {
            results.push({ passives: c, probability: probPerCombo });
          });
          coveredProb += weights[k];
        }
        
        // Add mutation/random case (accounts for 0-inheritance + any remaining probability)
        results.push({ passives: ["(Random/Mutation)"], probability: weights[0] });
      }
      
      // Sort by probability desc
      results.sort((a, b) => b.probability - a.probability);

      res.json({
        child,
        probabilities: results.slice(0, 20) // Top 20 results
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Best builds endpoint
  const allBuilds = [
    // Combat Builds
    {
      name: "Ultimate Attacker",
      category: "combat" as const,
      description: "Maximizes raw damage output for taking down bosses and tough enemies quickly.",
      passives: ["Legend", "Ferocious", "Musclehead", "Brave"],
      recommendedPals: ["Jetragon", "Shadowbeak", "Necromus", "Astegon"]
    },
    {
      name: "Elemental Fire Master",
      category: "combat" as const,
      description: "Specializes in fire damage for burning through enemies weak to fire.",
      passives: ["Legend", "Ferocious", "Flame Emperor", "Brave"],
      recommendedPals: ["Blazehowl", "Kitsun", "Bushi", "Incineram"]
    },
    {
      name: "Electric Storm",
      category: "combat" as const,
      description: "Electric-focused build for shocking enemies and high single-target damage.",
      passives: ["Legend", "Ferocious", "Lord of Lightning", "Swift"],
      recommendedPals: ["Orserk", "Grizzbolt", "Univolt", "Sparkit"]
    },
    {
      name: "Tanky Defender",
      category: "combat" as const,
      description: "High survivability build for Pals that need to take hits.",
      passives: ["Legend", "Burly Body", "Hard Skin", "Diet Lover"],
      recommendedPals: ["Paladius", "Anubis", "Penking", "Grizzbolt"]
    },
    {
      name: "Dark Assassin",
      category: "combat" as const,
      description: "Dark-type focused build for devastating shadow attacks.",
      passives: ["Legend", "Ferocious", "Lord of the Underworld", "Swift"],
      recommendedPals: ["Shadowbeak", "Necromus", "Astegon", "Katress"]
    },
    // Base Builds
    {
      name: "Master Crafter",
      category: "base" as const,
      description: "Maximum work speed for crafting and production tasks.",
      passives: ["Artisan", "Serious", "Lucky", "Workaholic"],
      recommendedPals: ["Anubis", "Cattiva", "Lamball", "Lifmunk"]
    },
    {
      name: "Efficient Worker",
      category: "base" as const,
      description: "Balanced work speed with reduced food consumption.",
      passives: ["Artisan", "Serious", "Diet Lover", "Dainty Eater"],
      recommendedPals: ["Anubis", "Cattiva", "Tanzee", "Robinquill"]
    },
    {
      name: "Tireless Laborer",
      category: "base" as const,
      description: "Works all day without getting stressed or hungry.",
      passives: ["Artisan", "Workaholic", "Positive Thinker", "Diet Lover"],
      recommendedPals: ["Anubis", "Cattiva", "Lifmunk", "Tanzee"]
    },
    {
      name: "Production Powerhouse",
      category: "base" as const,
      description: "Pure work speed focus for maximum output.",
      passives: ["Artisan", "Serious", "Work Slave", "Lucky"],
      recommendedPals: ["Anubis", "Cattiva", "Lamball", "Mozzarina"]
    },
    // Mount Builds
    {
      name: "Speed Demon",
      category: "mount" as const,
      description: "Maximum speed for getting around the map quickly.",
      passives: ["Swift", "Runner", "Nimble", "Legend"],
      recommendedPals: ["Jetragon", "Frostallion", "Fenglope", "Univolt"]
    },
    {
      name: "Long Distance Runner",
      category: "mount" as const,
      description: "High stamina for extended travel without stopping.",
      passives: ["Swift", "Runner", "Diet Lover", "Workaholic"],
      recommendedPals: ["Jetragon", "Frostallion", "Fenglope", "Arsox"]
    },
    {
      name: "Combat Mount",
      category: "mount" as const,
      description: "Fast movement with combat capability for hit-and-run tactics.",
      passives: ["Swift", "Legend", "Ferocious", "Runner"],
      recommendedPals: ["Jetragon", "Necromus", "Paladius", "Shadowbeak"]
    },
    {
      name: "Explorer's Choice",
      category: "mount" as const,
      description: "Balanced speed and defense for safe exploration.",
      passives: ["Swift", "Runner", "Burly Body", "Diet Lover"],
      recommendedPals: ["Fenglope", "Univolt", "Arsox", "Kitsun"]
    }
  ];

  app.get(api.builds.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    
    if (category && ['combat', 'base', 'mount'].includes(category)) {
      const filtered = allBuilds.filter(b => b.category === category);
      return res.json(filtered);
    }
    
    res.json(allBuilds);
  });

  return httpServer;
}
