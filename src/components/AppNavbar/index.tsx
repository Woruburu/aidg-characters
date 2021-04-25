import { Container, Nav, Navbar } from "react-bootstrap";

const AppNavbar = () => {
	return (
		<Navbar className="mb-4" bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand href="/">/aidg/ Character Repository</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link
							rel="nofollow norefferer"
							target="_blank"
							href="https://github.com/CoomersGuide/CoomersGuide.github.io/raw/main/Tools/scripts/aidg.character.injector.user.js"
						>
							Usercript
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default AppNavbar;
