import {useSupportedLanguages} from "../lib/hooks"
import {Button} from "./ui/button";

const LanguageFilter: React.FC<{onChange: (v: string) => void}> = ({onChange}) => {
	const languages = useSupportedLanguages();

	return (
		<Button asChild className="outline-none !ring-offset-0 !ring-blue-500 max-sm:drop-shadow-sm" variant={"outline"}>
			<select
				onChange={e => onChange(e.target.value)}
			// onChange={e => setValue(e.target.value)}
			// value={value}
			>
				<option value="">Filter by language…</option>
				{languages?.map((language) => (
					<option key={language.name} value={language.name}>
						{language.name}
					</option>
				))}
			</select>
		</Button>
	)
}

export default LanguageFilter