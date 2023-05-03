/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
// export const trpc = createTRPCNext<AppRouter>({
//   config(opts) {
//     return {
//       transformer: superjson,
//       links: [
//         loggerLink({
//           enabled: (opts) =>
//             process.env.NODE_ENV === "development" ||
//             (opts.direction === "down" && opts.result instanceof Error),
//         }),
//         httpBatchLink({
//           url: `${getBaseUrl()}/api/trpc`,
//         }),
//       ],
//     };
//   },
//   /**
//    * @link https://trpc.io/docs/ssr
//    **/
//   ssr: false,
// });
// export const api = createTRPCNext<AppRouter>({
//   config: (opts) => {
//     if (typeof window !== "undefined") {
//       return {
//         transformer: superjson,
//         links: [
//           httpBatchLink({
//             url: "/api/trpc",
//           }),
//         ],
//       };
//     }
//     const url = process.env.VERCEL_URL
//       ? `https://${process.env.VERCEL_URL}/api/trpc`
//       : "http://localhost:3000/api/trpc";
//     return {
//       transformer: superjson,
//       links: {
//         httpBatchLink({
//           url: lurl,
//         }),
//       },
//     };
//   },
//   ssr: true,
//   responseMeta(opts) {
//     const { clientErrors } = opts;
//     const firstClientError = clientErrors?.[0];
//     if (firstClientError) {
//       // propagate http first error from API calls
//       return {
//         status: firstClientError.data?.httpStatus ?? 500,
//       };
//     }
//     // cache request for 1 day + revalidate once every second
//     const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
//     return {
//       headers: {
//         "cache-control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
//       },
//     };
//   },
// });

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: true,
  responseMeta(opts) {
    const { clientErrors } = opts;
    const firstClientError = clientErrors?.[0];
    if (firstClientError) {
      // propagate http first error from API calls
      return {
        status: firstClientError.data?.httpStatus ?? 500,
      };
    }
    // cache full page for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      "Cache-Control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
