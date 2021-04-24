import CopyLinkButton from "components/CopyLinkButton";
import { CharacterContext } from "ContextProvider/CharacterContextProvider";
import { LunrIndexContext } from "ContextProvider/LunrIndexProvider";
import { FunctionComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Badge, Button, Card, Col, Form, Modal, Row, SafeAnchor } from "react-bootstrap";
import Container from "react-bootstrap/Container";

const Search: FunctionComponent<{ search?: string; onChange: (value: string) => void }> = (
	props
) => {
	const [searchValue, setSearchValue] = useState(props.search ?? "");
	const [showAdvancedModal, setshowAdvancedModal] = useState(false);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		setSearchValue(value);
		props.onChange(event.currentTarget.value);
	};

	useEffect(() => {
		if (props.search) {
			setSearchValue(props.search);
		} else {
			setSearchValue("");
		}
	}, [props.search]);

	return (
		<>
			<Form.Group>
				<Form.Control value={searchValue} onChange={onChange} placeholder="Search query" />
				<div className="d-flex">
					<Form.Text className="ml-auto" muted>
						<Button
							size="sm"
							variant="link"
							onClick={() => {
								setshowAdvancedModal(true);
							}}
						>
							Advanced
						</Button>
					</Form.Text>
				</div>
			</Form.Group>
			<Modal size="lg" show={showAdvancedModal} onHide={() => setshowAdvancedModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Searching</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						By default, all terms will be searched across title, description and tags.
						Spaces are used to seperate search terms. For example, searching for{" "}
						<code>digimon fairy</code> will search all cards for results that include{" "}
						<code>digimon</code> <strong>or</strong> <code>fairy</code>.
					</p>
					<h4>Fields</h4>
					<p>
						You can limit the search to a certain field by using{" "}
						<code>fieldname:query</code>. For example, searching{" "}
						<code>tags:digimon</code> will search all cards for any tags that contain{" "}
						<code>digimon</code>.
					</p>
					The possible values for field are:
					<ul>
						<li>
							<code>title</code>
						</li>
						<li>
							<code>description</code>
						</li>
						<li>
							<code>tags</code>
						</li>
					</ul>
					<h4>Term Presence</h4>
					<p>
						When prepending a <code>+</code> before a given query, all results must
						contain that query. For example, searching <code>+digimon +fairy</code> will
						search all cards for results that include <code>digimon</code>{" "}
						<strong>and</strong> <code>fairy</code>.
					</p>
					<p>
						Simalarly, when prepending a <code>-</code> before a given query, all
						results must <strong>not</strong> include that query. For example, searching{" "}
						<code>digimon -fairy</code> will search all cards for results that include{" "}
						<code>digimon</code> <strong>and do not include</strong> <code>fairy</code>.
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setshowAdvancedModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

const Home: FunctionComponent<{ search: string }> = (props) => {
	const charactersContext = useContext(CharacterContext);
	const indexContext = useContext(LunrIndexContext);

	const [characters, setCharacters] = useState(charactersContext.characters);

	const onSearch = (value: string) => {
		value = value
			.split(" ")
			.map((str) => `${str}*`)
			.join(" ");
		const searchResults = indexContext.index.search(`${value}`);
		const refs = searchResults.map((sr) => sr.ref);
		const filteredCharacters = charactersContext.characters.filter((char) =>
			char.path ? refs.includes(char.path) : false
		);
		setCharacters(filteredCharacters);
	};

	useEffect(() => {
		if (props.search) {
			onSearch(props.search);
		} else {
			onSearch("");
		}
	}, [props.search]);

	return (
		<Container>
			<Search search={props.search ?? undefined} onChange={onSearch}></Search>
			<Row>
				{characters.map((character) => {
					if (character.path) {
						let url: URL;
						try {
							url = new URL(character.path);
						} catch {
							url = new URL(`/characters/${character.path}`, window.location.href);
						}

						return (
							<Col sm={6} md={4} lg={3} key={character.path}>
								<Card className="mb-4">
									<a href={`/characters/${btoa(character.path)}`}>
										<Card.Img
											alt={character.title}
											loading="lazy"
											variant="top"
											src={url.toString()}
										/>
									</a>
									<Card.Body>
										<a href={`/characters/${btoa(character.path)}`}>
											<Card.Title>{character.title}</Card.Title>
										</a>
										{character.tags && (
											<div tabIndex={0} className="mb-3 card-tags">
												<strong>Tags: </strong>
												{character.tags.map((tag) => (
													<Badge
														as={SafeAnchor}
														href={`/?search=${tag}`}
														className="mr-1"
														variant="primary"
													>
														{tag}
													</Badge>
												))}
											</div>
										)}
										<Card.Text className="card-description">
											{character.description}
										</Card.Text>
										{/* Not sure if this clutters the front page too much */}
										{/* {character.relatedPrompts &&
										character.relatedPrompts.length > 0 && (
											<div>
												<strong>Related Prompts</strong>
												{character.relatedPrompts?.map((link) => (
													<a
														className="prompt-link"
														target="_blank"
														href={link}
													>
														{link}
													</a>
												))}
											</div>
										)} */}
									</Card.Body>
									<Card.Footer className="d-flex flex-column">
										<CopyLinkButton className="mb-2" link={url} />
										<a
											download
											className="btn btn-outline-secondary"
											href={url.toString()}
										>
											Download
										</a>
									</Card.Footer>
								</Card>
							</Col>
						);
					} else {
						return null;
					}
				})}
			</Row>
		</Container>
	);
};

export default Home;
