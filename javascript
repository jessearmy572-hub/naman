        /* ==========================================================================
           MODULE 9: GEMINI RESPONSE PROCESSING & STREAM ORCHESTRATION SUBSYSTEM
           ========================================================================== */
        let globalLastReceivedResponsePayloadString = "";
        let globalResponseExecutionActiveStatusFlag = false;
        let globalTypewriterAnimationIntervalReference = null;
        let globalTextSanitizationRegExpPattern = /\[.*?\]/g;

        // Model Link Integration Node
        const INTERACTION_MODEL_ASSET_URL = "https://github.com/jessearmy572-hub/naman/raw/refs/heads/main/model.glb";

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
        // GLTF Loader fallback alignment injection point
        if (typeof coreGLTFLoaderInstance !== 'undefined') {
            coreGLTFLoaderInstance.load(INTERACTION_MODEL_ASSET_URL, (gltfResponseStructure) => {
                const globalRenderedMeshModelInstance = gltfResponseStructure.scene;
                coreThreeSceneInstance.add(globalRenderedMeshModelInstance);
            });
        }

        initializeDeviceHarmonizedGraphicsPipeline();
        initWeatherAndSkyEngineMatrix();
        masterApplicationRenderLoopExecutionCycle();
    </script>
</body>
</html>
