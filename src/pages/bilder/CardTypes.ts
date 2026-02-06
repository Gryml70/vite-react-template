// Korttyper för Bilder - AI-genererade bilder

export interface CardType {
	id: string;
	title: string;
	defaultSystemPrompt: string;
	defaultCodeInstructions: string;
	isPhotoroom?: boolean; // Markera Photoroom-kort
}

export const BILDER_CARD_TYPES: CardType[] = [
	{
		id: "photoroom-remove-bg",
		title: "Ta bort bakgrund (Photoroom)",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# PHOTOROOM - TA BORT BAKGRUND

## Funktion:
Tar automatiskt bort bakgrunden från en bild med AI.

## Användning:
1. Ladda upp en bild
2. Klicka "Bearbeta"
3. Ladda ner resultat (PNG med transparent bakgrund)

## Parametrar:
- Format: PNG (med transparens)
- Channels: RGBA
- Automatisk objektdetektering`,
		isPhotoroom: true
	},
	{
		id: "hero-bild",
		title: "Hero Bild",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# HERO BILD - 16:9 FORMAT

## Funktion:
Bearbetar bilder för hero-sektioner på webbplatser.

## Process:
1. Ta bort bakgrund
2. Lägg till vit eller anpassad bakgrund
3. Beskär till 16:9 format (1920x1080px)
4. Optimera för webb (WebP)

## Photoroom API-parametrar:
- Format: WebP
- Aspect ratio: 16:9
- Background: Vit eller anpassad
- Output size: 1920x1080px`,
		isPhotoroom: true
	},
	{
		id: "featured-image",
		title: "Featured Image",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# FEATURED IMAGE - BLOGG/ARTIKEL

## Funktion:
Skapar featured images för blogginlägg och artiklar.

## Process:
1. Ta bort bakgrund
2. Lägg till neutral bakgrund
3. Beskär till 1200x630px (optimal för delning)
4. Exportera som WebP

## Photoroom API-parametrar:
- Format: WebP
- Output size: 1200x630px
- Background: Neutral/vit`,
		isPhotoroom: true
	},
	{
		id: "produkt-bild",
		title: "Produkt Bild",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# PRODUKTBILD FÖR WEBBUTIK

## Automatisk process:
1. Ta bort bakgrund från uppladdad bild
2. Lägg till vit studiobakgrund
3. Skapa kontaktskugga + djupskugga (samma riktning)
4. Mjukt studoljus (soft lighting)
5. Exportera som WebP med copyright metadata

## Photoroom API-parametrar:
- Background: Vit studio (#FFFFFF)
- Lighting: Soft
- Shadow: Contact + Drop (bottom-right, intensity 0.7)
- Format: WebP
- Copyright: Läggs till i EXIF-data`,
		isPhotoroom: true
	},
	{
		id: "social-media-bild",
		title: "Social Media Bild",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# SOCIAL MEDIA BILD - 1:1 FORMAT

## Funktion:
Optimerar bilder för Instagram, Facebook och andra sociala medier.

## Process:
1. Ta bort bakgrund
2. Lägg till färgad eller gradient bakgrund
3. Beskär till 1:1 format (1080x1080px)
4. Exportera som WebP/JPEG

## Photoroom API-parametrar:
- Format: WebP
- Aspect ratio: 1:1
- Output size: 1080x1080px
- Background: Anpassningsbar`,
		isPhotoroom: true
	},
	{
		id: "banner",
		title: "Banner",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# BANNER - BRED FORMAT

## Funktion:
Skapar banners för webbplatser och kampanjer.

## Process:
1. Ta bort bakgrund
2. Lägg till anpassad bakgrund
3. Beskär till banner-format (1200x400px)
4. Exportera som WebP

## Photoroom API-parametrar:
- Format: WebP
- Output size: 1200x400px
- Background: Anpassningsbar`,
		isPhotoroom: true
	},
	{
		id: "thumbnail",
		title: "Thumbnail",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# THUMBNAIL - LITEN FÖRHANDSVISNING

## Funktion:
Skapar små thumbnails för produkter, videos och artiklar.

## Process:
1. Ta bort bakgrund
2. Lägg till vit eller färgad bakgrund
3. Beskär till 300x300px
4. Exportera som WebP

## Photoroom API-parametrar:
- Format: WebP
- Output size: 300x300px
- Background: Vit eller anpassad`,
		isPhotoroom: true
	},
	{
		id: "background",
		title: "Background",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# BACKGROUND - BAKGRUNDSBILD

## Funktion:
Bearbetar bilder för användning som bakgrund på webbplatser.

## Process:
1. Optimera för stor skärm
2. Lägg till blur eller filter (optional)
3. Beskär till 1920x1080px
4. Exportera som WebP

## Photoroom API-parametrar:
- Format: WebP
- Output size: 1920x1080px
- Optimization: Webb-optimerad`,
		isPhotoroom: true
	},
	{
		id: "infographic",
		title: "Infographic",
		defaultSystemPrompt: "",
		defaultCodeInstructions: `# INFOGRAPHIC - INFORMATIONSGRAFIK

## Funktion:
Bearbetar bilder för infografik och presentationer.

## Process:
1. Ta bort bakgrund
2. Lägg till vit eller transparent bakgrund
3. Beskär till 800x1200px (vertikal)
4. Exportera som PNG/WebP

## Photoroom API-parametrar:
- Format: PNG eller WebP
- Output size: 800x1200px
- Background: Vit eller transparent`,
		isPhotoroom: true
	}
];
