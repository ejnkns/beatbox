import { TutorialVote, VoteType } from "@prisma/client";
import { TutorialWithVotesType } from "~/components/Tutorial/TutorialList";

type TutorialVoteMutationVariables = {
  voteType: VoteType;
  tutorialId: number;
  operation: string;
  voteId?: number | undefined;
};

export const updateTutorialVote = (
  tutorialVote: TutorialVote,
  newVoteMutation: TutorialVoteMutationVariables
): TutorialVote => {
  return {
    ...tutorialVote,
    voteType: newVoteMutation.voteType,
  };
};

export const addTutorialVote = (
  tutorialVote: TutorialVote,
  newVoteMutation: TutorialVoteMutationVariables,
  userId?: string
): TutorialVote => {
  if (!userId) return tutorialVote;
  return {
    ...tutorialVote,
    voteType: newVoteMutation.voteType,
    userId,
  };
};

export const deleteTutorialVote = (
  tutorialVote: TutorialVote,
  newVoteMutation: TutorialVoteMutationVariables
): TutorialVote => {
  return {
    ...tutorialVote,
  };
};
