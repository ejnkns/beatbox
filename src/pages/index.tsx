import { type NextPage } from "next";
import Head from "next/head";
import Keyboard from "~/utils/components/Keyboard/Keyboard";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Keyboard</title>
        <meta name="description" content="Simple keyboard app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Keyboard />
      </main>
    </>
  );
};

export default Home;
