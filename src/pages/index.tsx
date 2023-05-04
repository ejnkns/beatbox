import { type NextPage } from "next";
import Head from "next/head";
import { DisplayBeatboxData } from "~/components/beatboxData/DisplayBeatboxData";
import { api } from "~/utils/api";
import { useEffect, useState, useMemo } from "react";
import { AddSound } from "~/components/AddSound/AddSound";
import { Modal } from "~/components/Modal";
import { BeatboxSound, CategoryType } from "@prisma/client";
import { Input } from "~/components/Controls/Input";
import { Select } from "~/components/Controls/Select";

const Home: NextPage = () => {
  const [addSoundOpen, setAddSoundOpen] = useState(false);
  const [category, setCategory] = useState<CategoryType | "ALL">("ALL");

  const handleSetCategory = (category: CategoryType | "ALL") => {
    setCategory(category);
  };

  const handleAddSoundOpen = () => {
    setAddSoundOpen((prev) => !prev);
  };

  const handleAddSoundClose = () => {
    setAddSoundOpen(false);
  };

  const [searchInput, setSearchInput] = useState("");
  const enabled = searchInput.trim() !== "" || category !== "ALL";

  const [beatboxSounds, setBeatboxSounds] = useState<BeatboxSound[]>([]);

  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
    refetch,
  } = api.beatboxDb.searchBeatboxSounds.useQuery(
    {
      search: searchInput === "" ? undefined : searchInput,
      categoryFilter: category === "ALL" ? undefined : category,
    },
    {
      enabled,
    }
  );

  useEffect(() => {
    if (!enabled) refetch();
  }, [enabled, category]);

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

  const categoryOptions = useMemo(() => {
    const categories = Object.values(CategoryType).map(
      (category) =>
        ({
          id: category,
          name: category,
        } as const)
    );
    return [{ id: "ALL", name: "ALL" }, ...categories] satisfies Array<{
      name: CategoryType | "ALL";
      id: string;
    }>;
  }, []);

  return (
    <>
      <Head>
        <title>Keyboard</title>
        <meta name="description" content="Simple keyboard app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col gap-2 p-4 sm:p-2">
        <button onClick={handleAddSoundOpen}>Add Sound</button>
        <Modal isOpen={addSoundOpen} onClose={handleAddSoundClose}>
          <AddSound />
        </Modal>
        <Input
          inputText={searchInput}
          setInputText={setSearchInput}
          isLoading={isLoading}
          placeholder="Search for a sound"
        />
        <Select
          id="category"
          defaultValue={category}
          onChange={handleSetCategory}
          options={categoryOptions}
        />
        <DisplayBeatboxData beatboxSounds={beatboxSounds} />
      </main>
    </>
  );
};

export default Home;
