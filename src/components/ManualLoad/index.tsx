import CopyButton from "components/CopyLinkButton";
import { FunctionComponent } from "preact";
import { Alert } from "react-bootstrap";

const ManualLoad: FunctionComponent<{ base64: string; error?: string; className?: string }> = (
	props
) => {
	return (
		<div className={props.className}>
			<h5>Manual Load</h5>
			<p>Copy and paste the following into your AI Dungeon prompt to load this character:</p>
			{props.error ? (
				<Alert className="mt-3" variant="danger">
					{props.error}
				</Alert>
			) : (
				<>
					<pre>
						<code>/load {props.base64}</code>
					</pre>
					<div className="d-flex flex-column flex-sm-row">
						<CopyButton
							link={`/load ${props.base64}`}
							variantNormal="secondary"
							variantClick="outline-secondary"
							textNormal="&nbsp;Copy&nbsp;"
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ManualLoad;
