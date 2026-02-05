// Korttyper för Illustrationer - AI-genererade illustrationer

export interface CardType {
	id: string;
	title: string;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
}

export const ILLUSTRATIONER_CARD_TYPES: CardType[] = [
	{
		id: "ikon",
		title: "Ikon",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "diagram",
		title: "Diagram",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "flowchart",
		title: "Flowchart",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "karaktar",
		title: "Karaktär",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "scene",
		title: "Scene",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "logo",
		title: "Logo",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "pattern",
		title: "Pattern",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "concept-art",
		title: "Concept Art",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	}
];
