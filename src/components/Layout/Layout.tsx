import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Header } from "../Header/Header";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div
      style={{
        filter: `contrast(220%) brightness(100%)`,
        background: `linear-gradient(89deg, rgba(24, 49, 124, 0.09), rgba(2,2,6,0)), radial-gradient(circle at 50% 50%, rgba(113, 103, 121, 0.48), rgba(91, 59, 118, 0.19)), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='5.21' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
      className="flex min-h-screen flex-col items-center"
    >
      <Head>
        <title>Beatbox Sounds</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen w-full max-w-2xl flex-col gap-2 p-4 sm:p-2">
        <Header />
        {children}
      </main>

      <footer className="flex w-full items-center justify-center border-t">
        <p
          className="text-center text-sm text-gray-500"
          style={{ lineHeight: "2rem" }}
        >
          Made by{" "}
          <a
            href="https://github.com/ejnkns"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            ejnkns
          </a>
        </p>
      </footer>
    </div>
  );
};
