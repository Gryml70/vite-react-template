# System Prompts

Denna mapp innehåller sparade system prompts för Claude AI via OpenRouter.

## Hur det fungerar

1. **Skapa prompts**: Gå till `/system-prompts` i webbläsaren
2. **Spara prompts**: Varje prompt sparas som en `.txt`-fil i denna mapp
3. **Testa prompts**: Testa dina prompts direkt mot Claude AI
4. **Återanvänd prompts**: Välj sparade prompts från dropdown-menyn

## Filformat

Varje prompt sparas som en textfil med namnet som filnamn:
- `SEO Expert.txt`
- `Code Reviewer.txt`
- `Creative Writer.txt`

## Exempel på bra system prompts

En bra system prompt innehåller:

1. **Roll/Expertis**: Vem är AI:n? (t.ex. "Du är en SEO-expert")
2. **Uppgift**: Vad ska AI:n göra?
3. **Riktlinjer**: Hur ska AI:n bete sig?
4. **Format**: Hur ska svaren struktureras?
5. **Ton**: Vilken ton ska användas? (professionell, vänlig, pedagogisk)

## Tips

- Var specifik och tydlig
- Ge exempel på önskat beteende
- Testa och iterera
- Spara olika versioner för olika användningsområden
- Använd svenska för svenska texter, engelska för kod

## API-nyckel

För att använda system prompts behöver du en OpenRouter API-nyckel:

1. Skapa konto på [openrouter.ai](https://openrouter.ai)
2. Hämta din API-nyckel från [openrouter.ai/keys](https://openrouter.ai/keys)
3. Skapa en `.env`-fil i projektets rot
4. Lägg till: `VITE_OPENROUTER_API_KEY=din_nyckel_här`

## Användning i utveckling

```bash
# Starta dev-servern
npm run dev

# Gå till system prompts
http://localhost:5173/system-prompts
```

## Säkerhet

⚠️ **VIKTIGT**: Lägg ALDRIG till `.env`-filen i git! Den innehåller känsliga API-nycklar.

Filen `.env` är redan listad i `.gitignore`.
