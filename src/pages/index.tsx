import { type NextPage } from "next";
import { DisplayBeatboxData } from "~/components/beatboxData/DisplayBeatboxData";
import { api } from "~/utils/api";
import { useState, useMemo, useEffect } from "react";
import { AddSound } from "~/components/AddSound/AddSound";
import { Modal } from "~/components/Modal";
import { CategoryType, Tutorial } from "@prisma/client";
import { Input } from "~/components/Controls/Input";
import { Select } from "~/components/Controls/Select";
import { Header } from "~/components/Header/Header";
import { Button } from "~/components/Controls/Button";
import { Layout } from "~/components/Layout/Layout";
import { getServerAuthSession } from "~/server/auth";
import { beatboxDb } from "~/server/api/routers/beatboxDb";
import { useRouter } from "next/router";
import { AddSoundButton } from "~/components/AddSound/AddSoundButton";
import { signIn, signOut, useSession } from "next-auth/react";

type SearchResult = {
  category: CategoryType;
  id: number;
  name: string;
  tutorials: Tutorial[];
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
};

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
  const [category, setCategory] = useState<CategoryType | "ALL">("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [beatboxSoundsResults, setBeatboxSoundsResults] = useState<
    SearchResult[]
  >([]);

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

  useEffect(() => {
    if (searchResults !== undefined) setBeatboxSoundsResults(searchResults);
  }, [searchResults]);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
  };

  const handleSetCategory = (category: CategoryType | "ALL") => {
    setCategory(category);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-bold">Beatbox Sounds</h1>
        <h2 className="text-3xl">Search for any sound, or add one</h2>
      </div>
      <div className="flex items-center justify-center gap-2 sm:flex-row">
        <Input
          inputText={searchInput}
          setInputText={handleSearchInput}
          isLoading={isSearching}
          placeholder="Search for a sound..."
          type="search"
        />
        <AddSoundButton />
      </div>
      <Select
        id="category"
        defaultValue={category}
        onChange={handleSetCategory}
        options={categoryOptions}
      />
      <DisplayBeatboxData beatboxSounds={beatboxSoundsResults ?? []} />
    </Layout>
  );
};

export default Home;
