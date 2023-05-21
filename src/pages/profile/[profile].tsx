import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "~/components/Layout/Layout";
import { api } from "~/utils/api";

export default function ProfilePage() {
  const router = useRouter();
  const name = router.query.profile as string;

  const { data: sessionData } = useSession();

  const thing = sessionData?.user.name;
  console.log({ sessionData });

  const {
    data: uploads,
    isLoading: uploadsIsLoading,
    refetch,
  } = api.beatboxDb.getUserUploads.useQuery(undefined, {
    enabled: router.isReady,
  });

  console.log({ uploads });

  return (
    <Layout>
      <h1>Profile</h1>
      <p>{name}</p>
      {uploads && (
        <>
          <ul className="border-2 border-black">
            <h2>Uploaded Sounds</h2>
            {uploads.UploadedSounds?.map((sound) => (
              <li className="border-2 border-black" key={sound.id}>
                <span>{sound.name}</span>
                <Link href={`/sound/${sound.name}`}>View</Link>
              </li>
            ))}
          </ul>
          <ul className="border-2 border-black">
            <h2>Uploaded Tutorials</h2>
            {uploads.UploadedTutorials?.map((tutorial) => (
              <li className="border-2 border-black" key={tutorial.id}>
                <span>{tutorial.name}</span>
                <Link href={`/sound/${tutorial.name}`}>View</Link>
              </li>
            ))}
          </ul>
          <ul className="border-2 border-black">
            <h2>Tutorial Votes</h2>
            {uploads.TutorialVotes?.map((votes) => (
              <li className="border-2 border-black" key={votes.id}>
                <span>{votes.voteType}</span>
                <Link href={`/sound/${votes.tutorialId}`}>View</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Layout>
  );
}
