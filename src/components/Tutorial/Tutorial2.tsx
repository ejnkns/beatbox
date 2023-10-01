"use-client";

import { VoteType } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { TutorialWithVotesType } from "./TutorialList";
import { VoteButtons } from "../VoteButtons/VoteButtons";
import { useSession } from "next-auth/react";
import {
  addTutorialVote,
  deleteTutorialVote,
  updateTutorialVote,
} from "~/server/api/routers/beatboxDb.utils";
import VoteButtonsClient from "../VoteButtons/VoteButtonsClient";
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

  // const [userVote, setUserVote] = useState<{
  //   id: number;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   userId: string;
  //   voteType: VoteType;
  // }>();
  // const { data: tutorialVotes } = api.beatboxDb.getTutorialVotes.useQuery({
  //   tutorialId: tutorial.id,
  // });
  const tutorialVotes = tutorial.TutorialVotes;
  const userVote = tutorialVotes?.find(
    (tutorialVote) => tutorialVote.userId === userId
  );

  // useEffect(() => {
  //   setUserVote(
  //     tutorialVotes?.find((tutorialVote) => tutorialVote.userId === userId)
  //   );
  // }, [tutorialVotes, userId]);

  const upvotesCount = tutorialVotes?.filter(
    (tutorialVote) => tutorialVote.voteType === VoteType.UP
  ).length;
  const downvotesCount = tutorialVotes?.filter(
    (tutorialVote) => tutorialVote.voteType === VoteType.DOWN
  ).length;
  const totalVotes = upvotesCount - downvotesCount;

  console.log({ upvotesCount, downvotesCount, totalVotes });

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
        {/* <VoteButtons
          // key={`${userVote?.voteType}-${tutorial.id}-${totalVotes}`}
          onVote={handleVote}
          totalVotes={totalVotes}
          userVote={userVote?.voteType}
        /> */}
        <VoteButtonsClient
          tutorialId={tutorial.id}
          initialVotesAmt={totalVotes || 0}
          initialVote={userVote}
        />
      </div>
    </div>
  );
};
