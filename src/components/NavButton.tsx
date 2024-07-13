import {PropsWithChildren} from "react"
import {Button} from "./ui/button"

export const NavButton: React.FC<PropsWithChildren<{
	active: boolean;
	onClick: () => void;
	className?: string;
}>> = ({
	active,
	onClick,
	children,
	className
}) => {
		return (
			<Button variant={active ? "default" : "secondary"} onClick={onClick} className={className}>
				{children}
			</Button>
		)
	}