import Spinner from "react-bootstrap/Spinner";

const Loading = () => {
	return (
		<div className="fade-in d-flex">
			<Spinner className="m-auto" animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
};

export default Loading;
