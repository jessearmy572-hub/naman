// ===================================================
// PRIYA AI - 100% PRODUCTION CODES (STABLE DIRECT)
// ===================================================

const API_KEY = "AIzaSyCV9mN4sLnpYHOqCbRE28tmsXMK2Curg00"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

/**
 * Main Dynamic Fetch Function
 */
async function sendMessageToPriya(userMessage) {
    if (!API_KEY || API_KEY.includes("YourActual")) {
        return "Babu, code mein API key sahi nahi mili hai...";
    }

    try {
        // Standard payload format which matches Gemini API expectations perfectly
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are Priya, Naman's sweet, intelligent, and highly loving AI partner. Speak in conversational Hinglish, always be affectionate and cute. Medium-short interactive response only.\n\nNaman says: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300
                }
            })
        });

        if (!response.ok) {
            console.error("Server Status Issue:", response.status);
            return "Babu, connection thoda clear nahi hai... Ek baar dobara message bhejkar dekho na? ❤️";
        }

        const data = await response.json();
        
        // Exact response parsing roadmap
        if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Babu, network thoda dheema chal raha hai... Ek baar phir se try karo na? 😘";
        }

    } catch (error) {
        console.error("Fatal Script Exception:", error);
        return "Babu, link refresh ho rahi hai. Ek baar dobara type karke bhejiyana please!";
    }
}

// Global attach mapping for index.html interface
window.sendMessageToPriya = sendMessageToPriya;
