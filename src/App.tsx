import {useEffect, useState} from "react";

import {useFavouritesStore} from "./lib/favourites";
import {getGhRepos} from "./lib/api";
import RepoCard from "./components/RepoCard";

function App() {
  const [searchData, setSearchData] = useState<Awaited<ReturnType<typeof getGhRepos>> | null>(null);

  const favourites = useFavouritesStore((state) => state.ids);

  useEffect(() => {
    (async () => {
      const controller = new AbortController();
      const data = await getGhRepos({
        signal: controller.signal,
        // One-time cache to avoid repeat/spam API calls during dev
        // Something like React-Query would be better for short-lived caching
        cache: "force-cache",
      });
      setSearchData(data);

      return () => {
        controller.abort();
      }
    })();
  }, []);

  return (
    <ul className="list-none flex max-sm:flex-col flex-wrap *:basis-[min(100%,350px)] gap-5 justify-center p-5">
      {searchData?.items.map((item) => {
        const isFavourite = favourites.includes(item.id);

        return (
          <li key={item.id} className="flex flex-col">
            <RepoCard item={item} isFavourite={isFavourite} />
          </li>
        )
      })}
    </ul>
  )
}

export default App
