import Loading from "components/Loading";
import { createContext, FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

export interface ICharacter {
	path?: string;
	title?: string;
	description?: string;
	tags?: string[];
	relatedPrompts?: string[];
}

export interface ICharacterProviderState {
	characters: ICharacter[];
}

const initialState: ICharacterProviderState = {
	characters: [],
};

const CharacterContext = createContext(initialState);

const CharacterContextProvider: FunctionComponent = (props) => {
	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState(initialState);

	const getManifest = async () => {
		const response = await fetch("/characters/_manifest.json");
		if (response.ok) {
			const json = await response.json();
			setValue(json);
		}
		setLoading(false);
	};

	useEffect(() => {
		getManifest();
	}, []);

	return loading ? (
		<Loading />
	) : (
		<CharacterContext.Provider value={value}>{props.children}</CharacterContext.Provider>
	);
};

export { CharacterContext, CharacterContextProvider };
