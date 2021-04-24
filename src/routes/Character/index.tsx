import CopyLinkButton from "components/CopyLinkButton";
import Loading from "components/Loading";
import NotFound from "components/NotFound";
import { CharacterContext } from "ContextProvider/CharacterContextProvider";
import { parse } from "exifr";
import { FunctionComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Alert, Badge, Col, Container, Image, Row, Tab, Tabs } from "react-bootstrap";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/dracula";
import { b64DecodeUnicode } from "utils/utf8";

const DecodedValues: FunctionComponent<{ characterUrl: URL }> = (props) => {
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
			// <pre className="mt-3">
			// 	<code>{characterData}</code>
			// </pre>
		);
	}

	return <Loading />;
};

const Character = (props: { id: string }) => {
	const state = useContext(CharacterContext);

	let path = "";
	try {
		path = atob(props.id);
	} catch {
		return <NotFound />;
	}
	const character = state.characters.find((e) => e.path === path);
	if (!character) {
		return <NotFound />;
	}

	if (!character.path) {
		return <NotFound />;
	}

	let url: URL;
	try {
		url = new URL(character.path);
	} catch {
		url = new URL(`/characters/${character.path}`, window.location.href);
	}

	return (
		<Container>
			<Tabs defaultActiveKey="profile">
				<Tab eventKey="profile" title="Profile">
					<Row>
						<Col sm={6} md={4} xl={3} className="d-flex">
							<Image
								className="mx-auto mt-4"
								alt={character.title}
								src={url.toString()}
							/>
						</Col>
						<Col>
							<div className="mt-3">
								<h1>{character.title}</h1>
								{character.tags && (
									<div tabIndex={0} className="mb-3 card-tags">
										<strong>Tags: </strong>
										{character.tags.map((tag) => (
											<Badge className="mr-1" variant="primary">
												{tag}
											</Badge>
										))}
									</div>
								)}
								{character.description && <p>{character.description}</p>}
								{character.relatedPrompts && character.relatedPrompts.length > 0 && (
									<div className="mb-4">
										<h5>Related Prompts</h5>
										{character.relatedPrompts?.map((link) => (
											<a className="d-block" target="_blank" href={link}>
												{link}
											</a>
										))}
									</div>
								)}
								<div className="d-flex flex-column flex-sm-row">
									<CopyLinkButton className="mb-2 mb-sm-0 mr-sm-4" link={url} />
									<a
										download
										className="btn btn-outline-secondary"
										href={url.toString()}
									>
										Download
									</a>
								</div>
							</div>
						</Col>
					</Row>
				</Tab>
				<Tab eventKey="decode" title="Decoded Values">
					<DecodedValues characterUrl={url} />
				</Tab>
			</Tabs>
		</Container>
	);
};

export default Character;
