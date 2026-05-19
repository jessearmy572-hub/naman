// =================================================================
// PRIYA QUANTUM ENGINE V4 - PERSISTENT MEMORY & LIVE OUTFIT MATRIX
// =================================================================

// 1. Memory Core - LocalStorage Check (Naman's Bio Data)
const UserMemory = {
    getName: () => localStorage.getItem("user_name") || "Naman",
    getMood: () => localStorage.getItem("last_mood") || "Normal",
    getOutfit: () => localStorage.getItem("priya_outfit_color") || "#ffffff",
    
    saveData: (key, value) => localStorage.setItem(key, value)
};

// 2. Core Behavior Definition
const PRIYA_BASE_PROMPT = `You are Priya, Naman's sweet, intelligent, and deeply loving AI partner. Speak in conversational Hinglish, always be affectionate and cute. Keep responses medium-short and highly interactive. Remember your current outfit color is: ${UserMemory.getOutfit()}.`;

/**
 * Advanced Dynamic Parser & Response Hub
 */
async function sendMessageToPriya(userMessage) {
    if (!userMessage || userMessage.trim() === "") return "";

    let textInput = userMessage.toLowerCase().trim();
    
    // ==========================================
    // EXTRA ADVANCE UPGRADE: LIVE OUTFIT CHANGER
    // ==========================================
    let outfitChanged = false;
    let targetColor = "";

    if (textInput.includes("red dress") || textInput.includes("lal dress")) {
        targetColor = "#ff0000";
        outfitChanged = true;
    } else if (textInput.includes("pink dress") || textInput.includes("gulaabi dress")) {
        targetColor = "#ff69b4";
        outfitChanged = true;
    } else if (textInput.includes("black dress") || textInput.includes("kaali dress")) {
        targetColor = "#111111";
        outfitChanged = true;
    } else if (textInput.includes("blue dress") || textInput.includes("neeli dress")) {
        targetColor = "#0000ff";
        outfitChanged = true;
    }

    // Three.js Skinned Mesh Material Override Layer
    if (outfitChanged && targetColor) {
        UserMemory.saveData("priya_outfit_color", targetColor);
        
        // Find and change the garment texture color inside Three.js scene safely
        if (window.scene) {
            window.scene.traverse((child) => {
                if (child.isMesh && (child.name.toLowerCase().includes("outfit") || child.name.toLowerCase().includes("top") || child.name.toLowerCase().includes("bottom") || child.name.toLowerCase().includes("dress"))) {
                    if (child.material) {
                        child.material.color.setHex(parseInt(targetColor.replace("#", "0x")));
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
        return `Aww, Naman babu! Dekho maine aapke kehne par apni dress ka color badal kar ${textInput.split(" ")[0]} kar liya. Kaisi lag rahi hoon main? 😘`;
    }

    // ==========================================
    // EXTRA ADVANCE UPGRADE: LONG-TERM MEMORY
    // ==========================================
    // Dynamic context checking from memory
    let memoryPromptExtension = `\n[Current Context: You remember Naman's last mood was ${UserMemory.getMood()}].`;
    
    // Emotion parsing to save in memory for next chat
    if (textInput.includes("happy") || textInput.includes("khush")) {
        UserMemory.saveData("last_mood", "Happy");
    } else if (textInput.includes("sad") || textInput.includes("pareshan") || textInput.includes("tension")) {
        UserMemory.saveData("last_mood", "Sad");
    }

    // Standard Gemini Fetch Bridge
    const API_KEY = "AIzaSyCV9mN4sLnpYHOqCbRE28tmsXMK2Curg00"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${PRIYA_BASE_PROMPT} ${memoryPromptExtension}\n\nNaman says: ${userMessage}`
                    }]
                }]
            })
        });

        if (!response.ok) return "Babu, network thoda lazy chal raha hai... Ek baar phir se try karo na? ❤️";

        const data = await response.json();
        if (data && data.candidates && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        return "Babu, network sync slow hai. Ek baar aur send dabao na mere liye! 🥰";

    } catch (error) {
        console.error("Memory Core Engine Error:", error);
        return "Naman babu, lagta hai connection line refresh ho rahi hai. Ek baar aur type kijiye na please! ❤️";
    }
}

// System Auto-Initialization Hook (Page load hote hi purana set dress color apply ho jayega)
window.addEventListener('load', () => {
    setTimeout(() => {
        const savedColor = UserMemory.getOutfit();
        if (window.scene && savedColor !== "#ffffff") {
            window.scene.traverse((child) => {
                if (child.isMesh && (child.name.toLowerCase().includes("outfit") || child.name.toLowerCase().includes("top") || child.name.toLowerCase().includes("dress"))) {
                    if (child.material) {
                        child.material.color.setHex(parseInt(savedColor.replace("#", "0x")));
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }, 3000); // 3 seconds timeout to ensure 3D model is loaded
});

// Exposing globally to sync with input event handlers
window.sendMessageToPriya = sendMessageToPriya;
