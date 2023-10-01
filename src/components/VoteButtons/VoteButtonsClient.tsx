"use client";

// import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { usePrevious } from "@mantine/hooks";
import { VoteType, TutorialVote } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
// import { toast } from "../../hooks/use-toast";
// import { Button } from "../ui/Button";
import { Triangle } from "lucide-react";
import { cn } from "~/utils/helpers";
import { api } from "~/utils/api";

type VoteWithId = Pick<TutorialVote, "voteType"> & { id: number | undefined };

interface VoteButtonsClientProps {
  tutorialId: number;
  initialVotesAmt: number;
  initialVote?: VoteWithId | null;
}

const VoteButtonsClient = ({
  tutorialId,
  initialVotesAmt,
  initialVote,
}: VoteButtonsClientProps) => {
  // const { loginToast } = useCustomToasts();
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  console.log({ currentVote, initialVote });

  const prevVote = usePrevious(currentVote);

  // ensure sync with server
  useEffect(() => {
    if (!currentVote) setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = api.beatboxDb.mutateTutorialVote.useMutation({
    // mutationFn: async (variables) => {
    //   return variables.voteType === "UP" ? "UP" : "DOWN";
    // },
    onError: (err, variables) => {
      if (variables.voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      // if (err instanceof AxiosError) {
      //   if (err.response?.status === 401) {
      //     return loginToast();
      //   }
      // }

      // return toast({
      //   title: "Something went wrong.",
      //   description: "Your vote was not registered. Please try again.",
      //   variant: "destructive",
      // });
    },
    onMutate: (variables) => {
      const type = variables.voteType;
      setCurrentVote((currentVote) => {
        if (currentVote?.voteType === type) {
          // User is voting the same way again, so remove their vote
          if (type === "UP") setVotesAmt((prev) => prev - 1);
          else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
          return null;
        } else {
          // User is voting in the opposite direction, so subtract 2
          if (type === "UP")
            setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
          else if (type === "DOWN")
            setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
          return { id: currentVote?.id, voteType: type };
        }
      });
    },
  });

  return (
    <div className="flex flex-col py-4 pr-6 sm:w-20 sm:gap-0 sm:pb-0">
      {/* upvote */}
      <button
        onClick={() =>
          vote({ voteType: "UP", tutorialId, voteId: currentVote?.id })
        }
        // size="sm"
        // variant="ghost"
        aria-label="upvote"
      >
        <Triangle
          className={cn("h-5 w-5 text-black", {
            "fill-emerald-500 text-emerald-500": currentVote?.voteType === "UP",
          })}
        />
      </button>

      {/* score */}
      <p className="text-center text-sm font-medium text-zinc-900">
        {votesAmt}
      </p>

      {/* downvote */}
      <button
        onClick={() =>
          vote({ voteType: "DOWN", tutorialId, voteId: currentVote?.id })
        }
        // size="sm"
        className={cn({
          "text-emerald-500": currentVote?.voteType === "DOWN",
        })}
        // variant="ghost"
        aria-label="downvote"
      >
        <Triangle
          className={cn("h-5 w-5 rotate-180", {
            "fill-red-500 text-red-500": currentVote?.voteType === "DOWN",
          })}
        />
      </button>
    </div>
  );
};

export default VoteButtonsClient;
