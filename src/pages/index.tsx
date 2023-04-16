import { type NextPage } from "next";
import Head from "next/head";
import { KeyboardManager } from "~/utils/components/Keyboard/KeyboardManager";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Keyboard</title>
        <meta name="description" content="Simple keyboard app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <KeyboardManager />
      </main>
    </>
  );
};

export default Home;
