/**
 * PRIYA AI RE-ENGINEERED SOVEREIGN SYSTEM RUNTIME
 * HARDWARE LAYER - THREE.JS & CAMERA VISUAL SYSTEM
 */

const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const ELEVENLABS_API_TOKEN = "sk_7392a9b3c4d2e1f5a8b792340192eab4c7"; 
const CLOUD_MODEL_ENDPOINT = "https://cdn.jsdelivr.net/gh/jessearmy572-hub/naman3@main/model.glb";

let localWeatherConditionNode = "CLEAR";
let currentAtmosphericTimeCode = "DAY";
let activeParticleSystemGroup = null;

let kinematicsCoordinates = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
let webcamStreamElement = null, cameraHardwareUtilsInstance = null, isWebcamPipelineRunning = false;
let speechRecognitionEngineInstance = null, isSpeechRecognitionActive = false;

let activeSentimentProfileNode = { mouthSmileLeft: 0, mouthSmileRight: 0, browDownLeft: 0, browDownRight: 0, browInnerUp: 0 };

const hardwareBootTimeoutBypass = setTimeout(function() { dismissBootLoaderScreen(); }, 4000);

function initializeThreeGraphicsEnvironment() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    systemsClockEngine = new THREE.Clock();
    globalThreeScene = new THREE.Scene();

    globalThreeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    globalThreeRenderer.setSize(window.innerWidth, window.innerHeight);
    globalThreeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globalThreeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(globalThreeRenderer.domElement);

    globalThreeCamera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    globalThreeCamera.position.set(0, 0.3, 1.85);

    globalOrbitControls = new THREE.OrbitControls(globalThreeCamera, globalThreeRenderer.domElement);
    globalOrbitControls.enablePan = false; globalOrbitControls.target.set(0, 0.18, 0);
    globalOrbitControls.enableDamping = true;

    globalThreeScene.add(new THREE.HemisphereLight(0xffffff, 0xcce6ff, 1.4));
    const solarLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    solarLight.position.set(2, 4, 3); globalThreeScene.add(solarLight);

    const gltfAssetLoader = new THREE.GLTFLoader();
    gltfAssetLoader.load(CLOUD_MODEL_ENDPOINT, function(gltf) {
        clearTimeout(hardwareBootTimeoutBypass); dismissBootLoaderScreen();
        mainAvatarModel = gltf.scene; mainAvatarModel.position.y = -0.68; mainAvatarModel.scale.setScalar(1.5);

        mainAvatarModel.traverse(function(node) {
            if (node.isMesh) {
                node.frustumCulled = false;
                if (node.material) node.material.side = THREE.DoubleSide;
            }
            if (node.isBone) {
                let boneIdent = node.name.toLowerCase();
                if (boneIdent.includes('head')) anatomicalHeadBone = node;
                if (boneIdent.includes('neck')) anatomicalNeckBone = node;
            }
            if (node.morphTargetDictionary) computationalSkinnedMeshes.push(node);
        });
        globalThreeScene.add(mainAvatarModel);
        internalAnimationMixer = new THREE.AnimationMixer(mainAvatarModel);
        if (gltf.animations && gltf.animations.length > 0) internalAnimationMixer.clipAction(gltf.animations[0]).play();
    }, null, function(e){ dismissBootLoaderScreen(); });

    window.addEventListener('resize', function() {
        if (!globalThreeCamera || !globalThreeRenderer) return;
        globalThreeCamera.aspect = window.innerWidth / window.innerHeight; globalThreeCamera.updateProjectionMatrix();
        globalThreeRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', function(e) {
        if (!isWebcamPipelineRunning) {
            kinematicsCoordinates.targetX = (e.clientX / window.innerWidth) * 2 - 1;
            kinematicsCoordinates.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        }
    });
}

function UIBridge_SwapOutfit(tag, interfaceButtonElement) {
    if (!mainAvatarModel) return;
    let computedMaterialColor = 0xffffff;
    if (tag === 'crimson') computedMaterialColor = 0xbf061d;
    else if (tag === 'emerald') computedMaterialColor = 0x0a5c36;

    const controlGroupButtons = document.querySelectorAll('.dock-btn');
    controlGroupButtons.forEach(function(b) { b.classList.remove('active'); });
    if (interfaceButtonElement) interfaceButtonElement.classList.add('active');

    mainAvatarModel.traverse(function(childMeshNode) {
        if (childMeshNode.isMesh && childMeshNode.material) {
            let identityString = childMeshNode.name.toLowerCase();
            if (['top', 'outfit', 'saree', 'shirt', 'mesh', 'clothes'].some(function(t) { return identityString.includes(t); })) {
                childMeshNode.material.color.setHex(computedMaterialColor); childMeshNode.material.needsUpdate = true;
            }
        }
    });
}

function Vision_InitializeHardwarePipeline() {
    webcamStreamElement = document.getElementById('webcam-capture-node');
    if (!window.FaceMesh) return;
    
    const faceMesh = new FaceMesh({ locateFile: function(file) { return "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" + file; } });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
    faceMesh.onResults(function(results) {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
        const noseNode = results.multiFaceLandmarks[0][4];
        kinematicsCoordinates.targetX = THREE.MathUtils.clamp((noseNode.x - 0.5) * -2.2, -0.8, 0.8);
        kinematicsCoordinates.targetY = THREE.MathUtils.clamp((noseNode.y - 0.5) * -1.8, -0.5, 0.5);
    });

    if (window.Camera) {
        cameraHardwareUtilsInstance = new Camera(webcamStreamElement, {
            onFrame: async function() { if(isWebcamPipelineRunning) await faceMesh.send({ image: webcamStreamElement }); },
            width: 320, height: 240
        });
    }
}

function Vision_ToggleWebcamHardwarePipeline() {
    const btn = document.getElementById('btn-cam-toggle');
    const statusVal = document.getElementById('hud-vision-status');
    if (!isWebcamPipelineRunning) {
        isWebcamPipelineRunning = true;
        if(btn) { btn.innerText = "🛑 Stop Tracking"; btn.classList.add('active'); }
        if(statusVal) { statusVal.innerText = "ACTIVE"; statusVal.style.color = "var(--matrix-green)"; }
        webcamStreamElement.style.display = "block";
        cameraHardwareUtilsInstance.start().catch(function(){ Vision_ToggleWebcamHardwarePipeline(); });
    } else {
        isWebcamPipelineRunning = false;
        if(btn) { btn.innerText = "📷 Enable Eye Tracking"; btn.classList.remove('active'); }
        if(statusVal) { statusVal.innerText = "OFFLINE"; statusVal.style.color = "var(--neon-pink)"; }
        webcamStreamElement.style.display = "none";
        kinematicsCoordinates.targetX = 0; kinematicsCoordinates.targetY = 0;
    }
}

function Audio_DispatchVoiceSynthesisRouter(responseText) {
    const box = document.getElementById('subtitle-monitor-box');
    const node = document.getElementById('subtitle-internal-node');
    if (box && node) { node.innerText = responseText; box.style.display = 'block'; }

    const isElevenLabsEnabled = document.getElementById('elevenLabsToggle') ? document.getElementById('elevenLabsToggle').checked : false;
    if (isElevenLabsEnabled) {
        fetch("https://api.elevenlabs.io/v1/text-to-speech/" + ELEVENLABS_VOICE_ID + "/stream", {
            method: "POST", headers: { "Content-Type": "application/json", "xi-api-key": ELEVENLABS_API_TOKEN },
            body: JSON.stringify({ text: responseText, model_id: "eleven_multilingual_v2" })
        }).then(function(r){ return r.blob(); }).then(function(blob){
            let p = new Audio(URL.createObjectURL(blob));
            p.onplay = function(){ flagVoiceSynthesizerIsActive = true; };
            p.onended = function(){ flagVoiceSynthesizerIsActive = false; if(box) box.style.display='none'; }; p.play();
        }).catch(function(){ Audio_ExecuteNativeSpeech(responseText); });
    } else {
        Audio_ExecuteNativeSpeech(responseText);
    }
}

function Audio_ExecuteNativeSpeech(text) {
    if (!window.speechSynthesis) return; window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(text); u.lang = 'hi-IN'; u.pitch = 1.1;
    u.onstart = function(){ flagVoiceSynthesizerIsActive = true; };
    u.onend = function(){ flagVoiceSynthesizerIsActive = false; const box = document.getElementById('subtitle-monitor-box'); if(box) box.style.display='none'; };
    window.speechSynthesis.speak(u);
}

function Audio_ToggleSpeechRecognitionInterface() {
    const micButton = document.getElementById('micBtn');
    if (!('webkitSpeechRecognition' in window)) return;
    if (!speechRecognitionEngineInstance) {
        speechRecognitionEngineInstance = new webkitSpeechRecognition();
        speechRecognitionEngineInstance.lang = 'hi-IN';
        speechRecognitionEngineInstance.onstart = function() { isSpeechRecognitionActive = true; if(micButton) micButton.classList.add('recording'); };
        speechRecognitionEngineInstance.onresult = function(e) {
            const t = e.results[0][0].transcript;
            if (document.getElementById('userInput')) { document.getElementById('userInput').value = t; triggerProcessingWorkflowCycle(); }
        };
        speechRecognitionEngineInstance.onend = function() { isSpeechRecognitionActive = false; if(micButton) micButton.classList.remove('recording'); };
    }
    if (!isSpeechRecognitionActive) speechRecognitionEngineInstance.start();
    else speechRecognitionEngineInstance.stop();
}

function coreRuntimeAnimationProcessingPipeline() {
    requestAnimationFrame(coreRuntimeAnimationProcessingPipeline);
    if (!globalThreeRenderer || !globalThreeScene || !globalThreeCamera) return;

    const delta = systemsClockEngine ? systemsClockEngine.getDelta() : 0.016;
    const elapsed = systemsClockEngine ? systemsClockEngine.getElapsedTime() : Date.now() * 0.001;

    profilingFramesCount++;
    if (elapsed > operationalLastTimestamp + 1.0) {
        if (document.getElementById('hud-fps-val')) document.getElementById('hud-fps-val').innerText = profilingFramesCount + " FPS";
        profilingFramesCount = 0; operationalLastTimestamp = elapsed;
    }

    if (internalAnimationMixer) internalAnimationMixer.update(delta);
    if (globalOrbitControls) globalOrbitControls.update();

    if (mainAvatarModel) {
        kinematicsCoordinates.currentX = THREE.MathUtils.lerp(kinematicsCoordinates.currentX, kinematicsCoordinates.targetX, 0.08);
        kinematicsCoordinates.currentY = THREE.MathUtils.lerp(kinematicsCoordinates.currentY, kinematicsCoordinates.targetY, 0.08);
        if (anatomicalHeadBone) { anatomicalHeadBone.rotation.y = kinematicsCoordinates.currentX * 0.42; anatomicalHeadBone.rotation.x = -kinematicsCoordinates.currentY * 0.22; }

        let lip = (flagVoiceSynthesizerIsActive) ? (0.15 + Math.sin(elapsed * 22) * 0.45) : 0;
        let blink = (Math.sin(elapsed * 2.8) > 0.98) ? 1.0 : 0.0;

        computationalSkinnedMeshes.forEach(function(mesh) {
            const d = mesh.morphTargetDictionary, inf = mesh.morphTargetInfluences; if (!d || !inf) return;
            ['mouthOpen', 'jawOpen', 'viseme_aa'].forEach(function(k) { if (d[k] !== undefined) inf[d[k]] = lip; });
            ['eyeBlinkLeft', 'eyeBlinkRight'].forEach(function(k) { if (d[k] !== undefined) inf[d[k]] = THREE.MathUtils.lerp(inf[d[k]], blink, 0.7); });
            ['mouthSmileLeft', 'mouthSmileRight'].forEach(function(k) { if (d[k] !== undefined) inf[d[k]] = THREE.MathUtils.lerp(inf[d[k]], activeSentimentProfileNode.mouthSmileLeft, 0.1); });
        });
    }
    globalThreeRenderer.render(globalThreeScene, globalThreeCamera);
}

function triggerProcessingWorkflowCycle() {
    const input = document.getElementById('userInput'); if (!input) return;
    const txt = input.value.trim(); if (!txt) return; input.value = "";
    
    const lower = txt.toLowerCase();
    if(lower.includes("saree") || lower.includes("dress") || lower.includes("kapde")) {
        if(lower.includes("laal") || lower.includes("red")) { UIBridge_SwapOutfit('crimson', document.getElementById('btn-outfit-crimson')); Audio_DispatchVoiceSynthesisRouter("Haan ji babu, maine laal saree pehn li."); return; }
        if(lower.includes("green") || lower.includes("hari")) { UIBridge_SwapOutfit('emerald', document.getElementById('btn-outfit-emerald')); Audio_DispatchVoiceSynthesisRouter("Maine green dress pehn li hai."); return; }
    }

    if (window.requestGenerativeAIResponseEngine) {
        requestGenerativeAIResponseEngine(txt).then(function(reply) {
            if (window.Sentiment_AnalyzeResponseVector) Sentiment_AnalyzeResponseVector(reply);
            Audio_DispatchVoiceSynthesisRouter(reply);
        });
    }
}

function dismissBootLoaderScreen() {
    const veil = document.getElementById('boot-loader');
    if (veil) { veil.style.opacity = '0'; setTimeout(function() { veil.style.display = 'none'; }, 500); }
}

window.addEventListener('DOMContentLoaded', function() {
    initializeThreeGraphicsEnvironment();
    coreRuntimeAnimationProcessingPipeline();
    Vision_InitializeHardwarePipeline();
    setTimeout(function(){ if(window.Cloud_InitializeGoogleClientPipelines) Cloud_InitializeGoogleClientPipelines(); }, 1500);
    
    if(document.getElementById('sendBtn')) document.getElementById('sendBtn').addEventListener('click', triggerProcessingWorkflowCycle);
    if(document.getElementById('userInput')) document.getElementById('userInput').addEventListener('keypress', function(e){ if(e.key==='Enter') triggerProcessingWorkflowCycle(); });
});
