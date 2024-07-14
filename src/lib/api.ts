import {Endpoints} from "@octokit/types"
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import {createDateKey} from "./utils";

// Consideration: Can we guarantee sync/parity between the types and the actual
// API response - use actual Octokit lib? 
export type SearchReposResponseData = Endpoints["GET /search/repositories"]["response"]["data"];

// Example endpoint
// https://api.github.com/search/repositories?q=created:>2024-07-06&sort=stars&order=desc
const baseApiUrl = "https://api.github.com/search/repositories";

const useReposStore = create<{
  repos: Record<string, SearchReposResponseData>,
  sinceDate: string,
  setRepos: (lang: string, r: SearchReposResponseData) => void
}>()(
  devtools(
    persist(
      (set) => ({
        repos: {},
        sinceDate: createDateKey(),
        setRepos(lang, repos) {
          return set(state => ({repos: {...state.repos, [lang]: repos}}))
        },
      }),
      {
        name: 'repos-storage'
      },
    ),
  ),
)

export const getGhRepos = async (lang?: string | null, requestInit?: RequestInit) => {
  lang = lang || "";
  const sinceDateSame = useReposStore.getState().sinceDate === createDateKey();
  
  const cachedRepos = useReposStore.getState().repos[lang];

  if (sinceDateSame && cachedRepos) {
    return cachedRepos;
  }
  
  const apiQueryString = `q=${lang ? `language:${lang}+` : ""}created:>${createDateKey()}&sort=stars&order=desc`;
  const apiUrl = `${baseApiUrl}?${apiQueryString.toString()}`;
  const response = await fetch(apiUrl, requestInit);
  const data = await response.json() as SearchReposResponseData;
  useReposStore.setState({sinceDate: createDateKey(), repos: {[lang]: data}});
  return data;
}

type LanguagesResponseData = Array<{name: string, aliases: string[]}>;

// cache languages permanently (lack of changes)
const useFavouritesStore = create<{
  languages: LanguagesResponseData,
  setLanguages: (l: LanguagesResponseData) => void
}>()(
  devtools(
    persist(
      (set) => ({
        languages: [] as LanguagesResponseData,
        setLanguages(l) {
          return set({
            languages: l
          })
        },
      }),
      {
        name: 'languages-storage'
      },
    ),
  ),
)

export const getSupportedLanguages = async (requestInit?: RequestInit) => {
  if (useFavouritesStore.getState().languages.length) {
    return useFavouritesStore.getState().languages;
  }
  
  const response = await fetch("https://api.github.com/languages", requestInit);
  const data = await response.json() as Array<{name: string, aliases: string[]}>;
  useFavouritesStore.setState({languages: data});
  return data;
}