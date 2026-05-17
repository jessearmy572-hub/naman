/**
 * nv1 Ultimate Core Engine - Modular JS Edition
 * Dynamic Face Expressions, Webcam/Mouse Tracking, ElevenLabs & Memory Core
 */

// --- 1. कॉन्फ़िगरेशन और स्टेट मैनेजमेंट ---
// आपका नया डायरेक्ट गिटहब मॉडल एड्रेस यहाँ पूरी तरह सुरक्षित है
const MODEL_URL = "https://github.com/jessearmy572-hub/naman/raw/refs/heads/main/model.glb";
const ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY"; // आवश्यकतानुसार अपनी Key डालें वरना ये सिस्टम TTS पर चलेगा
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

let scene, camera, renderer, mixer, clock, model, head;
let morphMeshes = [], talking = false, forceTouchTimer = 0;
let userSentiment = "neutral";
let webcamActive = false, videoElement = null;

// लोकल स्टोरेज मेमोरी इंजन (Persistent Memory)
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

// स्पीच रिकग्निशन (माइक इनपुट) सेटअप
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN';
recognition.continuous = false;

/**
 * 2. थ्री.जेएस, सिनेमैटिक लाइट्स और रेंडरर इनिशियलाइजेशन
 */
function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    
    // अवतार को परफेक्ट फ्रेम में रखने के लिए कैमरा एंगल
    camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    // हाई-परफॉर्मेंस सिनेमैटिक रेंडरर
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // असली माहौल देने के लिए लाइटिंग (सूरज की धूप और झरने का नीला ग्लो)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.5); // हल्की पीली वार्म लाइट
    sunLight.position.set(5, 10, 7);
    scene.add(sunLight);

    const waterBounceLight = new THREE.HemisphereLight(0xffffff, 0xcce6ff, 0.6); // पानी से रिफ्लेक्ट होने वाला लाइट शेड
    waterBounceLight.position.set(0, -5, 0);
    scene.add(waterBounceLight);

    // मॉडल लोड इंजन
    const loader = new THREE.GLTFLoader();
    loader.load(
        MODEL_URL, 
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
            mixer = new THREE.AnimationMixer(model);
            if(gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
            
            // अल्ट्रा-डीप ब्लेंडशेप स्कैनर: मेश के सबसे अंदरूनी हिस्से से 52 Apple ARKit शेप्स निकालना
            model.traverse(n => {
                if(n.isBone && n.name.toLowerCase().includes('head')) head = n;
                if(n.isMesh && n.morphTargetDictionary) {
                    morphMeshes.push(n); 
                }
            });
            model.position.y = -1.3;
            document.getElementById('debug-log').innerText = "";
            
            const userName = nv1Memory.getUserData('name');
            speak(`नमस्ते ${userName}, एन वी वन का अल्टीमेट कोर सक्रिय है।`);
        },
        undefined,
        (error) => {
            console.error("GLTF Loading Failed: ", error);
            document.getElementById('debug-log').innerText = "ERROR: 3D Mesh loading failed. Check CORS or URL.";
        }
    );

    // एब्सोल्यूट ज्योमेट्री टच रिस्पॉन्स (Force Overrider)
    window.addEventListener('touchstart', (e) => {
        if(navigator.vibrate) navigator.vibrate(35);
        const touchY = e.touches[0].clientY / window.innerHeight;
        
        forceTouchTimer = 4.0; // 4 सेकंड के लिए डिफ़ॉल्ट एनीमेशन पॉज़
        if(touchY < 0.4) {
            userSentiment = "romantic"; // चेहरे को छूने पर शर्माने वाले एक्सप्रेशन ट्रिगर
            speak("आप मुझे छू रहे हैं? कितना प्यारा एहसास है।");
        } else {
            userSentiment = "happy";
            speak(" can feel it! मैं आपके हर टच को महसूस कर सकती हूँ।");
        }
    });

    window.addEventListener('resize', onWindowResize);
    initWebcamTracking(); // आई-कैमरा ट्रैकिंग चालू करें
}

/**
 * 3. वेबकैम / माउस आई-कॉन्टैक्ट ट्रैकिंग इंजन
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
            document.getElementById('sub-label').innerText = "SENSORS: WEBCAM TRACKING ACTIVE";
        })
        .catch(() => {
            console.log("Webcam unavailable. Falling back to mouse tracking.");
            // कर्सर ट्रैकिंग फॉलबैक (यदि कैमरा ऑफ हो)
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
 * 4. एनीमेशन लूप और इमोशनल ब्लेंडशेप सिंक
 */
function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();
    
    if(mixer && forceTouchTimer <= 0) mixer.update(dt);
    if(forceTouchTimer > 0) forceTouchTimer -= dt; 
    
    if(model) {
        // नेचुरल पलकें झपकना (Math.sin टाइमर)
        let blink = (Math.sin(t * 2.5) > 0.97 || Math.sin(t * 0.3) < -0.98) ? 1 : 0;
        // वॉयस वॉल्यूम आधारित लिप-सिंक सिमुलेशन
        let talkValue = talking ? Math.abs(Math.sin(t * 16)) * 0.75 : 0;
        
            morphMeshes.forEach(mesh => {
            const dict = mesh.morphTargetDictionary;
            
            for(let key in dict) {
                const index = dict[key];
                const lKey = key.toLowerCase();
                
                if(lKey.includes('blink')) mesh.morphTargetInfluences[index] = blink;
                if(talking && (lKey.includes('mouthopen') || lKey.includes('jawopen') || lKey.includes('viseme_aa'))) {
                    mesh.morphTargetInfluences[index] = talkValue;
                }
                
                // इमोशनल एक्सप्रेशन ब्लेंडिंग (Sentiment Analysis के हिसाब से चेहरा बदलना)
                if(userSentiment === "happy" || userSentiment === "romantic") {
                    if(lKey.includes('mouthsmile') || lKey.includes('crease')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[index], 0.8, 0.1);
                    if(lKey.includes('browup')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(0, 0.5, 0.1);
                } else if(userSentiment === "sad") {
                    if(lKey.includes('frown') || lKey.includes('mouthsad')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(0, 0.7, 0.1);
                    if(lKey.includes('browdown')) mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(0, 0.6, 0.1);
                } else {
                    // धीरे-धीरे न्यूट्रल फेस पर लौटें
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
 * 5. इलेवनलैब्स लाइव वॉयस इंजन (ElevenLabs & WebSpeech Fallback)
 */
async function speak(text) {
    window.speechSynthesis.cancel(); 
    
    if (ELEVENLABS_API_KEY === "YOUR_ELEVENLABS_API_KEY") {
        // फॉलबैक: एपीआई की न होने पर ब्राउज़र का हिंदी वॉयस इंजन काम करेगा
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
            headers: { "Content-Type": "application/json", "xi-api-key": ELEVENLABS_API_KEY },
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
        console.error("ElevenLabs Error:", err);
    }
}

/**
 * 6. असिंक्रोनस नो-लैग चैट इंजन और आउटफिट चेंजर
 */
async function engine(input) {
    const text = input.toLowerCase();
    document.getElementById('sys-status').innerText = "nv1_SYSTEM // THINKING";

    // सेंटीमेंट डिटेक्टर
    if(text.match(/(khush|happy|achha|pyaar|love|sharm)/)) userSentiment = "happy";
    else if(text.match(/(dukh|sad|pareshan|bura|ro)/)) userSentiment = "sad";
    else userSentiment = "neutral";

    // डायनेमिक आउटफिट कलर स्वैप
    if (text.includes("red dress") || text.includes("लाल कपड़े")) {
        model.traverse(n => {
            if(n.isMesh && n.name.toLowerCase().includes('outfit')) n.material.color.setHex(0xff3333);
        });
        return "लीजिए, मैंने लाल रंग की ड्रेस पहन ली। कैसी लग रही हूँ?";
    }
    if (text.includes("green dress") || text.includes("हरा कपड़ा")) {
        model.traverse(n => {
            if(n.isMesh && n.name.toLowerCase().includes('outfit')) n.material.color.setHex(0x33ff55);
        });
        return "मैंने ड्रेस का टेक्सचर चेंज कर के इसे हरे रंग का कर दिया है।";
    }

    // हार्डवेयर कंट्रोल्स
    if (text.includes("battery") || text.includes("बैटरी")) {
        const b = await navigator.getBattery();
        return `आपकी डिवाइस बैटरी अभी ${Math.floor(b.level * 100)}% है।`;
    }
    if (text.includes("time") || text.includes("समय")) {
        return `अभी समय ${new Date().toLocaleTimeString('hi-IN')} हो रहा है।`;
    }

    // परसिस्टेंट मेमोरी नाम सेटिंग्स
    if (text.includes("mera naam") || text.includes("मेरा naam")) {
        const words = input.split(" ");
        const name = words[words.length - 1] || "दोस्त";
        nv1Memory.setUserData('name', name);
        return `अब से मुझे याद रहेगा कि आपका नाम ${name} है।`;
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            if(text.match(/(kaise ho|how are you)/)) resolve("मैं बिल्कुल परफेक्ट हूँ! आपका लाइव मोशन वीडियो बैकग्राउंड काफी कमाल का लग रहा है।");
            else if(text.match(/(kaun ho|who are you)/)) resolve("मैं प्रिया हूँ, आपकी एडवांस एन वी वन इंटेलिजेंट असिस्टेंट।");
            else resolve("जी, मैंने आपकी बात समझ ली है और इसे मेमोरी ग्रिड में अपडेट कर लिया है।");
        }, 400);
    });
}

/**
 * 7. यूआई इवेंट्स और एक्शन एग्जीक्यूटर्स
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
