import dayjs from "dayjs";
import {SearchReposResponseData} from "../lib/api";
import {useFavouritesStore} from "../lib/favourites";
import {cn} from "../lib/utils";
import {Button} from "./ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "./ui/card";

const RepoCard: React.FC<{
	item: SearchReposResponseData["items"][0];
	isFavourite: boolean;
}> = ({
	item,
	isFavourite,
}) => {
		const toggleFavourite = useFavouritesStore((state) => state.toggle);

		return (
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
		)
	}

export default RepoCard