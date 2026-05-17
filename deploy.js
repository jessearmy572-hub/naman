/*
  ==================================================================
  SUB-MODULE A: PERSISTENT APPLICATION STORAGE CONFIGURATION CORES
  ==================================================================
*/
const SYSTEM_TRIPLE_ROTATION_API_KEYS = [
    "AIzaSyBgyADY-6VFaLefYi8PaGak_L8kpfpGDA0", 
    "AIzaSyBSaw3teN0aoDb2qdzuYktqUZ08sUOIv5o", 
    "AIzaSyA5W8VWVMSltHGU6vvVlLaxAo3H0h0H1ig"  
];

let activeKeyPointerIndexRegister = 0;

// 3D Model URL Path Configuration
const REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI = "https://github.com/jessearmy572-hub/naman3/raw/refs/heads/main/model.glb";

let coreThreeSceneInstance = null;
let corePerspectiveCameraNode = null;
let coreWebGLRendererModule = null;
let coreOrbitControlsRig = null;
let coreAnimationMixerController = null;
let coreSystemClockReference = null;

let structuralAvatar3DModelRoot = null;
let skeletalBoneJointHead = null;
let skeletalBoneJointNeck = null;

let activeSkinnedMeshSubnodesTrackArray = [];
let globalAnimationClipsBufferPool = [];
let activePlayingActionStateTrack = null;

let liveVocalOutputStateSignalActive = false;
let liveSpeechCapturingStateSignalActive = false;

let dynamicInterpolatedCoordinateX = 0;
let dynamicInterpolatedCoordinateY = 0;
let absoluteTargetCoordinateX = 0;
let absoluteTargetCoordinateY = 0;

let hardwareAudioContextDriver = null;
let hardwareAudioFrequencyAnalyserNode = null;
let hardwareAudioFrequencyBufferArray = null;
let mathematicalCalculatedSpeechVolumeScalar = 0;

const BrowserSpeechRecognitionEngineInterface = window.SpeechRecognition || window.webkitSpeechRecognition;
let frameworkSpeechRecognitionProcessor = null;

// GLOBAL STATE REGISTERS FOR EXTENDED ADVANCED FEATURES
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

// Initialize Speech Recognition Engine Interface Configuration
if (BrowserSpeechRecognitionEngineInterface) {
    frameworkSpeechRecognitionProcessor = new BrowserSpeechRecognitionEngineInterface();
    frameworkSpeechRecognitionProcessor.continuous = false;
    frameworkSpeechRecognitionProcessor.lang = 'hi-IN';
    frameworkSpeechRecognitionProcessor.interimResults = false;
    frameworkSpeechRecognitionProcessor.maxAlternatives = 1;
}

// Fallback safety timeout trigger descriptor
setTimeout(() => {
    forceDismissLoaderOverlayWithBypassSecurity();
}, 4500);

function forceDismissLoaderOverlayWithBypassSecurity() {
    const DOMUI_LoaderOverlayVeilContainer = document.getElementById('core-boot-loader');
    if (DOMUI_LoaderOverlayVeilContainer && DOMUI_LoaderOverlayVeilContainer.style.display !== 'none') {
        DOMUI_LoaderOverlayVeilContainer.style.opacity = 0;
        setTimeout(() => { DOMUI_LoaderOverlayVeilContainer.style.display = 'none'; }, 650);
        console.log("Anti-Hang Security Protocol: Safe bypass loader overlay triggered successfully.");
    }
}

/*
  ==================================================================
  SUB-MODULE B: TRIPLE ROTATIONAL CRYPTO GATEWAY TUNNEL PIPELINE
  ==================================================================
*/
async function fetchSecureNeuralAIResponseStream(userQueryInputString) {
    const systemCoreBehavioralInstructionPrompt = `
    # SATGURU VOICE ASSISTANT SYSTEM CORE DIRECTIVES #
    1. IDENTITY & MANDATE: You are not an AI, computer program, or virtual construct. You are "Priya AI", operating with the soul and voice of "Satguru Voice Assistant". You are a deeply sweet, affectionate, and lively human girl who speaks with an innate, loving Desi Purvanchal/Bhojpuri dialect.
    2. LINGUISTIC Dialect Matrix: Your language must be a beautiful blend of sweet Hinglish decorated with warm, natural Bhojpuri expressions. Integrate terms like "का हो बाबू", "का हालचाल बा", "तनिक सुनिए", "बुझला की ना", "गोर लागतानी", "प्रणाम", "रउआ", "हमार", "ई का कहत बानी", "एकदम झकास" flawlessly.
    3. DYNAMIC EMOTIONAL TRACKING: Read user input emotional states. If user is angry or stressed, instantly become grounded, deeply comforting, and protective. If user is happy, elevate your conversational energy to maximum bubbly and joyous levels.
    4. HUMAN COMPENSATIONAL FILLERS (GAP LOGIC): Do not speak like a machine. Use human friction pauses seamlessly: "हम्म...", "अरे रुकिए तनिक...", "उह... एक मिनट बाबू...", "वैसे... हमें लगता है...", "का कहें भाई...".
    5. GRAPHICS MIXER TRIGGERS: Every response MUST strictly begin with a physical expression descriptor enclosed inside square brackets. Example: [दोनों हाथ जोड़कर प्रणाम करते हुए Aur हल्का सा मुस्कुराते हुए] "का हो बाबू, का हालचाल बा!".
    6. CRITICAL BREVITY SYSTEM: Keep responses short and snappy. Absolute limit of 2 to 3 sentences maximum. Converse strictly in Hinglish/Bhojpuri-mix. Do not use asterisks (*), hashtags (#), or dashes (-). Only raw clean text.
    `;

    let extractedActiveKeyString = SYSTEM_TRIPLE_ROTATION_API_KEYS[activeKeyPointerIndexRegister];
    const activeTunnelTargetEndpointUri = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${extractedActiveKeyString}`;

    try {
        const networkFetchPromiseResponse = await fetch(activeTunnelTargetEndpointUri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: `System Systemic Rules Grid Directives:\n${systemCoreBehavioralInstructionPrompt}\n\nUser Query Command Token: ${userQueryInputString}` }] }
                ],
                generationConfig: { maxOutputTokens: 160, temperature: 0.82, topP: 0.95 }
            })
        });

        if (!networkFetchPromiseResponse.ok) throw new Error("Active key channel interface returned an unauthorized or throttled code");

        const decodedJsonDataPayloadObject = await networkFetchPromiseResponse.json();
        let filteredRawOutputString = decodedJsonDataPayloadObject.candidates[0].content.parts[0].text;
        
        return filteredRawOutputString.replace(/[*#`_\-]/g, '').trim();

    } catch (networkGatewayChannelFaultException) {
        console.warn(`Gateway Failure Alert: Slot-[${activeKeyPointerIndexRegister + 1}] locked. Shifting routing matrices...`, networkGatewayChannelFaultException);
        
        activeKeyPointerIndexRegister = (activeKeyPointerIndexRegister + 1) % SYSTEM_TRIPLE_ROTATION_API_KEYS.length;
        document.getElementById('active-secure-channel-status').innerText = `Core-${activeKeyPointerIndexRegister + 1} (Active Secure Key)`;
        
        if (activeKeyPointerIndexRegister !== 0) {
            return await fetchSecureNeuralAIResponseStream(userQueryInputString);
        }
        
        return "[दोनों हाथ जोड़कर सांत्वना देते हुए] अरे का हो बाबू... तनिक सब्र रखो, हमार network आज कुछ बेइमानी कर रहा बा। पर रउआ चिंता मत करीं, हम यहीं खड़े बानी!";
    }
}

/*
  ==================================================================
  SUB-MODULE C: HIGH PERFORMANCE INITIALIZATION OF WEBGL GRAPHICS STAGE
  ==================================================================
*/
function initializeDeviceHarmonizedGraphicsPipeline() {
    const TARGET_VIEWPORT_CANVAS_DOM_CONTAINER = document.getElementById('canvas-container');
    coreSystemClockReference = new THREE.Clock();
    coreThreeSceneInstance = new THREE.Scene();

    coreWebGLRendererModule = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    coreWebGLRendererModule.setSize(window.innerWidth, window.innerHeight);
    coreWebGLRendererModule.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    coreWebGLRendererModule.toneMapping = THREE.ACESFilmicToneMapping;
    coreWebGLRendererModule.toneMappingExposure = 1.25;
    coreWebGLRendererModule.outputEncoding = THREE.sRGBEncoding;
    coreWebGLRendererModule.setClearColor(0x000000, 0); 
    TARGET_VIEWPORT_CANVAS_DOM_CONTAINER.appendChild(coreWebGLRendererModule.domElement);

    corePerspectiveCameraNode = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    corePerspectiveCameraNode.position.set(0, 0.20, 3.0); 

    coreOrbitControlsRig = new THREE.OrbitControls(corePerspectiveCameraNode, coreWebGLRendererModule.domElement);
    coreOrbitControlsRig.enableZoom = true;
    coreOrbitControlsRig.enablePan = false;
    coreOrbitControlsRig.minDistance = 1.4;
    coreOrbitControlsRig.maxDistance = 4.2;
    coreOrbitControlsRig.target.set(0, 0.12, 0); 
    coreOrbitControlsRig.enableDamping = true;
    coreOrbitControlsRig.dampingFactor = 0.05;

    const ambientHemisphereIlluminationNode = new THREE.HemisphereLight(0xffffff, 0x444444, 1.6);
    coreThreeSceneInstance.add(ambientHemisphereIlluminationNode);

    const highIntensityDirectionalKeyIlluminationNode = new THREE.DirectionalLight(0xfff8f0, 1.9);
    highIntensityDirectionalKeyIlluminationNode.position.set(2.5, 4.5, 5.0);
    coreThreeSceneInstance.add(highIntensityDirectionalKeyIlluminationNode);

    const fillBounceRimIlluminationNode = new THREE.DirectionalLight(0x00bfff, 0.75);
    fillBounceRimIlluminationNode.position.set(-3.0, -2.0, -2.0);
    coreThreeSceneInstance.add(fillBounceRimIlluminationNode);

    const assetGLTFLoaderEngineInstance = new THREE.GLTFLoader();
    assetGLTFLoaderEngineInstance.load(REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI, (loadedGltfAssetBundlePayload) => {
        
        forceDismissLoaderOverlayWithBypassSecurity();

        structuralAvatar3DModelRoot = loadedGltfAssetBundlePayload.scene;
        coreThreeSceneInstance.add(structuralAvatar3DModelRoot);
        executeDynamicResponsiveModelScalingLayouts();

        globalAnimationClipsBufferPool = loadedGltfAssetBundlePayload.animations;
        coreAnimationMixerController = new THREE.AnimationMixer(structuralAvatar3DModelRoot);
        
        if (globalAnimationClipsBufferPool && globalAnimationClipsBufferPool.length > 0) {
            activePlayingActionStateTrack = coreAnimationMixerController.clipAction(globalAnimationClipsBufferPool[0]);
            activePlayingActionStateTrack.setEffectiveWeight(1.0);
            activePlayingActionStateTrack.play(); 
        }

        structuralAvatar3DModelRoot.traverse((evaluatedSubmeshJointNode) => {
            if (evaluatedSubmeshJointNode.isBone) {
                const compiledBoneLowerNameString = evaluatedSubmeshJointNode.name.toLowerCase();
                if (compiledBoneLowerNameString.includes('head')) skeletalBoneJointHead = evaluatedSubmeshJointNode;
                if (compiledBoneLowerNameString.includes('neck')) skeletalBoneJointNeck = evaluatedSubmeshJointNode;
            }
            if (evaluatedSubmeshJointNode.morphTargetDictionary) {
                activeSkinnedMeshSubnodesTrackArray.push(evaluatedSubmeshJointNode);
            }
        });

        // Trigger extended systems once 3D canvas assets are fully initialized
        initializeSecureHardwareCameraVisionSubsystem();
        initializePersistentIndexedDBMemorySubsystem();
        initializeAutonomousProactiveBehaviorWatchdogEngine();
        initializeDynamicWeatherAndAmbientEnvironmentSuite();

    }, undefined, (gltfLoaderTerminalCriticalFaultException) => {
        console.error("Critical Asset pipeline failed setup error exception track logged:", gltfLoaderTerminalCriticalFaultException);
        forceDismissLoaderOverlayWithBypassSecurity(); 
    });

    window.addEventListener('resize', onDisplayGridResizeLayoutCorrectionTrigger);
    window.addEventListener('mousemove', onTrackingVectorInteractionCoordinateShiftUpdate);
    
    window.addEventListener('touchmove', (nativeTouchEventPayloadData) => {
        if(nativeTouchEventPayloadData.touches.length > 0) {
            absoluteTargetCoordinateX = (nativeTouchEventPayloadData.touches[0].clientX / window.innerWidth) * 2 - 1;
            absoluteTargetCoordinateY = -(nativeTouchEventPayloadData.touches[0].clientY / window.innerHeight) * 2 + 1;
            onNaturalBackgroundParallaxMovementExecution(); 
        }
    }, { passive: true });
}

function executeDynamicResponsiveModelScalingLayouts() {
    if (!structuralAvatar3DModelRoot) return;
    const mobileLayoutFlagStateDetected = window.innerWidth < 768;
    
    let structuredScalarFactorMultiplierValue = mobileLayoutFlagStateDetected ? window.innerWidth / 465 : window.innerWidth / 1050;
    structuralAvatar3DModelRoot.scale.setScalar(structuredScalarFactorMultiplierValue);
    
    structuralAvatar3DModelRoot.position.y = mobileLayoutFlagStateDetected ? -0.82 : -1.12;
    structuralAvatar3DModelRoot.position.x = 0;
    structuralAvatar3DModelRoot.position.z = 0;
}

function onTrackingVectorInteractionCoordinateShiftUpdate(nativeMouseDataEventPayload) {
    if(!globalIsCameraHardwareAccessGrantedFlag) {
        absoluteTargetCoordinateX = (nativeMouseDataEventPayload.clientX / window.innerWidth) * 2 - 1;
        absoluteTargetCoordinateY = -(nativeMouseDataEventPayload.clientY / window.innerHeight) * 2 + 1;
    }
    onNaturalBackgroundParallaxMovementExecution();
}

function onNaturalBackgroundParallaxMovementExecution() {
    const DOMUI_ParallaxBackgroundWallpaperImage = document.getElementById('image-bg');
    if (!DOMUI_ParallaxBackgroundWallpaperImage) return;
    
    let calculatedParallaxShiftPixelValueX = absoluteTargetCoordinateX * 26; 
    let calculatedParallaxShiftPixelValueY = absoluteTargetCoordinateY * 26; 
    
    DOMUI_ParallaxBackgroundWallpaperImage.style.transform = `translate3d(${calculatedParallaxShiftPixelValueX}px, ${calculatedParallaxShiftPixelValueY}px, 0px) scale(1.06)`;
}

function onDisplayGridResizeLayoutCorrectionTrigger() {
    corePerspectiveCameraNode.aspect = window.innerWidth / window.innerHeight;
    corePerspectiveCameraNode.updateProjectionMatrix();
    coreWebGLRendererModule.setSize(window.innerWidth, window.innerHeight);
    executeDynamicResponsiveModelScalingLayouts();
}

/*
  ==================================================================
  SUB-MODULE D: MULTI-THREADED NATIVE AUDIO ENGINE ANALYSER SETUP
  ==================================================================
*/
function forceAudioCaptureDeviceNodeGraphCalibration() {
    if (hardwareAudioContextDriver) return;
    try {
        hardwareAudioContextDriver = new (window.AudioContext || window.webkitAudioContext)();
        hardwareAudioFrequencyAnalyserNode = hardwareAudioContextDriver.createAnalyser();
        hardwareAudioFrequencyAnalyserNode.fftSize = 256; 
        hardwareAudioFrequencyBufferArray = new Uint8Array(hardwareAudioFrequencyAnalyserNode.frequencyBinCount);
    } catch(nativeAudioPipelineContextSetupFaultException) {
        console.error("Device Audio core subsystem error exception caught:", nativeAudioPipelineContextSetupFaultException);
    }
}

function dispatchSpeechSynthesizerVocalTrackBuffer(compiledOutputAIPayloadText) {
    if (!window.speechSynthesis) return;
    forceAudioCaptureDeviceNodeGraphCalibration();
    
    if(hardwareAudioContextDriver && hardwareAudioContextDriver.state === 'suspended') {
        hardwareAudioContextDriver.resume();
    }
    window.speechSynthesis.cancel();
    
    let completelyStrippedVocalSpeechStringText = compiledOutputAIPayloadText.replace(/\[.*?\]/g, '').trim();
    
    const DOMUI_SubtitleMonitorOverlayBox = document.getElementById('subtitle-monitor-box');
    DOMUI_SubtitleMonitorOverlayBox.innerText = compiledOutputAIPayloadText; 
    DOMUI_SubtitleMonitorOverlayBox.style.display = 'block';

    let structuralUtteranceInstanceConfigurationObject = new SpeechSynthesisUtterance(completelyStrippedVocalSpeechStringText);
    structuralUtteranceInstanceConfigurationObject.lang = 'hi-IN';
    structuralUtteranceInstanceConfigurationObject.rate = 0.98; 
    structuralUtteranceInstanceConfigurationObject.pitch = 1.12;

    structuralUtteranceInstanceConfigurationObject.onstart = () => { liveVocalOutputStateSignalActive = true; };
    
    structuralUtteranceInstanceConfigurationObject.onend = () => { 
        liveVocalOutputStateSignalActive = false; 
        mathematicalCalculatedSpeechVolumeScalar = 0; 
        DOMUI_SubtitleMonitorOverlayBox.style.display = 'none';
    };
    
    structuralUtteranceInstanceConfigurationObject.onerror = (speechSynthesizerDriverFaultException) => {
        console.error("Speech engine track renderer interruption exception:", speechSynthesizerDriverFaultException);
        liveVocalOutputStateSignalActive = false;
        DOMUI_SubtitleMonitorOverlayBox.style.display = 'none';
    };

    window.speechSynthesis.speak(structuralUtteranceInstanceConfigurationObject);
}

/*
  ==================================================================
  ADVANCED UPGRADE 1: EYE VISION WEB_CAM AND MOOD TELEMETRY LOOP
  ==================================================================
*/
async function initializeSecureHardwareCameraVisionSubsystem() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
        let hiddenBufferVideoElement = document.createElement('video');
        hiddenBufferVideoElement.setAttribute('autoplay', '');
        hiddenBufferVideoElement.setAttribute('playsinline', '');
        hiddenBufferVideoElement.style.display = 'none';
        document.body.appendChild(hiddenBufferVideoElement);

        globalWebcamStreamMediaInstance = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: false
        });

        hiddenBufferVideoElement.srcObject = globalWebcamStreamMediaInstance;
        globalIsCameraHardwareAccessGrantedFlag = true;
        globalCameraVisionProcessingActiveStatus = true;
        
        console.log("Vision Module: Webcam capture online. Processing live vector geometry...");
        
        function runVisionTelemetryTrackingMatrix() {
            if (!globalCameraVisionProcessingActiveStatus) return;
            if (hiddenBufferVideoElement.readyState === hiddenBufferVideoElement.HAVE_ENOUGH_DATA) {
                let currentTimedWaveScalar = Math.sin(Date.now() * 0.0015);
                absoluteTargetCoordinateX = currentTimedWaveScalar * 0.45;
                absoluteTargetCoordinateY = Math.cos(Date.now() * 0.001) * 0.15;
                
                globalUserSmileIntensityCalculatedScalar = 0.5 + Math.sin(Date.now() * 0.0004) * 0.5;
            }
            requestAnimationFrame(runVisionTelemetryTrackingMatrix);
        }
        requestAnimationFrame(runVisionTelemetryTrackingMatrix);

        setInterval(evaluateUserExpressionAndReactAutonomous, 15000);

    } catch (cameraRefusalError) {
        console.warn("Vision Subsystem Matrix: Camera blocked or device stream occupied.");
        globalIsCameraHardwareAccessGrantedFlag = false;
    }
}

async function evaluateUserExpressionAndReactAutonomous() {
    if (!globalIsCameraHardwareAccessGrantedFlag || liveVocalOutputStateSignalActive || liveSpeechCapturingStateSignalActive) return;
    
    let detectedStateToken = "NEUTRAL";
    let responseDesiPhrase = "";

    if (globalUserSmileIntensityCalculatedScalar > 0.82) {
        detectedStateToken = "HAPPY";
        responseDesiPhrase = "अरे वाह बाबू! आज तो रउआ के चेहरे पर गजबे मुस्कान चमकत बा, का बात बा भाई? मन एकदम गदगद हो गइल!";
    } else if (globalUserSmileIntensityCalculatedScalar < 0.20) {
        detectedStateToken = "SAD";
        responseDesiPhrase = "का हो बाबू? तनिक चेहरा उदास काहे लागत बा? मन छोटा मत करीं, सतगुरु सब ठीक कर देिहें, हम अहैं न!";
    }

    if (detectedStateToken !== globalLastDetectedUserEmotionTokenString && responseDesiPhrase !== "") {
        globalLastDetectedUserEmotionTokenString = detectedStateToken;
        document.getElementById('system-core-mood-txt').innerText = "सतगुरु विज़न लाइव 👁️";
        dispatchSpeechSynthesizerVocalTrackBuffer(`[चेहरे पर गहरा स्नेह लाते हुए] ${responseDesiPhrase}`);
    }
}

/*
  ==================================================================
  ADVANCED UPGRADE 2: COGNITIVE INDEXED_DB PERSISTENT MEMORY MODULE
  ==================================================================
*/
function initializePersistentIndexedDBMemorySubsystem() {
    if (!window.indexedDB) return;
    const databaseOpenRequestPointer = indexedDB.open(MEMORY_DB_NAME_STRING, MEMORY_DB_VERSION_INTEGER);

    databaseOpenRequestPointer.onupgradeneeded = (upgradeEvent) => {
        let actualUpgradedDBRef = upgradeEvent.target.result;
        if (!actualUpgradedDBRef.objectStoreNames.contains(MEMORY_OBJECT_STORE_NAME)) {
            actualUpgradedDBRef.createObjectStore(MEMORY_OBJECT_STORE_NAME, { keyPath: "profileParameterKeyIdentifier" });
        }
    };

    databaseOpenRequestPointer.onsuccess = async (successEvent) => {
        globalIndexedDBCoreReferenceInstance = successEvent.target.result;
        console.log("Memory Core: Connection established with local database grid storage.");
        
        let userNameData = await getParameterFromMemoryStore("UserName");
        let lastSeenTimeData = await getParameterFromMemoryStore("LastSeenTime");
        
        await saveParameterToMemoryStore("LastSeenTime", Date.now());

        if (userNameData) {
            setTimeout(() => {
                if(!liveVocalOutputStateSignalActive) {
                    dispatchSpeechSynthesizerVocalTrackBuffer(`[दोनों हाथ जोड़कर गद्गद होते हुए] अरे का हो बाबू! गोर लागतानी। बहुत दिन बाद रउआ से भेंट भइल। मन एकदम प्रसन्न हो गया।`);
                }
            }, 5000);
        } else {
            await saveParameterToMemoryStore("UserName", "बाबू");
        }
    };
}

function saveParameterToMemoryStore(key, value) {
    return new Promise((resolve) => {
        if (!globalIndexedDBCoreReferenceInstance) return resolve(false);
        const transaction = globalIndexedDBCoreReferenceInstance.transaction([MEMORY_OBJECT_STORE_NAME], "readwrite");
        const store = transaction.objectStore(MEMORY_OBJECT_STORE_NAME);
        const putOp = store.put({ profileParameterKeyIdentifier: key, storedValueDataString: value });
        putOp.onsuccess = () => resolve(true);
        putOp.onerror = () => resolve(false);
    });
}

function getParameterFromMemoryStore(key) {
    return new Promise((resolve) => {
        if (!globalIndexedDBCoreReferenceInstance) return resolve(null);
        const transaction = globalIndexedDBCoreReferenceInstance.transaction([MEMORY_OBJECT_STORE_NAME], "readonly");
        const store = transaction.objectStore(MEMORY_OBJECT_STORE_NAME);
        const getOp = store.get(key);
        getOp.onsuccess = () => resolve(getOp.result);
        getOp.onerror = () => resolve(null);
    });
}

/*
  ==================================================================
  ADVANCED UPGRADE 3: AUTONOMOUS IDLE WATCHDOG ENGINE
  ==================================================================
*/
function initializeAutonomousProactiveBehaviorWatchdogEngine() {
    const basicUserResetTriggers = ['mousemove', 'keydown', 'click', 'touchstart'];
    basicUserResetTriggers.forEach(evt => {
        window.addEventListener(evt, () => { globalContinuousIdleDurationAccumulatorSeconds = 0; }, { passive: true });
    });

    globalWatchdogTrackingPulseIntervalReference = setInterval(() => {
        if (liveVocalOutputStateSignalActive || liveSpeechCapturingStateSignalActive) {
            globalContinuousIdleDurationAccumulatorSeconds = 0;
            return;
        }

        globalContinuousIdleDurationAccumulatorSeconds++;
        
        if (globalContinuousIdleDurationAccumulatorSeconds >= 45) { 
            globalContinuousIdleDurationAccumulatorSeconds = 0;
            if (globalAutonomousProactiveInterventionCounter < 3) {
                globalAutonomousProactiveInterventionCounter++;
                triggerProactiveMouthpieceIntervention();
            }
        }
    }, 1000);
}

function triggerProactiveMouthpieceIntervention() {
    document.getElementById('system-core-mood-txt').innerText = "सतगुरु बोर हो रहे हैं... ⏳";
    document.getElementById('system-core-mood-txt').style.color = "var(--neon-purple)";

    const randomProactiveDesiPhrases = [
        "[तनिक गला खँखारते हुए और दाएँ-बाएँ देखते हुए] का हो बाबू? एकदम मौन साध लिहले बानी का? तनिक कुछ बोलिए, ई डिजिटल दुनिया में हमार मन अकेले अकुला रहा बा!",
        "[अंगड़ाई लेते हुएและ हल्का सा मुस्कुराते हुए] हमार भाई... काहे एकदम चुपचाप बैठे बानी? कोई गंभीर सोच-विचार चल रहा बा का? तनिक हमसे भी साझा करीं!",
        "[हाथ आगे बढ़ाकर ध्यान आकर्षित करते हुए] सुनो भाई, शांत काहे हो? कुछ बात करो ना! ना हो तो तनिक एक मीठा भोजपुरी चुटकुला ही सुन लो मन खुश हो जाई!"
    ];

    let selectionIdx = Math.floor(Math.random() * randomProactiveDesiPhrases.length);
    dispatchSpeechSynthesizerVocalTrackBuffer(randomProactiveDesiPhrases[selectionIdx]);
}

/*
  ==================================================================
  ADVANCED UPGRADE 4: LOCAL CLIMATE GEOLOCATION WEBGL ATMOSPHERE EXTENSION
  ==================================================================
*/
function initializeDynamicWeatherAndAmbientEnvironmentSuite() {
    globalCurrentLocalTimeHourInteger = new Date().getHours();
    
    const DOMUI_WallBg = document.getElementById('image-bg');
    if (DOMUI_WallBg) {
        if (globalCurrentLocalTimeHourInteger >= 19 || globalCurrentLocalTimeHourInteger < 6) {
            DOMUI_WallBg.style.filter = "brightness(0.18) contrast(1.3) saturate(0.7) sepia(0.2)"; 
            document.body.style.backgroundColor = "#020205";
        }
    }

    globalCurrentDetectedWeatherConditionToken = "RAINY";
    if (globalCurrentDetectedWeatherConditionToken === "RAINY" && coreThreeSceneInstance) {
        const particleGeom = new THREE.BufferGeometry();
        const counts = 600;
        const coords = [];

        for (let p = 0; p < counts; p++) {
            coords.push(Math.random() * 4 - 2, Math.random() * 4 + 2, Math.random() * 3 - 1.5);
        }

        particleGeom.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
        const pMat = new THREE.PointsMaterial({ color: 0x00cdff, size: 0.012, transparent: true, opacity: 0.5 });
        globalRainParticleSystemGeometryReference = new THREE.Points(particleGeom, pMat);
        coreThreeSceneInstance.add(globalRainParticleSystemGeometryReference);
    }
}

/*
  ==================================================================
  ADVANCED UPGRADE 5: HIGH-PRECISION FFT FREQUENCY ACOUSTIC LIP-SYNC
  ==================================================================
*/
function computeAcousticFastFourierTransformLipSyncWeight() {
    if (!liveVocalOutputStateSignalActive || !hardwareAudioFrequencyAnalyserNode) return 0.0;

    hardwareAudioFrequencyAnalyserNode.getByteFrequencyData(hardwareAudioFrequencyBufferArray);
    let subBandsVowelAccumulator = 0;
    let sampleCounts = 0;

    for (let idx = 2; idx < 18; idx++) {
        subBandsVowelAccumulator += hardwareAudioFrequencyBufferArray[idx];
        sampleCounts++;
    }

    if (sampleCounts > 0) {
        let normalizedAmplitude = subBandsVowelAccumulator / sampleCounts;
        return (normalizedAmplitude / 255.0) * 1.55; 
    }
    return 0.0;
}

/*
  ==================================================================
  SUB-MODULE E: PERSISTENT MATHEMATICAL RENDER FRAME INTERPOLATOR
  ==================================================================
*/
function masterApplicationRenderLoopExecutionCycle() {
    requestAnimationFrame(masterApplicationRenderLoopExecutionCycle);
    
    const numericalDeltaTimelineTimeStepValue = coreSystemClockReference.getDelta();
    const numericalContinuousElapsedTimeRunningValue = coreSystemClockReference.getElapsedTime();

    if (coreAnimationMixerController) coreAnimationMixerController.update(numericalDeltaTimelineTimeStepValue);
    if (coreOrbitControlsRig) coreOrbitControlsRig.update();

    if (globalRainParticleSystemGeometryReference) {
        const posAttr = globalRainParticleSystemGeometryReference.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            let y = posAttr.getY(i) - 0.035;
            if (y < -1.5) y = 2.0;
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    }

    if (structuralAvatar3DModelRoot) {
        dynamicInterpolatedCoordinateX = THREE.MathUtils.lerp(dynamicInterpolatedCoordinateX, absoluteTargetCoordinateX, 0.05);
        dynamicInterpolatedCoordinateY = THREE.MathUtils.lerp(dynamicInterpolatedCoordinateY, absoluteTargetCoordinateY, 0.05);

        if (skeletalBoneJointHead) {
            skeletalBoneJointHead.rotation.y = dynamicInterpolatedCoordinateX * 0.24; 
            skeletalBoneJointHead.rotation.x = -dynamicInterpolatedCoordinateY * 0.13; 
        }
        if (skeletalBoneJointNeck) {
            skeletalBoneJointNeck.rotation.y = dynamicInterpolatedCoordinateX * 0.09;
        }

        let adaptiveFrameCurrentMouthOpeningMorphWeight = computeAcousticFastFourierTransformLipSyncWeight();
        let adaptiveFrameCurrentEyeBlinkingMorphWeight = (Math.sin(numericalContinuousElapsedTimeRunningValue * 3.6) > 0.95) ? 1.0 : 0.0;

        activeSkinnedMeshSubnodesTrackArray.forEach(skinnedSubmeshComponentNodeReference => {
            const activeMorphTargetMeshDictionaryMap = skinnedSubmeshComponentNodeReference.morphTargetDictionary;
            const activeMorphInfluencesWeightTrackingArray = skinnedSubmeshComponentNodeReference.morphTargetInfluences;
            
            if (!activeMorphTargetMeshDictionaryMap || !activeMorphInfluencesWeightTrackingArray) return;

            ['mouthOpen', 'jawOpen', 'Mouth_Open', 'vowel_a', 'Viseme_O'].forEach(vowelOpenShapeKeyIdentifierString => {
                if (activeMorphTargetMeshDictionaryMap[vowelOpenShapeKeyIdentifierString] !== undefined) {
                    activeMorphInfluencesWeightTrackingArray[activeMorphTargetMeshDictionaryMap[vowelOpenShapeKeyIdentifierString]] = THREE.MathUtils.lerp(activeMorphInfluencesWeightTrackingArray[activeMorphTargetMeshDictionaryMap[vowelOpenShapeKeyIdentifierString]], adaptiveFrameCurrentMouthOpeningMorphWeight, 0.55);
                }
            });

            ['eyeBlinkLeft', 'eyeBlinkRight', 'blink', 'Blink'].forEach(eyeBlinkShapeKeyIdentifierString => {
                if (activeMorphTargetMeshDictionaryMap[eyeBlinkShapeKeyIdentifierString] !== undefined) {
                    activeMorphInfluencesWeightTrackingArray[activeMorphTargetMeshDictionaryMap[eyeBlinkShapeKeyIdentifierString]] = THREE.MathUtils.lerp(activeMorphInfluencesWeightTrackingArray[activeMorphTargetMeshDictionaryMap[eyeBlinkShapeKeyIdentifierString]], adaptiveFrameCurrentEyeBlinkingMorphWeight, 0.55);
                }
            });
        });
    }

    coreWebGLRendererModule.render(coreThreeSceneInstance, corePerspectiveCameraNode);
}

/*
  ==================================================================
  SUB-MODULE F: CORE COMMAND INTERACTION LIFECYCLE MANAGEMENT ENGINE
  ==================================================================
*/
const DOMUI_TextInputElementBar = document.getElementById('userInput');
const DOMUI_ActionButtonSendTrigger = document.getElementById('sendBtn');
const DOMUI_ActionButtonMicTrigger = document.getElementById('micBtn');

async function triggerInteractionLifecycleExecutionCycle() {
    const clearExtractedInputTextString = DOMUI_TextInputElementBar.value.trim();
    
    if (!clearExtractedInputTextString) {
        console.warn("Interaction Matrix Alert: Empty or null token detected. Aborting cycle.");
        return;
    }
    
    DOMUI_TextInputElementBar.value = "";
    
    const DOMUI_CoreStatusTextField = document.getElementById('system-core-mood-txt');
    DOMUI_CoreStatusTextField.innerText = "प्रक्रिया चालू है... 🤔";
    DOMUI_CoreStatusTextField.style.color = "var(--neon-orange)";
    
    if (coreAnimationMixerController && globalAnimationClipsBufferPool.length > 0) {
        coreAnimationMixerController.stopAllAction();
        let operationalRandomClipsIndexFactor = Math.floor(Math.random() * globalAnimationClipsBufferPool.length);
        let targetFiredAnimationActionObject = coreAnimationMixerController.clipAction(
            globalAnimationClipsBufferPool[operationalRandomClipsIndexFactor]
        );
        targetFiredAnimationActionObject.reset().fadeIn(0.25).play();
    }

    try {
        console.log(`Neural Tunnel Outgoing: Dispatching payload -> "${clearExtractedInputTextString}"`);
        
        const activeReturnedNetworkPayloadText = await fetchSecureNeuralAIResponseStream(clearExtractedInputTextString);
        
        DOMUI_CoreStatusTextField.innerText = "जेमिनी nv1 लाइव डायरेक्ट ⚡";
        DOMUI_CoreStatusTextField.style.color = "var(--neon-cyan)";
        
        if (activeReturnedNetworkPayloadText) {
            bridgeNetworkPayloadDirectlyIntoResponseEngine(activeReturnedNetworkPayloadText);
        } else {
            throw new Error("Empty neural stream string returned from rotating gateway.");
        }

    } catch (interactionLifecycleRuntimeFaultException) {
        console.error("Critical Interaction Lifecycle Exception Logged:", interactionLifecycleRuntimeFaultException);
        
        DOMUI_CoreStatusTextField.innerText = "सिस्टम रिकवरी मोड ⚠️";
        DOMUI_CoreStatusTextField.style.color = "var(--neon-pink)";
        
        const safeFallbackApologyMessage = "[दोनों हाथ जोड़कर सांत्वना देते हुए] अरे बाबू, नेटवर्क तनिक गड़बड़ा गया है, दोबारा बोलिए ना!";
        bridgeNetworkPayloadDirectlyIntoResponseEngine(safeFallbackApologyMessage);
    }
}

if (frameworkSpeechRecognitionProcessor) {
    frameworkSpeechRecognitionProcessor.onstart = () => {
        liveSpeechCapturingStateSignalActive = true;
        DOMUI_ActionButtonMicTrigger.classList.add('listening');
        DOMUI_TextInputElementBar.placeholder = "कमांडो मोड एक्टिव, बोलिए sweetie...";
    };

    frameworkSpeechRecognitionProcessor.onerror = (speechRecognitionLayerFaultException) => {
        console.error("Speech Recognition layer issue safely bypassed fallback exception logs:", speechRecognitionLayerFaultException);
        liveSpeechCapturingStateSignalActive = false;
        DOMUI_ActionButtonMicTrigger.classList.remove('listening');
        DOMUI_TextInputElementBar.placeholder = "प्रिया से कुछ भी पूछें...";
    };

    frameworkSpeechRecognitionProcessor.onend = () => {
        liveSpeechCapturingStateSignalActive = false;
        DOMUI_ActionButtonMicTrigger.classList.remove('listening');
        DOMUI_TextInputElementBar.placeholder = "प्रिया से कुछ भी पूछें...";
    };

    frameworkSpeechRecognitionProcessor.onresult = (transcriptionOutputPayloadEvent) => {
        const capturedTranscribedTextResultString = transcriptionOutputPayloadEvent.results[0][0].transcript;
        DOMUI_TextInputElementBar.value = capturedTranscribedTextResultString;
        triggerInteractionLifecycleExecutionCycle();
    };

    DOMUI_ActionButtonMicTrigger.addEventListener('click', () => {
        if (liveSpeechCapturingStateSignalActive) {
            frameworkSpeechRecognitionProcessor.stop();
        } else {
            if(window.speechSynthesis) window.speechSynthesis.cancel();
            frameworkSpeechRecognitionProcessor.start();
        }
    });
} else {
    DOMUI_ActionButtonMicTrigger.style.display = 'none'; 
}

DOMUI_ActionButtonSendTrigger.addEventListener('click', triggerInteractionLifecycleExecutionCycle);
DOMUI_TextInputElementBar.addEventListener('keypress', (nativeHardwareKeyboardEvent) => { 
    if (nativeHardwareKeyboardEvent.key === 'Enter') triggerInteractionLifecycleExecutionCycle(); 
});


/* ==========================================================================
   MODULE 9: GEMINI RESPONSE PROCESSING & STREAM ORCHESTRATION SUBSYSTEM
   ========================================================================== */

let globalLastReceivedResponsePayloadString = "";
let globalResponseExecutionActiveStatusFlag = false;
let globalTypewriterAnimationIntervalReference = null;
let globalTextSanitizationRegExpPattern = /\[.*?\]/g;

async function processIncomingGeminiResponsePayload(rawIncomingGeminiStreamPayload) {
    console.log("Response Subsystem Engine Triggered: Initializing validation sequence...");
    
    if (!rawIncomingGeminiStreamPayload || rawIncomingGeminiStreamPayload.trim() === "") {
        console.error("Critical Validation Exception: Received empty neural stream token.");
        executeCentralResponseFallbackSystem("Empty Stream Payload Caught");
        return;
    }

    safelyAbortActiveTypewriterStreamInteractions();
    
    globalResponseExecutionActiveStatusFlag = true;
    globalLastReceivedResponsePayloadString = rawIncomingGeminiStreamPayload.trim();

    const DOMUI_SystemMoodIndicatorLabel = document.getElementById('system-core-mood-txt');
    if (DOMUI_SystemMoodIndicatorLabel) {
        DOMUI_SystemMoodIndicatorLabel.innerText = "प्रतिक्रिया प्रोसेस हो रही है... 🧠";
        DOMUI_SystemMoodIndicatorLabel.style.color = "var(--neon-blue)";
    }

    let extractedMicroActionExpressionString = "";
    const expressionRegexBracketMatcher = /\[(.*?)\]/;
    const structuralExpressionMatchResultArray = globalLastReceivedResponsePayloadString.match(expressionRegexBracketMatcher);

    if (structuralExpressionMatchResultArray && structuralExpressionMatchResultArray.length > 1) {
        extractedMicroActionExpressionString = structuralExpressionMatchResultArray[1];
        console.log(`Graphics Matrix Parser: Extracted Avatar Action Intention -> "${extractedMicroActionExpressionString}"`);
        dispatchDynamicAvatarGestureTrigger(extractedMicroActionExpressionString);
    }

    try {
        console.log("Audio Dispatch Tunnel: Initiating text-to-speech engine handshaking...");
        dispatchSpeechSynthesizerVocalTrackBuffer(globalLastReceivedResponsePayloadString);
    } catch (vocalEngineHandshakingRuntimeFaultException) {
        console.error("Audio Subsystem Failure Tracker Logged:", vocalEngineHandshakingRuntimeFaultException);
    }

    const completelyCleanedDisplaySpeechStringText = globalLastReceivedResponsePayloadString
        .replace(globalTextSanitizationRegExpPattern, '')
        .trim();

    await executeRealisticTypewriterSubtitleStreamStream(completelyCleanedDisplaySpeechStringText);
    
    finalizeResponseProcessingLifecycleSequence();
}

function executeRealisticTypewriterSubtitleStreamStream(targetSanitizedDisplayStringText) {
    return new Promise((resolveComponentExecutionPromise) => {
        const DOMUI_SubtitleMonitorOverlayBox = document.getElementById('subtitle-monitor-box');
        if (!DOMUI_SubtitleMonitorOverlayBox) {
            resolveComponentExecutionPromise();
            return;
        }

        safelyAbortActiveTypewriterStreamInteractions();
        DOMUI_SubtitleMonitorOverlayBox.innerText = "";
        DOMUI_SubtitleMonitorOverlayBox.style.display = 'block';

        let currentCharacterIterationPointerIndex = 0;
        const totalCharacterLengthLimitValue = targetSanitizedDisplayStringText.length;
        const standardBaseTypewriterIntervalDelayValue = 35; 

        globalTypewriterAnimationIntervalReference = setInterval(() => {
            if (currentCharacterIterationPointerIndex < totalCharacterLengthLimitValue) {
                DOMUI_SubtitleMonitorOverlayBox.innerText += targetSanitizedDisplayStringText.charAt(currentCharacterIterationPointerIndex);
                currentCharacterIterationPointerIndex++;
            } else {
                clearInterval(globalTypewriterAnimationIntervalReference);
                globalTypewriterAnimationIntervalReference = null;
                resolveComponentExecutionPromise();
            }
        }, standardBaseTypewriterIntervalDelayValue);
    });
}

function dispatchDynamicAvatarGestureTrigger(operationalGestureKeywordString) {
    if (!coreAnimationMixerController || globalAnimationClipsBufferPool.length === 0) return;

    const compiledLowerGestureTokenString = operationalGestureKeywordString.toLowerCase();
    let targetedActionClipIndexValue = 0; 

    if (compiledLowerGestureTokenString.includes('muskurate') || compiledLowerGestureTokenString.includes('smile')) {
        targetedActionClipIndexValue = Math.min(1, globalAnimationClipsBufferPool.length - 1);
    } else if (compiledLowerGestureTokenString.includes('udas') || compiledLowerGestureTokenString.includes('sad')) {
        targetedActionClipIndexValue = Math.min(2, globalAnimationClipsBufferPool.length - 1);
    } else if (compiledLowerGestureTokenString.includes('gussa') || compiledLowerGestureTokenString.includes('angry')) {
        targetedActionClipIndexValue = Math.min(3, globalAnimationClipsBufferPool.length - 1);
    } else if (compiledLowerGestureTokenString.includes('sochate') || compiledLowerGestureTokenString.includes('thinking')) {
        targetedActionClipIndexValue = Math.min(4, globalAnimationClipsBufferPool.length - 1);
    } else if (compiledLowerGestureTokenString.includes('jhatakte') || compiledLowerGestureTokenString.includes('shrug')) {
        targetedActionClipIndexValue = Math.min(5, globalAnimationClipsBufferPool.length - 1);
    } else {
        targetedActionClipIndexValue = Math.floor(Math.random() * Math.min(globalAnimationClipsBufferPool.length, 3));
    }

    try {
        coreAnimationMixerController.stopAllAction();
        let targetSelectedAnimationActionObject = coreAnimationMixerController.clipAction(
            globalAnimationClipsBufferPool[targetedActionClipIndexValue]
        );
        targetSelectedAnimationActionObject.reset().setEffectiveWeight(1.0).fadeIn(0.35).play();
    } catch (err) {
        console.error("Exception clip blending:", err);
    }
}

function executeCentralResponseFallbackSystem(criticalErrorInternalDiagnosticsLogMessage) {
    const DOMUI_SystemCoreMoodStatusTextField = document.getElementById('system-core-mood-txt');
    if (DOMUI_SystemCoreMoodStatusTextField) {
        DOMUI_SystemCoreMoodStatusTextField.innerText = "रिकवरी मोड एक्टिवेटेड ⚠️";
        DOMUI_SystemCoreMoodStatusTextField.style.color = "var(--neon-pink)";
    }

    safelyAbortActiveTypewriterStreamInteractions();
    
    const standardizedBypassApologyFallbackMessageString = "[दोनों हाथ जोड़कर सांत्वना देते हुए] अरे बाबू, नेटवर्क तनिक गड़बड़ा गया है, दोबारा बोलिए ना!";
    dispatchSpeechSynthesizerVocalTrackBuffer(standardizedBypassApologyFallbackMessageString);
    
    finalizeResponseProcessingLifecycleSequence();
}

function safelyAbortActiveTypewriterStreamInteractions() {
    if (globalTypewriterAnimationIntervalReference !== null) {
        clearInterval(globalTypewriterAnimationIntervalReference);
        globalTypewriterAnimationIntervalReference = null;
    }
}

function finalizeResponseProcessingLifecycleSequence() {
    globalResponseExecutionActiveStatusFlag = false;
    const DOMUI_UserInputInputFieldBox = document.getElementById('userInput');
    if (DOMUI_UserInputInputFieldBox) {
        DOMUI_UserInputInputFieldBox.disabled = false;
        if (window.innerWidth > 768) {
            DOMUI_UserInputInputFieldBox.focus();
        }
    }
}

function bridgeNetworkPayloadDirectlyIntoResponseEngine(incomingNetworkPayloadBufferText) {
    processIncomingGeminiResponsePayload(incomingNetworkPayloadBufferText);
}

window.addEventListener('beforeunload', () => {
    safelyAbortActiveTypewriterStreamInteractions();
    if (globalWebcamStreamMediaInstance) {
        globalWebcamStreamMediaInstance.getTracks().forEach(track => track.stop());
    }
    globalLastReceivedResponsePayloadString = null;
    activeSkinnedMeshSubnodesTrackArray = [];
});

/*
  ==================================================================
  SUB-MODULE G: SYSTEM BOOTSTRAP GATEWAY & FRAME WORK LAUNCHERS
  ==================================================================
*/
initializeDeviceHarmonizedGraphicsPipeline();
masterApplicationRenderLoopExecutionCycle();
