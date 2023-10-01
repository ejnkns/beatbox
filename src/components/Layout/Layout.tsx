import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Header } from "../Header/Header";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex flex-col items-center bg-[url(/background.svg)] bg-cover bg-fixed brightness-75 backdrop-blur-2xl">
      <Head>
        <title>Beatbox Sounds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="mt-16 flex min-h-screen w-full max-w-2xl flex-col gap-2 px-4 sm:px-2">
        {children}
      </main>

      <footer className="mt-8 flex w-full items-center justify-center border-t-2 border-black">
        <p
          className="text-center text-sm text-gray-500"
          style={{ lineHeight: "2rem" }}
        >
          Made by{" "}
          <Link
            href="https://github.com/ejnkns"
            target="_blank"
            className="text-indigo-300"
          >
            ejnkns
          </Link>
        </p>
      </footer>
    </div>
  );
};
