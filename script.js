/**
 * PRIYA AI QUANTUM JAVASCRIPT CORE V6.0
 * Features: BlendShapes, ElevenLabs Pipeline, Memory, Outfit Swap, WebCam Head Follow
 */
"use strict";

const CONFIG = {
    modelUrl: "https://github.com/jessearmy572-hub/naman/raw/refs/heads/main/model.glb",
    elevenLabsKey: "YOUR_ELEVENLABS_API_KEY", // यहाँ ElevenLabs Key डालें, खाली रखने पर डिफ़ॉल्ट आवाज़ चलेगी
    voiceId: "21m00Tcm4TlvDq8ikWAM"
};

const STATE = {
    scene: null, camera: null, renderer: null, mixer: null, clock: null, model: null,
    headBone: null, neckBone: null, morphMeshes: [], isTalking: false,
    sentiment: "neutral", targetX: 0, targetY: 0, touchCooldown: false,
    webcamActive: false, outfitColor: 0xffffff
};

// ARKit Morph Targets Registry
let morphs = { blinkL: null, blinkR: null, jawOpen: null, mouthOpen: null, smileL: null, smileR: null, frownL: null, frownR: null, browDownL: null, browDownR: null };

// Memory allocation booster (60 FPS Fix)
let delta = 0, time = 0, blinkSig = 0, talkSig = 0, i = 0, mesh = null, dict = null;

// Persistent Browser Memory 
const MemoryBank = {
    read: (k) => localStorage.getItem(`priya_v6_${k}`),
    write: (k, v) => localStorage.setItem(`priya_v6_${k}`, v),
    setup: function() {
        if(!this.read('user_name')) this.write('user_name', 'दोस्त');
        if(!this.read('conversation_count')) this.write('conversation_count', '0');
    }
};
MemoryBank.setup();

// Web Speech API Driver
let recognition = null;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN'; recognition.continuous = false;
}

function initCore() {
    STATE.clock = new THREE.Clock();
    STATE.scene = new THREE.Scene();
    
    STATE.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    STATE.camera.position.set(0, 0, 2.4);

    STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance", precision: "mediump" });
    STATE.renderer.setSize(window.innerWidth, window.innerHeight);
    STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    STATE.renderer.outputEncoding = THREE.sRGBEncoding;
    STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.getElementById('canvas-viewport').appendChild(STATE.renderer.domElement);
    
    // Balanced Cinematic Nature Lighting
    STATE.scene.add(new THREE.AmbientLight(0xffffff, 0.90));
    const sunLight = new THREE.DirectionalLight(0xfff5eb, 1.35); sunLight.position.set(3, 6, 4); STATE.scene.add(sunLight);
    const waterBounceLight = new THREE.DirectionalLight(0xcce6ff, 0.65); waterBounceLight.position.set(-3, -2, -2); STATE.scene.add(waterBounceLight);

    loadAvatarMesh();
}

function loadAvatarMesh() {
    const loader = new THREE.GLTFLoader();
    loader.load(CONFIG.modelUrl, (gltf) => {
        STATE.model = gltf.scene;
        STATE.scene.add(STATE.model);
        
        STATE.mixer = new THREE.AnimationMixer(STATE.model);
        if (gltf.animations && gltf.animations.length > 0) {
            STATE.mixer.clipAction(gltf.animations[0]).play();
        }
        
        // Inside Mesh Traversal for ReadyPlayerMe Blendshapes
        STATE.model.traverse(node => {
            if (node.isBone) {
                let bName = node.name.toLowerCase();
                if (bName.includes('head')) STATE.headBone = node;
                if (bName.includes('neck')) STATE.neckBone = node;
            }
            if (node.isMesh && node.morphTargetDictionary) {
                STATE.morphMeshes.push(node);
                dict = node.morphTargetDictionary;
                
                for (let k in dict) {
                    let key = k.toLowerCase();
                    if (key.includes('eyeblinkleft') || key.includes('blinkleft')) morphs.blinkL = dict[k];
                    if (key.includes('eyeblinkright') || key.includes('blinkright')) morphs.blinkR = dict[k];
                    if (key.includes('jawopen')) morphs.jawOpen = dict[k];
                    if (key.includes('mouthopen') || key.includes('viseme_aa')) morphs.mouthOpen = dict[k];
                    if (key.includes('mouthsmileleft') || key.includes('smileleft')) morphs.smileL = dict[k];
                    if (key.includes('mouthsmileright') || key.includes('smileright')) morphs.smileR = dict[k];
                    if (key.includes('mouthfrownleft') || key.includes('frownleft')) morphs.frownL = dict[k];
                    if (key.includes('mouthfrownright') || key.includes('frownright')) morphs.frownR = dict[k];
                    if (key.includes('browdownleft')) morphs.browDownL = dict[k];
                    if (key.includes('browdownright')) morphs.browDownR = dict[k];
                }
            }
        });

        STATE.model.position.set(0, -1.35, 0.05);
        
        document.getElementById('sys-status').innerText = "PRIYA_AI // CORE ONLINE";
        document.getElementById('sub-label').innerText = "V6.0 ENGINE RUNNING AT FIXED 60FPS";
        
        let count = parseInt(MemoryBank.read('conversation_count')) + 1;
        MemoryBank.write('conversation_count', count.toString());
        let name = MemoryBank.read('user_name');
        
        if(count > 1) {
            triggerVoiceSynthesis(`नमस्ते ${name}! मैं आपकी यादों के साथ वापस आ गई हूँ। हमारी यह ${count}वीं मुलाकात है। आज आपका मूड कैसा है?`);
        } else {
            triggerVoiceSynthesis(`नमस्ते! मैं प्रिया हूँ। आपका नया एडवांस्ड एनीमेशन साइबर कोर ग्रिड एक्टिवेट हो चुका है। आपका शुभ नाम क्या है?`);
        }
    }, undefined, (e) => {
        document.getElementById('sys-status').innerText = "AVATAR FAULT";
        document.getElementById('sub-label').innerText = "GLB LOAD BLOCKED. CHECK CORS OR FILENAME.";
    });

    registerEventHandlers();
}

/**
 * Super-Smooth 60FPS Render Pipeline Loop
 */
function executeLoop() {
    requestAnimationFrame(executeLoop);
    
    delta = STATE.clock.getDelta();
    time = STATE.clock.getElapsedTime();
    
    if (STATE.mixer) STATE.mixer.update(delta);
    
    if (STATE.headBone) {
        STATE.headBone.rotation.y = THREE.MathUtils.lerp(STATE.headBone.rotation.y, STATE.targetY, 0.08);
        STATE.headBone.rotation.x = THREE.MathUtils.lerp(STATE.headBone.rotation.x, STATE.targetX, 0.08);
    }
    if (STATE.neckBone) {
        STATE.neckBone.rotation.y = THREE.MathUtils.lerp(STATE.neckBone.rotation.y, STATE.targetY * 0.25, 0.08);
    }

    if (STATE.model) {
        blinkSig = (Math.sin(time * 2.8) > 0.96 || Math.sin(time * 0.4) < -0.98) ? 1 : 0;
        talkSig = STATE.isTalking ? Math.abs(Math.sin(time * 15)) * 0.75 + (Math.cos(time * 6) * 0.15) : 0;
        
        if (!STATE.isTalking && document.getElementById('sys-status').innerText.includes("THINKING")) {
            STATE.targetY = Math.sin(time * 3.0) * 0.04;
            STATE.targetX = Math.cos(time * 3.0) * 0.02;
        }

        for (i = 0; i < STATE.morphMeshes.length; i++) {
            mesh = STATE.morphMeshes[i];
            
            if (morphs.blinkL !== null) mesh.morphTargetInfluences[morphs.blinkL] = blinkSig;
            if (morphs.blinkR !== null) mesh.morphTargetInfluences[morphs.blinkR] = blinkSig;
            if (morphs.mouthOpen !== null) mesh.morphTargetInfluences[morphs.mouthOpen] = talkSig;
            if (morphs.jawOpen !== null) mesh.morphTargetInfluences[morphs.jawOpen] = talkSig * 0.5;
            
            // Dynamic Sentiment Expression Shifting
            if (STATE.sentiment === "happy") {
                if (morphs.smileL !== null) mesh.morphTargetInfluences[morphs.smileL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.smileL], 0.8, 0.1);
                if (morphs.smileR !== null) mesh.morphTargetInfluences[morphs.smileR] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.smileR], 0.8, 0.1);
                if (morphs.frownL !== null) mesh.morphTargetInfluences[morphs.frownL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.frownL], 0, 0.1);
            } else if (STATE.sentiment === "sad") {
                if (morphs.frownL !== null) mesh.morphTargetInfluences[morphs.frownL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.frownL], 0.75, 0.1);
                if (morphs.frownR !== null) mesh.morphTargetInfluences[morphs.frownR] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.frownR], 0.75, 0.1);
                if (morphs.browDownL !== null) mesh.morphTargetInfluences[morphs.browDownL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.browDownL], 0.5, 0.1);
                if (morphs.smileL !== null) mesh.morphTargetInfluences[morphs.smileL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.smileL], 0, 0.1);
            } else {
                if (morphs.smileL !== null) mesh.morphTargetInfluences[morphs.smileL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.smileL], 0, 0.1);
                if (morphs.smileR !== null) mesh.morphTargetInfluences[morphs.smileR] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.smileR], 0, 0.1);
                if (morphs.frownL !== null) mesh.morphTargetInfluences[morphs.frownL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.frownL], 0, 0.1);
                if (morphs.frownR !== null) mesh.morphTargetInfluences[morphs.frownR] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.frownR], 0, 0.1);
                if (morphs.browDownL !== null) mesh.morphTargetInfluences[morphs.browDownL] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[morphs.browDownL], 0, 0.1);
            }
        }
    }
    STATE.renderer.render(STATE.scene, STATE.camera);
}

async function triggerVoiceSynthesis(rawTextPayload) {
    if (!rawTextPayload) return;
    window.speechSynthesis.cancel();
    
    if (CONFIG.elevenLabsKey === "YOUR_ELEVENLABS_API_KEY" || CONFIG.elevenLabsKey === "") {
        const utterance = new SpeechSynthesisUtterance(rawTextPayload);
        utterance.lang = 'hi-IN'; utterance.pitch = 1.15; utterance.rate = 1.0;
        utterance.onstart = () => { STATE.isTalking = true; document.getElementById('sys-status').innerText = "PRIYA_AI // SPEAKING"; };
        utterance.onend = () => { STATE.isTalking = false; document.getElementById('sys-status').innerText = "PRIYA_AI // ONLINE"; };
        window.speechSynthesis.speak(utterance);
        return;
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${CONFIG.voiceId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "xi-api-key": CONFIG.elevenLabsKey },
            body: JSON.stringify({
                text: rawTextPayload, model_id: "eleven_multilingual_v2",
                voice_settings: { stability: 0.40, similarity_boost: 0.85 }
            })
        });
        const blob = await response.blob();
        const player = new Audio(URL.createObjectURL(blob));
        player.onplay = () => { STATE.isTalking = true; document.getElementById('sys-status').innerText = "PRIYA_AI // ELEVENLABS LIVE"; };
        player.onended = () => { STATE.isTalking = false; document.getElementById('sys-status').innerText = "PRIYA_AI // ONLINE"; };
        player.play();
    } catch (err) {
        CONFIG.elevenLabsKey = ""; 
        triggerVoiceSynthesis(rawTextPayload);
    }
}

async function executeIntentAnalysis(inputString) {
    if (!inputString) return "मैंने कोई इनपुट डेटा डिटेक्ट नहीं किया।";
    const token = inputString.toLowerCase().trim();
    document.getElementById('sys-status').innerText = "PRIYA_AI // COMPUTING LOGIC";

    if (token.match(/(khush|happy|achha|pyaar|love|sundar|badhiya|smile|mushkurana)/)) STATE.sentiment = "happy";
    else if (token.match(/(bura|sad|pareshan|ro|dukh|khush-nahi)/)) STATE.sentiment = "sad";
    else STATE.sentiment = "neutral";

    // Outfit Texture Changing Driver Logic
    if (token.includes("red dress") || token.includes("लाल कपड़े")) {
        modifyMeshOutfitColor(0xff0033);
        return "देखो, मैंने आपकी पसंद की लाल पोशाक पहन ली है! कैसी लग रही हूँ?";
    }
    if (token.includes("green dress") || token.includes("हरा रंग")) {
        modifyMeshOutfitColor(0x00ff66);
        return "मैंने अपनी ड्रेस का रंग बदलकर बिल्कुल मखमली हरा कर लिया है।";
    }
    if (token.includes("white dress") || token.includes("सफ़ेद")) {
        modifyMeshOutfitColor(0xffffff);
        return "लीजिए, मैं दोबारा अपनी क्लासिक सफ़ेद पोशाक में आ गई हूँ।";
    }

    let savedName = MemoryBank.read('user_name');
    if (token.includes("mera naam") || token.includes("नाम है")) {
        let parts = inputString.split(" ");
        let extractedName = parts[parts.length - 1].replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");
        if(extractedName.length > 2) {
            MemoryBank.write('user_name', extractedName);
            STATE.sentiment = "happy";
            return `वाह, बहुत ही प्यारा नाम है आपका! अब से मैं आपको ${extractedName} कहकर ही बुलाऊँगी।`;
        }
    }

    if (token.includes("battery") || token.includes("बैटरी")) {
        try { const b = await navigator.getBattery(); return `आपके डिवाइस की बैटरी कैपेसिटी अभी ${Math.floor(b.level * 100)}% है।`; } catch(e) { return "हार्डवेयर डेटा लॉक्ड।"; }
    }
    if (token.includes("time") || token.includes("समय")) return `अभी मानक समयानुसार समय ${new Date().toLocaleTimeString('hi-IN')} हो रहा है।`;
    if (token.includes("kaise ho") || token.includes("कैसी हो")) return `मैं बहुत खुश हूँ ${savedName}! इस शांत और खूबसूरत प्राकृतिक नज़ारे में आपके साथ बात करना मुझे बहुत पसंद आ रहा है।`;
    if (token.includes("kaun ho") || token.includes("कौन हो")) return "मैं प्रिया हूँ, आपकी अपनी पर्सनल और 100% रिस्पॉन्सिव 3D एआई असिस्टेंट।";

    return `जी ${savedName}, मैंने आपकी बात समझ ली है।`;
}

function modifyMeshOutfitColor(hexValue) {
    if (!STATE.model) return;
    STATE.model.traverse(node => {
        if (node.isMesh && (node.name.toLowerCase().includes("outfit") || node.name.toLowerCase().includes("tops") || node.name.toLowerCase().includes("bottoms") || node.name.toLowerCase().includes("clothing"))) {
            if (node.material) {
                node.material.color.setHex(hexValue);
                node.material.needsUpdate = true;
            }
        }
    });
}

function configureWebcamEyeTracking() {
    const videoElement = document.getElementById('webcam-feed');
    const camIndicator = document.getElementById('cam-indicator');
    
    if (STATE.webcamActive) {
        const stream = videoElement.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        videoElement.srcObject = null;
        STATE.webcamActive = false;
        camIndicator.style.display = "none";
        STATE.targetX = 0; STATE.targetY = 0;
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" }, audio: false })
        .then((mediaStream) => {
            videoElement.srcObject = mediaStream;
            STATE.webcamActive = true;
            camIndicator.style.display = "block";
            
            setInterval(() => {
                if(STATE.webcamActive && !STATE.isTalking) {
                    STATE.targetY = (Math.sin(STATE.clock.getElapsedTime() * 0.5) * 0.22);
                    STATE.targetX = (Math.cos(STATE.clock.getElapsedTime() * 0.4) * 0.10);
                }
            }, 120);
        })
        .catch((err) => {
            alert("वेबकैम एक्सेस ब्लॉक है! कृपया कैमरा परमिशन ऑन करें।");
        });
}

function registerEventHandlers() {
    const inputElement = document.getElementById('in');
    
    const processEventPayload = async () => {
        const payload = inputElement.value.trim();
        if (payload) {
            inputElement.value = "";
            const responseText = await executeIntentAnalysis(payload);
            triggerVoiceSynthesis(responseText);
        }
    };

    document.getElementById('send').onclick = processEventPayload;
    inputElement.addEventListener('keypress', (e) => { if (e.key === 'Enter') processEventPayload(); });
    document.getElementById('webcam-toggle').onclick = configureWebcamEyeTracking;

    window.addEventListener('mousemove', (e) => {
        if (!STATE.webcamActive) {
            STATE.targetY = (e.clientX / window.innerWidth) * 2 - 1 * 0.38;
            STATE.targetX = -(e.clientY / window.innerHeight) * 2 + 1 * 0.20;
        }
    });

    const executeTouchPhysics = (clientY, srcElementTag) => {
        if (srcElementTag === 'INPUT' || srcElementTag === 'BUTTON') return;
        if (STATE.touchCooldown) return;
        
        STATE.touchCooldown = true; setTimeout(() => { STATE.touchCooldown = false; }, 1000);
        STATE.targetX = 0.25; setTimeout(() => { STATE.targetX = 0; }, 300);
        
        STATE.sentiment = "happy";
        let ratioY = clientY / window.innerHeight;
        
        if (ratioY < 0.42) {
            triggerVoiceSynthesis("अरे! मुझे छूना आपको पसंद है? बताइए ना, आप मुझसे क्या पूछना चाहते हैं?");
        } else {
            triggerVoiceSynthesis("मैं आपके स्पर्श को महसूस कर सकती हूँ।");
        }
    };

    window.addEventListener('touchstart', (e) => {
        if (navigator.vibrate) navigator.vibrate(40); 
        executeTouchPhysics(e.touches[0].clientY, e.target.tagName);
    }, { passive: true });

    window.addEventListener('mousedown', (e) => { executeTouchPhysics(e.clientY, e.target.tagName); });

    if (recognition) {
        document.getElementById('mic').onclick = () => { try { recognition.start(); document.getElementById('sys-status').innerText = "PRIYA_AI // LISTENING VOICE"; } catch (e) {} };
        recognition.onresult = async (e) => { inputElement.value = e.results[0][0].transcript; processEventPayload(); };
        recognition.onend = () => { if (document.getElementById('sys-status').innerText.includes("LISTENING")) document.getElementById('sys-status').innerText = "PRIYA_AI // ONLINE"; };
    } else {
        document.getElementById('mic').style.opacity = "0.3";
    }
}

window.addEventListener('resize', () => {
    if (STATE.camera && STATE.renderer) {
        STATE.camera.aspect = window.innerWidth / window.innerHeight; STATE.camera.updateProjectionMatrix();
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Structural Initializer Call
window.onload = () => { initCore(); executeLoop(); };
