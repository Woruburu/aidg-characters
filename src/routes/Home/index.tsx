import CopyLinkButton from "components/CopyLinkButton";
import { CharacterContext } from "ContextProvider/CharacterContextProvider";
import { LunrIndexContext } from "ContextProvider/LunrIndexProvider";
import { FunctionComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Badge, Card, CardColumns, Form, SafeAnchor } from "react-bootstrap";
import Container from "react-bootstrap/Container";

const Search: FunctionComponent<{ search?: string; onChange: (value: string) => void }> = (
	props
) => {
	const [searchValue, setSearchValue] = useState(props.search ?? "");

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
		<Form.Group>
			<Form.Control value={searchValue} onChange={onChange} placeholder="Search query" />
		</Form.Group>
	);
};

const Home: FunctionComponent<{ search: string }> = (props) => {
	console.log(props.search);
	const charactersContext = useContext(CharacterContext);
	const indexContext = useContext(LunrIndexContext);

	const [characters, setCharacters] = useState(charactersContext.characters);

	const onSearch = (value: string) => {
		const searchResults = indexContext.index.search(`*${value}*`);
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
			<CardColumns>
				{characters.map((character) => {
					if (character.path) {
						let url: URL;
						try {
							url = new URL(character.path);
						} catch {
							url = new URL(`/characters/${character.path}`, window.location.href);
						}

						return (
							<Card>
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
						);
					} else {
						return null;
					}
				})}
			</CardColumns>
		</Container>
	);
};

export default Home;
