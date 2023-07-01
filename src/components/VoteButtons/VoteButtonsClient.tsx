"use client";

import { Button } from "../Controls/Button";
import { VoteType } from "@prisma/client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

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
        className={`w-full !bg-blue-500 opacity-50 ${
          selected === VoteType.UP ? "h-8 opacity-100" : ""
        }`}
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
        className={`w-full !bg-red-500 opacity-50 ${
          selected === VoteType.DOWN ? "h-8 !opacity-100" : ""
        }`}
        onClick={() => {
          setSelected(VoteType.DOWN);
          onVote(VoteType.DOWN);
        }}
      />
    </div>
  );
};
