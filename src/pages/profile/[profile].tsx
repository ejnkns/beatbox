import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Layout } from "~/components/Layout/Layout";

export default function ProfilePage() {
  const router = useRouter();
  const name = router.query.profile as string;

  const { data: sessionData } = useSession();

  const thing = sessionData?.user.name;

  return (
    <Layout>
      <h1>Profile</h1>
      <p>{name}</p>
    </Layout>
  );
}
