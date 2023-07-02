import { VoteType } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { TutorialWithVotesType } from "./TutorialList";
import { VoteButtons } from "../VoteButtons/VoteButtonsClient";
import { useSession } from "next-auth/react";
import {
  addTutorialVote,
  deleteTutorialVote,
  updateTutorialVote,
} from "~/server/api/routers/beatboxDb.utils";
const ReactPlayer = dynamic(() => import("react-player/lazy"));

export const Tutorial2 = ({
  tutorial,
}: {
  tutorial: TutorialWithVotesType;
}) => {
  const [channel, setChannel] = useState("");

  const { data: sessionData } = useSession();
  // TODO: figure out a better way to do this
  const userId = sessionData?.user.id;
  console.log(userId);

  useEffect(() => {
    fetch(`https://noembed.com/embed?dataType=json&url=${tutorial.url}`)
      .then((res) => res.json())
      .then((data) => {
        setChannel(data.author_name);
      });
  }, [tutorial.url]);

  const [userVote, setUserVote] = useState<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    voteType: VoteType;
  }>();
  const { data: tutorialVotes } = api.beatboxDb.getTutorialVotes.useQuery({
    tutorialId: tutorial.id,
  });

  useEffect(() => {
    if (Array.isArray(tutorialVotes)) {
      setUserVote(
        tutorialVotes?.find((tutorialVote) => tutorialVote.userId === userId)
      );
    }
    // const userVoteType = userVote?.voteType;
  }, [tutorialVotes, userId]);

  const utils = api.useContext();

  const mutateVote = api.beatboxDb.mutateTutorialVote.useMutation({
    async onMutate(newVoteMutation) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.beatboxDb.getTutorialVotes.cancel();

      // Get the data from the queryCache
      const prevData = utils.beatboxDb.getTutorialVotes.getData();

      // Optimistically update the data with our new post
      utils.beatboxDb.getTutorialVotes.setData(
        { tutorialId: tutorial.id },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            tutorials: old.map((tutorialVote) => {
              if (tutorialVote.id === newVoteMutation.tutorialId) {
                if (newVoteMutation.operation === "update") {
                  // return updateTutorialVote(tutorialVote, newVoteMutation);
                } else if (newVoteMutation.operation === "add") {
                  // return addTutorialVote(tutorialVote, newVoteMutation, userId);
                } else if (newVoteMutation.operation === "delete") {
                  return {};
                }
              }
              return tutorialVote;
            }),
          };
        }
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newVoteMutation, ctx) {
      // If the mutation fails, use the context-value from onMutate
      if (ctx) {
        utils.beatboxDb.getTutorialVotes.setData(
          { tutorialId: tutorial.id },
          ctx.prevData
        );
      }
    },
    onSettled() {
      // Sync with server once mutation has settled
      utils.beatboxDb.getBeatboxSoundByName.invalidate();
    },
  });

  if (!Array.isArray(tutorialVotes)) {
    return null;
  }

  const upvotesCount = tutorialVotes?.filter(
    (tutorialVote) => tutorialVote.voteType === VoteType.UP
  ).length;
  const downvotesCount = tutorialVotes?.filter(
    (tutorialVote) => tutorialVote.voteType === VoteType.DOWN
  ).length;
  const totalVotes =
    upvotesCount && downvotesCount && upvotesCount - downvotesCount;

  const handleVote = (voteType?: VoteType) => {
    if (!voteType) return;
    if (userVote?.voteType) {
      if (userVote.voteType !== voteType) {
        mutateVote.mutate({
          tutorialId: tutorial.id,
          voteId: userVote.id,
          voteType,
          operation: "update",
        });
        return;
      }
      mutateVote.mutate({
        tutorialId: tutorial.id,
        voteId: userVote.id,
        voteType,
        operation: "delete",
      });
      return;
    }
    mutateVote.mutate({
      tutorialId: tutorial.id,
      voteType,
      operation: "add",
    });
    return;
  };

  // const beatboxSoundQuery = api.beatboxDb.getBeatboxSoundByName.useQuery({
  //   name: tutorial.name,
  // });

  return (
    <div className="flex flex-col border-2 border-black bg-indigo-200 bg-opacity-50 backdrop-blur-lg">
      {tutorial.url && (
        <div className="flex">
          <ReactPlayer
            url={tutorial.url}
            title={tutorial.name}
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">Loading...</div>
              </div>
            }
          />
        </div>
      )}
      <div className=" flex flex-row justify-between gap-2 border-t-2 border-black bg-indigo-200 bg-opacity-50 backdrop-blur-lg ">
        <h3 className="mt-2 p-2 text-xl font-bold">{channel}</h3>
        {/* <p className="mt-2 p-2 text-xl font-bold">{title}</p> */}
        <VoteButtons
          // key={`${userVote?.voteType}-${tutorial.id}-${totalVotes}`}
          onVote={handleVote}
          totalVotes={totalVotes}
          userVote={userVote?.voteType}
        />
      </div>
    </div>
  );
};
