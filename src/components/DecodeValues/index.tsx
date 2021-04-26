import Loading from "components/Loading";
import ManualLoad from "components/ManualLoad";
import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Alert, Button, Form } from "react-bootstrap";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/dracula";
import exif from "utils/exif";
import utf8 from "utils/utf8";

const EditMode: FunctionComponent<{ characterUrl: URL; json: string }> = (props) => {
	let initialValid = true;
	try {
		JSON.parse(props.json);
	} catch {
		initialValid = false;
	}

	const [value, setValue] = useState(props.json);
	const [valid, setValid] = useState(initialValid);

	const onChange = (val: string) => {
		setValue(val);
		try {
			JSON.parse(val);
			setValid(true);
		} catch {
			setValid(false);
		}
	};

	return (
		<>
			<Form.Group className="mt-3">
				<Form.Control
					as="textarea"
					rows={16}
					value={value}
					onChange={(ev) => onChange(ev.currentTarget.value)}
				/>
				<Form.Text className="d-flex">
					<Button size="sm" variant="link" onClick={() => onChange(props.json)}>
						Restore Original
					</Button>
					<span className={`ml-auto ${valid ? "text-success" : "text-danger"}`}>
						{valid ? "Valid JSON" : "Invalid JSON"}
					</span>
				</Form.Text>
			</Form.Group>
			<ManualLoad className="my-4" base64={utf8.b64EncodeUnicode(value)} />
		</>
	);
};

const DecodeValues: FunctionComponent<{ title: string; characterUrl: URL }> = (props) => {
	SyntaxHighlighter.registerLanguage("json", json);

	const [characterData, setCharacterData] = useState("");
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState<null | string>(null);

	const parseExifr = async () => {
		const response = await fetch(props.characterUrl.toString());
		if (response.ok) {
			try {
				const blob = await response.blob();
				const encodedCharacter = await exif.getBase64(blob);
				const decodedCharacter = JSON.parse(utf8.b64DecodeUnicode(encodedCharacter));
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
		if (editMode) {
			return (
				<>
					<div class="d-flex mt-3">
						<h1>{props.title}</h1>
						<div className="ml-auto">
							<Button variant="outline-secondary" onClick={() => setEditMode(false)}>
								Back to View
							</Button>
						</div>
					</div>
					<EditMode characterUrl={props.characterUrl} json={characterData} />
				</>
			);
		}

		return (
			<>
				<div className="d-flex mt-3">
					<h1>{props.title}</h1>
					<div className="ml-auto">
						<Button variant="outline-secondary" onClick={() => setEditMode(true)}>
							Edit
						</Button>
					</div>
				</div>
				<SyntaxHighlighter className="mt-3" language="json" style={dark}>
					{characterData}
				</SyntaxHighlighter>
			</>
		);
	}

	return <Loading />;
};

export default DecodeValues;
