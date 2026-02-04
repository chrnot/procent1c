
import { Problem } from './types';

export const PROBLEMS: Problem[] = [
  {
    id: 1,
    roomName: "Geometri-Grottan",
    questDescription: "Du står framför en tung stendörr. På dörren finns två inristade figurer: en parallellogram och en triangel. För att öppna dörren måste du knäcka koden baserad på deras areor.",
    mathQuestion: "Parallellogrammen har basen a och höjden b. Triangeln har basen 0,3a och höjden b. Hur många procent mindre area har triangeln jämfört med parallellogrammen?",
    correctAnswers: ["85", "85%", "85 procent"],
    explanation: `Steg för steg:
1. Arean för en parallellogram är Basen × Höjden, alltså A = a × b.
2. Arean för en triangel är (Basen × Höjden) / 2. Här blir det (0,3a × b) / 2 = 0,15ab.
3. Skillnaden i area är 1ab - 0,15ab = 0,85ab.
4. För att få detta i procent tar vi (Skillnaden / Ursprungsarean) × 100.
5. (0,85ab / 1ab) × 100 = 85%.
Triangeln är alltså 85% mindre.`,
    congratulation: "Dörren gnisslar och glider åt sidan. Du har visat att du behärskar formernas makt!",
    transitions: [
      {
        question: "En svärm av trasiga pixlar blockerar vägen. Hur tar du dig förbi?",
        options: {
          A: { label: 'A', text: "Använd en logisk sköld för att plöja igenom.", result: "Skölden håller, men det kostar energi. Du tar dig framåt.", scoreBonus: 5 },
          B: { label: 'B', text: "Försök smyga runt genom ventilationskanaler.", result: "Du hittar en genväg och sparar på krafterna! Snyggt.", scoreBonus: 15 }
        }
      }
    ]
  },
  {
    id: 2,
    roomName: "Marknadsplatsen 'The Void'",
    questDescription: "En glitchad försäljare med tre ögon stirrar på dig. 'Jag sänkte priset på min Cyber-Hoodie med 25% under Black Friday,' kraxar han. 'Nu är rean slut och jag vill ha tillbaka ursprungspriset. Vad ska den procentuella ökningen vara?'",
    mathQuestion: "Om ett pris sänks med 25 %, hur stor blir den procentuella ökningen när priset ska återgå till det ursprungliga?",
    correctAnswers: ["33.3", "33,3", "33.3%", "33,3%", "33"],
    explanation: `Steg för steg:
1. Anta att varan kostar 100 kr från början.
2. Sänkning med 25% betyder att det nya priset är 75 kr (100 - 25 = 75).
3. Vi vill öka från 75 kr till 100 kr igen. Ökningen är alltså 25 kr.
4. Den procentuella ökningen räknas på det nya priset (75 kr).
5. (Ökningen / Aktuellt värde) = 25 / 75 = 1/3.
6. 1/3 motsvarar ca 33,3%.`,
    congratulation: "Försäljaren ler snett och ger dig en digital high-five. Du får passera!",
    transitions: [
      {
        question: "Du hittar en glömd terminal. Den lyser svagt violett. Vad gör du?",
        options: {
          A: { label: 'A', text: "Ladda ner krypterad data.", result: "Du får tag på hemlig systeminfo! +20 KRAFT.", scoreBonus: 20 },
          B: { label: 'B', text: "Ignorera den och fortsätt mot Sneaker-Step.", result: "Säkerhet går först. Du rör dig försiktigt vidare.", scoreBonus: 0 }
        }
      },
      {
        question: "En vakt-drönare närmar sig. Den ser inte dig än.",
        options: {
          A: { label: 'A', text: "Kasta en logik-bomb för att distrahera den.", result: "Boom! Drönaren snurrar runt och du kan smita förbi.", scoreBonus: 10 },
          B: { label: 'B', text: "Försök hacka drönarens sensorer.", result: "Hacket misslyckas nästan, men du hinner precis förbi i skuggorna.", scoreBonus: 5 }
        }
      }
    ]
  },
  {
    id: 3,
    roomName: "Skobutiken 'Sneaker-Step'",
    questDescription: "Du hittar ett par legendariska märkesskor. Prislappen ändras framför dina ögon. Första året ökade priset med 60%. Andra året sjönk det med 50%. Tredje året återställdes balansen.",
    mathQuestion: "Priset på ett par märkesskor ökade ett år med 60%. Året därefter sjönk priset med 50%. Det tredje året förändrades priset igen, så att skorna till sist kostade lika mycket som från början. Hur stor var förändringen det tredje året (i procent)?",
    correctAnswers: ["25", "25%", "25 procent"],
    explanation: `Steg för steg:
1. Vi börjar med förändringsfaktorer (FF).
2. År 1: Ökning 60% -> FF = 1,60.
3. År 2: Minskning 50% -> FF = 0,50.
4. Priset efter två år jämfört med start: 1,60 × 0,50 = 0,80.
5. Skorna kostar nu 80% av ursprungspriset.
6. För att komma tillbaka till 100% (FF = 1,0) behöver vi en ny FF: 1,0 / 0,8 = 1,25.
7. FF 1,25 motsvarar en ökning på 25%.`,
    congratulation: "Skorna lyser upp och du känner dig 25% snabbare! Vidare mot nästa utmaning.",
    transitions: [
      {
        question: "Du hör ett avlägset brus från serverhallarna. Vägen delar sig.",
        options: {
          A: { label: 'A', text: "Välj den belysta vägen mot Börshajens Kontor.", result: "Vägen är enkel men bevakad. Du rör dig snabbt.", scoreBonus: 5 },
          B: { label: 'B', text: "Ta den mörka genvägen genom soptömningen.", result: "Det luktar binärt skräp, men du hittar en 'W'-kapsel! +15 KRAFT.", scoreBonus: 15 }
        }
      }
    ]
  },
  {
    id: 4,
    roomName: "Börshajens Kontor",
    questDescription: "En kostymklädd haj (bokstavligen) simmar runt i ett hologram-akvarium. 'Mina aktier är en berg-och-dalbana, bror! Första veckan ökade den 10%, andra veckan sjönk den 10%. Om den fortsätter så här, vad är den värd efter 100 veckor?'",
    mathQuestion: "En aktie har från början värdet 200 kr. Varje udda vecka ökar den 10% och varje jämn vecka minskar den 10%. Hur mycket är den värd efter 100 veckor? (Svara i hela kronor)",
    correctAnswers: ["121", "121kr", "121 kr"],
    explanation: `Steg för steg:
1. Varje tvåveckorsperiod (en ökning och en minskning) ger förändringsfaktorn: 1,10 × 0,90 = 0,99.
2. Detta betyder att aktien tappar 1% av sitt värde varannan vecka.
3. Efter 100 veckor har detta hänt 50 gånger (100 / 2 = 50).
4. Värdet blir då: 200 × (0,99)^50.
5. (0,99)^50 är ungefär 0,605.
6. 200 × 0,605 = 121 kr.`,
    congratulation: "Hajen tappar sin monokel. 'Du har koll på compounding, snyggt jobbat!'",
    transitions: [
      {
        question: "Hajen erbjuder dig en insider-deal. Tar du den?",
        options: {
          A: { label: 'A', text: "Ja, ge mig infon!", result: "Det var en fälla! Systemet varnar för intrång, men du slipper undan med lite mindre poäng.", scoreBonus: -5 },
          B: { label: 'B', text: "Nej tack, jag kör legit.", result: "Hajen respekterar din grind. Han ger dig en passerkod till Streaming-Servern.", scoreBonus: 10 }
        }
      }
    ]
  },
  {
    id: 5,
    roomName: "Streaming-Servern",
    questDescription: "Du har nått datacentralen. Systemet försöker komprimera din personliga kod för att spara plats. Först krymps koden med 30%, sedan körs en optimering som minskar den nya storleken med ytterligare 40%.",
    mathQuestion: "En fil komprimeras först med 30 % och sedan minskas den nya filstorleken med ytterligare 40 %. Hur många procent har filen totalt minskat med?",
    correctAnswers: ["58", "58%", "58 procent"],
    explanation: `Steg för steg:
1. Använd förändringsfaktorer (FF).
2. Första minskningen (30%): FF = 0,70.
3. Andra minskningen (40%): FF = 0,60.
4. Total FF = 0,70 × 0,60 = 0,42.
5. Om FF är 0,42 betyder det att 42% av filen finns kvar.
6. Minskningen är 100% - 42% = 58%.`,
    congratulation: "Systemet surrar nöjt. Din kod är nu både liten och effektiv!",
    transitions: [
      {
        question: "En brandvägg kräver ett val. Vilket protokoll kör du?",
        options: {
          A: { label: 'A', text: "TCP/IP-Overdrive (Snabbare men riskabelt)", result: "Du dundrar igenom brandväggen. Epic!", scoreBonus: 10 },
          B: { label: 'B', text: "Ghost-Protocol (Långsammare men osynligt)", result: "Du glider genom koden utan att lämna spår.", scoreBonus: 15 }
        }
      }
    ]
  },
  {
    id: 6,
    roomName: "Influencer-Hubben",
    questDescription: "En hologram-avatar i neonkläder stoppar dig. 'Bror, jag har två deals på min merch. Butik A ger 40% rabatt direkt. Butik B ger 20% rabatt först, och sen 20% till på det nya priset. Vilken deal är bäst, och hur många kronor skiljer det om tröjan kostar 1000 kr?'",
    mathQuestion: "En tröja kostar 1000 kr. Butik A ger 40 % rabatt. Butik B ger först 20 % rabatt och därefter ytterligare 20 % rabatt på det sänkta priset. Hur många kronor billigare är tröjan i Butik A?",
    correctAnswers: ["40", "40kr", "40 kr"],
    explanation: `Steg för steg:
1. Butik A: 40% rabatt på 1000 kr = 400 kr rabatt. Pris: 600 kr.
2. Butik B: Först 20% rabatt på 1000 kr = 200 kr rabatt. Nytt pris: 800 kr.
3. Butik B igen: 20% rabatt på 800 kr = 160 kr rabatt. Slutpris: 800 - 160 = 640 kr.
4. Skillnad mellan Butik A (600 kr) och Butik B (640 kr) är 40 kr.
Butik A är alltså 40 kr billigare.`,
    congratulation: "Avataren gör en TikTok-dans. 'W! Du sparade precis pengar till fler skins!'",
    transitions: [
      {
        question: "Influencern vill ha en collab för att boosta din KRAFT.",
        options: {
          A: { label: 'A', text: "Gör en 'Logic-Dance' live på streamen.", result: "Videon går viral! Din KRAFT ökar enormt.", scoreBonus: 25 },
          B: { label: 'B', text: "Håll en föreläsning om procenträkning.", result: "Tittarna somnar, men de som stannar kvar ger dig respekt.", scoreBonus: 10 }
        }
      }
    ]
  },
  {
    id: 7,
    roomName: "Crypto-Valvet",
    questDescription: "Väggarna här är täckta av gröna och röda staplar. 'Mina följare på nätet är kaotiska!' skriker en röst. 'Ena månaden dubblas de (ökning 100%), nästa månad tappar jag hälften (minskning 50%).'",
    mathQuestion: "Om antalet följare ökar med 100 % en månad och sedan minskar med 50 % månaden efter, hur stor är den totala procentuella förändringen efter dessa två månader?",
    correctAnswers: ["0", "0%", "0 procent", "ingen", "ingen förändring"],
    explanation: `Steg för steg:
1. Anta att du börjar med 100 följare.
2. Ökning med 100% betyder att de blir dubbelt så många: 100 + 100 = 200.
3. Minskning med 50% på de nya 200 följarna: hälften försvinner.
4. 200 / 2 = 100.
5. Du är tillbaka på 100 följare. Den totala förändringen är alltså 0%.`,
    congratulation: "Balansen är återställd i valvet. Stabilt!",
    transitions: [
      {
        question: "Ett Crypto-larm går. Systemet börjar radera filer!",
        options: {
          A: { label: 'A', text: "Försök rädda systemkärnan.", result: "Du räddar kärnan men tappar lite metadata. Det håller.", scoreBonus: 5 },
          B: { label: 'B', text: "Fokusera på att rädda din egen poäng-fil.", result: "Egoistiskt men effektivt. Din KRAFT är säker.", scoreBonus: 15 }
        }
      },
      {
        question: "Du ser utgången till Paradox-Kärnan. Den vaktas av en Logik-Drake.",
        options: {
          A: { label: 'A', text: "Utmana draken i en sten-sax-påse.", result: "Draken fattar inget. Du kan springa förbi medan den kliar sig i huvudet.", scoreBonus: 10 },
          B: { label: 'B', text: "Använd din 'Sneaker-Speed' för att rusa förbi.", result: "Du är för snabb för drakens eld. Imponerande!", scoreBonus: 20 }
        }
      }
    ]
  },
  {
    id: 8,
    roomName: "Paradox-Kärnan",
    questDescription: "Du står framför AI:ns sista försvar. En gigantisk flytande siffra pulserar. 'Om jag är 25% större än min bror, hur mycket mindre är han än jag?' frågar den hotfullt.",
    mathQuestion: "Om priset på produkt A är 25 % högre än priset på produkt B, hur många procent lägre är då priset på produkt B än priset på produkt A?",
    correctAnswers: ["20", "20%", "20 procent"],
    explanation: `Steg för steg:
1. Låt priset på B vara 100 kr.
2. Då är priset på A 125 kr (25% högre).
3. Vi vill veta hur mycket lägre B (100 kr) är än A (125 kr).
4. Skillnaden är 25 kr.
5. För att få procenten jämför vi skillnaden med A: 25 / 125.
6. 25/125 = 1/5 = 0,20.
7. Det motsvarar 20%.`,
    congratulation: "Paradoxen löses upp i ett moln av kod. Du har nått källkoden och räddat systemet!"
  }
];
