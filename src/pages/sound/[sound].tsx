import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/Controls/Button";
import { Input } from "~/components/Controls/Input";
import { Layout } from "~/components/Layout/Layout";
import { TutorialList } from "~/components/Tutorial/TutorialList";
import { api } from "~/utils/api";

export const SoundPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const name = router.query.sound as string;

  const {
    data: beatboxSound,
    isLoading: beatboxSoundIsLoading,
    refetch,
  } = api.beatboxDb.getBeatboxSoundByName.useQuery(
    {
      name,
    },
    {
      enabled: router.isReady,
    }
  );

  const [tutorialUrl, setTutorialUrl] = useState("");

  const {
    mutate: addTutorialToBeatboxSound,
    isLoading: addTutorialToBeatboxSoundIsLoading,
    isSuccess: addTutorialToBeatboxSoundIsSuccess,
    reset: resetAddTutorialToBeatboxSound,
  } = api.beatboxDb.addTutorialToBeatboxSound.useMutation();
  const {
    mutate: addTutorial,
    data: addTutorialData,
    isLoading: addTutorialIsLoading,
    reset: resetAddTutorial,
  } = api.beatboxDb.addTutorial.useMutation();

  const handleAddTutorial = () => {
    if (tutorialUrl.includes("youtube.com")) {
      addTutorial({
        name,
        url: tutorialUrl,
      });
    }
  };

  useEffect(() => {
    if (addTutorialData && beatboxSound) {
      setTutorialUrl("");
      addTutorialToBeatboxSound({
        beatboxSoundId: beatboxSound.id,
        tutorialId: addTutorialData.id,
      });
      resetAddTutorial();
    }
  }, [
    addTutorialData,
    addTutorialToBeatboxSound,
    beatboxSound,
    resetAddTutorial,
  ]);

  useEffect(() => {
    if (addTutorialToBeatboxSoundIsSuccess) {
      refetch();
      resetAddTutorialToBeatboxSound();
    }
  }, [
    addTutorialToBeatboxSoundIsSuccess,
    refetch,
    resetAddTutorialToBeatboxSound,
  ]);

  const isLoading = addTutorialToBeatboxSoundIsLoading || addTutorialIsLoading;

  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <h1 className="mb-4 text-center text-4xl font-bold text-black">
          {name}
        </h1>
        <Button disabled onClick={() => {}}>
          <h2 className="text-center text-2xl font-bold text-black">
            {beatboxSound?.category}
          </h2>
        </Button>
        <TutorialList
          tutorials={beatboxSound?.tutorials ?? []}
          isLoading={beatboxSoundIsLoading}
        />
        <div className="flex w-full items-center justify-center gap-2 sm:flex-row">
          <Input
            inputText={tutorialUrl}
            setInputText={setTutorialUrl}
            isLoading={isLoading}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <Button onClick={handleAddTutorial}>Add tutorial</Button>
        </div>
      </div>
    </Layout>
  );
};

export default SoundPage;
