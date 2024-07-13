
import {Endpoints} from "@octokit/types"
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./components/ui/card";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import {Button} from "./components/ui/button";
import {cn} from "./lib/utils";
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

interface FavouritesState {
  ids: number[]
  clear: () => void
  toggle: (id: number) => void
}

const useFavouritesStore = create<FavouritesState>()(
  devtools(
    persist(
      (set) => ({
        ids: [],
        clear: () => set(() => ({ids: []})),
        toggle: (id) => set((state) => ({ids: state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id]})),
      }),
      {
        name: 'favourite-storage',
      },
    ),
  ),
)

dayjs.extend(RelativeTime);

// Consideration: Can we guarantee sync/parity between the types and the actual
// API response - use actual Octokit lib? 
type SearchReposResponseData = Endpoints["GET /search/repositories"]["response"]["data"];

// Example endpoint
// https://api.github.com/search/repositories?q=created:>2024-07-06&sort=stars&order=desc
const baseApiUrl = "https://api.github.com/search/repositories";
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
const apiQueryString = `q=created:>${sevenDaysAgoStr}&sort=stars&order=desc`;
const apiUrl = `${baseApiUrl}?${apiQueryString}`;

const getGhRepos = async () => {
  // One-time cache to avoid repeat/spam API calls during dev
  const response = await fetch(apiUrl, {cache: "force-cache"});
  const data = await response.json();
  return data as SearchReposResponseData;
}

function App() {
  const [searchData, setSearchData] = useState<Awaited<ReturnType<typeof getGhRepos>> | null>(null);

  const favourites = useFavouritesStore((state) => state.ids);
  const toggleFavourite = useFavouritesStore((state) => state.toggle);

  useEffect(() => {
    (async () => {
      console.log('fetching data');
      const data = await getGhRepos();
      setSearchData(data);
    })();
  }, []);

  return (
    <ul className="list-none flex max-sm:flex-col flex-wrap *:basis-[min(100%,350px)] gap-5 justify-center p-5">
      {searchData?.items.map((item) => {
        const isFavourite = favourites.includes(item.id);

        return (
          <li key={item.id} className="flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <div className="flex items-baseline">
                  {/* Repo title */}
                  <CardTitle className="grow leading-snug break-all text-balance -mt-[0.2lh] max-lg:text-base max-xl:text-lg max-2xl:text-xl">
                    {item.owner?.login}
                    {' '}/{' '}
                    <a href={item.html_url} target="_blank" className="group inline-block relative hover:text-blue-500">
                      {item.name}
                      <span className="opacity-0 absolute top-1/2 -translate-y-1/2 group-hover:opacity-50 text-xs  pl-2">⤴</span>
                    </a>
                  </CardTitle>

                  <Button variant={"ghost"} className={cn("-mr-3 -mt-2 text-xl", isFavourite ? "text-orange-400" : "opacity-30")} onClick={() => toggleFavourite(item.id)}>
                    <span aria-hidden>
                      {isFavourite ? "★" : "☆"}
                    </span>
                    <span className="sr-only">Toggle favourite</span>
                  </Button>
                </div>

                {/* Time ago */}
                <CardDescription>
                  <span className="sr-only">Created</span> {dayjs(item.created_at).fromNow()}
                </CardDescription>

              </CardHeader>

              {/* Description */}
              <CardContent className="flex-1">
                <p className="line-clamp-3 sm:min-h-[3lh] max-sm:text-sm" title={item.description ?? ""}>
                  {item.description ?? "\u00A0" /*&nbsp;*/}
                </p>
              </CardContent>

              <CardFooter>
                <CardDescription>
                  <ul className="flex gap-x-2 items-baseline [&>*:not(:last-child)]:after:content-['·'] [&>*:not(:last-child)]:after:ml-2 [&>*:not(:last-child)]:after:opacity-30">
                    {/* Stars */}
                    <li>
                      <span aria-hidden className="leading-[20px] select-none align-top opacity-50 mr-1 font-light">
                        ☆
                      </span>

                      {item.stargazers_count} <span className="sr-only">stars</span>
                    </li>

                    {/* Lang */}
                    {item.language && (
                      <li>
                        <span aria-hidden className="text-xs leading-[20px] select-none align-top opacity-50 mr-1">{`{ }`}</span>

                        <span className="sr-only">Written in</span>

                        {item.language}
                      </li>
                    )}
                  </ul>
                </CardDescription>
              </CardFooter>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

export default App
