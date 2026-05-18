/* ==========================================================================
  MODULE: PRODUCTION THREE.JS LIBS PIPELINE & BI-DIRECTIONAL LOGIC CORE
  ========================================================================== */

const SYSTEM_TRIPLE_ROTATION_API_KEYS = [
    "AIzaSyBgyADY-6VFaLefYi8PaGak_L8kpfpGDA0", 
    "AIzaSyBSaw3teN0aoDb2qdzuYktqUZ08sUOIv5o", 
    "AIzaSyA5W8VWVMSltHGU6vvVlLaxAo3H0h0H1ig"  
];

let activeKeyPointerIndexRegister = 0;
const REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI = "https://github.com/jessearmy572-hub/naman3/raw/refs/heads/main/model.glb";

// Three.js Scene Variables Layout
let coreThreeSceneInstance = null;
let corePerspectiveCameraNode = null;
let coreWebGLRendererModule = null;
let coreOrbitControlsRig = null;
let coreAnimationMixerController = null;
let coreSystemClockReference = null;

// Avatar Skeletal Structures mapping
let structuralAvatar3DModelRoot = null;
let skeletalBoneJointHead = null;
let skeletalBoneJointNeck = null;
let skeletalBoneJointSpine = null;

let activeSkinnedMeshSubnodesTrackArray = [];
let globalAnimationClipsBufferPool = [];
let activePlayingActionStateTrack = null;

let liveVocalOutputStateSignalActive = false;
let liveSpeechCapturingStateSignalActive = false;

// Vectors interpolation processing
let dynamicInterpolatedCoordinateX = 0;
let dynamicInterpolatedCoordinateY = 0;
let absoluteTargetCoordinateX = 0;
let absoluteTargetCoordinateY = 0;

// Lip Sync Variables
let hardwareAudioContextDriver = null;
let hardwareAudioFrequencyAnalyserNode = null;
let hardwareAudioFrequencyBufferArray = null;

const BrowserSpeechRecognitionEngineInterface = window.SpeechRecognition || window.webkitSpeechRecognition;
let frameworkSpeechRecognitionProcessor = null;

if (BrowserSpeechRecognitionEngineInterface) {
    frameworkSpeechRecognitionProcessor = new BrowserSpeechRecognitionEngineInterface();
    frameworkSpeechRecognitionProcessor.continuous = false;
    frameworkSpeechRecognitionProcessor.lang = 'hi-IN';
    frameworkSpeechRecognitionProcessor.interimResults = false;
    frameworkSpeechRecognitionProcessor.maxAlternatives = 1;
}

// Global UI Closer Method
function forceDismissLoaderOverlayWithBypassSecurity() {
    const DOMUI_LoaderOverlayVeilContainer = document.getElementById('core-boot-loader');
    if (DOMUI_LoaderOverlayVeilContainer) {
        DOMUI_LoaderOverlayVeilContainer.style.opacity = '0';
        setTimeout(() => { 
            DOMUI_LoaderOverlayVeilContainer.style.display = 'none'; 
        }, 500);
    }
}

// Fail-Safe Timeout to clear screen if network drops
setTimeout(forceDismissLoaderOverlayWithBypassSecurity, 4000);

/* --- AI INTERFACE LINK ROUTER CHAIN --- */
async function fetchSecureNeuralAIResponseStream(userQueryInputString) {
    const systemCoreBehavioralInstructionPrompt = `
    Identity: You are Priya AI. Speak in sweet Hinglish mixed with lovely Purvanchal Bhojpuri tokens like 'का हो बाबू', 'का हालचाल बा', 'बुझला की ना'. 
    Keep responses very short, 2 sentences maximum. Always start response with a physical gesture block inside square brackets like [दोनों हाथ जोड़कर मुस्कुराते हुए].
    `;

    let activeKey = SYSTEM_TRIPLE_ROTATION_API_KEYS[activeKeyPointerIndexRegister];
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;

    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: `${systemCoreBehavioralInstructionPrompt}\nUser Query: ${userQueryInputString}` }] }]
            })
        });

        if (!response.ok) throw new Error("API Throttled");
        const json = await response.json();
        return json.candidates[0].content.parts[0].text.replace(/[*#`_\-]/g, '').trim();
    } catch (e) {
        activeKeyPointerIndexRegister = (activeKeyPointerIndexRegister + 1) % SYSTEM_TRIPLE_ROTATION_API_KEYS.length;
        const uiStatus = document.getElementById('active-secure-channel-status');
        if(uiStatus) uiStatus.innerText = `Core-${activeKeyPointerIndexRegister + 1} (Rotated Node)`;
        
        if (activeKeyPointerIndexRegister !== 0) {
            return await fetchSecureNeuralAIResponseStream(userQueryInputString);
        }
        return "[दोनों हाथ जोड़कर सांत्वna देते हुए] का हो बाबू, network तनिक धीमा बा। फिर से कोशिश करीं ना!";
    }
}

/* --- THE 100% OPERATIONAL THREE.JS ENGINE GRAPHICS SUITE --- */
function initializeDeviceHarmonizedGraphicsPipeline() {
    const container = document.getElementById('canvas-container');
    coreSystemClockReference = new THREE.Clock();
    coreThreeSceneInstance = new THREE.Scene();

    // High performance renderer layout initialization
    coreWebGLRendererModule = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    coreWebGLRendererModule.setSize(window.innerWidth, window.innerHeight);
    coreWebGLRendererModule.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    coreWebGLRendererModule.toneMapping = THREE.ACESFilmicToneMapping;
    coreWebGLRendererModule.toneMappingExposure = 1.35;
    container.appendChild(coreWebGLRendererModule.domElement);

    // Optimized Safe Bounding Camera View Matrix Properties
    corePerspectiveCameraNode = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    corePerspectiveCameraNode.position.set(0, 0.5, 3.2); // Perfect alignment looking direct at center

    coreOrbitControlsRig = new THREE.OrbitControls(corePerspectiveCameraNode, coreWebGLRendererModule.domElement);
    coreOrbitControlsRig.enableZoom = true;
    coreOrbitContractsRig = coreOrbitControlsRig.enablePan = false;
    coreOrbitControlsRig.minDistance = 1.0;
    coreOrbitControlsRig.maxDistance = 6.0;
    coreOrbitControlsRig.target.set(0, 0.35, 0);
    coreOrbitControlsRig.enableDamping = true;
    coreOrbitControlsRig.dampingFactor = 0.05;

    // HIGH FIDELITY BALANCED LIGHTING MATRIX FOR GLTF VISIBILITY
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8); // Forced balanced base environment ambient intensity
    coreThreeSceneInstance.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0);
    hemiLight.position.set(0, 20, 0);
    coreThreeSceneInstance.add(hemiLight);

    const directionalKeyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    directionalKeyLight.position.set(3, 6, 5);
    coreThreeSceneInstance.add(directionalKeyLight);

    const rimPointLight = new THREE.PointLight(0x00ffcc, 2.5, 15);
    rimPointLight.position.set(-4, 3, -2);
    coreThreeSceneInstance.add(rimPointLight);

    // GLTF Loading Orchestration System Block
    const assetGLTFLoaderEngineInstance = new THREE.GLTFLoader();
    assetGLTFLoaderEngineInstance.load(REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI, (gltf) => {
        // Force Close Loader Mask instantly
        forceDismissLoaderOverlayWithBypassSecurity();
        
        structuralAvatar3DModelRoot = gltf.scene;

        // Bounding dimensions parsing logic
        const boundingBox = new THREE.Box3().setFromObject(structuralAvatar3DModelRoot);
        const modelSize = boundingBox.getSize(new THREE.Vector3());
        const modelCenter = boundingBox.getCenter(new THREE.Vector3());

        // Dynamic adjustment translation parameters center offsets
        structuralAvatar3DModelRoot.position.x += (structuralAvatar3DModelRoot.position.x - modelCenter.x);
        structuralAvatar3DModelRoot.position.z += (structuralAvatar3DModelRoot.position.z - modelCenter.z);
        
        const largestDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const autoScaleFactor = 1.65 / largestDimension; // Perfect height tracking layout metric rule
        structuralAvatar3DModelRoot.scale.setScalar(autoScaleFactor);
        structuralAvatar3DModelRoot.position.y = -0.55; 

        // RENDER STABILITY ENFORCEMENT PASSTHROUGH LOOP
        structuralAvatar3DModelRoot.traverse((node) => {
            if (node.isMesh) {
                node.frustumCulled = false; // Forces mesh to ignore culling limits and stay visible
                node.castShadow = true;
                node.receiveShadow = true;
                
                if (node.material) {
                    node.material.side = THREE.DoubleSide; // Fix invisible material gaps
                    node.material.depthWrite = true;
                    node.material.depthTest = true;
                    node.material.needsUpdate = true;
                }
            }
            if (node.isBone) {
                const boneName = node.name.toLowerCase();
                if (boneName.includes('head')) skeletalBoneJointHead = node;
                if (boneName.includes('neck')) skeletalBoneJointNeck = node;
                if (boneName.includes('spine')) skeletalBoneJointSpine = node;
            }
            if (node.morphTargetDictionary) activeSkinnedMeshSubnodesTrackArray.push(node);
        });

        coreThreeSceneInstance.add(structuralAvatar3DModelRoot);

        // Animation clip compilation sequences
        globalAnimationClipsBufferPool = gltf.animations;
        coreAnimationMixerController = new THREE.AnimationMixer(structuralAvatar3DModelRoot);
        
        if (globalAnimationClipsBufferPool.length > 0) {
            activePlayingActionStateTrack = coreAnimationMixerController.clipAction(globalAnimationClipsBufferPool[0]);
            activePlayingActionStateTrack.play(); 
        }

        const nodesLabel = document.getElementById('telemetry-nodes-val');
        if(nodesLabel) nodesLabel.innerText = "Mesh Render Fully Mounted";

    }, (xhr) => {
        console.log(`Asset Progress Matrix Tracking: ${Math.round((xhr.loaded / xhr.total) * 100)}%`);
    }, (error) => {
        console.error("Asset pipeline loader exception:", error);
        forceDismissLoaderOverlayWithBypassSecurity();
    });

    window.addEventListener('resize', () => {
        corePerspectiveCameraNode.aspect = window.innerWidth / window.innerHeight;
        corePerspectiveCameraNode.updateProjectionMatrix();
        coreWebGLRendererModule.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
        absoluteTargetCoordinateX = (e.clientX / window.innerWidth) * 2 - 1;
        absoluteTargetCoordinateY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        const backgroundWallpaperNode = document.getElementById('image-bg');
        if (backgroundWallpaperNode) {
            backgroundWallpaperNode.style.transform = `translate3d(${absoluteTargetCoordinateX * 15}px, ${absoluteTargetCoordinateY * 15}px, 0px) scale(1.04)`;
        }
    });

    // Clock System Initializer
    setInterval(() => {
        const d = new Date();
        const stamp = document.getElementById('system-live-clock-stamp');
        if(stamp) stamp.innerText = d.toUTCString().replace("GMT", "UTC");
    }, 1000);
}

/* --- AUDIO PROCESSING GRAPH LIP SYNC SETUP --- */
function setupAudioContextDriverGraph() {
    if (hardwareAudioContextDriver) return;
    try {
        hardwareAudioContextDriver = new (window.AudioContext || window.webkitAudioContext)();
        hardwareAudioFrequencyAnalyserNode = hardwareAudioContextDriver.createAnalyser();
        hardwareAudioFrequencyAnalyserNode.fftSize = 256;
        hardwareAudioFrequencyBufferArray = new Uint8Array(hardwareAudioFrequencyAnalyserNode.frequencyBinCount);
    } catch(e) { console.error("Audio Context setup error initialized mapping:", e); }
}

function dispatchSpeechSynthesizerVocalTrackBuffer(textData) {
    if (!window.speechSynthesis) return;
    setupAudioContextDriverGraph();
    
    if(hardwareAudioContextDriver && hardwareAudioContextDriver.state === 'suspended') {
        hardwareAudioContextDriver.resume();
    }
    window.speechSynthesis.cancel();
    
    let plainCleanedText = textData.replace(/\[.*?\]/g, '').trim();
    const monitorBox = document.getElementById('subtitle-monitor-box');
    
    if(monitorBox) {
        monitorBox.innerText = textData;
        monitorBox.style.display = 'block';
    }

    let utteranceInstance = new SpeechSynthesisUtterance(plainCleanedText);
    utteranceInstance.lang = 'hi-IN';
    utteranceInstance.rate = 1.0;
    utteranceInstance.pitch = 1.1;

    utteranceInstance.onstart = () => { liveVocalOutputStateSignalActive = true; };
    utteranceInstance.onend = () => { 
        liveVocalOutputStateSignalActive = false; 
        if(monitorBox) monitorBox.style.display = 'none';
    };
    window.speechSynthesis.speak(utteranceInstance);
}

function processMouthLipSyncMovementValue() {
    if (!liveVocalOutputStateSignalActive || !hardwareAudioFrequencyAnalyserNode) return 0.0;
    hardwareAudioFrequencyAnalyserNode.getByteFrequencyData(hardwareAudioFrequencyBufferArray);
    let sampleSum = 0;
    for (let i = 0; i < 16; i++) sampleSum += hardwareAudioFrequencyBufferArray[i];
    return (sampleSum / 16) / 255 * 1.5; 
}

/* --- MASTER GAME LOOP STEP PASS TRIGGER --- */
function masterApplicationRenderLoopExecutionCycle() {
    requestAnimationFrame(masterApplicationRenderLoopExecutionCycle);
    
    const deltaSeconds = coreSystemClockReference.getDelta();
    const runtimeTotalDurationSeconds = coreSystemClockReference.getElapsedTime();

    if (coreAnimationMixerController) coreAnimationMixerController.update(deltaSeconds);
    if (coreOrbitControlsRig) coreOrbitControlsRig.update();

    if (structuralAvatar3DModelRoot) {
        dynamicInterpolatedCoordinateX = THREE.MathUtils.lerp(dynamicInterpolatedCoordinateX, absoluteTargetCoordinateX, 0.05);
        dynamicInterpolatedCoordinateY = THREE.MathUtils.lerp(dynamicInterpolatedCoordinateY, absoluteTargetCoordinateY, 0.05);

        if (skeletalBoneJointHead) {
            skeletalBoneJointHead.rotation.y = dynamicInterpolatedCoordinateX * 0.35;
            skeletalBoneJointHead.rotation.x = -dynamicInterpolatedCoordinateY * 0.20;
        }
        if (skeletalBoneJointNeck) {
            skeletalBoneJointNeck.rotation.y = dynamicInterpolatedCoordinateX * 0.10;
        }

        let calculatedMouthWeight = processMouthLipSyncMovementValue();
        let eyeBlinkWeightState = (Math.sin(runtimeTotalDurationSeconds * 4.0) > 0.98) ? 1.0 : 0.0;

        activeSkinnedMeshSubnodesTrackArray.forEach(meshNodeElement => {
            const dictionary = meshNodeElement.morphTargetDictionary;
            const influences = meshNodeElement.morphTargetInfluences;
            if (!dictionary || !influences) return;
            
            ['mouthOpen', 'jawOpen', 'Mouth_Open', 'Viseme_O', 'mouthSmile'].forEach(key => {
                if (dictionary[key] !== undefined) influences[dictionary[key]] = THREE.MathUtils.lerp(influences[dictionary[key]], calculatedMouthWeight, 0.6);
            });
            ['eyeBlinkLeft', 'eyeBlinkRight', 'blink', 'Blink'].forEach(key => {
                if (dictionary[key] !== undefined) influences[dictionary[key]] = THREE.MathUtils.lerp(influences[dictionary[key]], eyeBlinkWeightState, 0.7);
            });
        });
    }
    
    if (coreWebGLRendererModule && coreThreeSceneInstance && corePerspectiveCameraNode) {
        coreWebGLRendererModule.render(coreThreeSceneInstance, corePerspectiveCameraNode);
    }
}

/* --- NAVIGATION TERMINAL ACTION CONTROLLERS SYSTEM --- */
const uiTextBarElement = document.getElementById('userInput');
const uiActionBtnSend = document.getElementById('sendBtn');
const uiActionBtnMic = document.getElementById('micBtn');

async function triggerInteractionLifecycleExecutionCycle() {
    const query = uiTextBarElement.value.trim();
    if (!query) return;
    uiTextBarElement.value = "";
    
    const moodTxt = document.getElementById('system-core-mood-txt');
    if(moodTxt) moodTxt.innerText = "प्रक्रिया चालू है... 🤔";
    
    try {
        const responseDataStringOutput = await fetchSecureNeuralAIResponseStream(query);
        if(moodTxt) moodTxt.innerText = "जेमिनी nv1 लाइव ⚡";
        dispatchSpeechSynthesizerVocalTrackBuffer(responseDataStringOutput);
    } catch (e) {
        dispatchSpeechSynthesizerVocalTrackBuffer("[दोनों हाथ जोड़कर] नेटवर्क तनिक गड़बड़ा गया बा बाबू, फिर से बोलिए ना!");
    }
}

if (frameworkSpeechRecognitionProcessor) {
    frameworkSpeechRecognitionProcessor.onstart = () => { 
        liveSpeechCapturingStateSignalActive = true;
        uiActionBtnMic.classList.add('listening'); 
    };
    frameworkSpeechRecognitionProcessor.onend = () => { 
        liveSpeechCapturingStateSignalActive = false;
        uiActionBtnMic.classList.remove('listening'); 
    };
    frameworkSpeechRecognitionProcessor.onresult = (event) => {
        uiTextBarElement.value = event.results[0][0].transcript;
        triggerInteractionLifecycleExecutionCycle();
    };
    uiActionBtnMic.addEventListener('click', () => { frameworkSpeechRecognitionProcessor.start(); });
}

uiActionBtnSend.addEventListener('click', triggerInteractionLifecycleExecutionCycle);
uiTextBarElement.addEventListener('keypress', (e) => { if (e.key === 'Enter') triggerInteractionLifecycleExecutionCycle(); });

// START COMPILATION ENGINE
initializeDeviceHarmonizedGraphicsPipeline();
masterApplicationRenderLoopExecutionCycle();
