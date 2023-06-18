import { VoteType } from "@prisma/client";
import { TutorialWithVotesType } from "~/components/Tutorial/TutorialList";

type TutorialVoteMutationVariables = {
  voteType: VoteType;
  tutorialId: number;
  operation: string;
  voteId?: number | undefined;
};

export const updateTutorialVote = (
  tutorial: TutorialWithVotesType,
  newVoteMutation: TutorialVoteMutationVariables
) => {
  return {
    ...tutorial,
    TutorialVotes: tutorial.TutorialVotes.map((vote) =>
      vote.id === newVoteMutation.voteId
        ? { ...vote, voteType: newVoteMutation.voteType }
        : vote
    ),
  };
};

export const addTutorialVote = (
  tutorial: TutorialWithVotesType,
  newVoteMutation: TutorialVoteMutationVariables,
  userId?: string
) => {
  if (!userId) return tutorial;
  return {
    ...tutorial,
    TutorialVotes: [
      ...tutorial.TutorialVotes,
      {
        id: newVoteMutation.voteId || 0,
        voteType: newVoteMutation.voteType,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
};

export const deleteTutorialVote = (
  tutorial: TutorialWithVotesType,
  newVoteMutation: TutorialVoteMutationVariables
) => {
  return {
    ...tutorial,
    TutorialVotes: tutorial.TutorialVotes.filter(
      (vote) => vote.id !== newVoteMutation.voteId
    ),
  };
};
