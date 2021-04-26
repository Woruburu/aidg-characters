import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "react-bootstrap";

const CopyButton: FunctionComponent<{
	className?: string;
	link: string;
	variantNormal?: string;
	variantClick?: string;
	textNormal?: string;
	textClick?: string;
}> = (props) => {
	const [showCopiedText, setShowCopiedText] = useState(false);
	const onClick = async () => {
		await navigator.clipboard.writeText(props.link);
		setShowCopiedText(true);
		setTimeout(() => {
			setShowCopiedText(false);
		}, 1500);
	};

	return (
		<Button
			disabled={showCopiedText}
			className={props.className}
			variant={
				showCopiedText
					? props.variantClick ?? "outline-success"
					: props.variantNormal ?? "success"
			}
			onClick={onClick}
		>
			{showCopiedText ? props.textClick ?? "Copied!" : props.textNormal ?? "Copy Link"}
		</Button>
	);
};

export default CopyButton;
