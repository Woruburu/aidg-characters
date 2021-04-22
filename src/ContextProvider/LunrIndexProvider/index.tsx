import { CharacterContext } from "ContextProvider/CharacterContextProvider";
import lunr from "lunr";
import { createContext, FunctionComponent } from "preact";
import { useContext } from "preact/hooks";

interface ILunrIndexProviderState {
	index: lunr.Index;
}

const initialState: ILunrIndexProviderState = {
	index: lunr(() => {}),
};

const LunrIndexContext = createContext(initialState);

const LunrIndexContextProvider: FunctionComponent = (props) => {
	const characterContext = useContext(CharacterContext);
	var index = lunr(function () {
		this.ref("path");
		this.field("title");
		this.field("description");
		this.field("tags");

		characterContext.characters.forEach((doc) => {
			this.add(doc);
		}, this);
	});

	return (
		<LunrIndexContext.Provider value={{ index }}>{props.children}</LunrIndexContext.Provider>
	);
};

export { LunrIndexContext, LunrIndexContextProvider };
