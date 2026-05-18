/**
 * PRIYA AI ADVANCED COMPUTE CONTEXT - GOOGLE DRIVE AUTO-STORAGE CONFIGURATION
 */

// Production API Access Matrix Keys
const SYSTEM_API_ROTATION_VAULT = [
    "AIzaSyBgyADY-6VFaLefYi8PaGak_L8kpfpGDA0",
    "AIzaSyBSaw3teN0aoDb2qdzuYktqUZ08sUOIv5o"
];
let systemActiveKeyIndex = 0;

// Cloud Drive Integration Constants (OAuth Verification Nodes)
const GOOGLE_DRIVE_CLIENT_ID = "572392740921-u2bhk8m8rbe1p7vptvj15g6h95p8nm7p.apps.googleusercontent.com"; 
const GOOGLE_DRIVE_API_SCOPES = "https://www.googleapis.com/auth/drive.file";

let activeGoogleTokenClient = null;
let googleDriveAccessToken = null;
let cloudTargetMemoryFileId = null;

// Primary Asset Mirror
const CLOUD_MODEL_ENDPOINT = "https://cdn.jsdelivr.net/gh/jessearmy572-hub/naman3@main/model.glb";

// ThreeJS Operational Handlers
let globalThreeScene, globalThreeCamera, globalThreeRenderer, globalOrbitControls;
let mainAvatarModel = null, anatomicalHeadBone = null, anatomicalNeckBone = null, anatomicalSpineBone = null;
let computationalSkinnedMeshes = [];
let internalAnimationMixer = null, systemsClockEngine;

let kinematicsCoordinates = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
let ecosystemStates = { currentSentiment: "neutral", hologramShaderActive: false };
let standardMaterialsCacheMap = new Map();

let nativeAudioContextEngine = null, softwareAudioAnalyserNode = null, audioFrequencyByteDataArray = null;
let flagVoiceSynthesizerIsActive = false;
let mediaPipeFaceMeshInstance = null, physicalHardwareCameraStream = null, flagWebcamTrackingIsActive = false;
let profilingFramesCount = 0, operationalLastTimestamp = 0;

// Direct Runtime Cache Object
let UnifiedCognitiveMemoryCache = {
    userPreferencesNode: { preferredUserSignature: "Babu", absoluteCustomName: "" },
    interactionGraphEdges: []
};

/**
 * GOOGLE DRIVE ARCHITECTURE ENGINE (AUTHENTICATION & AUTO SYNC)
 */
function Cloud_InitializeGoogleClientPipelines() {
    gapi.load('client', async () => {
        await gapi.client.init({});
        // Initialize OAuth Token Pipeline
        activeGoogleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_DRIVE_CLIENT_ID,
            scope: GOOGLE_DRIVE_API_SCOPES,
            callback: async (tokenResponse) => {
                if (tokenResponse.error) return;
                googleDriveAccessToken = tokenResponse.access_token;
                document.getElementById('hud-drive-status').innerText = "CLOUD ACTIVE";
                document.getElementById('hud-drive-status').style.color = "var(--matrix-green)";
                document.getElementById('authDriveBtn').style.display = "none";
                
                await Cloud_ExecuteSecureMemoryHandshake();
            },
        });
    });
}

function Cloud_TriggerDriveAuthorizationLink() {
    if (activeGoogleTokenClient) activeGoogleTokenClient.requestAccessToken({ prompt: 'consent' });
}

async function Cloud_ExecuteSecureMemoryHandshake() {
    try {
        // Query to check if memory file already exists inside user's drive
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='Priya_AI_Memory.json' and trashed=false`, {
            headers: { 'Authorization': `Bearer ${googleDriveAccessToken}` }
        });
        const meta = await response.json();
        
        if (meta.files && meta.files.length > 0) {
            cloudTargetMemoryFileId = meta.files[0].id;
            await Cloud_DownloadMemoryGraphFromDrive();
        } else {
            await Cloud_CreateFirstTimeMemoryGraphOnDrive();
        }
    } catch (err) { console.error("Cloud Handshake Failed:", err); }
}

async function Cloud_DownloadMemoryGraphFromDrive() {
    try {
        const fetchFile = await fetch(`https://www.googleapis.com/drive/v3/files/${cloudTargetMemoryFileId}?alt=media`, {
            headers: { 'Authorization': `Bearer ${googleDriveAccessToken}` }
        });
        const remoteData = await fetchFile.json();
        if (remoteData) {
            UnifiedCognitiveMemoryCache = remoteData;
            console.log("Cloud Graph Loaded into Frame Context Matrix Successfully!");
        }
    } catch (e) { console.error(e); }
}

async function Cloud_CreateFirstTimeMemoryGraphOnDrive() {
    const boundary = 'foo_bar_baz';
    const metadata = { name: 'Priya_AI_Memory.json', mimeType: 'application/json' };
    
    const multipartBody = 
        `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}` +
        `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(UnifiedCognitiveMemoryCache)}\r\n--${boundary}--`;

    try {
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${googleDriveAccessToken}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartBody
        });
        const file = await res.json();
        cloudTargetMemoryFileId = file.id;
    } catch (err) { console.error(err); }
}

async function Cloud_UpdateMemoryGraphOnDrive() {
    if (!googleDriveAccessToken || !cloudTargetMemoryFileId) return; // Silent failure if not authorized
    try {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${cloudTargetMemoryFileId}?uploadType=media`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${googleDriveAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(UnifiedCognitiveMemoryCache)
        });
    } catch (err) { console.warn("Cloud Write Cycle Drop:", err); }
}

function VectorMemory_HarvestEntities(query, reply) {
    if (query.toLowerCase().includes('naam') || query.toLowerCase().includes('name')) {
        let parts = query.split(/\s+/);
        if(parts.length > 2) UnifiedCognitiveMemoryCache.userPreferencesNode.absoluteCustomName = parts[parts.length-1];
    }
    UnifiedCognitiveMemoryCache.interactionGraphEdges.push({ uQ: query, aR: reply, tS: Date.now() });
    if (UnifiedCognitiveMemoryCache.interactionGraphEdges.length > 20) UnifiedCognitiveMemoryCache.interactionGraphEdges.shift();
    
    // Auto Trigger Asynchronous Sync to Google Drive
    Cloud_UpdateMemoryGraphOnDrive();
}

/**
 * INTERACTION GENERATIVE CORE
 */
async function requestGenerativeAIResponseEngine(rawPromptText) {
    const signature = UnifiedCognitiveMemoryCache.userPreferencesNode.absoluteCustomName || "Babu";
    const directives = `Identity: Priya AI, Indian virtual girlfriend. Language: Sweet Hinglish/Bhojpuri lines. Max 2 lines. Expressions inside brackets. Context User Name: ${signature}`;

    let rotationKey = SYSTEM_API_ROTATION_VAULT[systemActiveKeyIndex];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${rotationKey}`;

    try {
        const pipeline = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `${directives}\nPrompt: ${rawPromptText}` }] }] })
        });
        if (!pipeline.ok) throw new Error("Key Rotated");
        const json = await pipeline.json();
        let resText = json.candidates[0].content.parts[0].text.replace(/[*#_\-]/g, '').trim();
        
        VectorMemory_HarvestEntities(rawPromptText, resText);
        return resText;
    } catch (e) {
        systemActiveKeyIndex = (systemActiveKeyIndex + 1) % SYSTEM_API_ROTATION_VAULT.length;
        return await requestGenerativeAIResponseEngine(rawPromptText);
    }
}

function interpretSentimentHeuristics(inputString) {
    const raw = inputString.toLowerCase();
    let state = "neutral";
    if (["खुश", "smile", "अच्छा", "happy", "love"].some(t => raw.includes(t))) state = "happy";
    else if (["sad", "dukh", "उदाश", "angry"].some(t => raw.includes(t))) state = "sad";
    
    ecosystemStates.currentSentiment = state;
    const node = document.getElementById('hud-sentiment-label');
    if (node) {
        node.innerText = state.toUpperCase();
        node.style.color = state === "happy" ? "var(--neon-cyan)" : (state === "sad" ? "var(--neon-pink)" : "var(--neon-blue)");
    }
}

/**
 * 3D VIEWPORT ENGINE CORE
 */
function initializeThreeGraphicsEnvironment() {
    const container = document.getElementById('canvas-container');
    systemsClockEngine = new THREE.Clock();
    globalThreeScene = new THREE.Scene();

    globalThreeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    globalThreeRenderer.setSize(window.innerWidth, window.innerHeight);
    globalThreeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globalThreeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(globalThreeRenderer.domElement);

    globalThreeCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    globalThreeCamera.position.set(0, 0.35, 2.0);

    globalOrbitControls = new THREE.OrbitControls(globalThreeCamera, globalThreeRenderer.domElement);
    globalOrbitControls.enablePan = false; globalOrbitControls.target.set(0, 0.2, 0);
    globalOrbitControls.enableDamping = true;

    globalThreeScene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dLight = new THREE.DirectionalLight(0xfff6ed, 2.0);
    dLight.position.set(2, 5, 4); globalThreeScene.add(dLight);

    const loader = new THREE.GLTFLoader();
    loader.load(CLOUD_MODEL_ENDPOINT, (gltf) => {
        dismissBootLoaderScreen();
        mainAvatarModel = gltf.scene;
        mainAvatarModel.position.y = -0.7; 
        mainAvatarModel.scale.setScalar(1.55);

        mainAvatarModel.traverse((node) => {
            if (node.isMesh) {
                node.frustumCulled = false;
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                    standardMaterialsCacheMap.set(node.id, node.material.clone());
                }
            }
            if (node.isBone) {
                let name = node.name.toLowerCase();
                if (name.includes('head')) anatomicalHeadBone = node;
                if (name.includes('neck')) anatomicalNeckBone = node;
                if (name.includes('spine')) anatomicalSpineBone = node;
            }
            if (node.morphTargetDictionary) computationalSkinnedMeshes.push(node);
        });

        globalThreeScene.add(mainAvatarModel);
        internalAnimationMixer = new THREE.AnimationMixer(mainAvatarModel);
        if (gltf.animations && gltf.animations.length > 0) {
            internalAnimationMixer.clipAction(gltf.animations[0]).play();
        }
    }, undefined, (err) => { console.error(err); dismissBootLoaderScreen(); });

    window.addEventListener('resize', () => {
        globalThreeCamera.aspect = window.innerWidth / window.innerHeight; globalThreeCamera.updateProjectionMatrix();
        globalThreeRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
        if (flagWebcamTrackingIsActive) return;
        kinematicsCoordinates.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        kinematicsCoordinates.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
}

function UIBridge_ToggleHologramShader(btn) {
    if (!mainAvatarModel) return;
    ecosystemStates.hologramShaderActive = !ecosystemStates.hologramShaderActive;
    mainAvatarModel.traverse((node) => {
        if (node.isMesh && node.material) {
            if (ecosystemStates.hologramShaderActive) {
                btn.classList.add('shader-active');
                node.material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.35 });
            } else {
                btn.classList.remove('shader-active');
                if (standardMaterialsCacheMap.has(node.id)) node.material = standardMaterialsCacheMap.get(node.id).clone();
            }
            node.material.needsUpdate = true;
        }
    });
}

function UIBridge_SwapOutfit(tag, btn) {
    if (!mainAvatarModel || ecosystemStates.hologramShaderActive) return;
    let color = tag === 'crimson' ? 0xbf061d : 0xffffff;
    mainAvatarModel.traverse(p => {
        if (p.isMesh && p.material) {
            let name = p.name.toLowerCase();
            if (['top', 'outfit', 'saree', 'shirt'].some(t => name.includes(t))) {
                p.material.color.setHex(color); p.material.needsUpdate = true;
            }
        }
    });
}

function instantiateAudioHardwarePipelines() {
    if (nativeAudioContextEngine) return;
    try {
        nativeAudioContextEngine = new (window.AudioContext || window.webkitAudioContext)();
        softwareAudioAnalyserNode = nativeAudioContextEngine.createAnalyser();
        softwareAudioAnalyserNode.fftSize = 64;
        audioFrequencyByteDataArray = new Uint8Array(softwareAudioAnalyserNode.frequencyBinCount);
    } catch (e) { console.warn(e); }
}

function processTextToVoiceSpeechSynthesis(text) {
    instantiateAudioHardwarePipelines();
    const scrubbed = text.replace(/\[.*?\]/g, '').trim();
    const box = document.getElementById('subtitle-monitor-box');
    const node = document.getElementById('subtitle-internal-node');

    if (box && node) { node.innerText = text; box.style.display = 'block'; }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let utterance = new SpeechSynthesisUtterance(scrubbed);
    utterance.lang = 'hi-IN';
    utterance.onstart = () => { flagVoiceSynthesizerIsActive = true; executeSpectrumFrequencyRundownLoop(); };
    utterance.onend = () => { flagVoiceSynthesizerIsActive = false; if (box) box.style.display = 'none'; resetFrequencyHUDVisualizers(); };
    window.speechSynthesis.speak(utterance);
}

function executeSpectrumFrequencyRundownLoop() {
    if (!flagVoiceSynthesizerIsActive) return;
    if (audioFrequencyByteDataArray) {
        for (let i = 0; i < audioFrequencyByteDataArray.length; i++) audioFrequencyByteDataArray[i] = Math.floor(Math.random() * 180) + 50;
        renderLiveFrequencyHUDMetrics();
    }
    setTimeout(() => { if (flagVoiceSynthesizerIsActive) executeSpectrumFrequencyRundownLoop(); }, 70);
}

function renderLiveFrequencyHUDMetrics() {
    const parent = document.getElementById('frequencyBarAnchor');
    if (!parent) return;
    const bars = parent.querySelectorAll('.freq-bar');
    bars.forEach((bar, idx) => {
        if (audioFrequencyByteDataArray && audioFrequencyByteDataArray[idx] !== undefined) {
            let h = (audioFrequencyByteDataArray[idx] / 255) * 16;
            bar.style.height = `${Math.max(2, h)}px`;
        }
    });
}

function resetFrequencyHUDVisualizers() {
    const parent = document.getElementById('frequencyBarAnchor');
    if (parent) parent.querySelectorAll('.freq-bar').forEach(b => b.style.height = '2px');
}

function coreRuntimeAnimationProcessingPipeline() {
    requestAnimationFrame(coreRuntimeAnimationProcessingPipeline);
    const delta = systemsClockEngine.getDelta();
    const elapsed = systemsClockEngine.getElapsedTime();

    profilingFramesCount++;
    if (elapsed > operationalLastTimestamp + 1.0) {
        if (document.getElementById('hud-fps-val')) document.getElementById('hud-fps-val').innerText = `${profilingFramesCount} FPS`;
        profilingFramesCount = 0; operationalLastTimestamp = elapsed;
    }

    if (internalAnimationMixer) internalAnimationMixer.update(delta);
    if (globalOrbitControls) globalOrbitControls.update();

    if (mainAvatarModel) {
        kinematicsCoordinates.currentX = THREE.MathUtils.lerp(kinematicsCoordinates.currentX, kinematicsCoordinates.targetX, 0.1);
        kinematicsCoordinates.currentY = THREE.MathUtils.lerp(kinematicsCoordinates.currentY, kinematicsCoordinates.targetY, 0.1);

        if (anatomicalHeadBone) { 
            anatomicalHeadBone.rotation.y = kinematicsCoordinates.currentX * 0.45; 
            anatomicalHeadBone.rotation.x = -kinematicsCoordinates.currentY * 0.25; 
        }

        let lip = (flagVoiceSynthesizerIsActive) ? (Math.random() * 0.7) : 0;
        let blink = (Math.sin(elapsed * 4) > 0.98) ? 1.0 : 0.0;
        let smile = ecosystemStates.currentSentiment === "happy" ? 0.9 : 0.0;

        computationalSkinnedMeshes.forEach(mesh => {
            const d = mesh.morphTargetDictionary; const inf = mesh.morphTargetInfluences;
            if (!d || !inf) return;
            ['mouthOpen', 'jawOpen', 'viseme_aa'].forEach(k => { if (d[k] !== undefined) inf[d[k]] = lip; });
            ['eyeBlinkLeft', 'eyeBlinkRight'].forEach(k => { if (d[k] !== undefined) inf[d[k]] = THREE.MathUtils.lerp(inf[d[k]], blink, 0.8); });
            ['mouthSmileLeft', 'mouthSmileRight'].forEach(k => { if (d[k] !== undefined) inf[d[k]] = THREE.MathUtils.lerp(inf[d[k]], smile, 0.1); });
        });
    }
    globalThreeRenderer.render(globalThreeScene, globalThreeCamera);
}

const userInput = document.getElementById('userInput');
async function triggerProcessingWorkflowCycle() {
    const txt = userInput.value.trim(); if (!txt) return;
    userInput.value = ""; interpretSentimentHeuristics(txt);
    const reply = await requestGenerativeAIResponseEngine(txt);
    processTextToVoiceSpeechSynthesis(reply);
}

document.getElementById('sendBtn').addEventListener('click', triggerProcessingWorkflowCycle);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') triggerProcessingWorkflowCycle(); });

function dismissBootLoaderScreen() {
    const veil = document.getElementById('boot-loader');
    if (veil) { veil.style.opacity = '0'; setTimeout(() => { veil.style.display = 'none'; }, 400); }
}

// INTIALIZE SUB-SYSTEM CODES
initializeThreeGraphicsEnvironment();
coreRuntimeAnimationProcessingPipeline();
window.onload = () => { Cloud_InitializeGoogleClientPipelines(); };
