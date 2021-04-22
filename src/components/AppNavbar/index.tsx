import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const AppNavbar = () => {
	return (
		<Navbar className="mb-4" bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand href="/">/aidg/ Character Repository</Navbar.Brand>
			</Container>
		</Navbar>
	);
};

export default AppNavbar;
