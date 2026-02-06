import { useState, useEffect } from "react";
import { COPY_CARD_TYPES } from "./CardTypes";
import { getTonePrompt } from "./TonePrompts";
import { getTargetAudiencePrompt } from "./TargetAudiencePrompts";
import { getIntentPrompt } from "./IntentPrompts";
import { getBrandVoicePrompt } from "./BrandVoicePrompts";
import { getWordChoicePrompt } from "./WordChoicePrompts";
import { getFormalityPrompt } from "./FormalityPrompts";
import { getEmotionalTonePrompt } from "./EmotionalTonePrompts";
import { getCallToActionPrompt } from "./CallToActionPrompts";

/** Copy - Text och Ton */
export default function Copy() {
	return (
		<div style={styles.wrapper}>
			<div style={styles.container}>
				<h1 style={styles.title}>Copy</h1>
				
				<div style={styles.scrollContainer}>
					{COPY_CARD_TYPES.map((cardType) => (
						<CardComponent key={cardType.id} cardType={cardType} />
					))}
				</div>
			</div>
		</div>
	);
}

function CardComponent({ cardType }: { cardType: any }) {
	const [keyword, setKeyword] = useState("");
	const [systemPrompt, setSystemPrompt] = useState("");
	const [userPrompt, setUserPrompt] = useState("");
	const [codeInstructions, setCodeInstructions] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const savedKeyword = localStorage.getItem(`copy_keyword_${cardType.id}`);
		const savedSystemPrompt = localStorage.getItem(`copy_systemPrompt_${cardType.id}`);
		const savedCode = localStorage.getItem(`copy_code_${cardType.id}`);
		
		if (savedKeyword) setKeyword(savedKeyword);
		
		// För Ton-profil: Ladda systemprompt baserat på sparad ton
		if (cardType.id === 'ton-profil' && savedKeyword) {
			const tonePrompt = getTonePrompt(savedKeyword);
			if (tonePrompt) {
				setSystemPrompt(savedSystemPrompt || tonePrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Målgrupp: Ladda systemprompt baserat på sparad målgrupp
		else if (cardType.id === 'malgrupp' && savedKeyword) {
			const audiencePrompt = getTargetAudiencePrompt(savedKeyword);
			if (audiencePrompt) {
				setSystemPrompt(savedSystemPrompt || audiencePrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Avsikt: Ladda systemprompt baserat på sparad avsikt
		else if (cardType.id === 'avsikt' && savedKeyword) {
			const intentPrompt = getIntentPrompt(savedKeyword);
			if (intentPrompt) {
				setSystemPrompt(savedSystemPrompt || intentPrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Varumärkesröst: Ladda systemprompt baserat på sparad röst
		else if (cardType.id === 'varumarkesrost' && savedKeyword) {
			const voicePrompt = getBrandVoicePrompt(savedKeyword);
			if (voicePrompt) {
				setSystemPrompt(savedSystemPrompt || voicePrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Ordval: Ladda systemprompt baserat på sparat ordval
		else if (cardType.id === 'ordval' && savedKeyword) {
			const wordChoicePrompt = getWordChoicePrompt(savedKeyword);
			if (wordChoicePrompt) {
				setSystemPrompt(savedSystemPrompt || wordChoicePrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Formell Nivå: Ladda systemprompt baserat på sparad nivå
		else if (cardType.id === 'formell-niva' && savedKeyword) {
			const formalityPrompt = getFormalityPrompt(savedKeyword);
			if (formalityPrompt) {
				setSystemPrompt(savedSystemPrompt || formalityPrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Emotionell Ton: Ladda systemprompt baserat på sparad ton
		else if (cardType.id === 'emotionell-ton' && savedKeyword) {
			const emotionalPrompt = getEmotionalTonePrompt(savedKeyword);
			if (emotionalPrompt) {
				setSystemPrompt(savedSystemPrompt || emotionalPrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		// För Call to Action: Ladda systemprompt baserat på sparad CTA
		else if (cardType.id === 'call-to-action' && savedKeyword) {
			const ctaPrompt = getCallToActionPrompt(savedKeyword);
			if (ctaPrompt) {
				setSystemPrompt(savedSystemPrompt || ctaPrompt);
			} else {
				setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
			}
		}
		else {
			setSystemPrompt(savedSystemPrompt || cardType.defaultSystemPrompt);
		}
		
		setCodeInstructions(savedCode || cardType.defaultCodeInstructions);
	}, [cardType]);

	const saveData = () => {
		localStorage.setItem(`copy_keyword_${cardType.id}`, keyword);
		localStorage.setItem(`copy_systemPrompt_${cardType.id}`, systemPrompt);
		alert(`${cardType.title} sparad`);
	};

	const saveCode = () => {
		localStorage.setItem(`copy_code_${cardType.id}`, codeInstructions);
		alert("Kod sparad");
	};

	const countStats = (text: string) => {
		const chars = text.length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		return { chars, words };
	};

	const sendPrompt = async () => {
		if (!systemPrompt.trim()) {
			setError("Skriv en system prompt");
			return;
		}

		if (!userPrompt.trim()) {
			setError("Skriv ett meddelande");
			return;
		}

		setLoading(true);
		setError(null);
		setResponse("");

		try {
			let fullSystemPrompt = systemPrompt.trim();
			if (keyword.trim()) {
				// För kort med dropdowns används keyword som val (redan inkluderad i systemPrompt)
				// För andra kort används keyword som nyckelord
				const dropdownCards = ['ton-profil', 'malgrupp', 'avsikt', 'varumarkesrost', 'ordval', 'formell-niva', 'emotionell-ton', 'call-to-action'];
				if (!dropdownCards.includes(cardType.id)) {
					fullSystemPrompt = `${systemPrompt.trim()}\n\nVALT NYCKELORD: ${keyword.trim()}`;
				}
			}

			const apiResponse = await fetch("/api/system-prompts/test", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					systemPrompt: fullSystemPrompt,
					userMessage: userPrompt.trim(),
				}),
			});

			const data = await apiResponse.json();
			if (!apiResponse.ok) throw new Error(data.error || "Kunde inte få svar");

			setResponse(data.response);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ett fel uppstod");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.card}>
			<div style={styles.cardHeader}>
				<h2 style={styles.cardTitle}>{cardType.title}</h2>
			</div>

			<div style={styles.cardBody}>
				{error && (
					<div style={styles.error}>
						<strong>Fel:</strong> {error}
					</div>
				)}

			<div style={styles.formGroup}>
				<label style={styles.label}>
					{cardType.id === 'ton-profil' ? 'Välj ton' : 
					 cardType.id === 'malgrupp' ? 'Välj målgrupp' :
					 cardType.id === 'avsikt' ? 'Välj avsikt' :
					 cardType.id === 'varumarkesrost' ? 'Välj varumärkesröst' :
					 cardType.id === 'ordval' ? 'Välj ordval' :
					 cardType.id === 'formell-niva' ? 'Välj formell nivå' :
					 cardType.id === 'emotionell-ton' ? 'Välj emotionell ton' :
					 cardType.id === 'call-to-action' ? 'Välj CTA-typ' :
					 'Valt nyckelord'}
				</label>
				{cardType.id === 'ton-profil' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedTone = e.target.value;
							setKeyword(selectedTone);
							
							// Ladda systemprompt för vald ton
							if (selectedTone) {
								const tonePrompt = getTonePrompt(selectedTone);
								if (tonePrompt) {
									setSystemPrompt(tonePrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj ton --</option>
						<optgroup label="PROFESSIONELLA STILAR">
							<option value="Professionell">Professionell</option>
							<option value="Formell">Formell</option>
							<option value="Auktoritativ">Auktoritativ</option>
							<option value="Teknisk">Teknisk</option>
							<option value="Akademisk">Akademisk</option>
							<option value="Prestigefylld">Prestigefylld</option>
						</optgroup>
						<optgroup label="PERSONLIGA STILAR">
							<option value="Vänlig">Vänlig</option>
							<option value="Personlig">Personlig</option>
							<option value="Empatisk">Empatisk</option>
							<option value="Conversational">Conversational (samtalston)</option>
							<option value="Tillgänglig">Tillgänglig</option>
						</optgroup>
						<optgroup label="ENERGISKA STILAR">
							<option value="Entusiastisk">Entusiastisk</option>
							<option value="Energisk">Energisk</option>
							<option value="Inspirerande">Inspirerande</option>
							<option value="Urgency">Urgency (brådskande)</option>
						</optgroup>
						<optgroup label="KREATIVA STILAR">
							<option value="Humoristisk">Humoristisk</option>
							<option value="Lekfull">Lekfull</option>
							<option value="Storytelling">Storytelling</option>
							<option value="Subtil">Subtil</option>
						</optgroup>
						<optgroup label="BALANSERADE STILAR">
							<option value="Casual">Casual</option>
							<option value="Lugn">Lugn</option>
							<option value="Trygg">Trygg</option>
							<option value="Seriös">Seriös</option>
							<option value="Direkt">Direkt</option>
						</optgroup>
					</select>
				) : cardType.id === 'malgrupp' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedAudience = e.target.value;
							setKeyword(selectedAudience);
							
							// Ladda systemprompt för vald målgrupp
							if (selectedAudience) {
								const audiencePrompt = getTargetAudiencePrompt(selectedAudience);
								if (audiencePrompt) {
									setSystemPrompt(audiencePrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj målgrupp --</option>
						<optgroup label="DEMOGRAFISKA MÅLGRUPPER">
							<option value="unga-vuxna-18-25">Unga vuxna (18-25 år)</option>
							<option value="millennials-26-40">Millennials (26-40 år)</option>
							<option value="generation-x-41-56">Generation X (41-56 år)</option>
							<option value="baby-boomers-57-75">Baby Boomers (57-75 år)</option>
						</optgroup>
						<optgroup label="B2B MÅLGRUPPER">
							<option value="smaa-foeretagare">Småföretagare</option>
							<option value="enterprise-beslutsfattare">Enterprise-beslutsfattare</option>
							<option value="startups">Startups & Tech-företag</option>
						</optgroup>
						<optgroup label="BRANSCHSPECIFIKA MÅLGRUPPER">
							<option value="ecommerce">E-handlare</option>
							<option value="kreatorer-influencers">Kreatörer & Influencers</option>
							<option value="haalsa-wellness">Hälsa & Wellness</option>
						</optgroup>
						<optgroup label="PSYKOGRAFISKA MÅLGRUPPER">
							<option value="early-adopters">Early Adopters & Innovatörer</option>
							<option value="vaerdedrivna">Värdedrivna konsumenter</option>
							<option value="bekvaemlighetssoeakande">Bekvämlighetsökande</option>
							<option value="lyxkonsumenter">Lyxkonsumenter</option>
							<option value="budgetmedvetna">Budgetmedvetna</option>
						</optgroup>
						<optgroup label="LIVSSTILSBASERADE MÅLGRUPPER">
							<option value="foeraealdrar">Föräldrar (småbarn)</option>
							<option value="studenter">Studenter</option>
							<option value="pensionaerer">Pensionärer</option>
							<option value="yrkesverksamma-singlar">Yrkesverksamma singlar</option>
							<option value="distansarbetare">Distansarbetare & Digitala nomader</option>
						</optgroup>
						<optgroup label="NISCHADE MÅLGRUPPER">
							<option value="gamers">Gamers & E-sport</option>
							<option value="fitness-entusiaster">Fitness-entusiaster</option>
							<option value="matentusiaster">Matentusiaster & Foodies</option>
							<option value="resenärer">Resenärer & Äventyrare</option>
							<option value="tech-early-adopters">Tech-entusiaster</option>
						</optgroup>
					</select>
				) : cardType.id === 'avsikt' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedIntent = e.target.value;
							setKeyword(selectedIntent);
							
							// Ladda systemprompt för vald avsikt
							if (selectedIntent) {
								const intentPrompt = getIntentPrompt(selectedIntent);
								if (intentPrompt) {
									setSystemPrompt(intentPrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj avsikt --</option>
						<optgroup label="INFORMATIVA AVSIKTER">
							<option value="informera">Informera</option>
							<option value="utbilda">Utbilda</option>
							<option value="inspirera">Inspirera</option>
							<option value="underhalla">Underhålla</option>
						</optgroup>
						<optgroup label="ÖVERTYGANDE AVSIKTER">
							<option value="salja">Sälja</option>
							<option value="overtala">Övertala</option>
							<option value="konvertera">Konvertera</option>
							<option value="bygga-foertroende">Bygga förtroende</option>
						</optgroup>
						<optgroup label="ENGAGERANDE AVSIKTER">
							<option value="engagera">Engagera</option>
							<option value="skapa-medvetenhet">Skapa medvetenhet</option>
							<option value="bygga-relation">Bygga relation</option>
							<option value="behalla-kunder">Behålla kunder</option>
						</optgroup>
						<optgroup label="YTTERLIGARE AVSIKTER">
							<option value="positionera">Positionera</option>
							<option value="lansera">Lansera</option>
							<option value="reaktivera">Reaktivera</option>
							<option value="onboarda">Onboarda</option>
							<option value="upsella">Upsella</option>
							<option value="cross-sella">Cross-sella</option>
							<option value="hantera-invandningar">Hantera invändningar</option>
							<option value="samla-feedback">Samla feedback</option>
							<option value="bygga-community">Bygga community</option>
							<option value="skapa-urgency">Skapa urgency</option>
							<option value="storytelling">Storytelling</option>
							<option value="jämföra">Jämföra</option>
						</optgroup>
					</select>
				) : cardType.id === 'varumarkesrost' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedVoice = e.target.value;
							setKeyword(selectedVoice);
							
							// Ladda systemprompt för vald varumärkesröst
							if (selectedVoice) {
								const voicePrompt = getBrandVoicePrompt(selectedVoice);
								if (voicePrompt) {
									setSystemPrompt(voicePrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj varumärkesröst --</option>
						<optgroup label="KLASSISKA VARUMÄRKESRÖSTER">
							<option value="innovativ-pionjar">Innovativ Pionjär</option>
							<option value="paalitlig-expert">Pålitlig Expert</option>
							<option value="varm-vaen">Varm Vän</option>
							<option value="lekfull-rebell">Lekfull Rebell</option>
							<option value="lyxig-sofistikerad">Lyxig & Sofistikerad</option>
							<option value="rak-aarlig">Rak & Ärlig</option>
							<option value="pedagogisk-guide">Pedagogisk Guide</option>
							<option value="aktivist-forandring">Aktivist & Förändring</option>
							<option value="minimalistisk-zen">Minimalistisk & Zen</option>
							<option value="nostalgisk-heritage">Nostalgisk & Heritage</option>
						</optgroup>
						<optgroup label="MODERNA VARUMÄRKESRÖSTER">
							<option value="tech-futuristisk">Tech & Futuristisk</option>
							<option value="urban-street">Urban & Street</option>
							<option value="wellness-holistisk">Wellness & Holistisk</option>
							<option value="adventure-outdoor">Adventure & Outdoor</option>
							<option value="scientific-research">Scientific & Research</option>
						</optgroup>
						<optgroup label="NISCHADE VARUMÄRKESRÖSTER">
							<option value="artisan-craft">Artisan & Craft</option>
							<option value="gaming-esports">Gaming & E-sports</option>
							<option value="foodie-kulinarisk">Foodie & Kulinarisk</option>
							<option value="fashion-style">Fashion & Style</option>
							<option value="financial-wealth">Financial & Wealth</option>
							<option value="parent-family">Parent & Family</option>
							<option value="eco-sustainable">Eco & Sustainable</option>
							<option value="pet-animal">Pet & Animal</option>
							<option value="creative-artistic">Creative & Artistic</option>
						</optgroup>
					</select>
				) : cardType.id === 'ordval' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedChoice = e.target.value;
							setKeyword(selectedChoice);
							
							// Ladda systemprompt för valt ordval
							if (selectedChoice) {
								const choicePrompt = getWordChoicePrompt(selectedChoice);
								if (choicePrompt) {
									setSystemPrompt(choicePrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj ordval --</option>
						<optgroup label="TILLGÄNGLIGHET">
							<option value="enkla-vardagliga">Enkla & Vardagliga</option>
							<option value="inkluderande-tillgangliga">Inkluderande & Tillgängliga</option>
						</optgroup>
						<optgroup label="SPECIALISERING">
							<option value="tekniska-precisa">Tekniska & Precisa</option>
							<option value="data-driven-kvantitativa">Data-driven & Kvantitativa</option>
							<option value="juridiska-formella">Juridiska & Formella</option>
							<option value="medicinska-vetenskapliga">Medicinska & Vetenskapliga</option>
						</optgroup>
						<optgroup label="ENERGI">
							<option value="kraftfulla-actionord">Kraftfulla Actionord</option>
							<option value="kontrastrika-dramatiska">Kontrastrika & Dramatiska</option>
						</optgroup>
						<optgroup label="KREATIVITET">
							<option value="sensoriska-beskrivande">Sensoriska & Beskrivande</option>
							<option value="metaforiska-bildliga">Metaforiska & Bildliga</option>
							<option value="storytelling-narrativa">Storytelling & Narrativa</option>
							<option value="rytmiska-musikaliska">Rytmiska & Musikaliska</option>
						</optgroup>
						<optgroup label="KÄNSLOR">
							<option value="emotionella-vaerderings">Emotionella & Värderingsbaserade</option>
							<option value="humoristiska-lekfulla">Humoristiska & Lekfulla</option>
						</optgroup>
						<optgroup label="TON">
							<option value="positiva-uppbyggande">Positiva & Uppbyggande</option>
							<option value="seriosa-hogladdade">Seriösa & Högladdade</option>
						</optgroup>
						<optgroup label="PRECISION">
							<option value="konkreta-specifika">Konkreta & Specifika</option>
						</optgroup>
						<optgroup label="STIL">
							<option value="trendiga-moderna">Trendiga & Moderna</option>
							<option value="tidlosa-klassiska">Tidlösa & Klassiska</option>
							<option value="minimala-avskalade">Minimala & Avskalade</option>
						</optgroup>
						<optgroup label="DJUP">
							<option value="filosofiska-reflekterande">Filosofiska & Reflekterande</option>
							<option value="rika-detaljerade">Rika & Detaljerade</option>
						</optgroup>
						<optgroup label="KULTURELLT">
							<option value="lokala-regionala">Lokala & Regionala</option>
							<option value="globala-internationella">Globala & Internationella</option>
						</optgroup>
					</select>
				) : cardType.id === 'formell-niva' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedFormality = e.target.value;
							setKeyword(selectedFormality);
							
							// Ladda systemprompt för vald formell nivå
							if (selectedFormality) {
								const formalityPrompt = getFormalityPrompt(selectedFormality);
								if (formalityPrompt) {
									setSystemPrompt(formalityPrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj formell nivå --</option>
						<optgroup label="FORMALITETSNIVÅER">
							<option value="mycket-formell">Mycket formell</option>
							<option value="formell">Formell</option>
							<option value="neutral">Neutral</option>
							<option value="casual">Casual</option>
							<option value="informell">Informell</option>
							<option value="akademisk">Akademisk</option>
							<option value="diplomatisk">Diplomatisk</option>
							<option value="byraakratisk">Byråkratisk</option>
							<option value="affarsmaessig">Affärsmässig</option>
							<option value="konversationell">Konversationell</option>
							<option value="vanllig">Vänlig</option>
							<option value="intimt-personlig">Intimt personlig</option>
							<option value="respektfull-hoevisk">Respektfull & Hövisk</option>
							<option value="tekniskt-neutral">Tekniskt neutral</option>
							<option value="pedagogiskt-tillganglig">Pedagogiskt tillgänglig</option>
							<option value="journalistisk">Journalistisk</option>
							<option value="poetisk">Poetisk</option>
							<option value="instruktiv">Instruktiv</option>
							<option value="inspirerande">Inspirerande</option>
							<option value="satirisk">Satirisk</option>
							<option value="berattande">Berättande</option>
							<option value="reflekterande">Reflekterande</option>
							<option value="militant-aktivistisk">Militant & Aktivistisk</option>
							<option value="meditativ">Meditativ</option>
						</optgroup>
					</select>
				) : cardType.id === 'emotionell-ton' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedEmotion = e.target.value;
							setKeyword(selectedEmotion);
							
							// Ladda systemprompt för vald emotionell ton
							if (selectedEmotion) {
								const emotionPrompt = getEmotionalTonePrompt(selectedEmotion);
								if (emotionPrompt) {
									setSystemPrompt(emotionPrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj emotionell ton --</option>
						<optgroup label="POSITIVA KÄNSLOR">
							<option value="glad-optimistisk">Glad & Optimistisk</option>
							<option value="lugn-harmonisk">Lugn & Harmonisk</option>
							<option value="spannande-aventyrlig">Spännande & Äventyrlig</option>
						</optgroup>
						<optgroup label="EMPATISKA KÄNSLOR">
							<option value="empatisk-stottande">Empatisk & Stöttande</option>
							<option value="motiverande-inspirerande">Motiverande & Inspirerande</option>
						</optgroup>
						<optgroup label="NEUTRALA KÄNSLOR">
							<option value="neutral-objektiv">Neutral & Objektiv</option>
						</optgroup>
						<optgroup label="KRAFTFULLA KÄNSLOR">
							<option value="passionerad-intensiv">Passionerad & Intensiv</option>
							<option value="modig-kraftfull">Modig & Kraftfull</option>
							<option value="urgent-braskande">Urgent & Brådskande</option>
						</optgroup>
						<optgroup label="MJUKA KÄNSLOR">
							<option value="nostalgisk-minnesfull">Nostalgisk & Minnesfull</option>
							<option value="omtanksam-caring">Omtänksam & Caring</option>
							<option value="tacksam-uppskattande">Tacksam & Uppskattande</option>
						</optgroup>
						<optgroup label="REFLEKTERANDE KÄNSLOR">
							<option value="tankfull-djupsinnig">Tankfull & Djupsinnig</option>
							<option value="nyfiken-upptackande">Nyfiken & Upptäckande</option>
							<option value="hoppfull-framtidstroende">Hoppfull & Framtidstroende</option>
						</optgroup>
						<optgroup label="LEKFULLA KÄNSLOR">
							<option value="humoristisk-rolig">Humoristisk & Rolig</option>
							<option value="lekfull-playful">Lekfull & Playful</option>
							<option value="quirky-unik">Quirky & Unik</option>
						</optgroup>
						<optgroup label="PROFESSIONELLA KÄNSLOR">
							<option value="sjalvsaker-auktoritativ">Självsäker & Auktoritativ</option>
							<option value="professionell-distanserad">Professionell & Distanserad</option>
							<option value="pragmatisk-losningsfokuserad">Pragmatisk & Lösningsfokuserad</option>
						</optgroup>
						<optgroup label="UTMANANDE KÄNSLOR">
							<option value="provokativ-utmanande">Provokativ & Utmanande</option>
							<option value="rebellisk-antiestablishment">Rebellisk & Anti-establishment</option>
							<option value="sarkastisk-ironisk">Sarkastisk & Ironisk</option>
						</optgroup>
					</select>
				) : cardType.id === 'call-to-action' ? (
					<select
						value={keyword}
						onChange={(e) => {
							const selectedCTA = e.target.value;
							setKeyword(selectedCTA);
							
							// Ladda systemprompt för vald CTA
							if (selectedCTA) {
								const ctaPrompt = getCallToActionPrompt(selectedCTA);
								if (ctaPrompt) {
									setSystemPrompt(ctaPrompt);
								}
							}
						}}
						style={styles.select}
					>
						<option value="">-- Välj CTA-typ --</option>
						<optgroup label="DIREKTA CTA:ER">
							<option value="kop-nu">Köp nu</option>
							<option value="kom-igang">Kom igång</option>
							<option value="bestall-nu">Beställ nu</option>
							<option value="byt-till-oss">Byt till oss</option>
							<option value="uppgradera">Uppgradera</option>
							<option value="registrera-dig">Registrera dig</option>
						</optgroup>
						<optgroup label="LÅGTRÖSKELS CTA:ER">
							<option value="prova-gratis">Prova gratis</option>
							<option value="boka-demo">Boka demo</option>
							<option value="ladda-ner">Ladda ner</option>
							<option value="anmal-intresse">Anmäl intresse</option>
						</optgroup>
						<optgroup label="MJUKA CTA:ER">
							<option value="laer-mer">Lär dig mer</option>
							<option value="jamfor">Jämför</option>
							<option value="se-exempel">Se exempel</option>
							<option value="fortsatt">Fortsätt</option>
							<option value="spara">Spara</option>
							<option value="se-priser">Se priser</option>
						</optgroup>
						<optgroup label="RELATIONSSKAPANDE CTA:ER">
							<option value="kontakta-oss">Kontakta oss</option>
							<option value="prenumerera">Prenumerera</option>
							<option value="fa-offert">Få offert</option>
							<option value="recensera">Recensera</option>
						</optgroup>
						<optgroup label="COMMUNITY CTA:ER">
							<option value="ga-med-idag">Gå med idag</option>
							<option value="folj-oss">Följ oss</option>
							<option value="dela">Dela</option>
							<option value="rekommendera">Rekommendera</option>
						</optgroup>
					</select>
				) : (
					<input
						type="text"
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						style={styles.input}
						placeholder="T.ex: WordPress, SEO..."
					/>
				)}
			</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>System Prompt</label>
					<textarea
						value={systemPrompt}
						onChange={(e) => setSystemPrompt(e.target.value)}
						style={styles.textarea}
						rows={12}
					/>
					<button
						onClick={saveData}
						disabled={!systemPrompt.trim()}
						style={{
							...styles.saveButton,
							...((!systemPrompt.trim()) ? styles.buttonDisabled : {})
						}}
					>
						Spara
					</button>
				</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>Din fråga/prompt</label>
					<textarea
						value={userPrompt}
						onChange={(e) => setUserPrompt(e.target.value)}
						style={styles.textarea}
						rows={4}
					/>
				</div>

				<button
					onClick={sendPrompt}
					disabled={loading || !systemPrompt.trim() || !userPrompt.trim()}
					style={{
						...styles.button,
						...styles.primaryButton,
						...(loading || !systemPrompt.trim() || !userPrompt.trim() ? styles.buttonDisabled : {})
					}}
				>
					{loading ? "Väntar på svar..." : "Skicka"}
				</button>

				<div style={styles.formGroup}>
					<label style={styles.label}>Svar</label>
					<div style={styles.resultBox}>
						{loading && (
							<div style={styles.loadingIndicator}>
								<div style={styles.spinner}></div>
								<p style={styles.loadingText}>Väntar på svar...</p>
							</div>
						)}
						{!loading && !response && (
							<p style={styles.placeholderText}>Svaret visas här...</p>
						)}
						{!loading && response && (
							<div style={styles.resultContent}>
								{response.split('\n').map((line, index) => (
									<p key={index} style={styles.resultLine}>{line || '\u00A0'}</p>
								))}
							</div>
						)}
					</div>
					{!loading && response && (
						<p style={styles.stats}>
							{countStats(response).chars} bokstäver • {countStats(response).words} ord
						</p>
					)}
				</div>

				<div style={styles.formGroup}>
					<label style={styles.label}>Kod/Instruktioner</label>
					<textarea
						value={codeInstructions}
						onChange={(e) => setCodeInstructions(e.target.value)}
						style={styles.codeTextarea}
						rows={20}
					/>
					<button
						onClick={saveCode}
						disabled={!codeInstructions.trim()}
						style={{
							...styles.saveButton,
							...((!codeInstructions.trim()) ? styles.buttonDisabled : {})
						}}
					>
						Spara
					</button>
				</div>
			</div>

			<style>{`
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}

const styles: Record<string, React.CSSProperties> = {
	wrapper: {
		width: "100%",
		backgroundColor: "#f5f5f5",
		minHeight: "calc(100vh - 200px)",
	},
	container: {
		padding: "40px 20px",
	},
	title: {
		fontSize: "32px",
		marginBottom: "32px",
		color: "#1e293b",
		paddingLeft: "44px",
	},
	scrollContainer: {
		display: "flex",
		gap: "24px",
		overflowX: "auto",
		paddingBottom: "40px",
		paddingLeft: "44px",
		paddingRight: "44px",
	},
	card: {
		minWidth: "600px",
		maxWidth: "600px",
		backgroundColor: "white",
		borderRadius: "12px",
		boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
		flexShrink: 0,
	},
	cardHeader: {
		padding: "20px 24px",
		backgroundColor: "#f8fafc",
		borderBottom: "1px solid #e2e8f0",
	},
	cardTitle: {
		fontSize: "20px",
		fontWeight: "600",
		color: "#1e293b",
		margin: 0,
	},
	cardBody: {
		padding: "24px",
		maxHeight: "calc(100vh - 250px)",
		overflowY: "auto",
	},
	formGroup: {
		marginBottom: "20px",
	},
	label: {
		display: "block",
		fontSize: "14px",
		fontWeight: "600",
		color: "#1e293b",
		marginBottom: "8px",
	},
	input: {
		width: "100%",
		padding: "10px 12px",
		fontSize: "14px",
		border: "1px solid #ddd",
		borderRadius: "6px",
		boxSizing: "border-box",
	},
	select: {
		width: "100%",
		padding: "10px 12px",
		fontSize: "14px",
		border: "1px solid #ddd",
		borderRadius: "6px",
		boxSizing: "border-box",
		backgroundColor: "white",
		cursor: "pointer",
	},
	textarea: {
		width: "100%",
		padding: "12px",
		fontSize: "14px",
		lineHeight: 1.6,
		border: "1px solid #ddd",
		borderRadius: "6px",
		fontFamily: "system-ui, sans-serif",
		resize: "vertical",
		boxSizing: "border-box",
	},
	codeTextarea: {
		width: "100%",
		padding: "12px",
		fontSize: "13px",
		lineHeight: 1.6,
		border: "1px solid #ddd",
		borderRadius: "6px",
		fontFamily: "Monaco, Consolas, 'Courier New', monospace",
		resize: "vertical",
		boxSizing: "border-box",
		backgroundColor: "#f8f9fa",
	},
	saveButton: {
		padding: "6px 16px",
		fontSize: "13px",
		fontWeight: "500",
		backgroundColor: "#059669",
		color: "white",
		border: "none",
		borderRadius: "6px",
		cursor: "pointer",
		marginTop: "8px",
	},
	button: {
		width: "100%",
		padding: "12px 24px",
		fontSize: "16px",
		fontWeight: "600",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "all 0.2s",
		marginBottom: "20px",
	},
	primaryButton: {
		backgroundColor: "#0056b3",
		color: "white",
	},
	buttonDisabled: {
		opacity: 0.5,
		cursor: "not-allowed",
	},
	error: {
		padding: "12px",
		backgroundColor: "#fee",
		border: "1px solid #fcc",
		borderRadius: "6px",
		color: "#c00",
		marginBottom: "16px",
		fontSize: "14px",
	},
	resultBox: {
		padding: "20px",
		backgroundColor: "#f9fafb",
		border: "1px solid #ddd",
		borderRadius: "8px",
		minHeight: "200px",
		maxHeight: "400px",
		overflowY: "auto",
	},
	resultContent: {
		lineHeight: 1.6,
	},
	resultLine: {
		margin: "8px 0",
		color: "#1e293b",
	},
	loadingIndicator: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "16px",
		padding: "40px",
	},
	spinner: {
		width: "40px",
		height: "40px",
		border: "4px solid #e0e0e0",
		borderTop: "4px solid #0056b3",
		borderRadius: "50%",
		animation: "spin 1s linear infinite",
	},
	loadingText: {
		color: "#64748b",
		fontStyle: "italic",
	},
	placeholderText: {
		color: "#94a3b8",
		fontStyle: "italic",
		textAlign: "center",
		padding: "40px 20px",
	},
	stats: {
		fontSize: "12px",
		color: "#64748b",
		marginTop: "8px",
		textAlign: "right",
		fontWeight: "500",
	},
};
