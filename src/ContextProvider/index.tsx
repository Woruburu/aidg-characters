import { FunctionComponent } from "preact";
import { CharacterContextProvider } from "./CharacterContextProvider";
import { LunrIndexContextProvider } from "./LunrIndexProvider";

const ContextProvider: FunctionComponent = (props) => {
	return (
		<CharacterContextProvider>
			<LunrIndexContextProvider>{props.children}</LunrIndexContextProvider>
		</CharacterContextProvider>
	);
};

export default ContextProvider;
