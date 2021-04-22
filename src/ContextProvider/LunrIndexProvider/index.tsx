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

		//doing this will increase index size, however the search seems to work improperly if we don't
		//e.g. purple will not match purple heart without these disabled
		this.pipeline.remove(lunr.stemmer);
		this.searchPipeline.remove(lunr.stemmer);
		this.pipeline.remove(lunr.trimmer);
		this.searchPipeline.remove(lunr.trimmer);

		characterContext.characters.forEach((doc) => {
			this.add(doc);
		}, this);
	});

	return (
		<LunrIndexContext.Provider value={{ index }}>{props.children}</LunrIndexContext.Provider>
	);
};

export { LunrIndexContext, LunrIndexContextProvider };
