import { VoteType } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { TutorialWithVotesType } from "./TutorialList";
import { VoteButtons } from "../VoteButtons/VoteButtons";
import { useSession } from "next-auth/react";
import {
  deleteTutorialVote,
  updateTutorialVotes,
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

  const { data: sessionData } = useSession();
  // TODO: figure out a better way to do this
  const userId =
    process.env.NODE_ENV === "development" ? "1" : sessionData?.user.id;

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

  const userVote = tutorialVotes?.find(
    (tutorialVote) => tutorialVote.userId === userId
  );

  const userVoteType = userVote?.voteType;

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
              console.log("updating");
              if (tutorial.id === newVoteMutation.tutorialId) {
                if (
                  newVoteMutation.operation === "update" ||
                  newVoteMutation.operation === "add"
                ) {
                  return updateTutorialVotes(tutorial, newVoteMutation);
                } else if (newVoteMutation.operation === "delete") {
                  return deleteTutorialVote(tutorial, newVoteMutation);
                }
              }
              return tutorial;
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

  const handleVote = (voteType: VoteType) => {
    if (userVoteType) {
      if (userVoteType !== voteType) {
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
          key={`${userVoteType}-${tutorial.id}`}
          onVote={handleVote}
          totalVotes={totalVotes}
          userVote={userVoteType}
        />
      </div>
    </div>
  );
};
