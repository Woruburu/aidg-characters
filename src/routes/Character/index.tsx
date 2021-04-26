import CopyButton from "components/CopyLinkButton";
import Loading from "components/Loading";
import ManualLoad from "components/ManualLoad";
import NotFound from "components/NotFound";
import { CharacterContext } from "ContextProvider/CharacterContextProvider";
import { lazy, Suspense } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { Badge, Col, Container, Image, Row, SafeAnchor, Tab, Tabs } from "react-bootstrap";
import characterLoad from "utils/exif";

const DecodeValues = lazy(() => import("components/DecodeValues"));

const Character = (props: { id: string }) => {
	const [characterBase64, setCharacterBase64] = useState("");
	const [error, setError] = useState<undefined | string>(undefined);

	const state = useContext(CharacterContext);

	let path = "";
	try {
		path = atob(props.id);
	} catch {
		return <NotFound />;
	}
	const character = state.characters.find((e) => e.path === path);
	if (!character || !character.path) {
		return <NotFound />;
	}

	let url: URL;
	try {
		url = new URL(character.path);
	} catch {
		url = new URL(`/characters/${character.path}`, window.location.href);
	}

	const getBase64 = async () => {
		const response = await fetch(url.toString());
		if (response.ok) {
			try {
				const blob = await response.blob();
				setCharacterBase64(await characterLoad.getBase64(blob));
			} catch (e) {
				setError(e.toString());
				return;
			}
		}
	};

	useEffect(() => {
		getBase64();
	}, []);

	return (
		<Container>
			<Tabs defaultActiveKey="profile">
				<Tab eventKey="profile" title="Profile">
					<Row>
						<Col sm={6} md={4} xl={3} className="d-flex">
							<Image
								className="mx-auto mb-auto mt-4"
								alt={character.title}
								src={url.toString()}
							/>
						</Col>
						<Col sm={6} md={8} xl={9}>
							<div className="mt-3">
								<h1>{character.title}</h1>
								{character.tags && (
									<div tabIndex={0} className="mb-3 card-tags">
										<strong>Tags: </strong>
										{character.tags.map((tag) => (
											<Badge
												className="mr-1"
												variant="primary"
												as={SafeAnchor}
												href={`/?search=${tag}`}
											>
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
								<div className="mb-4">
									<h5>Usage</h5>
									<p>
										Requires you to be running a script that supports loading
										characters
										{character.relatedPrompts &&
										character.relatedPrompts.length > 0 ? (
											<span>
												. See <strong>Related Prompts</strong> above, or use
												one{" "}
											</span>
										) : (
											<span>, </span>
										)}
										such as{" "}
										<a
											rel="nofollow noreferrer"
											href="https://prompts.aidg.club/1141"
											target="_blank"
										>
											Infinity Brothel
										</a>
										. Images and links can be loaded with the{" "}
										<a
											href="https://github.com/CoomersGuide/CoomersGuide.github.io/raw/main/Tools/scripts/aidg.character.injector.user.js"
											target="_blank"
											rel="nofollow noreferrer"
										>
											userscript
										</a>
										, or you can load the character manually.
									</p>
								</div>
								<div className="d-flex flex-column flex-sm-row">
									<CopyButton
										className="mb-2 mb-sm-0 mr-sm-4"
										link={url.toString()}
									/>
									<a
										download
										className="btn btn-outline-secondary"
										href={url.toString()}
									>
										Download
									</a>
								</div>
								<ManualLoad
									className="my-4"
									error={error}
									base64={characterBase64}
								/>
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
						<DecodeValues characterUrl={url} title={character.title ?? ""} />
					</Suspense>
				</Tab>
			</Tabs>
		</Container>
	);
};

export default Character;
