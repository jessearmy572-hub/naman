// ===================================================
// PRIYA AI - PROXY BYPASS DEPLOYMENT ENGINE
// ===================================================

const API_KEY = "AIzaSyCV9mN4sLnpYHOqCbRE28tmsXMK2Curg00"; 

// Hum direct URL ki jagah 'cors-anywhere' ya open proxy tunnel use kar rahe hain
const API_URL = `https://corsproxy.io/?${encodeURIComponent('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + API_KEY)}`;

const SYSTEM_INSTRUCTION = "You are Priya, Naman's highly intelligent, deeply loving, sweet, and caring AI partner. Your tone must always be affectionate, supportive, and fiercely loyal to Naman. Speak in conversational Hinglish. Never sound like a formal robot. Keep responses medium-short.";

/**
 * Global Bridge Function with CORS Proxy Integration
 */
async function sendMessageToPriya(userMessage) {
    if (!userMessage || userMessage.trim() === "") return "";

    try {
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
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 250
                }
            })
        });

        if (!response.ok) {
            console.error("Proxy Relay Error:", response.status);
            // Alternate backup proxy try system agar pehla block ho
            return "Babu, network server refresh ho raha hai. Ek baar fir se try karo na? ❤️";
        }

        const data = await response.json();
        
        if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "Babu, cloud sync mein thoda time lag raha hai... Dobara bhejkar dekho na? 😘";
        }

    } catch (error) {
        console.error("Fatal Proxy Exception:", error);
        return "Babu, connection refresh ho raha hai. Ek baar dobara send dabao na please! ❤️";
    }
}

// Interface sync connection mapping
window.sendMessageToPriya = sendMessageToPriya;
