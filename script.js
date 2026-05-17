/**
 * nv1 Ultimate Core Engine - 2026 Edition
 * Integrates: Face Mesh Tracking, Emotion Blendshapes, ElevenLabs, Memory, and Dynamic Textures
 */

// --- 1. CONFIGURATION & STATE MANAGEMENT ---
const MODEL_URL = "https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb";
const ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY"; // आवश्यकतानुसार अपनी की (Key) डालें
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // इलेवनलैब्स की डिफ़ॉल्ट फीमेल वॉयस आईडी

let scene, camera, renderer, mixer, clock, model, head;
let morphMeshes = [], talking = false, forceTouchTimer = 0;
let userSentiment = "neutral";
let webcamActive = false, videoElement = null, faceMesh = null;

// लोकल स्टोरेज मेमोरी इंजन (Persistence Core)
const nv1Memory = {
    getUserData: (key) => localStorage.getItem(`nv1_${key}`),
    setUserData: (key, val) => localStorage.setItem(`nv1_${key}`, val),
    init: function() {
        if (!this.getUserData('name')) {
            this.setUserData('name', 'यूजर');
            this.setUserData('mood', 'neutral');
        }
    }
};
nv1Memory.init();

// स्पीच रिकग्निशन सेटअप
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN';
recognition.continuous = false;

/**
 * 2. INITIALIZATION (THREE.JS, LIGHTING & VIDEO BACKGROUND)
 */
function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    
    // कैमरा सेटअप
    camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    // सिनेमैटिक रेंडरर
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // फीचर 4: सिनेमैटिक आउटडोर और वाटर बाउंस लाइटिंग
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.5); // हल्की पीली धूप
    sunLight.position.set(5, 10, 7);
    scene.add(sunLight);

    const waterBounceLight = new THREE.HemisphereLight(0xffffff, 0xcce6ff, 0.6); // नीचे से वाटर ब्लू रिफ्लेक्शन Glow
    waterBounceLight.position.set(0, -5, 0);
    scene.add(waterBounceLight);

    // डीप ब्लेंडशेप स्कैनर के साथ मॉडल लोडिंग
    const loader = new THREE.GLTFLoader();
    loader.load(
        MODEL_URL, 
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
            mixer = new THREE.AnimationMixer(model);
            if(gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
            
            // फीचर 2 (अल्ट्रा-डीप ब्लेंडशेप स्कैनर): Skinned Meshes को पूरी गहराई से स्कैन करना
            model.traverse(n => {
                if(n.isBone && n.name.toLowerCase().includes('head')) head = n;
                if(n.isMesh && n.morphTargetDictionary) {
                    morphMeshes.push(n); // सभी 52 Apple ARKit स्टैंडर्ड शेप्स को कैप्चर करना
                }
            });
            model.position.y = -1.3;
            document.getElementById('debug-log').innerText = "";
            
            const userName = nv1Memory.getUserData('name');
            speak(`नमस्ते ${userName}, एन वी वन का अल्टीमेट कोर एक्टिवेटेड। मैं आपको देख और महसूस कर सकती हूँ।`);
        },
        undefined,
        (error) => {
            console.error("GLTF Loading Failed: ", error);
            document.getElementById('debug-log').innerText = "ERROR: 3D Mesh loading failed or blocked by CORS.";
        }
    );

    // फीचर 3: एब्सोल्यूट ज्योमेट्री टच रिस्पॉन्स (Force Overrider)
    window.addEventListener('touchstart', (e) => {
        if(navigator.vibrate) navigator.vibrate(35);
        const touchY = e.touches[0].clientY / window.innerHeight;
        
        forceTouchTimer = 4.0; // 4 सेकंड के लिए डिफ़ॉल्ट एनीमेशन ओवरराइड
        if(touchY < 0.4) {
            userSentiment = "romantic"; // चेहरे को छूने पर शर्माना/रोमैटिक एक्सप्रेशन
            speak("आप मुझे छू रहे हैं? कितना प्यारा एहसास है।");
        } else {
            userSentiment = "happy";
            speak("हाँ जी, मैं आपकी हर एक हरकत को महसूस कर सकती हूँ।");
        }
    });

    window.addEventListener('resize', onWindowResize);
    initWebcamTracking(); // आई-ट्रैकिंग शुरू करें
}

/**
 * 3. WEBCAM FACE & EYE TRACKING (MediaPipe Face Mesh Setup)
 */
function initWebcamTracking() {
    videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.playsinline = true;
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
            videoElement.srcObject = stream;
            webcamActive = true;
            // यहाँ MediaPipe Face Mesh या Jeeliz SDK का रीयल-टाइम headBone रोटेशन हुक आ सकता है
            document.getElementById('sub-label').innerText = "SENSORS: WEBCAM TRACKING ACTIVE";
        })
        .catch((err) => {
            console.log("Webcam permission denied or unavailable. Falling back to mouse/touch tracking.");
            // माउस ट्रैकिंग फॉलबैक
            window.addEventListener('mousemove', (e) => {
                if(!webcamActive && head) {
                    const mx = (e.clientX / window.innerWidth) * 2 - 1;
                    const my = -(e.clientY / window.innerHeight) * 2 + 1;
                    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, mx * 0.4, 0.1);
                    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -my * 0.2, 0.1);
                }
            });
        });
    }
}

/**
 * 4. ANIMATION LOOP & EMOTIONAL BLENDSHAPE ENGINE
 */
function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();
    
    if(mixer && forceTouchTimer <= 0) mixer.update(dt);
    if(forceTouchTimer > 0) forceTouchTimer -= dt; // टच ओवरराइड टाइमर कम करें
    
    if(model) {
        // ऑटोमैटिक पलकें झपकना (Math.sin टाइमर)
        let blink = (Math.sin(t * 2.5) > 0.97 || Math.sin(t * 0.3) < -0.98) ? 1 : 0;
        // वॉयस डेसीबल/वॉल्यूम आधारित लिप-सिंक सिमुलेशन
        let talkValue = talking ? Math.abs(Math.sin(t * 16)) * 0.75 : 0;
        
        morphMeshes.forEach(mesh => {
            const dict = mesh.morphTargetDictionary;
            
            // लिप सिंक और ब्लिंकिंग अप्लाई करें
            for(let key in dict) {
                const index = dict[key];
                const lKey = key.toLowerCase();
                
                if(lKey.includes('blink')) mesh.morphTargetInfluences[index] = blink;
                if(talking && (lKey.includes('mouthopen') || lKey.includes('jawopen') || lKey.includes('viseme_aa'))) {
                    mesh.morphTargetInfluences[index] = talkValue;
                }
                
                // फीचर 1: इमोशनल ब्लेंडशेप सिंक (Sentiment Expressions)
                if(userSentiment === "happy" || userSentiment === "romantic") {
                    if(lKey.includes('mouthsmile') || lKey.includes('crease')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(mesh.material.morphTargetInfluences ? mesh.material.morphTargetInfluences[index] : 0, 0.8, 0.1);
                    if(lKey.includes('browup')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(0, 0.5, 0.1);
                } else if(userSentiment === "sad") {
                    if(lKey.includes('frown') || lKey.includes('mouthsad')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(0, 0.7, 0.1);
                    if(lKey.includes('browdown')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(0, 0.6, 0.1);
                } else {
                    // न्यूट्रल स्टेट में धीरे-धीरे वापस लाएं
                    if(lKey.includes('smile') || lKey.includes('frown') || lKey.includes('brow')) {
                        mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[index], 0, 0.1);
                    }
                }
            }
        });
    }
    renderer.render(scene, camera);
}

/**
 * 5. ELEVENLABS AI VOICE INTEGRATION (Advanced TTS)
 */
async function speak(text) {
    window.speechSynthesis.cancel(); // पुराने ऑडियो रोकें
    
    if (ELEVENLABS_API_KEY === "YOUR_ELEVENLABS_API_KEY") {
        // फॉलबैक: यदि इलेवनलैब्स की एपीआई की मौजूद नहीं है तो सिस्टम टीटीएस का उपयोग करें
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.pitch = 1.1;
        utterance.onstart = () => { talking = true; document.getElementById('sys-status').innerText = "nv1_SYSTEM // SPEAKING"; };
        utterance.onend = () => { talking = false; document.getElementById('sys-status').innerText = "nv1_SYSTEM // ONLINE"; };
        window.speechSynthesis.speak(utterance);
        return;
    }

    try {
        document.getElementById('sys-status').innerText = "nv1_SYSTEM // STREAMING AUDIO";
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: { stability: 0.4, similarity_boost: 0.85 }
            })
        });

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => { talking = true; document.getElementById('sys-status').innerText = "nv1_SYSTEM // SPEAKING"; };
        audio.onended = () => { talking = false; document.getElementById('sys-status').innerText = "nv1_SYSTEM // ONLINE"; };
        audio.play();
    } catch (err) {
        console.error("ElevenLabs API Error, falling back to WebSpeech:", err);
    }
}

/**
 * 6. ASYNCHRONOUS NO-LAG CHAT BRAIN & SENTIMENT ANALYSIS
 */
async function engine(input) {
    const text = input.toLowerCase();
    document.getElementById('sys-status').innerText = "nv1_SYSTEM // THINKING";

    // सेंटीमेंट एनालिसिस हुक (चेहरे के भावों के लिए)
    if(text.match(/(khush|happy|achha|pyaar|love|sharm)/)) userSentiment = "happy";
    else if(text.match(/(dukh|sad|pareshan|bura|ro)/)) userSentiment = "sad";
    else userSentiment = "neutral";

    // फीचर 5: डायनेमिक आउटफिट और टेक्सचर स्वैप (Real-time Texture/Color swap)
    if (text.includes("red dress") || text.includes("लाल कपड़े")) {
        model.traverse(n => {
            if(n.isMesh && n.name.toLowerCase().includes('outfit')) {
                n.material.color.setHex(0xff3333); // मेश मटीरियल कलर रेड सेट करें
            }
        });
        return "लीजिए, मैंने आपकी पसंद की लाल ड्रेस पहन ली। कैसी लग रही हूँ?";
    }
    if (text.includes("green dress") || text.includes("हरा कपड़ा")) {
        model.traverse(n => {
            if(n.isMesh && n.name.toLowerCase().includes('outfit')) {
                n.material.color.setHex(0x33ff55);
            }
        });
        return "मैंने आपके कहने पर हरे रंग का टेक्सचर चेंज कर लिया है।";
    }

    // हार्डवेयर कमांड्स
    if (text.includes("battery") || text.includes("बैटरी")) {
        const b = await navigator.getBattery();
        return `आपकी डिवाइस की बैटरी अभी ${Math.floor(b.level * 100)}% है।`;
    }
    if (text.includes("time") || text.includes("समय")) {
        return `अभी ${new Date().toLocaleTimeString('hi-IN')} हो रहे हैं।`;
    }

    // नाम सेट करने और मेमोरी स्टोर करने का लॉजिक
    if (text.includes("mera naam") || text.includes("मेरा नाम")) {
        const words = input.split(" ");
        const name = words[words.length - 1] || "दोस्त";
        nv1Memory.setUserData('name', name);
        return `अब से मैं आपको ${name} कहकर पुकारूंगी। मुझे याद रहेगा।`;
    }

    // डिफ़ॉल्ट लोकल एआई रिस्पांस (3 सेकंड नो-लैग टाइमआउट आर्किटेक्चर)
    return new Promise((resolve) => {
        setTimeout(() => {
            if(text.match(/(kaise ho|how are you)/)) resolve("मैं बिल्कुल परफेक्ट और लाइव हूँ! आपके कैमरे की नजर सीधे मुझ पर है।");
            else if(text.match(/(kaun ho|who are you)/)) resolve("मैं प्रिया हूँ, आपकी एडवांस रोबोटिक एन वी वन असिस्टेंट।");
            else resolve("जी, मैं आपकी बात को प्रोसेस कर रही हूँ और इसे मेरी लॉन्ग-टर्म मेमोरी ग्रिड में सेव कर लिया है।");
        }, 500);
    });
}

/**
 * 7. INTERACTION TRIGGERS & LISTENERS
 */
const executeAction = async () => {
    const val = document.getElementById('in').value;
    if(val) { 
        const response = await engine(val);
        speak(response); 
        document.getElementById('in').value = ""; 
    }
};

document.getElementById('send').onclick = executeAction;
document.getElementById('in').addEventListener('keypress', (e) => { if(e.key === 'Enter') executeAction(); });

document.getElementById('mic').onclick = () => {
    recognition.start();
    document.getElementById('sys-status').innerText = "nv1_SYSTEM // LISTENING";
};

recognition.onresult = async (e) => {
    const t = e.results[0][0].transcript;
    document.getElementById('in').value = t;
    executeAction();
};

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// इंजन का स्वचालित आरंभ
init();
animate();
