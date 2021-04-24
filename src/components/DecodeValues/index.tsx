import Loading from "components/Loading";
import { parse } from "exifr";
import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Alert } from "react-bootstrap";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/dracula";
import { b64DecodeUnicode } from "utils/utf8";

const DecodeValues: FunctionComponent<{ characterUrl: URL }> = (props) => {
	SyntaxHighlighter.registerLanguage("json", json);

	const [characterData, setCharacterData] = useState("");
	const [error, setError] = useState<null | string>(null);

	const parseExifr = async () => {
		const response = await fetch(props.characterUrl.toString());
		if (response.ok) {
			const blob = await response.blob();
			//@ts-ignore
			const exif = await parse(blob, true);

			let encodedCharacter;
			if (exif.ImageDescription) {
				// JPG image
				encodedCharacter = exif.ImageDescription.trim();
			} else if (
				// PNG image
				exif.description &&
				exif.description.value
			) {
				encodedCharacter = exif.description.value.trim();
			}

			if (!encodedCharacter) {
				setError("Could not find any embedded data");
				return;
			}

			try {
				let decodedCharacter = JSON.parse(b64DecodeUnicode(encodedCharacter));
				setCharacterData(JSON.stringify(decodedCharacter, null, "\t"));
			} catch (e) {
				setError(e.toString());
				return;
			}
		}
	};

	useEffect(() => {
		parseExifr();
	}, []);

	if (error) {
		return (
			<Alert className="mt-3" variant="danger">
				{error}
			</Alert>
		);
	}

	if (characterData) {
		return (
			<SyntaxHighlighter className="mt-3" language="json" style={dark}>
				{characterData}
			</SyntaxHighlighter>
		);
	}

	return <Loading />;
};

export default DecodeValues;
