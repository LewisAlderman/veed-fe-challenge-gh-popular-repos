import {useState, useEffect} from "react";
import {getGhRepos, getSupportedLanguages} from "./api";

export function useSearchRepos(lang?: string) {
  const [searchData, setSearchData] = useState<Awaited<ReturnType<typeof getGhRepos>> | null>(null);

  useEffect(() => {
    (async () => {
      const controller = new AbortController();
      const data = await getGhRepos(lang ?? null, {
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
  }, [lang]);

  return searchData;
}

export function useSupportedLanguages() {
	const [languages, setLanguages] = useState<Array<{name: string, aliases: string[]}> | null>(null);

	useEffect(() => {
		(async () => {
			const controller = new AbortController();
			const data = await getSupportedLanguages({signal: controller.signal});

			setLanguages(data);
			
			return () => {
				controller.abort();
			}
		})();
	}, []);

	return languages;
}