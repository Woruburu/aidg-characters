import { parse } from "exifr";

const getBase64 = async (image: Blob): Promise<string> => {
	//@ts-ignore
	const exif = await parse(image, true);

	let encodedCharacter: string = "";
	if (exif.ImageDescription) {
		// JPG image
		encodedCharacter = exif.ImageDescription.trim();
	} else if (
		// PNG image
		exif.description &&
		exif.description.value
	) {
		encodedCharacter = exif.description.value.trim();
	}

	if (!encodedCharacter) {
		throw new Error("Could not find any embedded data");
	}

	return encodedCharacter;
};

export default { getBase64 };
