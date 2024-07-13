
import {Endpoints} from "@octokit/types"
import {useEffect, useState} from "react";

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

  useEffect(() => {
    (async () => {
      console.log('fetching data');
      const data = await getGhRepos();
      setSearchData(data);
    })();
  }, []);

  return (
    <ul className="list-none">
      {searchData?.items.map((item) => (
        <li key={item.id}>
          {item.full_name}
        </li>
      ))}
    </ul>
  )
}

export default App
