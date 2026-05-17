/* ==========================================================================
   MODULE 9: GEMINI RESPONSE PROCESSING & STREAM ORCHESTRATION SUBSYSTEM
   ========================================================================== */
let globalLastReceivedResponsePayloadString = "";
let globalResponseExecutionActiveStatusFlag = false;
let globalTypewriterAnimationIntervalReference = null;
let globalTextSanitizationRegExpPattern = /\[.*?\]/g;

// GitHub CORS 404 Bypass Link - Direct Stream
const INTERACTION_MODEL_ASSET_URL = "https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb";

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
        if (typeof dispatchSpeechSynthesizerVocalTrackBuffer === 'function') {
            dispatchSpeechSynthesizerVocalTrackBuffer(globalLastReceivedResponsePayloadString);
        }
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
    if (!typeof coreAnimationMixerController !== 'undefined' || !window.globalAnimationClipsBufferPool || globalAnimationClipsBufferPool.length === 0) return;

    const compiledLowerGestureTokenString = operationalGestureKeywordString.toLowerCase();
    let targetedActionClipIndexValue = 0; 

    if (compiledLowerGestureTokenString.includes('muskurate') || compiledLowerGestureTokenString.includes('smile') || compiledLowerGestureTokenString.includes('sharmate')) {
        targetedActionClipIndexValue = Math.min(1, globalAnimationClipsBufferPool.length - 1);
        if (typeof applyTargetSentimentMorphWeightMappings === 'function') applyTargetSentimentMorphWeightMappings("shy");
    } else if (compiledLowerGestureTokenString.includes('udas') || compiledLowerGestureTokenString.includes('sad')) {
        targetedActionClipIndexValue = Math.min(2, globalAnimationClipsBufferPool.length - 1);
        if (typeof applyTargetSentimentMorphWeightMappings === 'function') applyTargetSentimentMorphWeightMappings("sad");
    } else if (compiledLowerGestureTokenString.includes('khush') || compiledLowerGestureTokenString.includes('happy')) {
        targetedActionClipIndexValue = Math.min(3, globalAnimationClipsBufferPool.length - 1);
        if (typeof applyTargetSentimentMorphWeightMappings === 'function') applyTargetSentimentMorphWeightMappings("happy");
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
    if (typeof activeSkinnedMeshSubnodesTrackArray !== 'undefined') activeSkinnedMeshSubnodesTrackArray = [];
});

/*
  ------------------------------------------------------------------
  SUB-MODULE H: SYSTEM ENGINE MATRIX LIFECYCLE INITIALIZER LAUNCHER
  ------------------------------------------------------------------
*/
// Purane functions check karna, agar nahi mile toh crash hone se rokna
if (typeof initializeDeviceHarmonizedGraphicsPipeline === 'function') {
    initializeDeviceHarmonizedGraphicsPipeline();
}
if (typeof initWeatherAndSkyEngineMatrix === 'function') {
    initWeatherAndSkyEngineMatrix();
}

// [FIXED AUTODETECT] Agar Loader variables defined nahi hain, toh unhe create karna taaki error na aaye
let finalLoaderInstance = typeof coreGLTFLoaderInstance !== 'undefined' ? coreGLTFLoaderInstance : (typeof loader !== 'undefined' ? loader : null);
let finalSceneInstance = typeof coreThreeSceneInstance !== 'undefined' ? coreThreeSceneInstance : (typeof scene !== 'undefined' ? scene : null);

if (!finalLoaderInstance && typeof THREE !== 'undefined' && THREE.GLTFLoader) {
    finalLoaderInstance = new THREE.GLTFLoader();
}

// Model Loading Sequence with Fallbacks
if (finalLoaderInstance && finalSceneInstance) {
    finalLoaderInstance.load(INTERACTION_MODEL_ASSET_URL, (gltfResponseStructure) => {
        const globalRenderedMeshModelInstance = gltfResponseStructure.scene;
        
        // Auto-Fit calculations for mobile vs desktop screen sizes
        const evaluationIsMobileDevice = window.innerWidth < 768;
        const dynamicModelScaleFactor = evaluationIsMobileDevice ? 0.95 : 1.35;
        
        globalRenderedMeshModelInstance.scale.set(dynamicModelScaleFactor, dynamicModelScaleFactor, dynamicModelScaleFactor);
        globalRenderedMeshModelInstance.position.set(0, evaluationIsMobileDevice ? -1.1 : -1.4, 0);

        // Auto T-Pose Correction Mapping
        globalRenderedMeshModelInstance.traverse((evaluatedBoneNode) => {
            if (evaluatedBoneNode.isBone && evaluatedBoneNode.name.includes('Arm')) {
                evaluatedBoneNode.rotation.z = evaluatedBoneNode.name.includes('Left') ? -1.45 : 1.45;
                evaluatedBoneNode.rotation.x = 0.15;
            }
            if (evaluatedBoneNode.isSkinnedMesh && typeof activeSkinnedMeshSubnodesTrackArray !== 'undefined') {
                activeSkinnedMeshSubnodesTrackArray.push(evaluatedBoneNode);
            }
        });

        finalSceneInstance.add(globalRenderedMeshModelInstance);
        console.log("Priya Model Engine Successfully Mounted!");
    }, undefined, (loadErrorContext) => {
        console.error("Critical Matrix Asset Loading Failure:", loadErrorContext);
    });
} else {
    console.warn("Three.js Scene or Loader variables initialized late. Waiting for core component script.");
}

// Global Render Loop Function execution check
if (typeof masterApplicationRenderLoopExecutionCycle === 'function') {
    masterApplicationRenderLoopExecutionCycle();
} else if (typeof animate === 'function') {
    animate();
}
