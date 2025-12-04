import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- Question Sets by Contestant ---

// Image 1: Rukiye
const QUESTIONS_RUKIYE: Question[] = [
  { 
    question: "Welches berühmte Fest wird jedes Jahr in München gefeiert? (Hangi festival Münih'te her yıl kutlanır?)", 
    options: ["Oktoberfest", "Documenta (Kassel)", "Bundesgartenschau", "Kirchentag"], 
    correctAnswerIndex: 0, 
    difficulty: 1 
  },
  { 
    question: "Welches Rammstein-Lied hören Sie gerade? (Dinlediğiniz şarkı Rammstein grubunun hangi parçasıdır?)", 
    options: ["Ich will", "Feuer frei!", "Sonne", "Deutschland"], 
    correctAnswerIndex: 2, 
    difficulty: 2 
  },
  { 
    question: "Wer ist der Gründer Deutschlands? (Almanya'nın kurucusu kimdir?)", 
    options: ["Immanuel Kant", "Otto von Bismarck", "Boris Becker", "Martin Luther"], 
    correctAnswerIndex: 1, 
    difficulty: 3 
  },
  { 
    question: "Wo war der Schwarze Tod (die Pest) am stärksten wirksam? (Kara ölüm / veba en çok nerede etkili oldu?)", 
    options: ["Europa", "Asien", "Amerika", "Australien"], 
    correctAnswerIndex: 0, 
    difficulty: 4 
  }
];

// Image 2: Ayşenur
const QUESTIONS_AYSENUR: Question[] = [
  { 
    question: "Was ist die Hauptstadt von Deutschland? (Almanya'nın başkenti nedir?)", 
    options: ["Berlin", "Frankfurt", "Köln", "Stuttgart"], 
    correctAnswerIndex: 0, 
    difficulty: 5 
  },
  { 
    question: "Welches Land hat die größte Bevölkerung in Europa? (Avrupa'da en büyük nüfusa sahip ülke hangisidir?)", 
    options: ["Deutschland", "Frankreich", "Russland", "Italien"], 
    correctAnswerIndex: 2, 
    difficulty: 6 
  },
  { 
    question: "Welcher Körperteil gehört nicht zum Atmungssystem? (Hangi vücut parçası solunum sistemine ait değildir?)", 
    options: ["Lunge", "Nase", "Herz", "Luftröhre"], 
    correctAnswerIndex: 2, 
    difficulty: 7 
  },
  { 
    question: "Welche Stadt liegt nicht in Deutschland? (Hangi şehir Almanya'da değildir?)", 
    options: ["Köln", "Basel", "Hamburg", "Dresden"], 
    correctAnswerIndex: 1, 
    difficulty: 8 
  },
  { 
    question: "Welche Erfindung gehört Nikola Tesla? (Hangi icat Nikola Tesla'ya aittir?)", 
    options: ["Glühbirne", "Wechselstrom", "Telefon", "Flugzeug"], 
    correctAnswerIndex: 1, 
    difficulty: 9 
  }
];

// Image 3: Rabia
const QUESTIONS_RABIA: Question[] = [
  { 
    question: "Welche der folgenden Dinge wird nicht verwendet, um Babys zu beruhigen? (Aşağıdakilerden hangisi bebekleri sakinleştirmek için kullanılmaz?)", 
    options: ["Flasche", "Schnuller", "Wiegenlied", "Smartes Auto"], 
    correctAnswerIndex: 3, 
    difficulty: 10 
  },
  { 
    question: "Welcher der folgenden Sängerinnen/Sänger hat 2003 den Eurovision Song Contest gewonnen? (Hangi şarkıcı 2003 Eurovision'u kazandı?)", 
    options: ["Hadise", "Semiha Yankı", "Sertab Erener", "Mor ve Ötesi"], 
    correctAnswerIndex: 2, 
    difficulty: 11 
  },
  { 
    question: "Welche Zeile gehört zu einem Lied von Barış Manço, das Sie gerade gehört haben? (Hangi dize Barış Manço şarkısına aittir?)", 
    options: ["Gülpembe", "Arkadaşım Eşek", "Dönence", "Ben Bilirim"], 
    correctAnswerIndex: 2, 
    difficulty: 12 
  },
  { 
    question: "Welche der folgenden Sprachen würde man nicht von jemandem erwarten, der in der Schweiz lebt? (İsviçre'de yaşayan birinden hangi dili konuşması beklenmez?)", 
    options: ["Deutsch", "Französisch", "Italienisch", "Bengalisch"], 
    correctAnswerIndex: 3, 
    difficulty: 13 
  }
];

// Image 4: Leyla
const QUESTIONS_LEYLA: Question[] = [
  { 
    question: "Wann wurde die Berliner Mauer geöffnet? (Berlin Duvarı ne zaman açıldı?)", 
    options: ["1975", "1980", "1989", "2005"], 
    correctAnswerIndex: 2, 
    difficulty: 14 
  },
  { 
    question: "Welches Land wurde beim Eurovision Song Contest 2009 Vierter? (2009 Eurovision'da hangi ülke 4. oldu?)", 
    options: ["Deutschland", "Türkei", "Island", "Frankreich"], 
    correctAnswerIndex: 1, 
    difficulty: 15 
  },
  { 
    question: "Zwischen welchen Ländern liegt Deutschland? (Almanya hangi ülkeler arasındadır?)", 
    options: ["Spanien und Italien", "Polen und Frankreich", "Norwegen und Schweden", "Griechenland und Ungarn"], 
    correctAnswerIndex: 1, 
    difficulty: 15 
  },
  { 
    question: "Wer war der längste amtierende Bundeskanzler in Deutschland? (En uzun süre görev yapan Almanya şansölyesi kimdir?)", 
    options: ["Angela Merkel", "Helmut Kohl", "Willy Brandt", "Gerhard Schröder"], 
    correctAnswerIndex: 1, 
    difficulty: 15 
  }
];

// Image 5: Roz
const QUESTIONS_ROZ: Question[] = [
  { 
    question: "Wer malte die „Mona Lisa“? (Mona Lisa'yı kim yaptı?)", 
    options: ["Van Gogh", "Monet", "Da Vinci", "Picasso"], 
    correctAnswerIndex: 2, 
    difficulty: 15 
  },
  { 
    question: "Welche Stadt liegt NICHT am Rhein? (Hangi şehir Ren nehri üzerinde değildir?)", 
    options: ["Düsseldorf", "Mainz", "Köln", "Leipzig"], 
    correctAnswerIndex: 3, 
    difficulty: 15 
  },
  { 
    question: "Wessen Werke gehören zur klassischen deutschen Literatur? (Kimin eserleri klasik Alman edebiyatına aittir?)", 
    options: ["Goethe", "Einstein", "Merkel", "Tesla"], 
    correctAnswerIndex: 0, 
    difficulty: 15 
  },
  { 
    question: "In welcher Stadt trat Covid-19 erstmals auf? (Covid-19 ilk hangi şehirde ortaya çıktı?)", 
    options: ["Tokio", "Wuhan", "Mailand", "New York"], 
    correctAnswerIndex: 1, 
    difficulty: 15 
  },
  { 
    question: "Mit welchem Instrument wird diese Musik gespielt? (Bu müzik hangi enstrümanla çalınır?)", 
    options: ["Gitarre", "Klavier", "Trommel", "Geige"], 
    correctAnswerIndex: 0, 
    difficulty: 15 
  },
  { 
    question: "Welches dieser Symbole wird in vielen Ländern als Glücksbringer zum Neujahr verschenkt? (Bu sembollerden hangisi birçok ülkede yılbaşında şans getirmesi için hediye edilir?)", 
    options: ["Hufeisen", "Eichel", "Schneemann", "Regenschirm"], 
    correctAnswerIndex: 0, 
    difficulty: 15 
  }
];

export const generateQuestions = async (contestantName: string): Promise<Question[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const name = contestantName.toLowerCase().trim();
      let questions: Question[] = [];

      if (name === "rukiye") {
        questions = QUESTIONS_RUKIYE;
      } else if (name === "ayşenur" || name === "aysenur") {
        questions = QUESTIONS_AYSENUR;
      } else if (name === "rabia") {
        questions = QUESTIONS_RABIA;
      } else if (name === "leyla") {
        questions = QUESTIONS_LEYLA;
      } else if (name === "roz") {
        questions = QUESTIONS_ROZ;
      } else {
        const all = [
          ...QUESTIONS_RUKIYE,
          ...QUESTIONS_AYSENUR,
          ...QUESTIONS_RABIA,
          ...QUESTIONS_LEYLA,
          ...QUESTIONS_ROZ
        ];
        questions = all.sort(() => 0.5 - Math.random()).slice(0, 6);
      }

      resolve(questions);
    }, 1000);
  });
};

export const consultGeminiFriend = async (question: Question, friendName: string): Promise<string> => {
  if (!ai) {
    const correctOpt = question.options[question.correctAnswerIndex];
    return `Hmm, emin değilim ama bence cevap ${correctOpt} olabilir.`;
  }

  const model = "gemini-2.5-flash";
  const prompt = `
    The user is playing 'Wer wird Millionär' (Who Wants to Be a Millionaire) and is using the 'Phone a Friend' lifeline.
    They are calling YOU, their friend named "${friendName}".
    
    They are asking you this question:
    "${question.question}"
    
    Options:
    A: ${question.options[0]}
    B: ${question.options[1]}
    C: ${question.options[2]}
    D: ${question.options[3]}
    
    You are ${friendName}.
    Act natural. 
    Give your answer in Turkish in 1-2 sentences. 
    Don't just say "The answer is A". Say something like "Selam! Bence cevap..." or "Bunu biliyorum, cevap kesinlikle..."
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Hat koptu, sesini alamıyorum!";
  } catch (error) {
    console.error("Friend error:", error);
    return "Alo? Alo? Sesin gelmiyor...";
  }
};
