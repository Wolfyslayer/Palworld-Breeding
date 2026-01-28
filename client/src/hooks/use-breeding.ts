import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type BreedingResult, type ProbabilityResult } from "@shared/routes";
import { z } from "zod";

// Types
export type Pal = z.infer<typeof api.pals.list.responses[200]>[number];
export type Passive = z.infer<typeof api.passives.list.responses[200]>[number];
export type CalculationResponse = z.infer<typeof api.breeding.calculate.responses[200]>;

// === PALS ===
export function usePals() {
  return useQuery({
    queryKey: [api.pals.list.path],
    queryFn: async () => {
      const res = await fetch(api.pals.list.path);
      if (!res.ok) throw new Error("Failed to fetch pals");
      return api.pals.list.responses[200].parse(await res.json());
    },
  });
}

export function usePal(id: number | null) {
  return useQuery({
    queryKey: [api.pals.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      // Manually replace :id since we don't have the buildUrl helper imported here yet
      const url = api.pals.get.path.replace(":id", id.toString());
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch pal");
      return api.pals.get.responses[200].parse(await res.json());
    },
  });
}

// === PASSIVES ===
export function usePassives() {
  return useQuery({
    queryKey: [api.passives.list.path],
    queryFn: async () => {
      const res = await fetch(api.passives.list.path);
      if (!res.ok) throw new Error("Failed to fetch passives");
      return api.passives.list.responses[200].parse(await res.json());
    },
  });
}

// === BREEDING CALCULATION ===
type CalculateInput = z.infer<typeof api.breeding.calculate.input>;

export function useCalculateBreeding() {
  return useMutation({
    mutationFn: async (data: CalculateInput) => {
      const res = await fetch(api.breeding.calculate.path, {
        method: api.breeding.calculate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Calculation failed");
      }
      
      return api.breeding.calculate.responses[200].parse(await res.json());
    },
  });
}
