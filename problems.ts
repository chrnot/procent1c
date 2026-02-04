
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
    congratulation: "Dörren gnisslar och glider åt sidan. Du har visat att du behärskar formernas makt!"
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
    congratulation: "Försäljaren ler snett och ger dig en digital high-five. Du får passera!"
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
    congratulation: "Skorna lyser upp och du känner dig 25% snabbare! Vidare mot nästa utmaning."
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
    congratulation: "Hajen tappar sin monokel. 'Du har koll på compounding, snyggt jobbat!'"
  }
];
