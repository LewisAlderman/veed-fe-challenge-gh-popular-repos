# VEED FE Challenge: Popular recent Github Repos

Ref: [https://veed.notion.site/Frontend-Coding-Challenge-V2-1-72e36c449dde455ea6417d8ad0483c9c](https://veed.notion.site/Frontend-Coding-Challenge-V2-1-72e36c449dde455ea6417d8ad0483c9c)

### Exercise 🏋️‍♀️

The idea of this project is to implement a small client application for discovering trending repositories on GitHub.

* A list of the repositories created in the last 7 days with the most number of stars in github should be displayed and the user should be able to favourite them
* The favourited repositories should be visible either through a filter or in a different tab. Some basic info about the repo should be displayed, such as repo name, link to GitHub, description and number of stars.
* To keep things simple, the favourites won’t be sent back to GitHub’s servers but just stored locally (e.g localstorage, cookies etc...).
* Feel free to use whichever libraries/design systems you like to achieve the task.

🍎 Bonus task: if time allows, the ability to filter the repos by the languages used would be an awesome addition to have

### Implementation Details 🔎

GitHub provides a public search endpoint which you can use for fetching the most starred repositories:
[https://api.github.com/search/repositories?q=created:&gt;2017-01-10&amp;sort=stars&amp;order=desc](https://api.github.com/search/repositories?q=created:%3E2017-01-10&sort=stars&order=desc)

We value: clear, easy to understand code, that handles errors gracefully, and tests. The technology you use is up to you, but we work with React so seeing this in the solution is always great as well.
