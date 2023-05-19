import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const name = router.query.profile as string;

  return (
    <div>
      <h1>Profile</h1>
      <p>{name}</p>
    </div>
  );
}
