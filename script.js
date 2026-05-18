/* ==========================================================================
  PATCH MODULE: ROBUST LOADER BYPASS & ERROR HANDLING FALLBACK
  ========================================================================== */

// 1. Force Dismiss Loader on Exception or Slow Networks
function forceDismissLoaderOverlayWithBypassSecurity() {
    const DOMUI_LoaderOverlayVeilContainer = document.getElementById('core-boot-loader');
    if (DOMUI_LoaderOverlayVeilContainer) {
        DOMUI_LoaderOverlayVeilContainer.style.opacity = '0';
        DOMUI_LoaderOverlayVeilContainer.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { 
            DOMUI_LoaderOverlayVeilContainer.style.display = 'none'; 
        }, 500);
        console.log("A1 Optimization: Loader screen safely bypassed.");
    }
}

// 2. Updated GLTF Loader Block with Auto-Fallback
const assetGLTFLoaderEngineInstance = new THREE.GLTFLoader();
assetGLTFLoaderEngineInstance.load(
    REMOTE_GLTF_BINARY_PRODUCTION_ASSET_URI, 
    (loadedGltfAssetBundlePayload) => {
        // Clear loader instantly on successful mesh generation
        forceDismissLoaderOverlayWithBypassSecurity();
        
        structuralAvatar3DModelRoot = loadedGltfAssetBundlePayload.scene;
        const calculatedBox = new THREE.Box3().setFromObject(structuralAvatar3DModelRoot);
        const size = calculatedBox.getSize(new THREE.Vector3());
        const center = calculatedBox.getCenter(new THREE.Vector3());

        structuralAvatar3DModelRoot.position.x += (structuralAvatar3DModelRoot.position.x - center.x);
        structuralAvatar3DModelRoot.position.z += (structuralAvatar3DModelRoot.position.z - center.z);
        
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

        structuralAvatar3DModelRoot.traverse((node) => {
            if (node.isBone) {
                const name = node.name.toLowerCase();
                if (name.includes('head')) skeletalBoneJointHead = node;
                if (name.includes('neck')) skeletalBoneJointNeck = node;
            }
            if (node.morphTargetDictionary) activeSkinnedMeshSubnodesTrackArray.push(node);
        });

        // Initialize all side sub-systems safely
        if (typeof initializeSecureHardwareCameraVisionSubsystem === "function") initializeSecureHardwareCameraVisionSubsystem();
        if (typeof initializePersistentIndexedDBMemorySubsystem === "function") initializePersistentIndexedDBMemorySubsystem();
        if (typeof initializeAutonomousProactiveBehaviorWatchdogEngine === "function") initializeAutonomousProactiveBehaviorWatchdogEngine();
        if (typeof initializeDynamicWeatherAndAmbientEnvironmentSuite === "function") initializeDynamicWeatherAndAmbientEnvironmentSuite();
    }, 
    (xhr) => {
        // Monitoring progress safely
        if (xhr.lengthComputable) {
            console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`);
        }
    }, 
    (err) => {
        console.error("Asset pipeline loader exception encountered:", err);
        // CRITICAL FALLBACK: WebGL rendering window screen open ho jaye agar model missing bhi ho to
        forceDismissLoaderOverlayWithBypassSecurity();
    }
);

// 3. Absolute Fail-Safe Watchdog Timer (Forces screen to open within 3 seconds regardless of errors)
setTimeout(() => {
    forceDismissLoaderOverlayWithBypassSecurity();
}, 3000);
