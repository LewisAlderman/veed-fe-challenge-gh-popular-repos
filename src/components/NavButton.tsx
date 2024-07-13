import {PropsWithChildren} from "react"
import {Button} from "./ui/button"

export const NavButton: React.FC<PropsWithChildren<{
	active: boolean;
	onClick: () => void;
}>> = ({
	active,
	onClick,
	children
}) => {
		return (
			<Button variant={active ? "default" : "secondary"} onClick={onClick}>
				{children}
			</Button>
		)
	}