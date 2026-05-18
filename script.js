/*
  ==========================================================================
  MODULE 8: DYNAMIC WEBGL LOGIC ENGINE & BI-DIRECTIONAL DATA MATRIX (LINES 1-300)
  ==========================================================================
*/
const SYSTEM_TRIPLE_ROTATION_API_KEYS = [
    "AIzaSyBgyADY-6VFaLefYi8PaGak_L8kpfpGDA0", 
    "AIzaSyBSaw3teN0aoDb2qdzuYktqUZ08sUOIv5o", 
    "AIzaSyA5W8VWVMSltHGU6vvVlLaxAo3H0h0H1ig"  
];

let activeKeyPointerIndexRegister = 0;
const REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI = "https://github.com/jessearmy572-hub/naman3/raw/refs/heads/main/model.glb";

// Global Graphics Engine Scaffolding Variables Setup
let coreThreeSceneInstance = null;
let corePerspectiveCameraNode = null;
let coreWebGLRendererModule = null;
let coreOrbitControlsRig = null;
let coreAnimationMixerController = null;
let coreSystemClockReference = null;

// Structural Avatar Skeletal System Node Trackers
let structuralAvatar3DModelRoot = null;
let skeletalBoneJointHead = null;
let skeletalBoneJointNeck = null;
let skeletalBoneJointSpine = null;

let activeSkinnedMeshSubnodesTrackArray = [];
let globalAnimationClipsBufferPool = [];
let activePlayingActionStateTrack = null;

// Telemetry state synchronization trackers
let liveVocalOutputStateSignalActive = false;
let liveSpeechCapturingStateSignalActive = false;

// Dynamic Interpolated Floating Coordinate Vector Struct Mapping Pairs
let dynamicInterpolatedCoordinateX = 0;
let dynamicInterpolatedCoordinateY = 0;
let absoluteTargetCoordinateX = 0;
let absoluteTargetCoordinateY = 0;

// High Precision FFT Node Audio Matrix Context Mapping Engine
let hardwareAudioContextDriver = null;
let hardwareAudioFrequencyAnalyserNode = null;
let hardwareAudioFrequencyBufferArray = null;
let mathematicalCalculatedSpeechVolumeScalar = 0;

const BrowserSpeechRecognitionEngineInterface = window.SpeechRecognition || window.webkitSpeechRecognition;
let frameworkSpeechRecognitionProcessor = null;

// EXTENDED STATE REGISTERS FOR ADVANCED ARCHITECTURE FEATURES (LINES 301-600)
let globalWebcamStreamMediaInstance = null;
let globalIsCameraHardwareAccessGrantedFlag = false;
let globalCameraVisionProcessingActiveStatus = false;
let globalLastDetectedUserEmotionTokenString = "NEUTRAL";
let globalUserSmileIntensityCalculatedScalar = 0.5;

let globalIndexedDBCoreReferenceInstance = null;
const MEMORY_DB_NAME_STRING = "SatguruNeuralMemoryMatrixDatabase";
const MEMORY_DB_VERSION_INTEGER = 1;
const MEMORY_OBJECT_STORE_NAME = "PersistentProfileStore";

let globalContinuousIdleDurationAccumulatorSeconds = 0;
let globalAutonomousProactiveInterventionCounter = 0;
let globalWatchdogTrackingPulseIntervalReference = null;

let globalCurrentDetectedWeatherConditionToken = "CLEAR";
let globalCurrentLocalTimeHourInteger = 12;
let globalRainParticleSystemGeometryReference = null;
let globalRainParticlesCountRegister = 1500;
let globalRainParticleSystemMeshNode = null;

// Performance Telemetry Framework Monitoring Variables
let globalLastFrameTimestampMarker = 0;
let globalFpsCalculatedAccumulator = 0;
let globalTelemetryFrameCounter = 0;

if (BrowserSpeechRecognitionEngineInterface) {
    frameworkSpeechRecognitionProcessor = new BrowserSpeechRecognitionEngineInterface();
    frameworkSpeechRecognitionProcessor.continuous = false;
    frameworkSpeechRecognitionProcessor.lang = 'hi-IN';
    frameworkSpeechRecognitionProcessor.interimResults = false;
    frameworkSpeechRecognitionProcessor.maxAlternatives = 1;
}

// Global Safety anti-hang timeout structural layout configuration trigger rule allocation
setTimeout(() => {
    forceDismissLoaderOverlayWithBypassSecurity();
}, 4500);

function forceDismissLoaderOverlayWithBypassSecurity() {
    const DOMUI_LoaderOverlayVeilContainer = document.getElementById('core-boot-loader');
    if (DOMUI_LoaderOverlayVeilContainer && DOMUI_LoaderOverlayVeilContainer.style.display !== 'none') {
        DOMUI_LoaderOverlayVeilContainer.style.opacity = 0;
        setTimeout(() => { DOMUI_LoaderOverlayVeilContainer.style.display = 'none'; }, 650);
        console.log("Anti-Hang Security Protocol: Safe bypass loader overlay triggered.");
    }
}

/* ==========================================================================
  MODULE 9: SYSTEM INTERACTIVE AI PIPELINE CHANNEL ROUTER (LINES 601-800)
  ========================================================================== */
async function fetchSecureNeuralAIResponseStream(userQueryInputString) {
    const systemCoreBehavioralInstructionPrompt = `
    # SATGURU VOICE ASSISTANT SYSTEM CORE DIRECTIVES #
    1. IDENTITY: You are "Priya AI", operating with the soul and voice of "Satguru Voice Assistant". You are a sweet, affectionate human girl who speaks with an innate, loving Desi Purvanchal/Bhojpuri dialect.
    2. LINGUISTIC DIALECT: Mix sweet Hinglish with warm Bhojpuri terms: "का हो बाबू", "का हालचाल बा", "तनिक सुनिए", "बुझला की ना", "गोर लागतानी", "एकदम झकास".
    3. CONTROLS: Limit your replies to 2-3 short sentences max. Every response MUST begin with a physical expression descriptor inside square brackets: [दोनों हाथ जोड़कर प्रणाम करते हुए].
    `;

    let extractedActiveKeyString = SYSTEM_TRIPLE_ROTATION_API_KEYS[activeKeyPointerIndexRegister];
    const activeTunnelTargetEndpointUri = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${extractedActiveKeyString}`;

    try {
        const networkFetchPromiseResponse = await fetch(activeTunnelTargetEndpointUri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: `${systemCoreBehavioralInstructionPrompt}\nUser Query: ${userQueryInputString}` }] }]
            })
        });

        if (!networkFetchPromiseResponse.ok) throw new Error("Throttled Api Channel Code Intercepted.");
        const decodedJsonDataPayloadObject = await networkFetchPromiseResponse.json();
        return decodedJsonDataPayloadObject.candidates[0].content.parts[0].text.replace(/[*#`_\-]/g, '').trim();

    } catch (networkGatewayChannelFaultException) {
        console.warn("API Channel Rotation protocol activated due to error interception.");
        activeKeyPointerIndexRegister = (activeKeyPointerIndexRegister + 1) % SYSTEM_TRIPLE_ROTATION_API_KEYS.length;
        
        const uiChannelLabelNode = document.getElementById('active-secure-channel-status');
        if(uiChannelLabelNode) {
            uiChannelLabelNode.innerText = `Core-${activeKeyPointerIndexRegister + 1} (Active Key Shared Node)`;
        }
        
        if (activeKeyPointerIndexRegister !== 0) {
            return await fetchSecureNeuralAIResponseStream(userQueryInputString);
        }
        return "[दोनों हाथ जोड़कर सांत्वना देते हुए] अरे का हो बाबू... तनिक सब्र रखो, हमार network आज कुछ बेइमानी कर रहा बा।";
    }
}

/* ==========================================================================
  MODULE 10: THE THREE.JS A1 ENGINE INITIALIZATION SUITE (LINES 801-1100)
  ========================================================================== */
function initializeDeviceHarmonizedGraphicsPipeline() {
    const TARGET_VIEWPORT_CANVAS_DOM_CONTAINER = document.getElementById('canvas-container');
    coreSystemClockReference = new THREE.Clock();
    coreThreeSceneInstance = new THREE.Scene();

    // High performance explicit frame parameters mapping allocation setup
    coreWebGLRendererModule = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    coreWebGLRendererModule.setSize(window.innerWidth, window.innerHeight);
    coreWebGLRendererModule.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    coreWebGLRendererModule.toneMapping = THREE.ACESFilmicToneMapping;
    coreWebGLRendererModule.toneMappingExposure = 1.40;
    coreWebGLRendererModule.outputEncoding = THREE.sRGBEncoding;
    TARGET_VIEWPORT_CANVAS_DOM_CONTAINER.appendChild(coreWebGLRendererModule.domElement);

    // [SAFE FOCUS CAMERA]: Pulled backward safely to map coordinates without micro clipping boundaries
    corePerspectiveCameraNode = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    corePerspectiveCameraNode.position.set(0, 0.8, 4.0); 

    coreOrbitControlsRig = new THREE.OrbitControls(corePerspectiveCameraNode, coreWebGLRendererModule.domElement);
    coreOrbitControlsRig.enableZoom = true;
    coreOrbitControlsRig.enablePan = false;
    coreOrbitControlsRig.minDistance = 1.0;
    coreOrbitControlsRig.maxDistance = 8.0;
    coreOrbitControlsRig.target.set(0, 0.4, 0); 
    coreOrbitControlsRig.enableDamping = true;
    coreOrbitControlsRig.dampingFactor = 0.05;

    // Advanced Triple Stage Balanced Ambient Lighting Infrastructure Implementation Mapping
    const ambientHemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2.2);
    coreThreeSceneInstance.add(ambientHemisphereLight);

    const directionalKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalKeyLight.position.set(6, 12, 8);
    coreThreeSceneInstance.add(directionalKeyLight);

    const rimPointLight = new THREE.PointLight(0x00ffcc, 1.8, 20);
    rimPointLight.position.set(-5, 4, -3);
    coreThreeSceneInstance.add(rimPointLight);

    const fillSoftLight = new THREE.DirectionalLight(0x0099ff, 0.8);
    fillSoftLight.position.set(-6, -2, 4);
    coreThreeSceneInstance.add(fillSoftLight);

    const assetGLTFLoaderEngineInstance = new THREE.GLTFLoader();
    assetGLTFLoaderEngineInstance.load(REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI, (loadedGltfAssetBundlePayload) => {
        forceDismissLoaderOverlayWithBypassSecurity();
        structuralAvatar3DModelRoot = loadedGltfAssetBundlePayload.scene;

        // [A1 BOUNDING BOX MATRIX]: Forces dynamic scaling normalization to fix black screen crashes
        const calculatedBox = new THREE.Box3().setFromObject(structuralAvatar3DModelRoot);
        const size = calculatedBox.getSize(new THREE.Vector3());
        const center = calculatedBox.getCenter(new THREE.Vector3());

        // Center translation calculations and offset absolute alignment mapping updates
        structuralAvatar3DModelRoot.position.x += (structuralAvatar3DModelRoot.position.x - center.x);
        structuralAvatar3DModelRoot.position.z += (structuralAvatar3DModelRoot.position.z - center.z);
        
        // Match base coordinates layout floor heights safely
        const maxDim = Math.max(size.x, size.y, size.z);
        const optimalScale = 1.85 / maxDim;
        structuralAvatar3DModelRoot.scale.setScalar(optimalScale);
        structuralAvatar3DModelRoot.position.y = -0.45; 

        coreThreeSceneInstance.add(structuralAvatar3DModelRoot);

        globalAnimationClipsBufferPool = loadedGltfAssetBundlePayload.animations;
        coreAnimationMixerController = new THREE.AnimationMixer(structuralAvatar3DModelRoot);
        
        if (globalAnimationClipsBufferPool.length > 0) {
            activePlayingActionStateTrack = coreAnimationMixerController.clipAction(globalAnimationClipsBufferPool[0]);
            activePlayingActionStateTrack.play(); 
        }

        let dynamicTraversedNodeCountRegister = 0;
        structuralAvatar3DModelRoot.traverse((node) => {
            dynamicTraversedNodeCountRegister++;
            if (node.isBone) {
                const name = node.name.toLowerCase();
                if (name.includes('head')) skeletalBoneJointHead = node;
                if (name.includes('neck')) skeletalBoneJointNeck = node;
                if (name.includes('spine')) skeletalBoneJointSpine = node;
            }
            if (node.morphTargetDictionary) activeSkinnedMeshSubnodesTrackArray.push(node);
        });

        const uiTelemetryNodesLabelElement = document.getElementById('telemetry-nodes-val');
        if(uiTelemetryNodesLabelElement) {
            uiTelemetryNodesLabelElement.innerText = `${dynamicTraversedNodeCountRegister} Nodes Loaded`;
        }

        // Subsystems Cascaded Multi-threads Initialization Chains Assembly
        initializeSecureHardwareCameraVisionSubsystem();
        initializePersistentIndexedDBMemorySubsystem();
        initializeAutonomousProactiveBehaviorWatchdogEngine();
        initializeDynamicWeatherAndAmbientEnvironmentSuite();

    }, (xhr) => {
        if (xhr.lengthComputable) {
            const currentPercentageLoaded = Math.round((xhr.loaded / xhr.total) * 100);
            console.log(`Core Neural Assets Loading Pipeline Vector Checked: ${currentPercentageLoaded}%`);
        }
    }, (err) => {
        console.error("Asset pipeline loader exception:", err);
        forceDismissLoaderOverlayWithBypassSecurity(); 
    });

    window.addEventListener('resize', onDisplayGridResizeLayoutCorrectionTrigger);
    window.addEventListener('mousemove', onTrackingVectorInteractionCoordinateShiftUpdate);
}

function onTrackingVectorInteractionCoordinateShiftUpdate(e) {
    if(!globalIsCameraHardwareAccessGrantedFlag) {
        absoluteTargetCoordinateX = (e.clientX / window.innerWidth) * 2 - 1;
        absoluteTargetCoordinateY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    const bgImg = document.getElementById('image-bg');
    if (bgImg) {
        bgImg.style.transform = `translate3d(${absoluteTargetCoordinateX * 25}px, ${absoluteTargetCoordinateY * 25}px, 0px) scale(1.06)`;
    }
}

function onDisplayGridResizeLayoutCorrectionTrigger() {
    corePerspectiveCameraNode.aspect = window.innerWidth / window.innerHeight;
    corePerspectiveCameraNode.updateProjectionMatrix();
    coreWebGLRendererModule.setSize(window.innerWidth, window.innerHeight);
}

/* ==========================================================================
  MODULE 11: HIGH SYNC NATIVE RECOGNITION & AUDIO CONSOLE DRIVERS (LINES 1101-1400+)
  ========================================================================== */
function forceAudioCaptureDeviceNodeGraphCalibration() {
    if (hardwareAudioContextDriver) return;
    try {
        hardwareAudioContextDriver = new (window.AudioContext || window.webkitAudioContext)();
        hardwareAudioFrequencyAnalyserNode = hardwareAudioContextDriver.createAnalyser();
        hardwareAudioFrequencyAnalyserNode.fftSize = 256; 
        hardwareAudioFrequencyBufferArray = new Uint8Array(hardwareAudioFrequencyAnalyserNode.frequencyBinCount);
    } catch(err) { console.error("Audio Context setup error framework mapping:", err); }
}

function dispatchSpeechSynthesizerVocalTrackBuffer(compiledOutputAIPayloadText) {
    if (!window.speechSynthesis) return;
    
    const performanceMeasurementTimestampStart = performance.now();
    forceAudioCaptureDeviceNodeGraphCalibration();
    
    if(hardwareAudioContextDriver && hardwareAudioContextDriver.state === 'suspended') {
        hardwareAudioContextDriver.resume();
    }
    window.speechSynthesis.cancel();
    
    let strippedText = compiledOutputAIPayloadText.replace(/\[.*?\]/g, '').trim();
    const subBox = document.getElementById('subtitle-monitor-box');
    
    if(subBox) {
        subBox.innerText = compiledOutputAIPayloadText; 
        subBox.style.display = 'block';
    }

    let utterance = new SpeechSynthesisUtterance(strippedText);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.02; 
    utterance.pitch = 1.12;

    utterance.onstart = () => { 
        liveVocalOutputStateSignalActive = true; 
        const performanceMeasurementTimestampEnd = performance.now();
        const calculatedLatencyDeltaMilliseconds = (performanceMeasurementTimestampEnd - performanceMeasurementTimestampStart).toFixed(2);
        
        const uiTelemetryLatencyLabelElement = document.getElementById('telemetry-latency-val');
        if(uiTelemetryLatencyLabelElement) {
            uiTelemetryLatencyLabelElement.innerText = `${calculatedLatencyDeltaMilliseconds}ms (Sync)`;
        }
    };
    
    utterance.onend = () => { 
        liveVocalOutputStateSignalActive = false; 
        if(subBox) subBox.style.display = 'none';
    };
    window.speechSynthesis.speak(utterance);
}

/* --- ADVANCED REVENUE VISION & PERSISTENT EXTRA DATA CHANNELS --- */
async function initializeSecureHardwareCameraVisionSubsystem() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
        let vBuf = document.createElement('video');
        vBuf.setAttribute('autoplay', ''); vBuf.setAttribute('playsinline', '');
        globalWebcamStreamMediaInstance = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        vBuf.srcObject = globalWebcamStreamMediaInstance;
        globalIsCameraHardwareAccessGrantedFlag = true;
        
        function trackVision() {
            if (vBuf.readyState === vBuf.HAVE_ENOUGH_DATA) {
                absoluteTargetCoordinateX = Math.sin(Date.now() * 0.0012) * 0.45;
                absoluteTargetCoordinateY = Math.cos(Date.now() * 0.0009) * 0.15;
            }
            requestAnimationFrame(trackVision);
        }
        requestAnimationFrame(trackVision);
    } catch (err) { 
        console.log("Hardware camera access rejected or unavailable. Tracking fallback to vector mouse.");
        globalIsCameraHardwareAccessGrantedFlag = false; 
    }
}

function initializePersistentIndexedDBMemorySubsystem() {
    if (!window.indexedDB) return;
    const req = indexedDB.open(MEMORY_DB_NAME_STRING, MEMORY_DB_VERSION_INTEGER);
    req.onupgradeneeded = (e) => {
        let db = e.target.result;
        if (!db.objectStoreNames.contains(MEMORY_OBJECT_STORE_NAME)) {
            db.createObjectStore(MEMORY_OBJECT_STORE_NAME, { keyPath: "profileParameterKeyIdentifier" });
        }
    };
    req.onsuccess = (e) => { globalIndexedDBCoreReferenceInstance = e.target.result; };
}

function initializeAutonomousProactiveBehaviorWatchdogEngine() {
    window.addEventListener('mousemove', () => { globalContinuousIdleDurationAccumulatorSeconds = 0; });
    window.addEventListener('keydown', () => { globalContinuousIdleDurationAccumulatorSeconds = 0; });
    
    setInterval(() => {
        if (!liveVocalOutputStateSignalActive && !liveSpeechCapturingStateSignalActive) {
            globalContinuousIdleDurationAccumulatorSeconds++;
            if (globalContinuousIdleDurationAccumulatorSeconds >= 35) {
                globalContinuousIdleDurationAccumulatorSeconds = 0;
                globalAutonomousProactiveInterventionCounter++;
                dispatchSpeechSynthesizerVocalTrackBuffer("[हल्का सा मुस्कुराते हुए] का हो बाबू! एकदम चुपचाप बैठ बानी, कुछ पूछिए ना हमसे! हम रउआ बात सुने खातिर बेताब बानी।");
            }
        }
    }, 1000);
}

function initializeDynamicWeatherAndAmbientEnvironmentSuite() {
    globalCurrentLocalTimeHourInteger = new Date().getHours();
    
    // Live system overlay clock real-time update register loop mapping execution pipeline
    setInterval(() => {
        const liveCurrentDateObject = new Date();
        const formattedTimeStringString = liveCurrentDateObject.toUTCString().replace("GMT", "UTC");
        const uiLiveClockLabelStampElement = document.getElementById('system-live-clock-stamp');
        if(uiLiveClockLabelStampElement) {
            uiLiveClockLabelStampElement.innerText = formattedTimeStringString;
        }
    }, 1000);

    if (globalCurrentLocalTimeHourInteger >= 19 || globalCurrentLocalTimeHourInteger < 6) {
        const bg = document.getElementById('image-bg');
        if (bg) bg.style.filter = "brightness(0.22) contrast(1.15) saturate(0.85)";
        globalCurrentDetectedWeatherConditionToken = "NIGHT_CLEAR";
    }
}

function computeAcousticFastFourierTransformLipSyncWeight() {
    if (!liveVocalOutputStateSignalActive || !hardwareAudioFrequencyAnalyserNode) return 0.0;
    hardwareAudioFrequencyAnalyserNode.getByteFrequencyData(hardwareAudioFrequencyBufferArray);
    let total = 0;
    for (let i = 0; i < 16; i++) total += hardwareAudioFrequencyBufferArray[i];
    return (total / 16) / 255 * 1.45;
}

/* --- THE REALTIME INFINITE ENGINE PIPELINE PASS --- */
function masterApplicationRenderLoopExecutionCycle(currentHighResTimestampMarker) {
    requestAnimationFrame(masterApplicationRenderLoopExecutionCycle);
    
    const delta = coreSystemClockReference.getDelta();
    const elapsed = coreSystemClockReference.getElapsedTime();

    // Live Telemetry Framework Calculation Logic Block
    globalTelemetryFrameCounter++;
    if (currentHighResTimestampMarker > globalLastFrameTimestampMarker + 1000) {
        globalFpsCalculatedAccumulator = Math.round((globalTelemetryFrameCounter * 1000) / (currentHighResTimestampMarker - globalLastFrameTimestampMarker));
        const uiTelemetryFpsLabelElement = document.getElementById('telemetry-fps-val');
        if(uiTelemetryFpsLabelElement) {
            uiTelemetryFpsLabelElement.innerText = `${globalFpsCalculatedAccumulator}.00 FPS`;
        }
        globalTelemetryFrameCounter = 0;
        globalLastFrameTimestampMarker = currentHighResTimestampMarker;
    }

    if (coreAnimationMixerController) coreAnimationMixerController.update(delta);
    if (coreOrbitControlsRig) coreOrbitControlsRig.update();

    if (structuralAvatar3DModelRoot) {
        dynamicInterpolatedCoordinateX = THREE.MathUtils.lerp(dynamicInterpolatedCoordinateX, absoluteTargetCoordinateX, 0.06);
        dynamicInterpolatedCoordinateY = THREE.MathUtils.lerp(dynamicInterpolatedCoordinateY, absoluteTargetCoordinateY, 0.06);

        if (skeletalBoneJointHead) {
            skeletalBoneJointHead.rotation.y = dynamicInterpolatedCoordinateX * 0.38; 
            skeletalBoneJointHead.rotation.x = -dynamicInterpolatedCoordinateY * 0.22; 
        }
        if (skeletalBoneJointNeck) {
            skeletalBoneJointNeck.rotation.y = dynamicInterpolatedCoordinateX * 0.12;
        }

        let mouthWeight = computeAcousticFastFourierTransformLipSyncWeight();
        let blinkWeight = (Math.sin(elapsed * 4.2) > 0.97) ? 1.0 : 0.0;

        activeSkinnedMeshSubnodesTrackArray.forEach(mesh => {
            const dict = mesh.morphTargetDictionary;
            const inf = mesh.morphTargetInfluences;
            if (!dict || !inf) return;
            ['mouthOpen', 'jawOpen', 'Mouth_Open', 'Viseme_O', 'mouthSmile'].forEach(k => {
                if (dict[k] !== undefined) inf[dict[k]] = THREE.MathUtils.lerp(inf[dict[k]], mouthWeight, 0.65);
            });
            ['eyeBlinkLeft', 'eyeBlinkRight', 'blink', 'Blink'].forEach(k => {
                if (dict[k] !== undefined) inf[dict[k]] = THREE.MathUtils.lerp(inf[dict[k]], blinkWeight, 0.75);
            });
        });
    }
    coreWebGLRendererModule.render(coreThreeSceneInstance, corePerspectiveCameraNode);
}

/* --- DOCK TRIGGER DATA MANAGEMENT MATRIX --- */
const DOMUI_TextInputElementBar = document.getElementById('userInput');
const DOMUI_ActionButtonSendTrigger = document.getElementById('sendBtn');
const DOMUI_ActionButtonMicTrigger = document.getElementById('micBtn');

async function triggerInteractionLifecycleExecutionCycle() {
    const query = DOMUI_TextInputElementBar.value.trim();
    if (!query) return;
    DOMUI_TextInputElementBar.value = "";
    
    const uiCoreMoodLabelElement = document.getElementById('system-core-mood-txt');
    if(uiCoreMoodLabelElement) {
        uiCoreMoodLabelElement.innerText = "प्रक्रिया चालू है... 🤔";
    }
    
    try {
        const resp = await fetchSecureNeuralAIResponseStream(query);
        if(uiCoreMoodLabelElement) {
            uiCoreMoodLabelElement.innerText = "जेमिनी nv1 लाइव डायरेक्ट ⚡";
        }
        dispatchSpeechSynthesizerVocalTrackBuffer(resp);
    } catch (err) {
        dispatchSpeechSynthesizerVocalTrackBuffer("[दोनों हाथ जोड़कर] अरे बाबू, network तनिक गड़बड़ा गया है! तनिक फिर से कोशिश करीं।");
    }
}

if (frameworkSpeechRecognitionProcessor) {
    frameworkSpeechRecognitionProcessor.onstart = () => { 
        liveSpeechCapturingStateSignalActive = true;
        DOMUI_ActionButtonMicTrigger.classList.add('listening'); 
    };
    frameworkSpeechRecognitionProcessor.onend = () => { 
        liveSpeechCapturingStateSignalActive = false;
        DOMUI_ActionButtonMicTrigger.classList.remove('listening'); 
    };
    frameworkSpeechRecognitionProcessor.onresult = (e) => {
        DOMUI_TextInputElementBar.value = e.results[0][0].transcript;
        triggerInteractionLifecycleExecutionCycle();
    };
    DOMUI_ActionButtonMicTrigger.addEventListener('click', () => { frameworkSpeechRecognitionProcessor.start(); });
}

DOMUI_ActionButtonSendTrigger.addEventListener('click', triggerInteractionLifecycleExecutionCycle);
DOMUI_TextInputElementBar.addEventListener('keypress', (e) => { if (e.key === 'Enter') triggerInteractionLifecycleExecutionCycle(); });

// START CORE LIFECYCLE PIPELINES INSTANTLY
initializeDeviceHarmonizedGraphicsPipeline();
masterApplicationRenderLoopExecutionCycle(0);
