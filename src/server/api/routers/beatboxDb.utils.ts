import { TutorialWithVotesType } from "~/components/Tutorial/TutorialList";

export const updateTutorialVotes = (
  tutorial: TutorialWithVotesType,
  newVoteMutation: {
    voteType: "UP" | "DOWN";
    tutorialId: number;
    operation: string;
    voteId?: number | undefined;
  }
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

export const deleteTutorialVote = (
  tutorial: TutorialWithVotesType,
  newVoteMutation: {
    voteType: "UP" | "DOWN";
    tutorialId: number;
    operation: string;
    voteId?: number | undefined;
  }
) => {
  return {
    ...tutorial,
    TutorialVotes: tutorial.TutorialVotes.filter(
      (tutorialVote) => tutorialVote.id !== newVoteMutation.voteId
    ),
  };
};
