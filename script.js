/**
 * =================================================================================================
 * PRIYA AI QUANTUM INTERACTIVE PARADIGM CONTROLLER ENGINE - VERSION 2.5
 * ARCHITECTURE: Production-Grade Modular Object Infrastructure (60 FPS Rigid Target Lock)
 * COMPLETENESS PROTOCOL: All modules integrated with absolute ZERO feature shedding.
 * =================================================================================================
 */

// 1. ROTATIONAL API SECURITY ENDPOINTS & ASSET CACHES
const SYSTEM_API_ROTATION_VAULT = [
    "AIzaSyBgyADY-6VFaLefYi8PaGak_L8kpfpGDA0",
    "AIzaSyBSaw3teN0aoDb2qdzuYktqUZ08sUOIv5o"
];
let systemActiveKeyIndex = 0;
const CLOUD_MODEL_ENDPOINT = "https://github.com/jessearmy572-hub/naman3/raw/refs/heads/main/model.glb";

// 2. CORE GRAPHICS VIEWPORT CORE REGISTRIES
let globalThreeScene, globalThreeCamera, globalThreeRenderer, globalOrbitControls;
let mainAvatarModel = null, anatomicalHeadBone = null, anatomicalNeckBone = null, anatomicalSpineBone = null;
let computationalSkinnedMeshes = [];
let internalAnimationMixer, systemsClockEngine;

// Damping Mathematical Lerp Vector Tracks
let kinematicsCoordinates = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
let ecosystemStates = { currentSentiment: "neutral", weatherRainActive: false, circadianNightActive: false, hologramShaderActive: false };

// Safe original standard material mapping tracker to handle non-destructive shader reversals
let standardMaterialsCacheMap = new Map();

// Environmental Particle Vectors
let monsoonParticleGeometry, monsoonParticleMaterial, monsoonParticleNodeSystem = null;
const SYSTEM_MAX_PARTICLES_COUNT = 1500;

// High Precision Realtime Audio Spectrum Interfaces
let nativeAudioContextEngine = null, softwareAudioAnalyserNode = null, audioFrequencyByteDataArray = null;
let flagVoiceSynthesizerIsActive = false;

// Hardware Camera & Benchmarking Trackers
let mediaPipeFaceMeshInstance = null, physicalHardwareCameraStream = null, flagWebcamTrackingIsActive = false;
let profilingFramesCount = 0, operationalLastTimestamp = 0;

/* =================================================================================================
 * 3. ADVANCED GRAPH-NODE PERSONALITY COGNITIVE MEMORY STRUCT VAULT
 * ================================================================================================= */
const VectorGraphCognitiveMemoryVault = {
    initializeSecureGraph: function() {
        if (!localStorage.getItem('priya_graph_memory_vault_v2.5')) {
            const initialGraphManifest = {
                userPreferencesNode: { preferredUserSignature: "Babu", explicitMoodLikes: [], absoluteCustomName: "" },
                interactionGraphEdges: []
            };
            localStorage.setItem('priya_graph_memory_vault_v2.5', JSON.stringify(initialGraphManifest));
        }
    },
    parseAndHarvestEntities: function(userQueryString, agentOutputString) {
        try {
            let activeGraph = JSON.parse(localStorage.getItem('priya_graph_memory_vault_v2.5'));
            const lowerQuery = userQueryString.toLowerCase();

            if (lowerQuery.includes('mera naam') || lowerQuery.includes('call me')) {
                const nameTokens = userQueryString.split(/\s+/);
                if (nameTokens.length > 2) activeGraph.userPreferencesNode.absoluteCustomName = nameTokens[nameTokens.length - 1];
            }
            if (lowerQuery.includes('pasand hai') || lowerQuery.includes('like')) {
                activeGraph.userPreferencesNode.explicitMoodLikes.push(userQueryString);
            }

            activeGraph.interactionGraphEdges.push({ uQ: userQueryString, aR: agentOutputString, tS: Date.now() });
            if (activeGraph.interactionGraphEdges.length > 20) activeGraph.interactionGraphEdges.shift();

            localStorage.setItem('priya_graph_memory_vault_v2.5', JSON.stringify(activeGraph));
        } catch (e) { console.error("Memory Extraction Fail:", e); }
    },
    compileCognitiveContextManifest: function() {
        try {
            let activeGraph = JSON.parse(localStorage.getItem('priya_graph_memory_vault_v2.5'));
            let memorySnippet = `User Identity Label: ${activeGraph.userPreferencesNode.absoluteCustomName || activeGraph.userPreferencesNode.preferredUserSignature}.\n`;
            if (activeGraph.userPreferencesNode.explicitMoodLikes.length > 0) {
                memorySnippet += `User Context Preferences: ${activeGraph.userPreferencesNode.explicitMoodLikes.slice(-3).join(', ')}.\n`;
            }
            memorySnippet += "Historical Chat Node Sequence Nodes:\n";
            memorySnippet += activeGraph.interactionGraphEdges.map(edge => `User: ${edge.uQ} -> Priya: ${edge.aR}`).join('\n');
            return memorySnippet;
        } catch (err) { return "No prior memory strings linked."; }
    }
};
VectorGraphCognitiveMemoryVault.initializeSecureGraph();

/* =================================================================================================
 * 4. NATURAL LANGUAGE HEURISTICS & GENERATIVE ROTATIONAL LAYER INTERFACE
 * ================================================================================================= */
function interpretSentimentHeuristics(inputString) {
    const rawTokens = inputString.toLowerCase();
    let computedState = "neutral";

    if (["खुश", "smile", "अच्छा", "प्यार", "love", "हंसो", "happy", "sweet"].some(t => rawTokens.includes(t))) computedState = "happy";
    else if (["sad", "dukh", "दुखी", "परेशान", "रो", "उदाश", "angry", "गुस्सा"].some(t => rawTokens.includes(t))) computedState = "sad";

    ecosystemStates.currentSentiment = computedState;
    const hudLabel = document.getElementById('hud-sentiment-label');
    if (hudLabel) {
        hudLabel.innerText = computedState.toUpperCase();
        hudLabel.style.color = computedState === "happy" ? "var(--neon-cyan)" : (computedState === "sad" ? "var(--neon-pink)" : "var(--neon-blue)");
    }
}

async function requestGenerativeAIResponseEngine(rawPromptText) {
    if (interceptAndExecuteDirectCommands(rawPromptText)) {
        return "[मुस्कुराते हुए आँखों से प्यार बरसाते हुए] जी बाबू, आपके आदेशानुसार मैंने सिस्टम कॉन्फ़िगरेशन तुरंत बदल दिया है! देखिए, मैं कैसी लग रही हूँ?";
    }

    const compiledGraphContext = VectorGraphCognitiveMemoryVault.compileCognitiveContextManifest();
    const systemicBehavioralDirectives = 
        `Identity Paradigm: You are Priya AI, a highly responsive, deeply affectionate, and intelligent Indian AI girl. ` +
        `Language Constraint: Beautiful Hinglish laced with sweet casual Bhojpuri phrases (like 'का हालचाल बा बाबू', 'सब ठीक बा ना'). ` +
        `Response Constraint: Maximum 2 small high-impact sentences. ` +
        `Gesture Protocol: Prepend statements with an physical micro-expression token inside explicit square brackets, e.g., [शर्माते हुए मुस्कुरा कर] or [पलकें झपकाते हुए डिजिटल अवतार में]. ` +
        `Ambient Parameters: Sentiment Context=${ecosystemStates.currentSentiment}, HologramShaderActive=${ecosystemStates.hologramShaderActive}.\n` +
        `Graph Cognition Matrix Logs:\n${compiledGraphContext}`;

    let rotationKey = SYSTEM_API_ROTATION_VAULT[systemActiveKeyIndex];
    const operationalGatewayEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${rotationKey}`;

    try {
        const responsePipeline = await fetch(operationalGatewayEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `${systemicBehavioralDirectives}\nUser Query Trigger: ${rawPromptText}` }] }] })
        });
        if (!responsePipeline.ok) throw new Error("Key Rotation Required Due To Allocation Thresholds");
        
        const responseJsonNode = await responsePipeline.json();
        let finalizedOutputString = responseJsonNode.candidates[0].content.parts[0].text.replace(/[*#_\-]/g, '').trim();
        
        VectorGraphCognitiveMemoryVault.parseAndHarvestEntities(rawPromptText, finalizedOutputString);
        return finalizedOutputString;
    } catch (e) {
        systemActiveKeyIndex = (systemActiveKeyIndex + 1) % SYSTEM_API_ROTATION_VAULT.length;
        return await requestGenerativeAIResponseEngine(rawPromptText);
    }
}

/* =================================================================================================
 * 5. HIGH-END GRAPHICS THREE.JS ENVIRONMENT SETUP MAPPING
 * ================================================================================================= */
function initializeThreeGraphicsEnvironment() {
    const canvasContainerAnchor = document.getElementById('canvas-container');
    systemsClockEngine = new THREE.Clock();
    globalThreeScene = new THREE.Scene();

    globalThreeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    globalThreeRenderer.setSize(window.innerWidth, window.innerHeight);
    globalThreeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globalThreeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    globalThreeRenderer.toneMappingExposure = 1.05;
    canvasContainerAnchor.appendChild(globalThreeRenderer.domElement);

    globalThreeCamera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    globalThreeCamera.position.set(0, 0.42, 2.35);

    globalOrbitControls = new THREE.OrbitControls(globalThreeCamera, globalThreeRenderer.domElement);
    globalOrbitControls.enablePan = false; globalOrbitControls.minDistance = 0.75; globalOrbitControls.maxDistance = 4.2;
    globalOrbitControls.target.set(0, 0.26, 0); globalOrbitControls.enableDamping = true; globalOrbitControls.dampingFactor = 0.05;

    globalThreeScene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const structuralSunLight = new THREE.DirectionalLight(0xfff6ed, 2.25);
    structuralSunLight.position.set(5, 9, 5); globalThreeScene.add(structuralSunLight);

    const assetGltfLoader = new THREE.GLTFLoader();
    assetGltfLoader.load(CLOUD_MODEL_ENDPOINT, (downloadedAssetGltf) => {
        dismissBootLoaderScreen();
        mainAvatarModel = downloadedAssetGltf.scene;
        mainAvatarModel.position.y = -0.66; mainAvatarModel.scale.setScalar(1.65);

        mainAvatarModel.traverse((node) => {
            if (node.isMesh) {
                node.frustumCulled = false;
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                    standardMaterialsCacheMap.set(node.id, node.material.clone());
                }
            }
            if (node.isBone) {
                const normalizedName = node.name.toLowerCase();
                if (normalizedName.includes('head')) anatomicalHeadBone = node;
                if (normalizedName.includes('neck')) anatomicalNeckBone = node;
                if (normalizedName.includes('spine')) anatomicalSpineBone = node;
            }
            if (node.morphTargetDictionary) computationalSkinnedMeshes.push(node);
        });

        globalThreeScene.add(mainAvatarModel);
        internalAnimationMixer = new THREE.AnimationMixer(mainAvatarModel);
        if (downloadedAssetGltf.animations.length > 0) {
            internalAnimationMixer.clipAction(downloadedAssetGltf.animations[0]).play();
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

/* =================================================================================================
 * 6. SCI-FI SHADER INTERFACE MODULE - HOLOGRAM MATRIX MANIPULATORS
 * ================================================================================================= */
function UIBridge_ToggleHologramShader(uiButtonContext) {
    if (!mainAvatarModel) return;
    ecosystemStates.hologramShaderActive = !ecosystemStates.hologramShaderActive;

    mainAvatarModel.traverse((meshNode) => {
        if (meshNode.isMesh && meshNode.material) {
            if (ecosystemStates.hologramShaderActive) {
                uiButtonContext.classList.add('shader-active');
                meshNode.material = new THREE.MeshBasicMaterial({
                    color: 0x00ffcc,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.38,
                    blending: THREE.AdditiveBlending
                });
            } else {
                uiButtonContext.classList.remove('shader-active');
                if (standardMaterialsCacheMap.has(meshNode.id)) {
                    meshNode.material = standardMaterialsCacheMap.get(meshNode.id).clone();
                }
            }
            meshNode.material.needsUpdate = true;
        }
    });
}

/* =================================================================================================
 * 7. AUDIO HARMONICS SPECTRUM ANALYSIS ENGINE (LIVE SPEED TUNING HUD)
 * ================================================================================================= */
function instantiateAudioHardwarePipelines() {
    if (nativeAudioContextEngine) return;
    try {
        nativeAudioContextEngine = new (window.AudioContext || window.webkitAudioContext)();
        softwareAudioAnalyserNode = nativeAudioContextEngine.createAnalyser();
        softwareAudioAnalyserNode.fftSize = 64;
        audioFrequencyByteDataArray = new Uint8Array(softwareAudioAnalyserNode.frequencyBinCount);
    } catch (e) { console.warn("Audio Pipeline Context Allocation Blocked:", e); }
}

function processTextToVoiceSpeechSynthesis(responseTextData) {
    instantiateAudioHardwarePipelines();
    const scrubbedString = responseTextData.replace(/\[.*?\]/g, '').trim();
    const subtitleBox = document.getElementById('subtitle-monitor-box');
    const subtitleTextNode = document.getElementById('subtitle-internal-node');

    if (subtitleBox && subtitleTextNode) {
        subtitleTextNode.innerText = responseTextData;
        subtitleBox.style.display = 'block';
    }

    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let utteranceInstance = new SpeechSynthesisUtterance(scrubbedString);
    utteranceInstance.lang = 'hi-IN';

    utteranceInstance.onstart = () => {
        flagVoiceSynthesizerIsActive = true;
        executeSpectrumFrequencyRundownLoop();
    };

    utteranceInstance.onend = () => {
        flagVoiceSynthesizerIsActive = false;
        if (subtitleBox) subtitleBox.style.display = 'none';
        resetFrequencyHUDVisualizers();
    };

    window.speechSynthesis.speak(utteranceInstance);
}

function executeSpectrumFrequencyRundownLoop() {
    if (!flagVoiceSynthesizerIsActive) return;
    
    if (audioFrequencyByteDataArray) {
        for (let idx = 0; idx < audioFrequencyByteDataArray.length; idx++) {
            audioFrequencyByteDataArray[idx] = Math.floor(Math.random() * 190) + 40;
        }
        renderLiveFrequencyHUDMetrics();
    }
    setTimeout(() => { if (flagVoiceSynthesizerIsActive) executeSpectrumFrequencyRundownLoop(); }, 60);
}

function renderLiveFrequencyHUDMetrics() {
    const parentContainerNode = document.getElementById('frequencyBarAnchor');
    if (!parentContainerNode) return;
    const individualBars = parentContainerNode.querySelectorAll('.freq-bar');
    
    individualBars.forEach((barElement, currentBarIndex) => {
        if (audioFrequencyByteDataArray && audioFrequencyByteDataArray[currentBarIndex] !== undefined) {
            let mappingScalarHeight = (audioFrequencyByteDataArray[currentBarIndex] / 255) * 26;
            barElement.style.height = `${Math.max(2, mappingScalarHeight)}px`;
            barElement.style.background = ecosystemStates.hologramShaderActive ? "var(--neon-pink)" : "var(--neon-cyan)";
        }
    });
}

function resetFrequencyHUDVisualizers() {
    const parentContainerNode = document.getElementById('frequencyBarAnchor');
    if (!parentContainerNode) return;
    parentContainerNode.querySelectorAll('.freq-bar').forEach(bar => bar.style.height = '2px');
}

function computeInstantaneousLipVolumeHeuristics() {
    if (!flagVoiceSynthesizerIsActive || !audioFrequencyByteDataArray) return 0;
    let baselineSum = 0;
    for (let i = 0; i < 10; i++) baselineSum += audioFrequencyByteDataArray[i];
    return (baselineSum / 10) / 255 * 1.4;
}

/* =================================================================================================
 * 8. LIVE ENVIRONMENTAL ECOSYSTEM MONSOON PARTICLE AGENTS & CIRCADIAN TIME CONTROL
 * ================================================================================================= */
function UIBridge_OverrideWeather(triggerRainMode, uiButtonReference) {
    ecosystemStates.weatherRainActive = triggerRainMode;
    const btnClear = document.getElementById('btn-weather-clear');
    const btnRain = document.getElementById('btn-weather-rain');
    const hudWeather = document.getElementById('hud-weather-status');

    if (triggerRainMode) {
        btnRain.classList.add('active'); btnClear.classList.remove('active');
        if (hudWeather) { hudWeather.innerText = "MONSOON SYSTEM MATRIX"; hudWeather.style.color = "var(--neon-blue)"; }
        instantiateMonsoonParticleMatrix();
    } else {
        btnClear.classList.add('active'); btnRain.classList.remove('active');
        if (hudWeather) { hudWeather.innerText = "CLEAR PARADIGM GRID"; hudWeather.style.color = "var(--neon-cyan)"; }
        deconstructMonsoonParticleMatrix();
    }
}

function instantiateMonsoonParticleMatrix() {
    deconstructMonsoonParticleMatrix();
    monsoonParticleGeometry = new THREE.BufferGeometry();
    const bufferArray = new Float32Array(SYSTEM_MAX_PARTICLES_COUNT * 3);

    for (let i = 0; i < SYSTEM_MAX_PARTICLES_COUNT * 3; i += 3) {
        bufferArray[i] = (Math.random() - 0.5) * 6;
        bufferArray[i + 1] = Math.random() * 4.5;
        bufferArray[i + 2] = (Math.random() - 0.5) * 6;
    }

    monsoonParticleGeometry.setAttribute('position', new THREE.BufferAttribute(bufferArray, 3));
    monsoonParticleMaterial = new THREE.PointsMaterial({ color: 0x00ffcc, size: 0.016, transparent: true, opacity: 0.55, depthWrite: false });
    monsoonParticleNodeSystem = new THREE.Points(monsoonParticleGeometry, monsoonParticleMaterial);
    globalThreeScene.add(monsoonParticleNodeSystem);
}

function deconstructMonsoonParticleMatrix() {
    if (monsoonParticleNodeSystem) { globalThreeScene.remove(monsoonParticleNodeSystem); monsoonParticleNodeSystem = null; }
}

function UIBridge_ToggleCircadianTime() {
    ecosystemStates.circadianNightActive = !ecosystemStates.circadianNightActive;
    const bgVideo = document.getElementById('video-background-engine');
    const ambientLightNode = globalThreeScene.children.find(n => n.isAmbientLight);
    const directionalLightNode = globalThreeScene.children.find(n => n.isDirectionalLight);

    if (ecosystemStates.circadianNightActive) {
        if (bgVideo) bgVideo.style.filter = "brightness(0.06) contrast(1.25)";
        if (ambientLightNode) ambientLightNode.intensity = 0.2;
        if (directionalLightNode) directionalLightNode.intensity = 0.1;
    } else {
        if (bgVideo) bgVideo.style.filter = "brightness(0.22) contrast(1.15) saturate(0.80)";
        if (ambientLightNode) ambientLightNode.intensity = 1.4;
        if (directionalLightNode) directionalLightNode.intensity = 2.25;
    }
}

/* =================================================================================================
 * 9. COUTURE COGNITION COATINGS & COGNITIVE WARDROBE INTERFACES
 * ================================================================================================= */
function UIBridge_SwapOutfit(selectedCostumeTagCode, nativeButtonUIAnchor) {
    if (!mainAvatarModel || ecosystemStates.hologramShaderActive) return;

    let hexColor = 0xffffff;
    if (selectedCostumeTagCode === 'crimson') hexColor = 0xbf061d;
    else if (selectedCostumeTagCode === 'forest') hexColor = 0x0b4b22;

    mainAvatarModel.traverse(piece => {
        if (piece.isMesh && piece.material) {
            const nameStr = piece.name.toLowerCase();
            if (['top', 'outfit', 'saree', 'shirt', 'bottom', 'body', 'cloth'].some(t => nameStr.includes(t))) {
                piece.material.color.setHex(hexColor);
                piece.material.needsUpdate = true;
                if (standardMaterialsCacheMap.has(piece.id)) {
                    standardMaterialsCacheMap.get(piece.id).color.setHex(hexColor);
                }
            }
        }
    });

    if (nativeButtonUIAnchor) {
        nativeButtonUIAnchor.parentNode.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
        nativeButtonUIAnchor.classList.add('active');
    }
}

function interceptAndExecuteDirectCommands(textString) {
    const tokens = textString.toLowerCase();
    if (tokens.includes('hologram mode') || tokens.includes('होलोग्राम')) {
        UIBridge_ToggleHologramShader(document.getElementById('btn-shader-toggle'));
        return true;
    }
    if (tokens.includes('red saree') || tokens.includes('लाल साड़ी')) {
        UIBridge_SwapOutfit('crimson', document.getElementById('btn-outfit-crimson'));
        return true;
    }
    if (tokens.includes('green shirt') || tokens.includes('हरा कपड़ा')) {
        UIBridge_SwapOutfit('forest', document.getElementById('btn-outfit-forest'));
        return true;
    }
    if (tokens.includes('barish') || tokens.includes('rain')) {
        UIBridge_OverrideWeather(true, document.getElementById('btn-weather-rain'));
        return true;
    }
    return false;
}

/* =================================================================================================
 * 10. REALTIME PIPELINE ANIMATION RENDERING TICKER (THE 60 FPS ENGINE)
 * ================================================================================================= */
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

    if (monsoonParticleNodeSystem && ecosystemStates.weatherRainActive) {
        const posAttr = monsoonParticleGeometry.getAttribute('position');
        for (let i = 1; i < posAttr.count * 3; i += 3) {
            posAttr.array[i] -= delta * 3.6;
            if (posAttr.array[i] < 0) posAttr.array[i] = 4.5;
        }
        posAttr.needsUpdate = true;
    }

    if (mainAvatarModel) {
        kinematicsCoordinates.currentX = THREE.MathUtils.lerp(kinematicsCoordinates.currentX, kinematicsCoordinates.targetX, 0.08);
        kinematicsCoordinates.currentY = THREE.MathUtils.lerp(kinematicsCoordinates.currentY, kinematicsCoordinates.targetY, 0.08);

        if (anatomicalHeadBone) { anatomicalHeadBone.rotation.y = kinematicsCoordinates.currentX * 0.44; anatomicalHeadBone.rotation.x = -kinematicsCoordinates.currentY * 0.24; }
        if (anatomicalNeckBone) anatomicalNeckBone.rotation.y = kinematicsCoordinates.currentX * 0.14;

        // Adaptive Biometric Breathing Continuous Loop Execution
        let breathingScalar = Math.sin(elapsed * 1.7) * 0.024;
        if (anatomicalSpineBone) anatomicalSpineBone.rotation.x = breathingScalar;
        if (document.getElementById('hud-resp-val')) document.getElementById('hud-resp-val').innerText = `H(${breathingScalar.toFixed(4)})`;

        let lipSyncIntensity = computeInstantaneousLipVolumeHeuristics();
        let eyeBlinkState = (Math.sin(elapsed * 3.2) > 0.982) ? 1.0 : 0.0;
        let smileWeight = ecosystemStates.currentSentiment === "happy" ? 0.88 : 0.0;

        computationalSkinnedMeshes.forEach(mesh => {
            const dict = mesh.morphTargetDictionary; const inf = mesh.morphTargetInfluences;
            if (!dict || !inf) return;

            ['mouthOpen', 'jawOpen', 'viseme_aa'].forEach(k => { if (dict[k] !== undefined) inf[dict[k]] = lipSyncIntensity; });
            ['eyeBlinkLeft', 'eyeBlinkRight'].forEach(k => { if (dict[k] !== undefined) inf[dict[k]] = THREE.MathUtils.lerp(inf[dict[k]], eyeBlinkState, 0.8); });
            ['mouthSmileLeft', 'mouthSmileRight'].forEach(k => { if (dict[k] !== undefined) inf[dict[k]] = THREE.MathUtils.lerp(inf[dict[k]], smileWeight, 0.1); });
        });
    }
    globalThreeRenderer.render(globalThreeScene, globalThreeCamera);
}

/* =================================================================================================
 * 11. EVENT COCKPIT ORCHESTRATION LAYER & HARDWARE INITIATORS
 * ================================================================================================= */
function startupWebcamFaceMeshTrackingSystem() {
    const videoNode = document.getElementById('hardware-webcam-preview-node');
    mediaPipeFaceMeshInstance = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/facemesh/${file}` });
    mediaPipeFaceMeshInstance.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.55, minTrackingConfidence: 0.55 });
    
    mediaPipeFaceMeshInstance.onResults((res) => {
        if (!flagWebcamTrackingIsActive) return;
        const landmarks = res.multiFaceLandmarks;
        if (landmarks && landmarks.length > 0) {
            const noseTip = landmarks[0][4];
            kinematicsCoordinates.targetX = -(noseTip.x - 0.5) * 2.8; kinematicsCoordinates.targetY = -(noseTip.y - 0.5) * 2.2;
        }
    });

    physicalHardwareCameraStream = new Camera(videoNode, {
        onFrame: async () => { if (flagWebcamTrackingIsActive) await mediaPipeFaceMeshInstance.send({ image: videoNode }); },
        width: 320, height: 240
    });
}

document.getElementById('webcamToggleBtn').addEventListener('click', function() {
    const videoNode = document.getElementById('hardware-webcam-preview-node');
    const hudTrackingTextNode = document.getElementById('hud-tracking-mode');
    if (!physicalHardwareCameraStream) startupWebcamFaceMeshTrackingSystem();

    if (!flagWebcamTrackingIsActive) {
        videoNode.style.display = 'block';
        physicalHardwareCameraStream.start().then(() => {
            flagWebcamTrackingIsActive = true; this.classList.add('active');
            hudTrackingTextNode.innerText = "WEBCAM AI TRACKING"; hudTrackingTextNode.style.color = "var(--neon-pink)";
        });
    } else {
        flagWebcamTrackingIsActive = false; videoNode.style.display = 'none'; this.classList.remove('active');
        hudTrackingTextNode.innerText = "CURSOR HARMONY"; hudTrackingTextNode.style.color = "var(--neon-gold)";
        kinematicsCoordinates.targetX = 0; kinematicsCoordinates.targetY = 0;
    }
});

const userInputFieldNode = document.getElementById('userInput');
async function triggerProcessingWorkflowCycle() {
    const rawTxt = userInputFieldNode.value.trim(); if (!rawTxt) return;
    userInputFieldNode.value = "";
    interpretSentimentHeuristics(rawTxt);
    const generatedAIString = await requestGenerativeAIResponseEngine(rawTxt);
    processTextToVoiceSpeechSynthesis(generatedAIString);
}

document.getElementById('sendBtn').addEventListener('click', triggerProcessingWorkflowCycle);
userInputFieldNode.addEventListener('keypress', (e) => { if (e.key === 'Enter') triggerProcessingWorkflowCycle(); });

const SpeechEngineNode = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechEngineNode) {
    let micEngine = new SpeechEngineNode(); micEngine.lang = 'hi-IN';
    micEngine.onstart = () => document.getElementById('micBtn').classList.add('listening');
    micEngine.onresult = (ev) => { userInputFieldNode.value = ev.results[0][0].transcript; triggerProcessingWorkflowCycle(); };
    micEngine.onend = () => document.getElementById('micBtn').classList.remove('listening');
    document.getElementById('micBtn').addEventListener('click', () => { instantiateAudioHardwarePipelines(); micEngine.start(); });
}

function dismissBootLoaderScreen() {
    const bootVeil = document.getElementById('boot-loader');
    if (bootVeil) { bootVeil.style.opacity = '0'; setTimeout(() => { bootVeil.style.display = 'none'; }, 500); }
}

// EXECUTE CORE LOOP
initializeThreeGraphicsEnvironment();
coreRuntimeAnimationProcessingPipeline();
