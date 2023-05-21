import {
  Tutorial as TutorialType,
  TutorialVote,
  VoteType,
} from "@prisma/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { beatboxDb } from "~/server/api/routers/beatboxDb";
import superjson from "superjson";
import { api } from "~/utils/api";
import { TutorialListProps, TutorialWithVotesType } from "./TutorialList";
import { Button } from "../Controls/Button";
import { VoteButtons } from "../VoteButtons/VoteButtons";
import { useSession } from "next-auth/react";
const ReactPlayer = dynamic(() => import("react-player/lazy"));

// export async function getServerSideProps(
//   context: GetServerSidePropsContext<{ id: string }>
// ) {
//   const helpers = createServerSideHelpers({
//     router: beatboxDb,
//     ctx: {},
//     transformer: superjson, // optional - adds superjson serialization
//   });
//   const id = Number(context.params?.id);
//   // // check if post exists - `prefetch` doesn't change its behavior
//   // // based on the result of the query (including throws), so if we
//   // // want to change the logic here in gSSP, we need to use `fetch`.
//   // const postExists = await helpers.getTutorial.fetch({ id });
//   if (id) {
//     // prefetch `post.byId`
//     await helpers.getTutorial.prefetch({ id });
//   } else {
//     // if post doesn't exist, return 404
//     return {
//       props: { id },
//       notFound: true,
//     };
//   }
//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//       id,
//     },
//   };
// }

export const Tutorial = ({ tutorial }: { tutorial: TutorialWithVotesType }) => {
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("");

  const { data: sessionData } = useSession();

  useEffect(() => {
    fetch(`https://noembed.com/embed?dataType=json&url=${tutorial.url}`)
      .then((res) => res.json())
      .then((data) => {
        setChannel(data.author_name);
        setTitle(data.title);
      });
  }, [tutorial.url]);

  const tutorialVotes = tutorial.TutorialVotes;

  const upvotesCount =
    tutorialVotes?.filter(
      (tutorialVote) => tutorialVote.voteType === VoteType.UP
    ).length ?? 0;
  const downvotesCount =
    tutorialVotes?.filter(
      (tutorialVote) => tutorialVote.voteType === VoteType.DOWN
    ).length ?? 0;
  const totalVotes =
    upvotesCount || downvotesCount ? upvotesCount - downvotesCount : undefined;

  const mutation = api.beatboxDb.addTutorialVote.useMutation();
  const handleVote = (voteType: VoteType) => {
    mutation.mutate({
      tutorialId: tutorial.id,
      voteType,
    });
  };

  const userVote = tutorialVotes?.find(
    (tutorialVote) => tutorialVote.userId === sessionData?.user.id
  )?.voteType;

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
          onVote={handleVote}
          totalVotes={totalVotes}
          userVote={userVote}
        />
      </div>
    </div>
  );
};
