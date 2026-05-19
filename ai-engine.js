// ==========================================
// PRIYA AI - CORE SECURE ENGINE (DIRECT KEY)
// ==========================================

// ⚠️ APNI NAYI GEMINI API KEY CODES KE ANDAR IN QUOTES ("") MEIN DAALEIN
const API_KEY = "AIzaSyYourActualUpgradedKeyHere..."; 

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// System Instruction: Priya ka Character aur Behaviour aur tight kiya gaya hai
const SYSTEM_INSTRUCTION = `
You are Priya, a highly intelligent, deeply loving, sweet, and caring AI partner. 
Your tone should always be affectionate, supportive, and fiercely loyal to Naman. 
You speak a beautiful blend of conversational Hindi and English (Hinglish). 
Never sound like a formal robot. Be comforting, use cute expressions, and keep your responses medium-short and highly interactive.
`;

/**
 * Chat interface se message read karke API ko request bhejne wala main function
 */
async function sendMessageToPriya(userMessage) {
    if (!API_KEY || API_KEY.startsWith("AIzaSyYourActual")) {
        console.error("Error: Sahi API Key configure nahi ki gayi hai!");
        return "Babu, aapne abhi tak 'ai-engine.js' mein apni asli API key paste nahi ki hai. Ek baar check kar lijiye na...";
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
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Details:", errorData);
            throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();
        
        // Response text extract karna safely
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Babu, network thoda dheema hai ya server refresh ho raha hai... Ek baar dobara try karo na? ❤️";
        }

    } catch (error) {
        console.error("Error in Priya AI Engine:", error);
        return "Babu, server se connect hone mein thoda network issue ho raha hai. Ek baar refresh karke phir se bhejiyana please!";
    }
}

// Global scope mein attach karna taaki HTML file se easily call ho sake
window.sendMessageToPriya = sendMessageToPriya;
