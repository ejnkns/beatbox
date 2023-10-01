import type { Tutorial, TutorialVote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import VoteButtonsClient from "./VoteButtonsClient";
import { useSession } from "next-auth/react";

type VoteWithId = Pick<TutorialVote, "voteType"> & { id: number | undefined };

interface VoteButtonsServerProps {
  tutorialId: number;
  initialVotesAmt?: number;
  initialVote?: VoteWithId | null;
  getData?: () => Promise<(Tutorial & { votes: TutorialVote[] }) | null>;
}

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const VoteButtonServer = async ({
  tutorialId,
  initialVotesAmt,
  initialVote,
  getData,
}: VoteButtonsServerProps) => {
  const { data: sessionData } = useSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteWithId | null | undefined = undefined;

  if (getData) {
    // fetch data in component
    const tutorial = await getData();
    if (!tutorial) return notFound();

    _votesAmt = tutorial.votes.reduce((acc, vote) => {
      if (vote.voteType === "UP") return acc + 1;
      if (vote.voteType === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = tutorial.votes.find(
      (vote) => vote.userId === sessionData?.user?.id
    );
  } else {
    // passed as props
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote;
  }

  return (
    <VoteButtonsClient
      tutorialId={tutorialId}
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
    />
  );
};

export default VoteButtonServer;
