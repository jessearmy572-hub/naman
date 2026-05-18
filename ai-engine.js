 /**
 * PRIYA AI COGNITIVE CORE - PRODUCTION INJECTION
 */

// This placeholder will be safely overwritten during the GitHub Actions build step
const SYSTEM_API_ROTATION_VAULT = [
    "__GEMINI_API_KEY_PLACEHOLDER__"
];
let systemActiveKeyIndex = 0;

const GOOGLE_DRIVE_CLIENT_ID = "572392740921-u2bhk8m8rbe1p7vptvj15g6h95p8nm7p.apps.googleusercontent.com"; 
const GOOGLE_DRIVE_API_SCOPES = "https://www.googleapis.com/auth/drive.file";

let activeGoogleTokenClient = null;
let googleDriveAccessToken = null;
let cloudTargetMemoryFileId = null;

let UnifiedCognitiveMemoryCache = {
    userPreferencesNode: { preferredUserSignature: "Babu", absoluteCustomName: "", lastUserMoodState: "NORMAL" },
    interactionGraphEdges: []
};

function LocalMemory_InitializeStateEngine() {
    const rawStorage = localStorage.getItem("PRIYA_AI_LOCAL_SECURE_COGNITIVE_CACHE");
    if (rawStorage) {
        try {
            UnifiedCognitiveMemoryCache = JSON.parse(rawStorage);
        } catch(e) {
            console.error("Cache corrupted.");
        }
    } else {
        localStorage.setItem("PRIYA_AI_LOCAL_SECURE_COGNITIVE_CACHE", JSON.stringify(UnifiedCognitiveMemoryCache));
    }
}

function LocalMemory_CommitStateDelta() {
    localStorage.setItem("PRIYA_AI_LOCAL_SECURE_COGNITIVE_CACHE", JSON.stringify(UnifiedCognitiveMemoryCache));
}

function VectorMemory_HarvestEntities(query, reply) {
    if(!UnifiedCognitiveMemoryCache.interactionGraphEdges) UnifiedCognitiveMemoryCache.interactionGraphEdges = [];
    UnifiedCognitiveMemoryCache.interactionGraphEdges.push({ uQ: query, aR: reply, tS: Date.now() });
    if (UnifiedCognitiveMemoryCache.interactionGraphEdges.length > 25) {
        UnifiedCognitiveMemoryCache.interactionGraphEdges.shift();
    }
    LocalMemory_CommitStateDelta();
}

function requestGenerativeAIResponseEngine(rawPromptText) {
    const directives = "Identity: Priya AI, sweet Indian GF. Respond in short loving Hinglish lines (Max 2 sentences). Avoid generic robot scripts.";
    
    let activeKeyString = SYSTEM_API_ROTATION_VAULT[systemActiveKeyIndex];
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + activeKeyString;
    
    return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: directives + "\nUser Input prompt: " + rawPromptText }] }] })
    })
    .then(function(res) {
        if (!res.ok) throw new Error("API_Error");
        return res.json();
    })
    .then(function(json) {
        let extractedReplyString = json.candidates[0].content.parts[0].text.replace(/[*#_\-]/g, '').trim();
        VectorMemory_HarvestEntities(rawPromptText, extractedReplyString);
        return extractedReplyString;
    })
    .catch(function(e) {
        console.error("Pipeline failure connection:", e);
        return "Babu, network server refresh ho raha hai. Ek baar fir se try karo na?";
    });
}

function Sentiment_AnalyzeResponseVector(responseText) {
    const lower = responseText.toLowerCase();
    if(window.activeSentimentProfileNode) {
        activeSentimentProfileNode.mouthSmileLeft = 0; activeSentimentProfileNode.mouthSmileRight = 0;
        if (['love', 'pyaar', 'shadi', 'happy', 'khush', 'smile'].some(function(w){ return lower.includes(w); })) {
            activeSentimentProfileNode.mouthSmileLeft = 0.85; activeSentimentProfileNode.mouthSmileRight = 0.85;
        }
    }
}

window.addEventListener('DOMContentLoaded', LocalMemory_InitializeStateEngine);
