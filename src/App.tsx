import AppNavbar from "components/AppNavbar";
import Loading from "components/Loading";
import Redirect from "components/Redirect";
import ContextProvider from "ContextProvider";
import AsyncRoute from "preact-async-route";
import Router, { Route } from "preact-router";

const App = () => {
	return (
		<ContextProvider>
			<AppNavbar />
			<Router>
				<AsyncRoute
					path="/"
					getComponent={async () => {
						const module = await import("./routes/Home");
						return module.default;
					}}
					loading={Loading}
				/>
				<Route path="/characters" to="/" component={Redirect} />
				<AsyncRoute
					path="/characters/:id"
					getComponent={async () => {
						const module = await import("./routes/Character");
						return module.default;
					}}
					loading={Loading}
				/>
			</Router>
		</ContextProvider>
	);
};

export default App;
