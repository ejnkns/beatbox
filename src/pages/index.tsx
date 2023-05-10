import { type NextPage } from "next";
import { DisplayBeatboxData } from "~/components/beatboxData/DisplayBeatboxData";
import { api } from "~/utils/api";
import { useState, useMemo, useEffect } from "react";
import { AddSound } from "~/components/AddSound/AddSound";
import { Modal } from "~/components/Modal";
import { CategoryType } from "@prisma/client";
import { Input } from "~/components/Controls/Input";
import { Select } from "~/components/Controls/Select";
import { Header } from "~/components/Header/Header";
import { Button } from "~/components/Controls/Button";
import { Layout } from "~/components/Layout/Layout";
import { getServerAuthSession } from "~/server/auth";
import { beatboxDb } from "~/server/api/routers/beatboxDb";
import { useRouter } from "next/router";

const categoryOptions = [
  { id: "ALL", name: "ALL" },
  ...Object.values(CategoryType).map(
    (category) =>
      ({
        id: category,
        name: category,
      } as const)
  ),
] satisfies Array<{
  name: CategoryType | "ALL";
  id: string;
}>;

const Home: NextPage = () => {
  const router = useRouter();
  const [addSoundOpen, setAddSoundOpen] = useState(false);
  const [category, setCategory] = useState<CategoryType | "ALL">("ALL");
  const [searchInput, setSearchInput] = useState("");
  // const enabled = searchInput.trim() !== "" || category !== "ALL";

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
  };

  const handleSetCategory = (category: CategoryType | "ALL") => {
    setCategory(category);
  };

  const handleAddSoundOpen = () => {
    setAddSoundOpen((prev) => !prev);
  };

  const handleAddSoundClose = () => {
    setAddSoundOpen(false);
  };

  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
    refetch,
  } = api.beatboxDb.searchBeatboxSounds.useQuery(
    {
      search: searchInput.trim() === "" ? undefined : searchInput.trim(),
      categoryFilter: category === "ALL" ? undefined : category,
    },
    {
      enabled: router.isReady,
    }
  );

  useEffect(() => {
    if (router.isReady) refetch();
  }, [refetch, router.isReady]);

  // const [beatboxSounds, setBeatboxSounds] =
  //   useState<BeatboxSound[]>(allBeatboxSounds);
  // const isLoading = enabled && isSearching;

  const beatboxSounds = useMemo(() => {
    if (searchResults !== undefined) return searchResults;
    // return allBeatboxSounds ?? [];
  }, [searchResults]);

  // useEffect(() => {
  //   if (searchResults !== undefined) setBeatboxSounds(searchResults);
  //   if (!enabled) setBeatboxSounds(allBeatboxSounds);
  // }, [searchResults, enabled, allBeatboxSounds, setBeatboxSounds]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-8">
        {/* <h1 className="text-6xl font-bold">Beatbox Sounds</h1> */}
        <h2 className="text-3xl">Search for any sound, or add one</h2>
      </div>
      <div className="flex items-center justify-center gap-2 sm:flex-row">
        <Input
          inputText={searchInput}
          setInputText={handleSearchInput}
          // isLoading={isLoading}
          placeholder="Search for a sound..."
          type="search"
        />
        <Button className="w-[25%] min-w-[100px]" onClick={handleAddSoundOpen}>
          Add Sound
        </Button>
        <Modal isOpen={addSoundOpen} onClose={handleAddSoundClose}>
          <AddSound
            initialValues={{
              name: searchInput,
              category: category === "ALL" ? undefined : category,
            }}
          />
        </Modal>
      </div>
      <Select
        id="category"
        defaultValue={category}
        onChange={handleSetCategory}
        options={categoryOptions}
      />
      <DisplayBeatboxData beatboxSounds={beatboxSounds ?? []} />
    </Layout>
  );
};

export default Home;
