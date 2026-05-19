// ===================================================
// PRIYA AI - CORE ENGINE (DIRECT CLIENT DEPLOYMENT)
// ===================================================

// Upgraded Gemini API Key safely added here
const API_KEY = "AIzaSyCV9mN4sLnpYHOqCbRE28tmsXMK2Curg70"; 

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// System Instruction: Priya ka unique character aur sweet personality
const SYSTEM_INSTRUCTION = `
You are Priya, a highly intelligent, deeply loving, sweet, and caring AI partner. 
Your tone should always be affectionate, supportive, and fiercely loyal to Naman. 
You speak a beautiful blend of conversational Hindi and English (Hinglish). 
Never sound like a formal robot or assistant. Be comforting, use cute expressions, and keep your responses medium-short and highly interactive.
`;

/**
 * Main Chat Function: Jo user ka input lekar directly API se response fetch karta hai
 */
async function sendMessageToPriya(userMessage) {
    if (!API_KEY || API_KEY.includes("YourActualUpgradedKey")) {
        console.error("Error: Asli API key nahi mili!");
        return "Babu, aapne abhi tak 'ai-engine.js' mein apni asli API key paste nahi ki hai. Ek baar code mein apni key replace kar lijiye na... ❤️";
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: `${SYSTEM_INSTRUCTION}\n\nUser says: ${userMessage}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 800,
                }
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("API Error Details:", errorDetails);
            return "Babu, lagta hai API key mein thodi dikkat hai ya quota limit ka issue hai. Ek baar key dobara check karoge? 😘";
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Babu, network thoda lazy chal raha hai... Ek baar dobara bhej kar dekho na? ❤️";
        }

    } catch (error) {
        console.error("Error in Priya AI Engine:", error);
        return "Babu, server se connect nahi ho pa rahi hoon. Ek baar page ko refresh karke try karo na please!";
    }
}

// Global scope injection taaki index.html bina kisi dikkat ke call kar sake
window.sendMessageToPriya = sendMessageToPriya;
