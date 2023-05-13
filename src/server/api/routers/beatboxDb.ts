import { CategoryType, VoteType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { isCategory } from "~/utils/helpers";

export const beatboxDb = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getBeatboxSounds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.beatboxSound.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        tutorials: {
          select: {
            id: true,
            name: true,
            url: true,
            TutorialVotes: { select: { voteType: true, userId: true } },
          },
        },
      },
    });
  }),

  getBeatboxSound: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.beatboxSound.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          tutorials: {
            select: {
              id: true,
              name: true,
              url: true,
              TutorialVotes: { select: { voteType: true, userId: true } },
            },
          },
        },
      });
    }),

  getBeatboxSoundByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.beatboxSound.findFirst({
        where: { name: input.name },
        select: {
          id: true,
          name: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          tutorials: {
            select: {
              createdAt: true,
              updatedAt: true,
              id: true,
              name: true,
              url: true,
              TutorialVotes: {
                select: {
                  userId: true,
                  createdAt: true,
                  updatedAt: true,
                  voteType: true,
                },
              },
            },
          },
        },
      });
    }),

  getTutorials: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tutorial.findMany();
  }),

  getTutorial: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.tutorial.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          url: true,
          TutorialVotes: { select: { voteType: true, userId: true } },
        },
      });
    }),

  getBeatboxSoundsByCategory: publicProcedure
    .input(z.object({ category: z.nativeEnum(CategoryType) }))
    .query(({ input, ctx }) => {
      return ctx.prisma.beatboxSound.findMany({
        where: {
          category: input.category,
        },
      });
    }),

  getGroupBeatboxSoundsByCategory: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.beatboxSound.groupBy({
      by: ["category"],
    });
  }),

  addTutorial: protectedProcedure
    .input(
      z.object({ name: z.string().trim().min(1), url: z.string().trim().url() })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tutorial.create({
        data: {
          name: input.name,
          url: input.url,
        },
      });
    }),

  addTutorialToBeatboxSound: protectedProcedure
    .input(z.object({ tutorialId: z.number(), beatboxSoundId: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.beatboxSound.update({
        where: { id: input.beatboxSoundId },
        data: {
          tutorials: {
            connect: {
              id: input.tutorialId,
            },
          },
        },
      });
    }),

  addBeatboxSound: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        category: z.nativeEnum(CategoryType),
        // z.url() ?
        tutorials: z.array(z.string().trim().url()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.beatboxSound.create({
        data: {
          name: input.name,
          category: input.category,
          tutorials: {
            create: input.tutorials.map((tutorial) => ({
              name: input.name,
              url: tutorial,
            })),
          },
        },
      });
    }),

  searchBeatboxSounds: publicProcedure
    .input(
      z.object({
        search: z.string().trim().optional(),
        categoryFilter: z.nativeEnum(CategoryType).optional(),
      })
    )
    .query(({ input, ctx }) => {
      return input.search !== undefined || input.categoryFilter !== undefined
        ? ctx.prisma.beatboxSound.findMany({
            select: {
              id: true,
              name: true,
              category: true,
              tutorials: true,
              createdAt: true,
              updatedAt: true,
              userId: true,
            },
            where: {
              OR: [
                {
                  category: input.categoryFilter,
                },
                {
                  name: {
                    contains: input.search,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    in: isCategory(input.search) ? [input.search] : [],
                  },
                },
              ],
            },
          })
        : ctx.prisma.beatboxSound.findMany({
            select: {
              id: true,
              name: true,
              category: true,
              tutorials: true,
              createdAt: true,
              updatedAt: true,
              userId: true,
            },
          });
    }),

  upvoteTutorial: protectedProcedure
    .input(z.object({ tutorialId: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tutorialVote.update({
        where: { id: input.tutorialId },
        data: {
          userId: ctx.session.user.id,
          voteType: VoteType.UP,
        },
      });
    }),

  getTutorialVotes: publicProcedure
    .input(z.object({ tutorialId: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.tutorialVote.findMany({
        where: { tutorialId: input.tutorialId },
      });
    }),
});
