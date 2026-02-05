// Korttyper för Mark Up - Schema Markup

export interface CardType {
	id: string;
	title: string;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
}

export const MARKUP_CARD_TYPES: CardType[] = [
	{
		id: "article-schema",
		title: "Article Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "product-schema",
		title: "Product Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "faq-schema",
		title: "FAQ Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "breadcrumb-schema",
		title: "Breadcrumb Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "organization-schema",
		title: "Organization Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "local-business-schema",
		title: "Local Business Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "review-schema",
		title: "Review Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	},
	{
		id: "howto-schema",
		title: "HowTo Schema",
		defaultSystemPrompt: "",
		defaultCodeInstructions: ""
	}
];
