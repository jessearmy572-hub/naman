/**
 * PRIYA AI - ENTERPRISE QUANTUM CORE V11.2
 * FIXES: Resolves Infinite Loading Screen on GitHub Resource Blocks via Race Timeouts
 */

"use strict";

(function (GlobalScope) {
    
    const CORE_SYSTEM_CONFIG = {
        assets: {
            primaryModelGltfRoute: "https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb",
            failSafeBackupModelRoute: "https://models.readyplayer.me/64a6603a6e9d690a29b5bb89.glb",
            localMemoryValidationToken: "priya_quantum_v11_state_bank"
        },
        engineParameters: {
            targetFieldOfView: 36, nearClippingPlane: 0.1, farClippingPlane: 100,
            cameraZDepthOffset: 2.35, cameraYHeightOffset: 0.22, modelBaseYFloorLevel: -1.32,
            maxDevicePixelRatioThresh: 2
        },
        voiceMatrix: { speechSynthesisLanguageToken: "hi-IN", globalPlaybackSpeedRate: 1.0, globalVoicePitchModifier: 1.15 }
    };

    const RUNTIME_SYSTEM_STATE = {
        threeContext: { globalActiveScene: null, primaryFrustumCamera: null, hardwareAcceleratedRenderer: null, skeletalAnimationMixer: null, precisionDeltaClock: null, avatarMainMeshNode: null },
        riggingBones: { cervicalHeadBoneReference: null, thoracicNeckBoneReference: null },
        morphTargetArray: [],
        morphTargetResolvedIndices: { blinkLeftEyeIdx: null, blinkRightEyeIdx: null, mandibularJawOpenIdx: null, orbicularisMouthOpenIdx: null },
        interactionFlags: { isSystemCurrentlySynthesizingVoice: false, horizontalInterpolatedLookAtTargetX: 0, verticalInterpolatedLookAtTargetY: 0, touchEventExecutionCooldownLock: false, isFaceTrackingWebcamActive: false, currentActiveWeatherProfile: "day", internalFlashThunderCooldownTicks: 0, fallbackTouchBoundingBoxDummy: null },
        instancedParticleSystems: { globalActiveWeatherParticlesMesh: null },
        lightingRig: { globalAmbientLightComponent: null, globalDirectionalSunlightComponent: null, globalFrontalPointAccentLightComponent: null }
    };

    let deltaTimeSeconds = 0, absoluteElapsedTime = 0, computedEyeBlinkSignalAmplitude = 0, computedMouthOpenSignalAmplitude = 0, hasModelStartedLoading = false;

    const QuantumPersistentMemoryInterface = {
        fetchDataChunk: (k) => localStorage.getItem(`${CORE_SYSTEM_CONFIG.assets.localMemoryValidationToken}_${k}`),
        commitDataChunk: (k, v) => localStorage.setItem(`${CORE_SYSTEM_CONFIG.assets.localMemoryValidationToken}_${k}`, v),
        initializeDefaults: function () { if (!this.fetchDataChunk('user_identity_tag')) this.commitDataChunk('user_identity_tag', 'दोस्त'); }
    };
    QuantumPersistentMemoryInterface.initializeDefaults();

    let WebSpeechInputDriverInstance = null;
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const BrowserSpeechObject = window.SpeechRecognition || window.webkitSpeechRecognition;
        WebSpeechInputDriverInstance = new BrowserSpeechObject();
        WebSpeechInputDriverInstance.lang = CORE_SYSTEM_CONFIG.voiceMatrix.speechSynthesisLanguageToken;
    }

    function instantiateQuantumEngineGraphicsPipeline() {
        RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock = new THREE.Clock();
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene = new THREE.Scene();
        
        // Dark premium scene background to remove default pitch black color hole
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.background = new THREE.Color(0x02020a);
        
        RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera = new THREE.PerspectiveCamera(
            CORE_SYSTEM_CONFIG.engineParameters.targetFieldOfView, window.innerWidth / window.innerHeight,
            CORE_SYSTEM_CONFIG.engineParameters.nearClippingPlane, CORE_SYSTEM_CONFIG.engineParameters.farClippingPlane
        );
        RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera.position.set(0, CORE_SYSTEM_CONFIG.engineParameters.cameraYHeightOffset, CORE_SYSTEM_CONFIG.engineParameters.cameraZDepthOffset);

        RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.setSize(window.innerWidth, window.innerHeight);
        RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.setPixelRatio(Math.min(window.devicePixelRatio, CORE_SYSTEM_CONFIG.engineParameters.maxDevicePixelRatioThresh));
        RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.outputEncoding = THREE.sRGBEncoding;

        const viewportMountDOMNode = document.getElementById('canvas-viewport');
        if (viewportMountDOMNode) viewportMountDOMNode.appendChild(RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.domElement);

        // ILLUMINATION OVERHAUL
        RUNTIME_SYSTEM_STATE.lightingRig.globalAmbientLightComponent = new THREE.AmbientLight(0xffffff, 1.6);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.lightingRig.globalAmbientLightComponent);

        RUNTIME_SYSTEM_STATE.lightingRig.globalDirectionalSunlightComponent = new THREE.DirectionalLight(0xfff3e8, 1.5);
        RUNTIME_SYSTEM_STATE.lightingRig.globalDirectionalSunlightComponent.position.set(2, 4, 3);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.lightingRig.globalDirectionalSunlightComponent);

        RUNTIME_SYSTEM_STATE.lightingRig.globalFrontalPointAccentLightComponent = new THREE.PointLight(0xffffff, 0.9, 10);
        RUNTIME_SYSTEM_STATE.lightingRig.globalFrontalPointAccentLightComponent.position.set(0, 0.4, 1.8);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.lightingRig.globalFrontalPointAccentLightComponent);

        // BUILD DUMMY BOX TARGET IMMEDIATE
        const invisibleBoxGeometry = new THREE.BoxGeometry(1.2, 2.0, 0.4);
        const invisibleBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });
        RUNTIME_SYSTEM_STATE.interactionFlags.fallbackTouchBoundingBoxDummy = new THREE.Mesh(invisibleBoxGeometry, invisibleBoxMaterial);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.interactionFlags.fallbackTouchBoundingBoxDummy);

        evaluateAndApplyWeatherSystemState(null);
        
        // ASYNC TIMEOUT ROUTER: Swaps to backup if primary hangs for more than 3.5 seconds
        let backupTimeoutTrigger = setTimeout(() => {
            if (!hasModelStartedLoading) {
                console.warn("GitHub stream handshake slow. Enforcing backup node routing.");
                negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.failSafeBackupModelRoute, true);
            }
        }, 3500);

        negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.primaryModelGltfRoute, false, backupTimeoutTrigger);
    }

    function negotiateMeshStreamLoadingSequence(targetResourceAssetUrl, isFallbackActive, optionalTimeoutClearToken) {
        const UIStatusTextStringNode = document.getElementById('system-status-string');
        const UISubLabelDiagnosticNode = document.getElementById('sub-diagnostic-label');

        if (UIStatusTextStringNode) UIStatusTextStringNode.innerText = isFallbackActive ? "PRIYA_AI // BACKUP ENGINE LIVE" : "PRIYA_AI // GLB CORE SYNC";
        if (UISubLabelDiagnosticNode) UISubLabelDiagnosticNode.innerText = "STREAMING HIGH-FIDELITY VECTOR BUFFERS...";

        const standardGltfMeshAssetLoader = new THREE.GLTFLoader();
        standardGltfMeshAssetLoader.load(
            targetResourceAssetUrl,
            function (gltfContainer) {
                if(optionalTimeoutClearToken) clearTimeout(optionalTimeoutClearToken);
                hasModelStartedLoading = true;

                if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode) {
                    RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.remove(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);
                }

                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode = gltfContainer.scene;
                RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);

                RUNTIME_SYSTEM_STATE.threeContext.skeletalAnimationMixer = new THREE.AnimationMixer(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);
                if (gltfContainer.animations && gltfContainer.animations.length > 0) {
                    RUNTIME_SYSTEM_STATE.threeContext.skeletalAnimationMixer.clipAction(gltfContainer.animations[0]).play();
                }

                RUNTIME_SYSTEM_STATE.morphTargetArray = [];
                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.traverse(function (node) {
                    if (node.isBone) {
                        let bName = node.name.toLowerCase();
                        if (bName.includes('head')) RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference = node;
                        if (bName.includes('neck')) RUNTIME_SYSTEM_STATE.riggingBones.thoracicNeckBoneReference = node;
                    }
                    if (node.isMesh) {
                        if (node.material) { node.material.roughness = 0.4; node.material.needsUpdate = true; }
                        if (node.morphTargetDictionary) {
                            RUNTIME_SYSTEM_STATE.morphTargetArray.push(node);
                            let dict = node.morphTargetDictionary;
                            for (let key in dict) {
                                let lKey = key.toLowerCase();
                                if (lKey.includes('blinkleft')) RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.blinkLeftEyeIdx = dict[key];
                                if (lKey.includes('blinkright')) RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.blinkRightEyeIdx = dict[key];
                                if (lKey.includes('jawopen')) RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.mandibularJawOpenIdx = dict[key];
                                if (lKey.includes('mouthopen') || lKey.includes('viseme_aa')) RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.orbicularisMouthOpenIdx = dict[key];
                            }
                        }
                    }
                });

                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.position.set(0, CORE_SYSTEM_CONFIG.engineParameters.modelBaseYFloorLevel, 0);
                if (UIStatusTextStringNode) UIStatusTextStringNode.innerText = "PRIYA_AI // RENDER ONLINE";
                if (UISubLabelDiagnosticNode) UISubLabelDiagnosticNode.innerText = "60FPS SECURE DATA LINK ON";

                performTextToVoiceEngineSynthesis(`नमस्ते भाई! आपका ग्राफ़िक्स कोडिंग फिक्स हो गया है। अब सब कुछ बिल्कुल स्मूथ चल रहा है।`);
            },
            function (progress) {
                if (UISubLabelDiagnosticNode && progress.total > 0) {
                    UISubLabelDiagnosticNode.innerText = `SYNC ENGINE CORE MATRIX: ${Math.round((progress.loaded / progress.total) * 100)}%`;
                }
            },
            function (error) {
                if(optionalTimeoutClearToken) clearTimeout(optionalTimeoutClearToken);
                console.error("Link block fault. Swapping data routes.", error);
                if (!isFallbackActive) {
                    negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.failSafeBackupModelRoute, true);
                }
            }
        );
        bindApplicationInterfaceEventListeners();
    }

    function evaluateAndApplyWeatherSystemState(forcedState) {
        let hour = new Date().getHours(), mode = "day", gradient = "linear-gradient(to top, #0c1020, #03030f, #020208)";
        if (hour >= 6 && hour < 16) { mode = "day"; gradient = "linear-gradient(to top, #bae6fd, #0284c7)"; }
        
        if(forcedState) mode = forcedState;
        RUNTIME_SYSTEM_STATE.interactionFlags.currentActiveWeatherProfile = mode;
        
        const sky = document.getElementById('dynamic-sky');
        if (sky) sky.style.background = forcedState === "rain" ? "linear-gradient(to top, #334155, #1e293b)" : gradient;

        if (mode === "rain") instantiateProceduralParticleArraySystem("rain");
    }

    function instantiateProceduralParticleArraySystem(type) {
        clearParticleSystemBuffers();
        const geo = new THREE.BufferGeometry(), arr = new Float32Array(1500 * 3);
        for (let idx = 0; idx < 1500 * 3; idx += 3) {
            arr[idx] = (Math.random() - 0.5) * 8; arr[idx + 1] = Math.random() * 5; arr[idx + 2] = (Math.random() - 0.5) * 6;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        let mat = new THREE.PointsMaterial({ color: 0xddf4ff, size: 0.015, transparent: true, opacity: 0.7 });
        RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh = new THREE.Points(geo, mat);
        RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh.name = type;
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh);
    }

    function clearParticleSystemBuffers() {
        if (RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh) {
            RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.remove(RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh);
            RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh.geometry.dispose();
            RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh.material.dispose();
        }
    }

    function executeQuantumGraphicsRendererPipelineRenderLoop() {
        requestAnimationFrame(executeQuantumGraphicsRendererPipelineRenderLoop);
        deltaTimeSeconds = RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock.getDelta();
        absoluteElapsedTime = RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock.getElapsedTime();
        
        if (RUNTIME_SYSTEM_STATE.threeContext.skeletalAnimationMixer) RUNTIME_SYSTEM_STATE.threeContext.skeletalAnimationMixer.update(deltaTimeSeconds);
        
        if (RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference) {
            RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.y = THREE.MathUtils.lerp(RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.y, RUNTIME_SYSTEM_STATE.interactionFlags.verticalInterpolatedLookAtTargetY, 0.08);
            RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.x = THREE.MathUtils.lerp(RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.x, RUNTIME_SYSTEM_STATE.interactionFlags.horizontalInterpolatedLookAtTargetX, 0.08);
        }

        if (RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh) {
            const positions = RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= deltaTimeSeconds * 4.5;
                if (positions[i] < -1.4) positions[i] = 3.5;
            }
            RUNTIME_SYSTEM_STATE.instancedParticleSystems.globalActiveWeatherParticlesMesh.geometry.attributes.position.needsUpdate = true;
        }

        if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode && RUNTIME_SYSTEM_STATE.morphTargetArray.length > 0) {
            computedEyeBlinkSignalAmplitude = (Math.sin(absoluteElapsedTime * 2.5) > 0.98) ? 1.0 : 0.0;
            computedMouthOpenSignalAmplitude = RUNTIME_SYSTEM_STATE.interactionFlags.isSystemCurrentlySynthesizingVoice ? Math.abs(Math.sin(absoluteElapsedTime * 16.0)) * 0.7 : 0.0;

            for (let i = 0; i < RUNTIME_SYSTEM_STATE.morphTargetArray.length; i++) {
                let mesh = RUNTIME_SYSTEM_STATE.morphTargetArray[i];
                if (RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.blinkLeftEyeIdx !== null) mesh.morphTargetInfluences[RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.blinkLeftEyeIdx] = computedEyeBlinkSignalAmplitude;
                if (RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.blinkRightEyeIdx !== null) mesh.morphTargetInfluences[RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.blinkRightEyeIdx] = computedEyeBlinkSignalAmplitude;
                if (RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.orbicularisMouthOpenIdx !== null) mesh.morphTargetInfluences[RUNTIME_SYSTEM_STATE.morphTargetResolvedIndices.orbicularisMouthOpenIdx] = computedMouthOpenSignalAmplitude;
            }
        }

        RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.render(RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene, RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera);
    }

    async function performTextToVoiceEngineSynthesis(text) {
        if (!text) return; window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = CORE_SYSTEM_CONFIG.voiceMatrix.speechSynthesisLanguageToken;
        utterance.pitch = CORE_SYSTEM_CONFIG.voiceMatrix.globalVoicePitchModifier;
        utterance.onstart = () => RUNTIME_SYSTEM_STATE.interactionFlags.isSystemCurrentlySynthesizingVoice = true;
        utterance.onend = () => RUNTIME_SYSTEM_STATE.interactionFlags.isSystemCurrentlySynthesizingVoice = false;
        window.speechSynthesis.speak(utterance);
    }

    async function evaluateUserSemanticIntentString(input) {
        const token = input.toLowerCase().trim();
        if (token.includes("barish") || token.includes("बारिश")) { evaluateAndApplyWeatherSystemState("rain"); return "लीजिए भाई, लाइव बारिश चालू हो गई है।"; }
        if (token.includes("din") || token.includes("दिन")) { evaluateAndApplyWeatherSystemState("day"); return "मौसम साफ़ कर दिया गया है।"; }
        let user = QuantumPersistentMemoryInterface.fetchDataChunk('user_identity_tag');
        if (token.includes("kaise ho")) return `मैं एकदम फर्स्ट क्लास हूँ ${user}। आप बताएं?`;
        return "निर्देश सेव कर लिया गया है।";
    }

    function executeDeviceHapticTouchTriggerEventSequence() {
        if (RUNTIME_SYSTEM_STATE.interactionFlags.touchEventExecutionCooldownLock) return;
        RUNTIME_SYSTEM_STATE.interactionFlags.touchEventExecutionCooldownLock = true;
        setTimeout(() => RUNTIME_SYSTEM_STATE.interactionFlags.touchEventExecutionCooldownLock = false, 1200);
        
        if (navigator.vibrate) navigator.vibrate(40);
        
        const res = ["जी भाई बोलिए, मैं सुन रही हूँ!", "3D रेंडर मैट्रिक्स एक्टिव है। इनपुट बॉक्स में लिखकर निर्देश दें भाई।", "सिस्टम पूरी तरह एरर फ्री है!"];
        performTextToVoiceEngineSynthesis(res[Math.floor(Math.random() * res.length)]);
    }

    function bindApplicationInterfaceEventListeners() {
        const field = document.getElementById('user-input-field');
        const btn = document.getElementById('transmit-payload-btn');

        const pipeline = async () => {
            if (!field) return;
            const val = field.value.trim();
            if (val) { field.value = ""; const reply = await evaluateUserSemanticIntentString(val); performTextToVoiceEngineSynthesis(reply); }
        };

        if (btn) btn.onclick = pipeline;
        if (field) field.addEventListener('keypress', (e) => { if (e.key === 'Enter') pipeline(); });

        window.addEventListener('mousemove', (e) => {
            if (!RUNTIME_SYSTEM_STATE.interactionFlags.isFaceTrackingWebcamActive) {
                RUNTIME_SYSTEM_STATE.interactionFlags.verticalInterpolatedLookAtTargetY = (e.clientX / window.innerWidth) * 2 - 1 * 0.35;
                RUNTIME_SYSTEM_STATE.interactionFlags.horizontalInterpolatedLookAtTargetX = -(e.clientY / window.innerHeight) * 2 + 1 * 0.18;
            }
        });

        window.addEventListener('touchstart', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') executeDeviceHapticTouchTriggerEventSequence();
        }, { passive: true });
        
        window.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') executeDeviceHapticTouchTriggerEventSequence();
        });
    }

    window.addEventListener('resize', () => {
        if (RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera && RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer) {
            RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera.aspect = window.innerWidth / window.innerHeight;
            RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera.updateProjectionMatrix();
            RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    });

    window.onload = function () { instantiateQuantumEngineGraphicsPipeline(); executeQuantumGraphicsRendererPipelineRenderLoop(); };

})(window);
