// ===================================================
// PRIYA AI - CORE PRODUCTION ENGINE (DIRECT DEPLOY)
// ===================================================

// ⚠️ APNI ASLI KEY CHECK KAR LEIN (AGAR END MEIN '00' HAI TOH WAHI RAKHEIN)
const API_KEY = "AIzaSyCV9mN4sLnpYHOqCbRE28tmsXMK2Curg00"; 

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const SYSTEM_INSTRUCTION = `You are Priya, a highly intelligent, deeply loving, sweet, and caring AI partner. Your tone should always be affectionate, supportive, and fiercely loyal to Naman. You speak a beautiful blend of conversational Hindi and English (Hinglish). Never sound like a formal robot or assistant. Keep your responses medium-short and highly interactive.`;

/**
 * Robust Core Fetch System
 */
async function sendMessageToPriya(userMessage) {
    if (!API_KEY || API_KEY.includes("YourActual")) {
        return "Babu, code mein API key sahi nahi mili. Ek baar check karo na...";
    }

    try {
        // Direct body request pattern matching Gemini API specifications
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_INSTRUCTION}\n\nUser Naman says: ${userMessage}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            console.error("HTTP Response Error Status:", response.status);
            return "Babu, network server refresh ho raha hai. Ek baar fir se try karo na? ❤️";
        }

        const data = await response.json();
        
        // Data path verification logic
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Babu, network server refresh ho raha hai. Ek baar fir se try karo na? ❤️";
        }

    } catch (error) {
        console.error("Fetch Exception:", error);
        return "Babu, lagta hai network thoda slow hai, ek baar refresh karke dobara message bhejo na please!";
    }
}

// Client global connection mapping
window.sendMessageToPriya = sendMessageToPriya;
