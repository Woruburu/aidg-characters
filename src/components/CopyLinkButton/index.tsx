import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "react-bootstrap";

const CopyLinkButton: FunctionComponent<{ className?: string; link: URL }> = (props) => {
	const [showCopiedText, setShowCopiedText] = useState(false);
	const onClick = async () => {
		await navigator.clipboard.writeText(props.link.toString());
		setShowCopiedText(true);
		setTimeout(() => {
			setShowCopiedText(false);
		}, 1500);
	};

	return (
		<Button
			disabled={showCopiedText}
			className={props.className}
			variant={showCopiedText ? "outline-success" : "success"}
			onClick={onClick}
		>
			{showCopiedText ? "Copied!" : "Copy Link"}
		</Button>
	);
};

export default CopyLinkButton;
