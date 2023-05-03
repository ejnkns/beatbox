import { type NextPage } from "next";
import Head from "next/head";
import { DisplayBeatboxData } from "~/components/beatboxData/DisplayBeatboxData";
import { KeyboardManager } from "~/components/Keyboard/KeyboardManager";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { AddSound } from "~/components/AddSound/AddSound";
import { Modal } from "~/components/Modal";
import { BeatboxSound } from "@prisma/client";
import { Input } from "~/components/Controls/Input";

const Home: NextPage = () => {
  const [addSoundOpen, setAddSoundOpen] = useState(false);

  const handleAddSoundOpen = () => {
    setAddSoundOpen((prev) => !prev);
  };

  const handleAddSoundClose = () => {
    setAddSoundOpen(false);
  };

  const [searchInput, setSearchInput] = useState("");
  const enabled = searchInput.trim() !== "";

  const [beatboxSounds, setBeatboxSounds] = useState<BeatboxSound[]>([]);

  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
  } = api.beatboxDb.searchBeatboxSounds.useQuery(
    {
      search: searchInput,
    },
    {
      enabled,
    }
  );

  const {
    data: allBeatboxSounds = [],
    isLoading: beatboxSoundsIsLoading,
    isError: beatboxSoundsIsError,
  } = api.beatboxDb.getBeatboxSounds.useQuery();

  const isLoading = (enabled && isSearching) || beatboxSoundsIsLoading;

  useEffect(() => {
    if (searchResults !== undefined) setBeatboxSounds(searchResults);
    if (!enabled) setBeatboxSounds(allBeatboxSounds);
  }, [searchResults, allBeatboxSounds]);

  return (
    <>
      <Head>
        <title>Keyboard</title>
        <meta name="description" content="Simple keyboard app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <button onClick={handleAddSoundOpen}>Add Sound</button>
        <Modal isOpen={addSoundOpen} onClose={handleAddSoundClose}>
          <AddSound />
        </Modal>
        <Input
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          isLoading={isLoading}
          placeholder="Search for a sound"
        />
        <DisplayBeatboxData beatboxSounds={beatboxSounds} />
      </main>
    </>
  );
};

export default Home;
