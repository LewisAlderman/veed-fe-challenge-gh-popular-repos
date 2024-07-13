import {useEffect, useMemo, useState} from "react";

import {useFavouritesStore} from "./lib/favourites";
import {getGhRepos} from "./lib/api";
import RepoCard from "./components/RepoCard";
import {Button} from "./components/ui/button";
import {NavButton} from "./components/NavButton";

enum DisplayFilter {
  Popular = "popular",
  Favourites = "favourites",
}

function App() {
  const [searchData, setSearchData] = useState<Awaited<ReturnType<typeof getGhRepos>> | null>(null);

  // Improvement: utilise URL-state
  const [displayFilter, setDisplayFilter] = useState<DisplayFilter>(DisplayFilter.Popular);

  const favourites = useFavouritesStore((state) => state.ids);
  const favouriteItems = useMemo(() => searchData?.items.filter((item) => favourites.includes(item.id)), [searchData, favourites]);

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
    <>
      <header className="shrink-0 sticky top-0 z-10">
        <nav className="p-5 sticky top-0">
          <ul className="flex items-center gap-5 lg:flex-col lg:*:w-full">
            <li>
              <NavButton active={displayFilter === DisplayFilter.Popular} onClick={() => setDisplayFilter(DisplayFilter.Popular)}>
                Popular
              </NavButton>
            </li>
            <li>
              <NavButton active={displayFilter === DisplayFilter.Favourites} onClick={() => setDisplayFilter(DisplayFilter.Favourites)}>
                My Favourites
              </NavButton>
            </li>
          </ul>
        </nav>
      </header>
      <main className="grow">
        <ul className="list-none flex flex-col sm:grid [grid-template-columns:repeat(auto-fit,minmax(350px,1fr))] *:basis-[min(100%,350px)] gap-5 p-5">
          {(displayFilter === DisplayFilter.Popular ? searchData?.items : favouriteItems)?.map((item) => {
            const isFavourite = favourites.includes(item.id);

            return (
              <li key={item.id} className="flex flex-col">
                <RepoCard item={item} isFavourite={isFavourite} />
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}

export default App
