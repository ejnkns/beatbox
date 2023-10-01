"use client";

import { Button } from "../Controls/Button";
import { VoteType } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import debounce from "lodash.debounce";

export const VoteButtons = ({
  onVote,
  totalVotes,
  userVote,
  reset,
}: {
  onVote: (voteType: VoteType | undefined) => void;
  totalVotes?: number;
  userVote?: VoteType;
  reset?: boolean;
}) => {
  const [selected, setSelected] = useState<VoteType | undefined>(userVote);
  const [total, setTotal] = useState(totalVotes);

  useEffect(() => {
    setSelected(userVote);
    setTotal(totalVotes);
  }, [userVote, reset, totalVotes]);

  const handleVote = (voteType?: VoteType) => {
    if (voteType === VoteType.UP) {
      const shouldIncrement = selected !== VoteType.UP;
      setSelected(shouldIncrement ? VoteType.UP : undefined);
      setTotal((total) => (total || 0) + (shouldIncrement ? 1 : -1));
      debounceHandleVote(shouldIncrement ? VoteType.UP : undefined);
    }

    if (voteType === VoteType.DOWN) {
      const shouldIncrement = selected !== VoteType.DOWN;
      setSelected(shouldIncrement ? VoteType.DOWN : undefined);
      setTotal((total) => (total || 0) + (shouldIncrement ? -1 : 1));
      debounceHandleVote(shouldIncrement ? VoteType.DOWN : undefined);
    }
  };
  const debounceHandleVote = useCallback(debounce(onVote, 800), []);

  return (
    <div className="m-2 flex w-12 flex-col items-center justify-center ">
      <Button
        className={`w-full !bg-blue-500 opacity-50 ${
          selected === VoteType.UP ? "h-8 opacity-100" : ""
        }`}
        onClick={() => {
          handleVote(VoteType.UP);
        }}
      />
      <div className="flex w-full items-center justify-center border-x-2 border-black bg-indigo-200 bg-opacity-50 text-center backdrop-blur-lg">
        <span className="text-md font-bold ">
          {`${total === undefined ? "?" : total}`}
        </span>
      </div>
      <Button
        className={`w-full !bg-red-500 opacity-50 ${
          selected === VoteType.DOWN ? "h-8 !opacity-100" : ""
        }`}
        onClick={() => {
          handleVote(VoteType.DOWN);
        }}
      />
    </div>
  );
};
