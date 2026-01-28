import { useQuery } from "@tanstack/react-query";
import { api, type Build } from "@shared/routes";

export type { Build };

export function useBuilds(category?: 'combat' | 'base' | 'mount') {
  const queryKey = category 
    ? [api.builds.list.path, category] 
    : [api.builds.list.path];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = category 
        ? `${api.builds.list.path}?category=${category}` 
        : api.builds.list.path;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch builds");
      return api.builds.list.responses[200].parse(await res.json()) as Build[];
    },
  });
}
