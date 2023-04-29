import { BeatboxSound } from "@prisma/client";
import { useRouter } from "next/router";
import { Tutorial } from "~/components/Tutorial";
import { api } from "~/utils/api";

export default function SoundPage() {
  const router = useRouter();
  const name = router.query.sound as string;
  const id = router.query.id ? parseInt(router.query.id as string) : NaN;
  const { data: beatboxSound, isLoading } =
    api.beatboxDb.getBeatboxSound.useQuery(
      {
        id,
      },
      {
        enabled: router.isReady,
      }
    );

  return (
    <>
      <h1 className=" mb-4 text-center text-4xl font-bold text-gray-800 ">
        {name}
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : beatboxSound?.tutorials ? (
          beatboxSound.tutorials.map((tutorial, i) => (
            <Tutorial key={`${tutorial}-${i}`} tutorial={tutorial} />
          ))
        ) : (
          <div>{`No tutorials :(`}</div>
        )}
      </div>
    </>
  );
}
