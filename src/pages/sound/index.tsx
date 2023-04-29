import { useRouter } from "next/router";

export default function SoundPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const comment = router.query.comment as string;
  console.log(router);

  return (
    <>
      <h1>Post: {id}</h1>
      <h1>Comment: {comment}</h1>
    </>
  );
}
