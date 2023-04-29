import { createTRPCRouter } from "~/server/api/trpc";
import { beatboxDb } from "~/server/api/routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  beatboxDb,
});

// export type definition of API
export type AppRouter = typeof appRouter;
