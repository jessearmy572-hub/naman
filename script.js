/**
 * PROJECT REFERENCE MATRIX ID: a1
 * STEP 1 UPDATE: NATURAL FULL-BODY BIOMETRIC BREATHING & SWAY ENGINE
 */

"use strict";

(function (GlobalScope) {
    
    const CORE_SYSTEM_CONFIG = {
        assets: {
            primaryModelGltfRoute: "https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb",
            failSafeBackupModelRoute: "https://models.readyplayer.me/64a6603a6e9d690a29b5bb89.glb",
            localMemoryValidationToken: "project_a1_data_bank"
        },
        engineParameters: {
            targetFieldOfView: 35, nearClippingPlane: 0.1, farClippingPlane: 100,
            cameraZDepthOffset: 1.95, cameraYHeightOffset: 0.45, modelBaseYFloorLevel: -1.38,
            maxDevicePixelRatioThresh: 2
        },
        constraints: {
            maxYawRotationLimit: 0.38,    
            maxPitchRotationLimit: 0.22,  
            interpolationLerpSpeed: 0.06  // स्मूथ स्प्रिंग मूवमेंट के लिए
        },
        voiceMatrix: { speechSynthesisLanguageToken: "hi-IN", globalVoicePitchModifier: 1.15 }
    };

    const RUNTIME_SYSTEM_STATE = {
        threeContext: { globalActiveScene: null, primaryFrustumCamera: null, hardwareAcceleratedRenderer: null, precisionDeltaClock: null, avatarMainMeshNode: null },
        riggingBones: { 
            cervicalHeadBoneReference: null, 
            thoracicNeckBoneReference: null,
            spineUpperBoneReference: null,       // upper chest bone
            spineMidBoneReference: null          // mid torso bone
        },
        morphTargetArray: [],
        morphTargetResolvedIndices: { blinkLeftEyeIdx: null, blinkRightEyeIdx: null, mandibularJawOpenIdx: null, orbicularisMouthOpenIdx: null },
        interactionFlags: { 
            isSystemCurrentlySynthesizingVoice: false, 
            targetLookAtX: 0, targetLookAtY: 0, 
            currentLookAtX: 0, currentLookAtY: 0,
            touchEventExecutionCooldownLock: false
        }
    };

    let deltaTimeSeconds = 0, absoluteElapsedTime = 0, computedEyeBlinkSignalAmplitude = 0, computedMouthOpenSignalAmplitude = 0;

    function instantiateQuantumEngineGraphicsPipeline() {
        RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock = new THREE.Clock();
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene = new THREE.Scene();
        
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

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(ambientLight);

        const studioKeySun = new THREE.DirectionalLight(0xfff5ea, 1.5);
        studioKeySun.position.set(1.5, 3.5, 2.5);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(studioKeySun);

        const softFrontalFill = new THREE.PointLight(0xffffff, 0.6, 8);
        softFrontalFill.position.set(0, 0.4, 1.8);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(softFrontalFill);

        negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.primaryModelGltfRoute);
    }

    function negotiateMeshStreamLoadingSequence(targetResourceAssetUrl) {
        const UIStatusTextStringNode = document.getElementById('system-status-string');
        const UISubLabelDiagnosticNode = document.getElementById('sub-diagnostic-label');

        const standardGltfMeshAssetLoader = new THREE.GLTFLoader();
        standardGltfMeshAssetLoader.load(
            targetResourceAssetUrl,
            function (gltfContainer) {
                if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode) {
                    RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.remove(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);
                }

                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode = gltfContainer.scene;
                RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);

                RUNTIME_SYSTEM_STATE.morphTargetArray = [];
                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.traverse(function (node) {
                    if (node.isBone) {
                        let bName = node.name.toLowerCase();
                        // हड्डियों (Bones) की सही ट्रैकिंग ताकि पूरा शरीर हिले
                        if (bName.includes('head')) RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference = node;
                        if (bName.includes('neck')) RUNTIME_SYSTEM_STATE.riggingBones.thoracicNeckBoneReference = node;
                        if (bName.includes('spine2') || bName.includes('spine1')) RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference = node;
                        if (bName.includes('spine') && !bName.includes('1') && !bName.includes('2')) RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference = node;
                    }
                    if (node.isMesh) {
                        if (node.material) { node.material.roughness = 0.42; node.material.needsUpdate = true; }
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
                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.rotation.set(0, 0, 0);

                if (UIStatusTextStringNode) UIStatusTextStringNode.innerText = "PROJECT MASTER // DESIGNATION: a1";
                if (UISubLabelDiagnosticNode) UISubLabelDiagnosticNode.innerText = "STEP 1: NATURAL NATURAL MOVEMENT ENGAGED";

                performTextToVoiceEngineSynthesis(`स्टेप वन पूरा हो गया है भाई। अब मेरा पूरा शरीर नेचुरल तरीके से सांस ले रहा है।`);
            },
            function (progress) {
                if (UISubLabelDiagnosticNode && progress.total > 0) {
                    UISubLabelDiagnosticNode.innerText = `BUFFERING RIGS: ${Math.round((progress.loaded / progress.total) * 100)}%`;
                }
            },
            function (error) {
                if (targetResourceAssetUrl !== CORE_SYSTEM_CONFIG.assets.failSafeBackupModelRoute) {
                    negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.failSafeBackupModelRoute);
                }
            }
        );
        bindApplicationInterfaceEventListeners();
    }

    /**
     * ADVANCED PROCEDURAL REALISTIC BIOMETRIC TICK LOOP
     */
    function executeQuantumGraphicsRendererPipelineRenderLoop() {
        requestAnimationFrame(executeQuantumGraphicsRendererPipelineRenderLoop);
        absoluteElapsedTime = RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock.getElapsedTime();
        
        let f = CORE_SYSTEM_CONFIG.constraints.interpolationLerpSpeed;
        RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX = THREE.MathUtils.lerp(RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX, RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX, f);
        RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY = THREE.MathUtils.lerp(RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY, RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY, f);

        // --- प्राकृतिक सांस लेने और डुलने का गणितीय लॉजिक (Natural Idle Animation) ---
        let breathingOscillationValue = Math.sin(absoluteElapsedTime * 1.5) * 0.012; // छाती का ऊपर-नीचे होना
        let sidewaysShoulderSwayValue = Math.cos(absoluteElapsedTime * 0.8) * 0.007; // कंधों का हल्का साइड मूवमेंट

        // 1. पूरे मॉडल का बेस ब्रीदिंग मोशन (Up & Down Shift)
        if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode) {
            RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.position.y = CORE_SYSTEM_CONFIG.engineParameters.modelBaseYFloorLevel + breathingOscillationValue;
        }

        // 2. रीढ़ की हड्डियों (Spine & Torso) में नेचुरल मूवमेंट बांटना
        if (RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference) {
            RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference.rotation.z = sidewaysShoulderSwayValue; 
            RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.10;
        }
        if (RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference) {
            // सांस लेते वक़्त छाती आगे-पीछे होगी (X-axis rotation)
            RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference.rotation.x = (breathingOscillationValue * 0.5) + (RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY * 0.10);
            RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.15;
        }

        // 3. गर्दन और सिर का मूवमेंट (Neck & Head Distributed Layers)
        if (RUNTIME_SYSTEM_STATE.thoracicNeckBoneReference) {
            RUNTIME_SYSTEM_STATE.thoracicNeckBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.25;
            RUNTIME_SYSTEM_STATE.thoracicNeckBoneReference.rotation.x = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY * 0.15;
        }
        if (RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference) {
            RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.40;
            RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.x = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY * 0.30;
        }

        // पलकें झपकाना और लिप-सिंक
        if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode && RUNTIME_SYSTEM_STATE.morphTargetArray.length > 0) {
            computedEyeBlinkSignalAmplitude = (Math.sin(absoluteElapsedTime * 2.6) > 0.98) ? 1.0 : 0.0;
            computedMouthOpenSignalAmplitude = RUNTIME_SYSTEM_STATE.interactionFlags.isSystemCurrentlySynthesizingVoice ? Math.abs(Math.sin(absoluteElapsedTime * 14.0)) * 0.65 : 0.0;

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

    function bindApplicationInterfaceEventListeners() {
        const field = document.getElementById('user-input-field');
        const btn = document.getElementById('transmit-payload-btn');

        if (btn) btn.onclick = () => { if(field && field.value) { performTextToVoiceEngineSynthesis("डाटा सिंक हो गया है।"); field.value = ""; } };

        window.addEventListener('mousemove', (e) => {
            let rawX = (e.clientX / window.innerWidth) * 2 - 1;
            let rawY = -(e.clientY / window.innerHeight) * 2 + 1;
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, rawX));
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, rawY));
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                let rawX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
                let rawY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
                RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, rawX));
                RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, rawY));
            }
        }, { passive: true });

        const resetTrackingTargets = () => {
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX = 0;
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY = 0;
        };
        window.addEventListener('mouseleave', resetTrackingTargets);
        window.addEventListener('touchend', resetTrackingTargets, { passive: true });
    }

    window.addEventListener('resize', () => {
        if (RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera && RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer) {
            RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera.aspect = window.innerWidth / window.innerHeight;
            RUNTIME_SYSTEM_STATE.threeContext.primaryFrustumCamera.updateProjectionMatrix();
            RUNTIME_SYSTEM_STATE.threeContext.hardwareAcceleratedRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    });

    window.onload = function () { instantiateQuantumEngineGraphicsPipeline(); executeQuantumGraphicsRendererPipelineRenderLoop(); };

})(window);/**
 * PROJECT REFERENCE MATRIX ID: a1
 * MASTER CODE: INTEGRATED BIOMETRIC BREATHING & FORCED T-POSE DEFAULTS
 */

"use strict";

(function (GlobalScope) {
    
    const CORE_SYSTEM_CONFIG = {
        assets: {
            primaryModelGltfRoute: "https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb",
            failSafeBackupModelRoute: "https://models.readyplayer.me/64a6603a6e9d690a29b5bb89.glb",
            localMemoryValidationToken: "project_a1_data_bank"
        },
        engineParameters: {
            targetFieldOfView: 35, nearClippingPlane: 0.1, farClippingPlane: 100,
            cameraZDepthOffset: 1.95, cameraYHeightOffset: 0.45, modelBaseYFloorLevel: -1.38,
            maxDevicePixelRatioThresh: 2
        },
        constraints: {
            maxYawRotationLimit: 0.38,    
            maxPitchRotationLimit: 0.22,  
            interpolationLerpSpeed: 0.06  
        },
        voiceMatrix: { speechSynthesisLanguageToken: "hi-IN", globalVoicePitchModifier: 1.15 }
    };

    const RUNTIME_SYSTEM_STATE = {
        threeContext: { globalActiveScene: null, primaryFrustumCamera: null, hardwareAcceleratedRenderer: null, precisionDeltaClock: null, avatarMainMeshNode: null },
        riggingBones: { 
            cervicalHeadBoneReference: null, 
            thoracicNeckBoneReference: null,
            spineUpperBoneReference: null,       
            spineMidBoneReference: null,
            // [ADDED IN CORE] हाथों को नॉर्मल रखने के लिए बोंस References
            leftShoulderArm: null,
            rightShoulderArm: null,
            leftForeArm: null,
            rightForeArm: null
        },
        morphTargetArray: [],
        morphTargetResolvedIndices: { blinkLeftEyeIdx: null, blinkRightEyeIdx: null, mandibularJawOpenIdx: null, orbicularisMouthOpenIdx: null },
        interactionFlags: { 
            isSystemCurrentlySynthesizingVoice: false, 
            targetLookAtX: 0, targetLookAtY: 0, 
            currentLookAtX: 0, currentLookAtY: 0,
            touchEventExecutionCooldownLock: false
        }
    };

    let deltaTimeSeconds = 0, absoluteElapsedTime = 0, computedEyeBlinkSignalAmplitude = 0, computedMouthOpenSignalAmplitude = 0;

    function instantiateQuantumEngineGraphicsPipeline() {
        RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock = new THREE.Clock();
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene = new THREE.Scene();
        
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

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(ambientLight);

        const studioKeySun = new THREE.DirectionalLight(0xfff5ea, 1.5);
        studioKeySun.position.set(1.5, 3.5, 2.5);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(studioKeySun);

        const softFrontalFill = new THREE.PointLight(0xffffff, 0.6, 8);
        softFrontalFill.position.set(0, 0.4, 1.8);
        RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(softFrontalFill);

        negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.primaryModelGltfRoute);
    }

    function negotiateMeshStreamLoadingSequence(targetResourceAssetUrl) {
        const UIStatusTextStringNode = document.getElementById('system-status-string');
        const UISubLabelDiagnosticNode = document.getElementById('sub-diagnostic-label');

        const standardGltfMeshAssetLoader = new THREE.GLTFLoader();
        standardGltfMeshAssetLoader.load(
            targetResourceAssetUrl,
            function (gltfContainer) {
                if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode) {
                    RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.remove(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);
                }

                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode = gltfContainer.scene;
                RUNTIME_SYSTEM_STATE.threeContext.globalActiveScene.add(RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode);

                RUNTIME_SYSTEM_STATE.morphTargetArray = [];
                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.traverse(function (node) {
                    if (node.isBone) {
                        let bName = node.name.toLowerCase();
                        
                        if (bName.includes('head')) RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference = node;
                        if (bName.includes('neck')) RUNTIME_SYSTEM_STATE.riggingBones.thoracicNeckBoneReference = node;
                        if (bName.includes('spine2') || bName.includes('spine1')) RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference = node;
                        if (bName.includes('spine') && !bName.includes('1') && !bName.includes('2')) RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference = node;
                        
                        // [ADDED IN CORE] मैपिंग बोंस फॉर आर्म्स कंट्रोल
                        if (bName === 'leftarm') RUNTIME_SYSTEM_STATE.riggingBones.leftShoulderArm = node;
                        if (bName === 'rightarm') RUNTIME_SYSTEM_STATE.riggingBones.rightShoulderArm = node;
                        if (bName === 'leftforearm') RUNTIME_SYSTEM_STATE.riggingBones.leftForeArm = node;
                        if (bName === 'rightforearm') RUNTIME_SYSTEM_STATE.riggingBones.rightForeArm = node;
                    }
                    if (node.isMesh) {
                        if (node.material) { node.material.roughness = 0.42; node.material.needsUpdate = true; }
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

                // [ADDED IN CORE] हाथों को T-Pose से ज़बरदस्ती हटाकर नीचे रिलैक्स पोजीशन में रेंडर करना
                if (RUNTIME_SYSTEM_STATE.riggingBones.leftShoulderArm) RUNTIME_SYSTEM_STATE.riggingBones.leftShoulderArm.rotation.z = -1.35; 
                if (RUNTIME_SYSTEM_STATE.riggingBones.rightShoulderArm) RUNTIME_SYSTEM_STATE.riggingBones.rightShoulderArm.rotation.z = 1.35;  
                if (RUNTIME_SYSTEM_STATE.riggingBones.leftForeArm) RUNTIME_SYSTEM_STATE.riggingBones.leftForeArm.rotation.y = 0.2;
                if (RUNTIME_SYSTEM_STATE.riggingBones.rightForeArm) RUNTIME_SYSTEM_STATE.riggingBones.rightForeArm.rotation.y = -0.2;

                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.position.set(0, CORE_SYSTEM_CONFIG.engineParameters.modelBaseYFloorLevel, 0);
                RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.rotation.set(0, 0, 0);

                if (UIStatusTextStringNode) UIStatusTextStringNode.innerText = "PROJECT MASTER // DESIGNATION: a1";
                if (UISubLabelDiagnosticNode) UISubLabelDiagnosticNode.innerText = "ALL UPDATES INTEGRATED SECURELY";

                performTextToVoiceEngineSynthesis(`मास्टर कोडिंग अपडेट हो गई है भाई। हाथ अब बिल्कुल नॉर्मल पोजीशन में लॉक हो चुके हैं।`);
            },
            function (progress) {
                if (UISubLabelDiagnosticNode && progress.total > 0) {
                    UISubLabelDiagnosticNode.innerText = `SYNCING SKELETON: ${Math.round((progress.loaded / progress.total) * 100)}%`;
                }
            },
            function (error) {
                if (targetResourceAssetUrl !== CORE_SYSTEM_CONFIG.assets.failSafeBackupModelRoute) {
                    negotiateMeshStreamLoadingSequence(CORE_SYSTEM_CONFIG.assets.failSafeBackupModelRoute);
                }
            }
        );
        bindApplicationInterfaceEventListeners();
    }

    /**
     * ADVANCED PROCEDURAL REALISTIC BIOMETRIC TICK LOOP
     */
    function executeQuantumGraphicsRendererPipelineRenderLoop() {
        requestAnimationFrame(executeQuantumGraphicsRendererPipelineRenderLoop);
        absoluteElapsedTime = RUNTIME_SYSTEM_STATE.threeContext.precisionDeltaClock.getElapsedTime();
        
        let f = CORE_SYSTEM_CONFIG.constraints.interpolationLerpSpeed;
        RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX = THREE.MathUtils.lerp(RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX, RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX, f);
        RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY = THREE.MathUtils.lerp(RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY, RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY, f);

        // प्राकृतिक सांस लेने की गति
        let breathingOscillationValue = Math.sin(absoluteElapsedTime * 1.5) * 0.012; 
        let sidewaysShoulderSwayValue = Math.cos(absoluteElapsedTime * 0.8) * 0.007; 

        if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode) {
            RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode.position.y = CORE_SYSTEM_CONFIG.engineParameters.modelBaseYFloorLevel + breathingOscillationValue;
        }

        // रीढ़ की हड्डियां और चेस्ट मूवमेंट
        if (RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference) {
            RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference.rotation.z = sidewaysShoulderSwayValue; 
            RUNTIME_SYSTEM_STATE.riggingBones.spineMidBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.10;
        }
        if (RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference) {
            RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference.rotation.x = (breathingOscillationValue * 0.5) + (RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY * 0.10);
            RUNTIME_SYSTEM_STATE.riggingBones.spineUpperBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.15;
        }

        // गर्दन और सिर रोटेशन
        if (RUNTIME_SYSTEM_STATE.thoracicNeckBoneReference) {
            RUNTIME_SYSTEM_STATE.thoracicNeckBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.25;
            RUNTIME_SYSTEM_STATE.thoracicNeckBoneReference.rotation.x = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY * 0.15;
        }
        if (RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference) {
            RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.y = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtX * 0.40;
            RUNTIME_SYSTEM_STATE.riggingBones.cervicalHeadBoneReference.rotation.x = RUNTIME_SYSTEM_STATE.interactionFlags.currentLookAtY * 0.30;
        }

        // [ADDED IN CORE] हाथों को सांस के मोशन के साथ सिंक्रोनाइज़ रखना (घोस्ट इफ़ेक्ट हटाने के लिए)
        if (RUNTIME_SYSTEM_STATE.riggingBones.leftShoulderArm) RUNTIME_SYSTEM_STATE.riggingBones.leftShoulderArm.rotation.x = breathingOscillationValue * 0.2;
        if (RUNTIME_SYSTEM_STATE.riggingBones.rightShoulderArm) RUNTIME_SYSTEM_STATE.riggingBones.rightShoulderArm.rotation.x = breathingOscillationValue * 0.2;

        // फेस ब्लिंक और लिप सिंक
        if (RUNTIME_SYSTEM_STATE.threeContext.avatarMainMeshNode && RUNTIME_SYSTEM_STATE.morphTargetArray.length > 0) {
            computedEyeBlinkSignalAmplitude = (Math.sin(absoluteElapsedTime * 2.6) > 0.98) ? 1.0 : 0.0;
            computedMouthOpenSignalAmplitude = RUNTIME_SYSTEM_STATE.interactionFlags.isSystemCurrentlySynthesizingVoice ? Math.abs(Math.sin(absoluteElapsedTime * 14.0)) * 0.65 : 0.0;

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

    function bindApplicationInterfaceEventListeners() {
        const field = document.getElementById('user-input-field');
        const btn = document.getElementById('transmit-payload-btn');

        if (btn) btn.onclick = () => { if(field && field.value) { performTextToVoiceEngineSynthesis("डेटा सिंक हो गया है।"); field.value = ""; } };

        window.addEventListener('mousemove', (e) => {
            let rawX = (e.clientX / window.innerWidth) * 2 - 1;
            let rawY = -(e.clientY / window.innerHeight) * 2 + 1;
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, rawX));
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, rawY));
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                let rawX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
                let rawY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
                RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxYawRotationLimit, rawX));
                RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY = Math.max(-CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, Math.min(CORE_SYSTEM_CONFIG.constraints.maxPitchRotationLimit, rawY));
            }
        }, { passive: true });

        const resetTrackingTargets = () => {
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtX = 0;
            RUNTIME_SYSTEM_STATE.interactionFlags.targetLookAtY = 0;
        };
        window.addEventListener('mouseleave', resetTrackingTargets);
        window.addEventListener('touchend', resetTrackingTargets, { passive: true });
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

