"use-client";

import { VoteType } from "@prisma/client";
import { Tutorial2 } from "./Tutorial2";

export type TutorialWithVotesType = {
  name: string;
  url: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  TutorialVotes: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    voteType: VoteType;
  }[];
};

export type TutorialListProps = {
  tutorials?: TutorialWithVotesType[];
  isLoading: boolean;
};

export const TutorialList = ({ tutorials, isLoading }: TutorialListProps) => {
  const sortedTutorials = tutorials?.sort((a, b) => {
    const aVotes = a.TutorialVotes.reduce(
      (acc, curr) => acc + (curr.voteType === "UP" ? 1 : -1),
      0
    );
    const bVotes = b.TutorialVotes.reduce(
      (acc, curr) => acc + (curr.voteType === "UP" ? 1 : -1),
      0
    );
    return bVotes - aVotes;
  });

  return (
    <div className="m-8 flex w-full max-w-2xl flex-col gap-8 border-2 border-black px-8 pb-8">
      <h2 className="mt-2 text-center text-2xl font-bold text-black">
        Tutorials
      </h2>
      {isLoading || !tutorials ? (
        <div>{"Loading..."}</div>
      ) : sortedTutorials?.length ? (
        sortedTutorials.map((tutorial, i) => (
          <Tutorial2 key={`${tutorial.id}`} tutorial={tutorial} />
        ))
      ) : (
        <div>{"No tutorials :("}</div>
      )}
    </div>
  );
};
