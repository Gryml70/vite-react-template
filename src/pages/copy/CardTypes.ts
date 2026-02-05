// Korttyper för Copy - Text och Ton

export interface CardType {
	id: string;
	title: string;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
}

export const COPY_CARD_TYPES: CardType[] = [
	{
		id: "ton-profil",
		title: "Ton-profil",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "malgrupp",
		title: "Målgrupp",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "avsikt",
		title: "Avsikt",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "varumarkesrost",
		title: "Varumärkesröst",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "ordval",
		title: "Ordval",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "formell-niva",
		title: "Formell Nivå",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "emotionell-ton",
		title: "Emotionell Ton",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "call-to-action",
		title: "Call to Action",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	}
];
