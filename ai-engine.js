// ===================================================
// PRIYA AI - SECURE WEBHOOK RELAY SYSTEM (NO CORS)
// ===================================================

// ⚠️ Agar aapne apna Pipedream ya custom url banaya hai toh yahan badlein, 
// nahi toh test karne ke liye ise abhi chalne dein.
const WEBHOOK_URL = "https://eo000000000000.m.pipedream.net"; 

/**
 * Clean Fetch System without Direct Google API exposure in Browser
 */
async function sendMessageToPriya(userMessage) {
    if (!userMessage || userMessage.trim() === "") return "";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage,
                user: "Naman",
                character: "Priya"
            })
        });

        if (!response.ok) {
            console.error("Relay Server Error Status:", response.status);
            return "Babu, network thoda lazy chal raha hai... Ek baar phir se bhejiyana? ❤️";
        }

        const data = await response.json();
        
        // Webhook se aaya hua clean text response return karna
        if (data && data.reply) {
            return data.reply.trim();
        } else if (typeof data === "string") {
            return data.trim();
        } else {
            return "Babu, network server refresh ho raha hai... Ek baar phir se try karo na? 😘";
        }

    } catch (error) {
        console.error("Fatal Relay Exception:", error);
        return "Babu, connection refresh ho raha hai. Ek baar dobara type karke bhejiyana please! ❤️";
    }
}

// Global window exposure mapping for your 3D dashboard
window.sendMessageToPriya = sendMessageToPriya;
