import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "~/components/Controls/Input";
import { Layout } from "~/components/Layout/Layout";
import { Tutorial } from "~/components/Tutorial";
import { api } from "~/utils/api";

export default function SoundPage() {
  const router = useRouter();
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

  if (beatboxSound?.tutorials.length && beatboxSound.tutorials[0])
    fetch(
      `https://noembed.com/embed?dataType=json&url=${beatboxSound.tutorials[0].url}`
    )
      .then((res) => res.json())
      .then((data) => console.log("fetch", data.title));

  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <h1 className=" mb-4 text-center text-4xl font-bold text-gray-800 ">
          {name}
        </h1>
        {beatboxSoundIsLoading ? (
          <div>Loading...</div>
        ) : beatboxSound?.tutorials.length ? (
          beatboxSound.tutorials.map((tutorial, i) => (
            <Tutorial key={`${tutorial}-${i}`} tutorial={tutorial} />
          ))
        ) : (
          <div>{`No tutorials :(`}</div>
        )}
        <>
          <Input
            inputText={tutorialUrl}
            setInputText={setTutorialUrl}
            isLoading={isLoading}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <button
            className="w-full rounded-md border border-gray-300 p-2"
            onClick={handleAddTutorial}
          >
            Add tutorial
          </button>
        </>
      </div>
    </Layout>
  );
}
