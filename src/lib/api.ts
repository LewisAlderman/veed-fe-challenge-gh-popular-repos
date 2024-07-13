import {Endpoints} from "@octokit/types"


// Consideration: Can we guarantee sync/parity between the types and the actual
// API response - use actual Octokit lib? 
export type SearchReposResponseData = Endpoints["GET /search/repositories"]["response"]["data"];

// Example endpoint
// https://api.github.com/search/repositories?q=created:>2024-07-06&sort=stars&order=desc
const baseApiUrl = "https://api.github.com/search/repositories";
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
const apiQueryString = `q=created:>${sevenDaysAgoStr}&sort=stars&order=desc`;
const apiUrl = `${baseApiUrl}?${apiQueryString}`;

export const getGhRepos = async (requestInit?: RequestInit) => {
  const response = await fetch(apiUrl, requestInit);
  const data = await response.json();
  return data as SearchReposResponseData;
}