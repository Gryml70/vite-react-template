// Korttyper för Bilder - AI-genererade bilder

export interface CardType {
	id: string;
	title: string;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
}

export const BILDER_CARD_TYPES: CardType[] = [
	{
		id: "hero-bild",
		title: "Hero Bild",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "featured-image",
		title: "Featured Image",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "produkt-bild",
		title: "Produkt Bild",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "social-media-bild",
		title: "Social Media Bild",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "banner",
		title: "Banner",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "thumbnail",
		title: "Thumbnail",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "background",
		title: "Background",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "infographic",
		title: "Infographic",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	}
];
