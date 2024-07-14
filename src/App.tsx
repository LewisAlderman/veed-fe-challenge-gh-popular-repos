import {useMemo, useState} from "react";

import {useFavouritesStore} from "./lib/favourites";
import RepoCard from "./components/RepoCard";
import {NavButton} from "./components/NavButton";
import {useSearchRepos} from "./lib/hooks";
import {Separator} from "./components/ui/separator";
import LanguageFilter from "./components/LanguageFilter";

enum DisplayFilter {
  Popular = "popular",
  Favourites = "favourites",
}

function App() {
  // Improvement: utilise URL-state
  const [displayFilter, setDisplayFilter] = useState<DisplayFilter>(DisplayFilter.Popular);
  const [languageFilter, setLanguageFilter] = useState<string>("");

  const searchData = useSearchRepos(languageFilter);

  const favourites = useFavouritesStore((state) => state.ids);
  const favouriteItems = useMemo(() => searchData?.items
    .filter((item) => favourites.includes(item.id) && (languageFilter ? item.language === languageFilter : true)), [searchData, favourites, languageFilter]);

  const items = displayFilter === DisplayFilter.Popular ? searchData?.items : favouriteItems;

  return (
    <>
      <header className="shrink-0 sticky top-0 z-10">
        <nav className="p-5 sticky top-0 space-y-5">
          <ul className="flex items-center gap-y-3 lg:flex-col lg:*:w-full max-sm:drop-shadow-sm">
            <li>
              <NavButton active={displayFilter === DisplayFilter.Popular} onClick={() => setDisplayFilter(DisplayFilter.Popular)} className="max-sm:rounded-r-none">
                Popular
              </NavButton>
            </li>
            <li>
              <NavButton active={displayFilter === DisplayFilter.Favourites} onClick={() => setDisplayFilter(DisplayFilter.Favourites)} className="max-sm:rounded-l-none">
                My Favourites
              </NavButton>
            </li>
          </ul>

          <Separator className="max-sm:hidden" />

          <LanguageFilter onChange={setLanguageFilter} />

        </nav>
      </header>

      <main className="grow relative">
        <ul className="list-none flex flex-col sm:grid [grid-template-columns:repeat(auto-fill,minmax(350px,1fr))] gap-5 p-5 justify-center">
          {items?.length ? items.map((item) => {
            const isFavourite = favourites.includes(item.id);

            return (
              <li key={item.id} className="flex flex-col">
                <RepoCard item={item} isFavourite={isFavourite} />
              </li>
            )
          }) : <div className="absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 text-gray-500">Nothing to see ¯\_(ツ)_/¯</div>}
        </ul>
      </main>
    </>
  )
}

export default App
