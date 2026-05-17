
            if (calculatedNormalizedTouchYCoordinate > 0.35) {
                applyTargetSentimentMorphWeightMappings("shy");
                bridgeNetworkPayloadDirectlyIntoResponseEngine("[Palkein jhapkate hue aur sharmate hue] Umh... Tum jab mujhe aise touch karte ho na, mujhe thodi sharm aa jati hai...!");
            } else {
                applyTargetSentimentMorphWeightMappings("happy");
                bridgeNetworkPayloadDirectlyIntoResponseEngine("[Halka sa haste hue] Haha! Waha mat छुओ, gudhgudhi hoti hai! Batao aaj kya baatein karni hain?");
            }
        }

        function applyDynamicOutfitTextureColorBypass(colorHexCodeValue) {
            activeSkinnedMeshSubnodesTrackArray.forEach(evaluatedSkinnedMeshNodeReference => {
                const convertedMeshLowerNameString = evaluatedSkinnedMeshNodeReference.name.toLowerCase();
                if (convertedMeshLowerNameString.includes('outfit') || convertedMeshLowerNameString.includes('tops') || 
                    convertedMeshLowerNameString.includes('bottom') || convertedMeshLowerNameString.includes('footwear')) {
                    if (evaluatedSkinnedMeshNodeReference.material) {
                        if (Array.isArray(evaluatedSkinnedMeshNodeReference.material)) {
                            evaluatedSkinnedMeshNodeReference.material.forEach(singleMaterialNode => {
                                if(singleMaterialNode.color) singleMaterialNode.color.setHex(colorHexCodeValue);
                            });
                        } else {
                            if(evaluatedSkinnedMeshNodeReference.material.color) evaluatedSkinnedMeshNodeReference.material.color.setHex(colorHexCodeValue);
                        }
                    }
                }
            });
        }

        function applyTargetSentimentMorphWeightMappings(sentimentKeywordKeyString) {
            activeSkinnedMeshSubnodesTrackArray.forEach(skinnedSubmeshComponentNodeReference => {
                const activeMorphTargetMeshDictionaryMap = skinnedSubmeshComponentNodeReference.morphTargetDictionary;
                const activeMorphInfluencesWeightTrackingArray = skinnedSubmeshComponentNodeReference.morphTargetInfluences;
                
                if (!activeMorphTargetMeshDictionaryMap || !activeMorphInfluencesWeightTrackingArray) return;

                const globalSentimentTargetsList = ["mouthSmileLeft", "mouthSmileRight", "browDownLeft", "browDownRight", "browInnerUp"];
                globalSentimentTargetsList.forEach(shapeKeyString => {
                    let trackingSlotIndexValue = activeMorphTargetMeshDictionaryMap[shapeKeyString];
                    if (trackingSlotIndexValue !== undefined) activeMorphInfluencesWeightTrackingArray[trackingSlotIndexValue] = 0;
                });

                if (sentimentKeywordKeyString === "happy" || sentimentKeywordKeyString === "joy") {
                    let smileLeftSlotIndex = activeMorphTargetMeshDictionaryMap["mouthSmileLeft"];
                    let smileRightSlotIndex = activeMorphTargetMeshDictionaryMap["mouthSmileRight"];
                    if (smileLeftSlotIndex !== undefined) activeMorphInfluencesWeightTrackingArray[smileLeftSlotIndex] = 0.85;
                    if (smileRightSlotIndex !== undefined) activeMorphInfluencesWeightTrackingArray[smileRightSlotIndex] = 0.85;
                } else if (sentimentKeywordKeyString === "sad" || sentimentKeywordKeyString === "sorry") {
                    let browDownLeftSlotIndex = activeMorphTargetMeshDictionaryMap["browDownLeft"];
                    let browDownRightSlotIndex = activeMorphTargetMeshDictionaryMap["browDownRight"];
                    if (browDownLeftSlotIndex !== undefined) activeMorphInfluencesWeightTrackingArray[browDownLeftSlotIndex] = 0.75;
                    if (browDownRightSlotIndex !== undefined) activeMorphInfluencesWeightTrackingArray[browDownRightSlotIndex] = 0.75;
                } else if (sentimentKeywordKeyString === "shy") {
                    let browInnerUpSlotIndex = activeMorphTargetMeshDictionaryMap["browInnerUp"];
                    let smileLeftSlotIndex = activeMorphTargetMeshDictionaryMap["mouthSmileLeft"];
                    if (browInnerUpSlotIndex !== undefined) activeMorphInfluencesWeightTrackingArray[browInnerUpSlotIndex] = 0.65;
                    if (smileLeftSlotIndex !== undefined) activeMorphInfluencesWeightTrackingArray[smileLeftSlotIndex] = 0.45;
                }
            });
        }

        function executeLongTermMemoryGreetingsSync() {
            const standardCurrentDateStringValue = new Date().toDateString();
            if (priyaMemoryEngineDataPayload.lastInteractionTimestamp) {
                if (priyaMemoryEngineDataPayload.lastInteractionTimestamp !== standardCurrentDateStringValue) {
                    setTimeout(() => {
                        bridgeNetworkPayloadDirectlyIntoResponseEngine(`[Palkein jhapkate hue aur khush hote hue] Namaste ${priyaMemoryEngineDataPayload.userName}! Tum kuch दिन पहले मुझसे बात करने आए थे ना? आज फिर से मिलकर बहुत खुशी हुई डियर!`);
                    }, 2500);
                }
            } else {
                priyaMemoryEngineDataPayload.lastInteractionTimestamp = standardCurrentDateStringValue;
                commitPriyaMemoryStateToStorageCache();
            }
        }

        async function initWeatherAndSkyEngineMatrix() {
            let activeWeatherTypeProfileString = "clear";
            try {
                if (OPENWEATHER_API_KEY !== "") {
                    const weatherNetworkFetchResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${OPENWEATHER_API_KEY}`);
                    const weatherParsedJsonPayload = await weatherNetworkFetchResponse.json();
                    activeWeatherTypeProfileString = weatherParsedJsonPayload.weather[0].main.toLowerCase();
                }
            } catch (weatherException) { console.log("Weather API skipped, running default clear profile layout."); }

            if (activeWeatherTypeProfileString.includes("rain") || activeWeatherTypeProfileString.includes("drizzle") || activeWeatherTypeProfileString.includes("cloud")) {
                const totalTargetParticleCountLimit = 1200;
                const particleGeometryClusterNode = new THREE.BufferGeometry();
                const particlePositionsCoordinatesArray = new Float32Array(totalTargetParticleCountLimit * 3);
                
                for (let particleIndex = 0; particleIndex < totalTargetParticleCountLimit * 3; particleIndex += 3) {
                    particlePositionsCoordinatesArray[particleIndex] = (Math.random() - 0.5) * 12;
                    particlePositionsCoordinatesArray[particleIndex+1] = Math.random() * 6;
                    particlePositionsCoordinatesArray[particleIndex+2] = (Math.random() - 0.5) * 12;
                }
                
                particleGeometryClusterNode.setAttribute('position', new THREE.BufferAttribute(particlePositionsCoordinatesArray, 3));
                const particleMaterialConfigurationObject = new THREE.PointsMaterial({
                    color: 0x9be2ff, size: 0.025, transparent: true, opacity: 0.55
                });
                weatherDynamicParticlePointsSystem = new THREE.Points(particleGeometryClusterNode, particleMaterialConfigurationObject);
                coreThreeSceneInstance.add(weatherDynamicParticlePointsSystem);
            }
        }

        if (frameworkSpeechRecognitionProcessor) {
            frameworkSpeechRecognitionProcessor.onstart = () => {
                liveSpeechCapturingStateSignalActive = true;
                DOMUI_ActionButtonMicTrigger.classList.add('listening');
                DOMUI_TextInputElementBar.placeholder = "कमांडो मोड एक्टिव, बोलie sweetie...";
            };

            frameworkSpeechRecognitionProcessor.onerror = () => {
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

        /*
          ------------------------------------------------------------------
          SUB-MODULE G: MEDIAPIPE FACE MESH CAM TRACK ENGINE INITIALIZER
          ------------------------------------------------------------------
        */
        function initializeMediaPipeWebcamTrackingEngineGrid() {
            const nativeDeviceVideoElementNode = document.getElementById('webcam-video');
            nativeDeviceVideoElementNode.style.display = 'block';

            const faceMeshProcessorFrameworkInstance = new FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
            });

            faceMeshProcessorFrameworkInstance.setOptions({
                maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5
            });

            faceMeshProcessorFrameworkInstance.onResults((transcriptionResultsPayload) => {
                if (!isCamTrackingActiveSignal || !transcriptionResultsPayload.multiFaceLandmarks || transcriptionResultsPayload.multiFaceLandmarks.length === 0) return;
                
                const facialCoordinatesLandmarksVectorArray = transcriptionResultsPayload.multiFaceLandmarks[0];
                const anatomicalNoseTipIndexIndicator = facialCoordinatesLandmarksVectorArray[4];
                
                targetHeadRotationMatrix.y = -(anatomicalNoseTipIndexIndicator.x - 0.5) * 1.25; 
                targetHeadRotationMatrix.x = (anatomicalNoseTipIndexIndicator.y - 0.5) * 0.85;
            });

            const deviceCameraUtilityDriverNode = new Camera(nativeDeviceVideoElementNode, {
                onFrame: async () => { 
                    if (isCamTrackingActiveSignal) await faceMeshProcessorFrameworkInstance.send({ image: nativeDeviceVideoElementNode }); 
                },
                width: 320, height: 240
            });
            deviceCameraUtilityDriverNode.start();
        }

        document.getElementById('toggle-cam-btn').addEventListener('click', () => {
            isCamTrackingActiveSignal = !isCamTrackingActiveSignal;
            const DOMUI_CamButtonElementReference = document.getElementById('toggle-cam-btn');
            
            if (isCamTrackingActiveSignal) {
                DOMUI_CamButtonElementReference.classList.add('tracking-active');
                initializeMediaPipeWebcamTrackingEngineGrid();
            } else {
                DOMUI_CamButtonElementReference.classList.remove('tracking-active');
                document.getElementById('webcam-video').style.display = 'none';
            }
        });

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
            if (!rawIncomingGeminiStreamPayload || rawIncomingGeminiStreamPayload.trim() === "") return;

            if (globalResponseExecutionActiveStatusFlag) safelyAbortActiveTypewriterStreamInteractions();
            
            globalResponseExecutionActiveStatusFlag = true;
            globalLastReceivedResponsePayloadString = rawIncomingGeminiStreamPayload.trim();

            let extractedMicroActionExpressionString = "";
            const expressionRegexBracketMatcher = /\[(.*?)\]/;
            const structuralExpressionMatchResultArray = globalLastReceivedResponsePayloadString.match(expressionRegexBracketMatcher);

            if (structuralExpressionMatchResultArray && structuralExpressionMatchResultArray.length > 1) {
                extractedMicroActionExpressionString = structuralExpressionMatchResultArray[1];
                dispatchDynamicAvatarGestureTrigger(extractedMicroActionExpressionString);
            }

            try {
                dispatchSpeechSynthesizerVocalTrackBuffer(globalLastReceivedResponsePayloadString);
            } catch (error) { console.error("Audio Dispatch Error:", error); }

            const completelyCleanedDisplaySpeechStringText = globalLastReceivedResponsePayloadString
                .replace(globalTextSanitizationRegExpPattern, '').trim();

            await executeRealisticTypewriterSubtitleStreamStream(completelyCleanedDisplaySpeechStringText);
            globalResponseExecutionActiveStatusFlag = false;
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

                let currentCharacterIterationPointerIndex = 0;
                const totalCharacterLengthLimitValue = targetSanitizedDisplayStringText.length;

                globalTypewriterAnimationIntervalReference = setInterval(() => {
                    if (currentCharacterIterationPointerIndex < totalCharacterLengthLimitValue) {
                        DOMUI_SubtitleMonitorOverlayBox.innerText += targetSanitizedDisplayStringText.charAt(currentCharacterIterationPointerIndex);
                        currentCharacterIterationPointerIndex++;
                    } else {
                        clearInterval(globalTypewriterAnimationIntervalReference);
                        globalTypewriterAnimationIntervalReference = null;
                        resolveComponentExecutionPromise();
                    }
                }, 45); 
            });
        }

        function dispatchDynamicAvatarGestureTrigger(operationalGestureKeywordString) {
            if (!coreAnimationMixerController || globalAnimationClipsBufferPool.length === 0) return;

            const compiledLowerGestureTokenString = operationalGestureKeywordString.toLowerCase();
            let targetedActionClipIndexValue = 0; 

            if (compiledLowerGestureTokenString.includes('muskurate') || compiledLowerGestureTokenString.includes('smile') || compiledLowerGestureTokenString.includes('sharmate')) {
                targetedActionClipIndexValue = Math.min(1, globalAnimationClipsBufferPool.length - 1);
                applyTargetSentimentMorphWeightMappings("shy");
            } else if (compiledLowerGestureTokenString.includes('udas') || compiledLowerGestureTokenString.includes('sad')) {
                targetedActionClipIndexValue = Math.min(2, globalAnimationClipsBufferPool.length - 1);
                applyTargetSentimentMorphWeightMappings("sad");
            } else if (compiledLowerGestureTokenString.includes('khush') || compiledLowerGestureTokenString.includes('happy')) {
                targetedActionClipIndexValue = Math.min(3, globalAnimationClipsBufferPool.length - 1);
                applyTargetSentimentMorphWeightMappings("happy");
            } else {
                targetedActionClipIndexValue = Math.floor(Math.random() * Math.min(globalAnimationClipsBufferPool.length, 2));
            }

            try {
                coreAnimationMixerController.stopAllAction();
                let targetSelectedAnimationActionObject = coreAnimationMixerController.clipAction(globalAnimationClipsBufferPool[targetedActionClipIndexValue]);
                targetSelectedAnimationActionObject.reset().setEffectiveWeight(1.0).fadeIn(0.35).play();
            } catch (e) { console.error("Animation Blend Fault:", e); }
        }

        function safelyAbortActiveTypewriterStreamInteractions() {
            if (globalTypewriterAnimationIntervalReference !== null) {
                clearInterval(globalTypewriterAnimationIntervalReference);
                globalTypewriterAnimationIntervalReference = null;
            }
        }

        function bridgeNetworkPayloadDirectlyIntoResponseEngine(incomingNetworkPayloadBufferText) {
            processIncomingGeminiResponsePayload(incomingNetworkPayloadBufferText);
        }

        window.addEventListener('beforeunload', () => {
            safelyAbortActiveTypewriterStreamInteractions();
            globalLastReceivedResponsePayloadString = null;
            activeSkinnedMeshSubnodesTrackArray = [];
        });

        /*
          ------------------------------------------------------------------
          SUB-MODULE H: SYSTEM ENGINE MATRIX LIFECYCLE INITIALIZER LAUNCHER
          ------------------------------------------------------------------
        */
        initializeDeviceHarmonizedGraphicsPipeline();
        initWeatherAndSkyEngineMatrix();
        masterApplicationRenderLoopExecutionCycle();
    </script>
</body>
</html>
