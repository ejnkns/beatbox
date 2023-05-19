import { useState } from "react";
import { Tutorial } from "./Tutorial";
import {
  Tutorial as TutorialType,
  TutorialVote,
  User,
  VoteType,
} from "@prisma/client";

export type TutorialWithVotesType = {
  url: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  TutorialVotes: {
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    voteType: VoteType;
  }[];
};

export type TutorialListProps = {
  tutorials?: TutorialWithVotesType[];
  isLoading: boolean;
  initialUserVotes?: {
    [key: number]: VoteType;
  };
};

export const TutorialList = ({
  tutorials,
  isLoading,
  initialUserVotes,
}: TutorialListProps) => {
  const [userVotes, setUserVotes] = useState(initialUserVotes);

  const handleVote = (id: string, type: VoteType) => {
    setUserVotes((currentUserVotes) => ({
      ...currentUserVotes,
      [id]: type,
    }));
  };

  return (
    <div className="m-8 flex w-full max-w-2xl flex-col gap-8 border-2 border-black px-8 pb-8">
      <h2 className="mt-2 text-center text-2xl font-bold text-black">
        Tutorials
      </h2>
      {isLoading || !tutorials ? (
        <div>{`Loading...`}</div>
      ) : tutorials.length ? (
        tutorials.map((tutorial, i) => (
          <Tutorial key={`${tutorial}-${i}`} tutorial={tutorial} />
        ))
      ) : (
        <div>{`No tutorials :(`}</div>
      )}
    </div>
  );
};
