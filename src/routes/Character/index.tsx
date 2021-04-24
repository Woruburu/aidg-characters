import CopyLinkButton from "components/CopyLinkButton";
import Loading from "components/Loading";
import NotFound from "components/NotFound";
import { CharacterContext } from "ContextProvider/CharacterContextProvider";
import { lazy, Suspense } from "preact/compat";
import { useContext } from "preact/hooks";
import { Badge, Col, Container, Image, Row, Tab, Tabs } from "react-bootstrap";

const DecodeValues = lazy(() => import("components/DecodeValues"));

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
					<Suspense
						fallback={
							<div className="mt-3">
								<Loading />
							</div>
						}
					>
						<DecodeValues characterUrl={url} />
					</Suspense>
				</Tab>
			</Tabs>
		</Container>
	);
};

export default Character;
