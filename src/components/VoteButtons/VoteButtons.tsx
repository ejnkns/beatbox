import { api } from "~/utils/api";
import { Button } from "../Controls/Button";
import { TutorialVote, VoteType } from "@prisma/client";
import { useState } from "react";

export const VoteButtons = ({
  onVote,
  totalVotes,
  userVote,
}: {
  onVote: (voteType: VoteType) => void;
  totalVotes?: number;
  userVote?: VoteType;
}) => {
  const [selected, setSelected] = useState<VoteType | undefined>(userVote);

  return (
    <div className="m-2 flex w-12 flex-col items-center justify-center ">
      <Button
        className="h-2 w-full !bg-blue-500"
        selected={selected === VoteType.UP}
        onClick={() => {
          setSelected(VoteType.UP);
          onVote(VoteType.UP);
        }}
      />
      <div className="flex w-full items-center justify-center border-x-2 border-black bg-indigo-200 bg-opacity-50 text-center backdrop-blur-lg">
        <span className="text-md font-bold ">
          {`${totalVotes === undefined ? "?" : totalVotes}`}
        </span>
      </div>
      <Button
        selected={selected === VoteType.DOWN}
        className="h-2 w-full bg-red-500"
        onClick={() => {
          setSelected(VoteType.UP);
          onVote(VoteType.DOWN);
        }}
      />
    </div>
  );
};
