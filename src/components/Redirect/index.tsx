import { route } from "preact-router";

interface IRedirectProps {
	to: string;
}

const Redirect = (props: IRedirectProps) => {
	route(props.to, true);
	return null;
};

export default Redirect;
