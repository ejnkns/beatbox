import { VoteType } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { api } from "~/utils/api";
import { TutorialWithVotesType } from "./TutorialList";
import { VoteButtons } from "../VoteButtons/VoteButtons";
import { useSession } from "next-auth/react";
import {
  addTutorialVote,
  deleteTutorialVote,
  updateTutorialVote,
} from "~/server/api/routers/beatboxDb.utils";
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
  const resetVoteRef = useRef(false);

  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  console.log(userId);

  useEffect(() => {
    fetch(`https://noembed.com/embed?dataType=json&url=${tutorial.url}`)
      .then((res) => res.json())
      .then((data) => {
        setChannel(data.author_name);
        setTitle(data.title);
      });
  }, [tutorial.url]);

  const tutorialVotes = tutorial.TutorialVotes;

  const upvotesCount = tutorialVotes?.filter(
    (tutorialVote) => tutorialVote.voteType === VoteType.UP
  ).length;
  const downvotesCount = tutorialVotes?.filter(
    (tutorialVote) => tutorialVote.voteType === VoteType.DOWN
  ).length;
  const totalVotes = upvotesCount - downvotesCount;
  console.log({ totalVotes });

  const [userVote, setUserVote] = useState<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    voteType: VoteType;
  }>();
  useEffect(() => {
    setUserVote(
      tutorialVotes?.find((tutorialVote) => tutorialVote.userId === userId)
    );
    // const userVoteType = userVote?.voteType;
  }, [tutorialVotes, userId]);

  const utils = api.useContext();

  const mutateVote = api.beatboxDb.mutateTutorialVote.useMutation({
    async onMutate(newVoteMutation) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.beatboxDb.getBeatboxSoundByName.cancel();

      // Get the data from the queryCache
      const prevData = utils.beatboxDb.getBeatboxSoundByName.getData();

      // Optimistically update the data with our new post
      utils.beatboxDb.getBeatboxSoundByName.setData(
        { name: tutorial.name },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            tutorials: old.tutorials.map((tutorial) => {
              // if (tutorial.id === newVoteMutation.tutorialId) {
              //   if (newVoteMutation.operation === "update") {
              //     return updateTutorialVote(tutorial, newVoteMutation);
              //   } else if (newVoteMutation.operation === "add") {
              //     return addTutorialVote(tutorial, newVoteMutation, userId);
              //   } else if (newVoteMutation.operation === "delete") {
              //     return deleteTutorialVote(tutorial, newVoteMutation);
              //   }
              // }
              return tutorial;
            }),
          };
        }
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newVoteMutation, ctx) {
      resetVoteRef.current = !resetVoteRef.current;
      // If the mutation fails, use the context-value from onMutate
      if (ctx) {
        utils.beatboxDb.getBeatboxSoundByName.setData(
          { name: tutorial.name },
          ctx.prevData
        );
      }
    },
    onSettled() {
      // Sync with server once mutation has settled
      utils.beatboxDb.getBeatboxSoundByName.invalidate();
    },
  });

  const handleVote = (voteType?: VoteType) => {
    // handle delete called before add finished or errored
    console.log({ voteType, resetVoteRef, userVote });
    if (!voteType) {
      if (userVote?.voteType) {
        mutateVote.mutate({
          tutorialId: tutorial.id,
          voteId: userVote.id,
          voteType: userVote.voteType,
        });
        return;
      }
      mutateVote.reset();
      resetVoteRef.current = !resetVoteRef.current;
      return;
    }

    if (userVote?.voteType) {
      if (userVote.voteType !== voteType) {
        mutateVote.mutate({
          tutorialId: tutorial.id,
          voteId: userVote.id,
          voteType,
        });
        return;
      }
    }
    mutateVote.mutate({
      tutorialId: tutorial.id,
      voteType,
    });
    return;
  };

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
          reset={resetVoteRef.current}
          onVote={handleVote}
          totalVotes={totalVotes}
          userVote={userVote?.voteType}
        />
      </div>
    </div>
  );
};
