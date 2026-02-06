/**
 * API för Photoroom - AI-bildredigering
 */

/**
 * Ta bort bakgrund från en bild
 */
export async function removeBackground(imageFile: File): Promise<Blob> {
	const apiKey = process.env.VITE_PHOTOROOM_API_KEY;
	
	if (!apiKey) {
		throw new Error("VITE_PHOTOROOM_API_KEY saknas i .env");
	}

	const formData = new FormData();
	formData.append('image_file', imageFile);
	formData.append('format', 'png');
	formData.append('channels', 'rgba');

	const response = await fetch('https://sdk.photoroom.com/v1/segment', {
		method: 'POST',
		headers: {
			'x-api-key': apiKey,
		},
		body: formData,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Photoroom API-fel: ${errorText}`);
	}

	return await response.blob();
}

/**
 * Byt bakgrund på en bild
 */
export async function replaceBackground(
	imageFile: File,
	backgroundType: 'color' | 'prompt',
	backgroundValue: string
): Promise<Blob> {
	const apiKey = process.env.VITE_PHOTOROOM_API_KEY;
	
	if (!apiKey) {
		throw new Error("VITE_PHOTOROOM_API_KEY saknas i .env");
	}

	const formData = new FormData();
	formData.append('image_file', imageFile);
	
	if (backgroundType === 'color') {
		formData.append('background.color', backgroundValue);
	} else {
		formData.append('background.prompt', backgroundValue);
	}

	const response = await fetch('https://sdk.photoroom.com/v1/background', {
		method: 'POST',
		headers: {
			'x-api-key': apiKey,
		},
		body: formData,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Photoroom API-fel: ${errorText}`);
	}

	return await response.blob();
}

/**
 * Skapa professionellt produktfoto med AI-bakgrund
 */
export async function createProductPhoto(
	imageFile: File,
	prompt: string,
	style: 'realistic' | 'artistic' | 'minimal' = 'realistic',
	lighting: 'soft' | 'dramatic' | 'natural' = 'soft'
): Promise<Blob> {
	const apiKey = process.env.VITE_PHOTOROOM_API_KEY;
	
	if (!apiKey) {
		throw new Error("VITE_PHOTOROOM_API_KEY saknas i .env");
	}

	const formData = new FormData();
	formData.append('image_file', imageFile);
	formData.append('prompt', prompt);
	formData.append('style', style);
	formData.append('lighting', lighting);

	const response = await fetch('https://sdk.photoroom.com/v1/instant-backgrounds', {
		method: 'POST',
		headers: {
			'x-api-key': apiKey,
		},
		body: formData,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Photoroom API-fel: ${errorText}`);
	}

	return await response.blob();
}
