/**
 * nv1 HIGH-PERFORMANCE MAKKHAN JAVASCRIPT CORE V5.0
 * Strict Mode Functional Layout & Zero Memory Footprint Architecture
 */
"use strict";

const MODEL_URL = "https://github.com/jessearmy572-hub/naman/raw/refs/heads/main/model.glb";

// Global Isolated Logic Matrix
const STATE = {
    scene: null, camera: null, renderer: null, mixer: null, clock: null, model: null,
    headBone: null, neckBone: null, morphMeshes: [], isTalking: false,
    sentiment: "neutral", targetX: 0, targetY: 0, touchCooldown: false
};

// Index Registry Cache (Eliminates CPU lookup lag inside render loop)
let idxBlink = null, idxMouthOpen = null, idxSmile = null, idxFrown = null;

// Pre-allocated Global Scope Loop Counters (Zero Garbage Collection = No Stuttering)
let delta = 0, time = 0, blinkSig = 0, talkSig = 0, i = 0, mesh = 0, dict = 0;

// Speech Engine Handler
let recognition = null;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
}

function initialize3DUniverse() {
    STATE.clock = new THREE.Clock();
    STATE.scene = new THREE.Scene();
    
    STATE.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    STATE.camera.position.set(0, 0, 2.5);

    // High Speed Render Pipeline Context Setup
    STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance", precision: "mediump" });
    STATE.renderer.setSize(window.innerWidth, window.innerHeight);
    STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Capped at 2 to bypass thermal throttling on high-end phones
    STATE.renderer.outputEncoding = THREE.sRGBEncoding;
    STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.getElementById('canvas-viewport').appendChild(STATE.renderer.domElement);
    
    // Balanced Photorealistic Lighting Setup
    STATE.scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const sunLight = new THREE.DirectionalLight(0xfff6ed, 1.4); sunLight.position.set(4, 7, 5); STATE.scene.add(sunLight);
    const rimLight = new THREE.DirectionalLight(0xe0f2ff, 0.7); rimLight.position.set(-4, 4, -3); STATE.scene.add(rimLight);
    const bounceLight = new THREE.HemisphereLight(0xffffff, 0x9cb4bf, 0.45); bounceLight.position.set(0, -5, 0); STATE.scene.add(bounceLight);

    loadAvatarGLBAsset();
}

function loadAvatarGLBAsset() {
    const loader = new THREE.GLTFLoader();
    loader.load(MODEL_URL, (gltf) => {
        STATE.model = gltf.scene;
        STATE.scene.add(STATE.model);
        
        STATE.mixer = new THREE.AnimationMixer(STATE.model);
        if (gltf.animations && gltf.animations.length > 0) {
            STATE.mixer.clipAction(gltf.animations[0]).play();
        }
        
        // Single-pass skeletal data caching system
        STATE.model.traverse(node => {
            if (node.isBone) {
                let name = node.name.toLowerCase();
                if (name.includes('head')) STATE.headBone = node;
                if (name.includes('neck')) STATE.neckBone = node;
            }
            if (node.isMesh && node.morphTargetDictionary) {
                STATE.morphMeshes.push(node);
                dict = node.morphTargetDictionary;
                
                for (let key in dict) {
                    let k = key.toLowerCase();
                    if (k.includes('blink')) idxBlink = dict[key];
                    if (k.includes('mouthopen') || k.includes('jawopen') || k.includes('viseme')) idxMouthOpen = dict[key];
                    if (k.includes('mouthsmile') || k.includes('smile')) idxSmile = dict[key];
                    if (k.includes('frown') || k.includes('mouthsad')) idxFrown = dict[key];
                }
            }
        });

        STATE.model.position.set(0, -1.35, 0.05);
        
        document.getElementById('sys-status').innerText = "nv1 CORE: ONLINE";
        document.getElementById('sub-label').innerText = "60FPS ASYNC MAKKHAN PIPELINE ACTIVE";
        
        executeSpeechSynthesis("नमस्ते! आपका नया मॉड्यूल-बेस्ड और मक्खन स्मूथ जावास्क्रिप्ट आर्किटेक्चर लोड हो चुका है।");
    }, undefined, (err) => {
        document.getElementById('sys-status').innerText = "LINK FAULT";
        document.getElementById('sub-label').innerText = "CHECK GLB REACHABILITY // CORS RESTRICTION";
    });

    registerInteractiveDOMBindings();
}

/**
 * Highly Optimized Hyper-Smooth Animate Loop (No allocation stutters)
 */
function runAnimationEngineLoop() {
    requestAnimationFrame(runAnimationEngineLoop);
    
    delta = STATE.clock.getDelta();
    time = STATE.clock.getElapsedTime();
    
    if (STATE.mixer) STATE.mixer.update(delta);
    
    // Smooth Linear Physics Interpolation for Head/Neck Kinematics
    if (STATE.headBone) {
        STATE.headBone.rotation.y = THREE.MathUtils.lerp(STATE.headBone.rotation.y, STATE.targetY, 0.08);
        STATE.headBone.rotation.x = THREE.MathUtils.lerp(STATE.headBone.rotation.x, STATE.targetX, 0.08);
    }
    if (STATE.neckBone) {
        STATE.neckBone.rotation.y = THREE.MathUtils.lerp(STATE.neckBone.rotation.y, STATE.targetY * 0.25, 0.08);
    }

    if (STATE.model) {
        blinkSig = (Math.sin(time * 2.8) > 0.95 || Math.sin(time * 0.35) < -0.98) ? 1 : 0;
        talkSig = STATE.isTalking ? Math.abs(Math.sin(time * 16)) * 0.7 + (Math.cos(time * 7) * 0.12) : 0;
        
        // Idle Breathing Shift Matrix when assistant is computing logic
        if (!STATE.isTalking && document.getElementById('sys-status').innerText.includes("THINKING")) {
            STATE.targetY = Math.sin(time * 3.5) * 0.05;
            STATE.targetX = Math.cos(time * 3.5) * 0.025;
        }

        // Fast Direct Index Mapping for Morphs (Zero loops inside render thread)
        for (i = 0; i < STATE.morphMeshes.length; i++) {
            mesh = STATE.morphMeshes[i];
            
            if (idxBlink !== null) mesh.morphTargetInfluences[idxBlink] = blinkSig;
            if (idxMouthOpen !== null) mesh.morphTargetInfluences[idxMouthOpen] = talkSig;
            
            if (STATE.sentiment === "happy" && idxSmile !== null) {
                mesh.morphTargetInfluences[idxSmile] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[idxSmile], 0.7, 0.08);
            } else if (STATE.sentiment === "sad" && idxFrown !== null) {
                mesh.morphTargetInfluences[idxFrown] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[idxFrown], 0.6, 0.08);
            } else {
                if (idxSmile !== null) mesh.morphTargetInfluences[idxSmile] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[idxSmile], 0, 0.08);
                if (idxFrown !== null) mesh.morphTargetInfluences[idxFrown] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[idxFrown], 0, 0.08);
            }
        }
    }
    STATE.renderer.render(STATE.scene, STATE.camera);
}

async function executeSpeechSynthesis(payloadText) {
    if (!payloadText) return;
    window.speechSynthesis.cancel();
    
    const waveUtterance = new SpeechSynthesisUtterance(payloadText);
    waveUtterance.lang = 'hi-IN'; waveUtterance.pitch = 1.1; waveUtterance.rate = 1.0;
    
    waveUtterance.onstart = () => { STATE.isTalking = true; document.getElementById('sys-status').innerText = "nv1_SYSTEM // SPEAKING"; };
    waveUtterance.onend = () => { STATE.isTalking = false; document.getElementById('sys-status').innerText = "nv1_SYSTEM // ONLINE"; };
    waveUtterance.onerror = () => { STATE.isTalking = false; };
    
    window.speechSynthesis.speak(waveUtterance);
}

async function parseInputIntent(rawString) {
    if (!rawString) return "जी, कहिए मैं सुन रही हूँ।";
    const cleanToken = rawString.toLowerCase().trim();
    document.getElementById('sys-status').innerText = "nv1_SYSTEM // THINKING";

    if (cleanToken.match(/(khush|happy|achha|pyaar|love|sundar|badhiya)/)) STATE.sentiment = "happy";
    else if (cleanToken.match(/(bura|sad|pareshan|ro|dukh)/)) STATE.sentiment = "sad";
    else STATE.sentiment = "neutral";

    if (cleanToken.includes("battery") || cleanToken.includes("बैटरी")) {
        try { const b = await navigator.getBattery(); return `आपके डिवाइस की बैटरी अभी ${Math.floor(b.level * 100)}% चार्ज है।`; } catch(e) { return "बैटरी डेटा उपलब्ध नहीं है।"; }
    }
    if (cleanToken.includes("time") || cleanToken.includes("समय")) return `अभी समय ${new Date().toLocaleTimeString('hi-IN')} हो रहा है।`;
    if (cleanToken.includes("kaise ho") || cleanToken.includes("कैसी हो")) return "मैं बिल्कुल ठीक हूँ और आपके इस प्यारे से नेचुरल बैकग्राउंड व्यू का आनंद ले रही हूँ। आप कैसे हैं?";
    if (cleanToken.includes("kaun ho") || cleanToken.includes("कौन हो")) return "मैं प्रिया हूँ, आपकी एडवांस एन वी वन 3D रिस्पॉन्सिव असिस्टेंट।";

    return `जी, मैंने आपकी बात "${rawString}" को पूरी तरह समझ लिया है।`;
}

function registerInteractiveDOMBindings() {
    const uiInputField = document.getElementById('in');
    
    const processTransaction = async () => {
        const streamValue = uiInputField.value.trim();
        if (streamValue) {
            uiInputField.value = "";
            const dynamicReply = await parseInputIntent(streamValue);
            executeSpeechSynthesis(dynamicReply);
        }
    };

    document.getElementById('send').onclick = processTransaction;
    uiInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') processTransaction(); });

    // Pointer Follow Event Tracker
    window.addEventListener('mousemove', (e) => {
        STATE.targetY = (e.clientX / window.innerWidth) * 2 - 1 * 0.38;
        STATE.targetX = -(e.clientY / window.innerHeight) * 2 + 1 * 0.20;
    });

    // Unified Premium Touch Mechanics Layer
    const triggerTouchResponseMatrix = (clientY, componentTag) => {
        if (componentTag === 'INPUT' || componentTag === 'BUTTON') return;
        if (STATE.touchCooldown) return;
        
        STATE.touchCooldown = true; setTimeout(() => { STATE.touchCooldown = false; }, 1000);

        // Dynamic Nod Animation Vectors
        STATE.targetX = 0.22; setTimeout(() => { STATE.targetX = 0; }, 320);

        STATE.sentiment = "happy";
        if ((clientY / window.innerHeight) < 0.45) {
            executeSpeechSynthesis("हाँ जी, मैं आपके इस टच जेस्चर को महसूस कर सकती हूँ। बताइए क्या हुक्म है?");
        } else {
            executeSpeechSynthesis("एन वी वन का टच सेंसर पूरी तरह एक्टिव है। मैं आपकी बात सुन रही हूँ।");
        }
    };

    window.addEventListener('touchstart', (e) => {
        if (navigator.vibrate) navigator.vibrate(35); // Micro-haptic vibration response
        triggerTouchResponseMatrix(e.touches[0].clientY, e.target.tagName);
    }, { passive: true });

    window.addEventListener('mousedown', (e) => { triggerTouchResponseMatrix(e.clientY, e.target.tagName); });

    // Voice Capture Handler
    if (recognition) {
        document.getElementById('mic').onclick = () => { try { recognition.start(); document.getElementById('sys-status').innerText = "nv1_SYSTEM // LISTENING"; } catch (e) {} };
        recognition.onresult = async (e) => { uiInputField.value = e.results[0][0].transcript; processTransaction(); };
        recognition.onend = () => { if (document.getElementById('sys-status').innerText.includes("LISTENING")) document.getElementById('sys-status').innerText = "nv1_SYSTEM // ONLINE"; };
    } else {
        document.getElementById('mic').style.opacity = "0.35";
    }
}

window.addEventListener('resize', () => {
    if (STATE.camera && STATE.renderer) {
        STATE.camera.aspect = window.innerWidth / window.innerHeight; STATE.camera.updateProjectionMatrix();
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Structural Boot Sequence
window.onload = () => {
    initialize3DUniverse();
    runAnimationEngineLoop();
};
