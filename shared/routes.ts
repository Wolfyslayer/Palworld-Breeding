import { z } from 'zod';
import { pals, passives } from './schema';

export const BuildSchema = z.object({
  name: z.string(),
  category: z.enum(['combat', 'base', 'mount']),
  description: z.string(),
  passives: z.array(z.string()),
  recommendedPals: z.array(z.string()),
});

export type Build = z.infer<typeof BuildSchema>;

export const api = {
  pals: {
    list: {
      method: 'GET' as const,
      path: '/api/pals',
      responses: {
        200: z.array(z.custom<typeof pals.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/pals/:id',
      responses: {
        200: z.custom<typeof pals.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  passives: {
    list: {
      method: 'GET' as const,
      path: '/api/passives',
      responses: {
        200: z.array(z.custom<typeof passives.$inferSelect>()),
      },
    },
  },
  breeding: {
    calculate: {
      method: 'POST' as const,
      path: '/api/breeding/calculate',
      input: z.object({
        parent1Id: z.number(),
        parent2Id: z.number(),
        parent1Passives: z.array(z.string()).max(4),
        parent2Passives: z.array(z.string()).max(4),
      }),
      responses: {
        200: z.object({
          child: z.custom<typeof pals.$inferSelect>(),
          probabilities: z.array(z.object({
            passives: z.array(z.string()),
            probability: z.number(),
          })),
        }),
        400: z.object({ message: z.string() }),
      },
    },
  },
  builds: {
    list: {
      method: 'GET' as const,
      path: '/api/builds',
      input: z.object({
        category: z.enum(['combat', 'base', 'mount']).optional(),
      }).optional(),
      responses: {
        200: z.array(BuildSchema),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
