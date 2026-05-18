/**
 * PROJECT MASTER CORE: a1
 * FORMAT STATE: FULL CORE OVERHAUL (HTML + JS SEPARATED)
 * FEATURES: 4.3 CAMERA CONFIG, ANIMATION OVERRIDE ENGINE, 99% MATTE SHADERS
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        mixer: null,
        bones: { neck: null, head: null, spine: null },
        blink: {
            targets: [], 
            timer: 0, nextBlinkTime: 1.5, state: 'open', duration: 0.0
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // a1 MASTER RULE: Full Body View Camera Position Layer
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // ACES Filmic Tone Mapping Configuration for Matte Surface Contrast
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        STATE.renderer.toneMappingExposure = 0.95; 
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // Studio Three-Point Balance Ambient Light System
        const ambient = new THREE.AmbientLight(0xffffff, 0.4); 
        STATE.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.5);
        sunLight.position.set(1.5, 3.5, 3.5); 
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0005; 
        sunLight.shadow.normalBias = 0.03;
        STATE.scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xe8f2ff, 0.5);
        fillLight.position.set(-2, 1.5, 2.5);
        STATE.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.8); 
        rimLight.position.set(-1, 3, -3);
        STATE.scene.add(rimLight);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // Deep Traversal Layer Scanner for Morph Targets & Matte Materials
            STATE.avatar.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Skin Matte Pores Intensity Optimization
                    if (node.material) {
                        node.material.roughness = 0.90; 
                        node.material.metalness = 0.0;
                        if (node.material.map) {
                            node.material.map.anisotropy = 8; 
                            node.material.map.needsUpdate = true;
                        }
                    }

                    // Avaturn Mesh Morph Tracking Matrix
                    if (node.morphTargetDictionary && node.morphTargetInfluences) {
                        Object.keys(node.morphTargetDictionary).forEach(key => {
                            let name = key.toLowerCase();
                            if (name.includes('blink') || name.includes('eye_close') || name.includes('eyesclosed')) {
                                STATE.blink.targets.push({
                                    mesh: node,
                                    index: node.morphTargetDictionary[key]
                                });
                            }
                        });
                    }
                }
                
                // a1 MASTER HINT: Skeleton Base Bone Mapping Trackers
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck') || n.toLowerCase() === 'neck') STATE.bones.neck = node;
                    if (n.includes('Head') || n.toLowerCase() === 'head') STATE.bones.head = node;
                    if (n.includes('Spine1') || n.name === 'Spine') STATE.bones.spine = node;
                }
            });

            if (gltf.animations && gltf.animations.length > 0) {
                STATE.mixer = new THREE.AnimationMixer(STATE.avatar);
                gltf.animations.forEach((clip) => {
                    STATE.mixer.clipAction(clip).play();
                });
            }

            STATE.avatar.position.set(0, -1.35, 0);
            STATE.blink.nextBlinkTime = STATE.clock.getElapsedTime() + 2.0;
            animate();
        });

        setupEvents();
    }

    // Active Forceful Animation Override Blink Module
    function updateBlinking(currentTime) {
        if (STATE.blink.targets.length === 0) return;

        if (STATE.blink.state === 'open') {
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.05); 
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'opening';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'opening') {
            STATE.blink.duration += 0.016;
            let progress = Math.min(1.0, STATE.blink.duration / 0.05);
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = 1.0 - progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'open';
                STATE.blink.nextBlinkTime = currentTime + 2.5 + Math.random() * 2.5; 
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        let delta = STATE.clock.getDelta();
        let time = STATE.clock.getElapsedTime();
        
        if (STATE.mixer) {
            STATE.mixer.update(delta);
        }

        // Post-Animation Target Sync Layer Override
        updateBlinking(time);
        
        // Face Track Interpolations
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // a1 MASTER RULE: Center Base Spine Tracking Configuration
        if (STATE.camera && STATE.bones.spine) {
            const targetPos = new THREE.Vector3();
            STATE.bones.spine.getWorldPosition(targetPos);
            STATE.camera.lookAt(targetPos);
        }

        STATE.renderer.render(STATE.scene, STATE.camera);
    }

    function setupEvents() {
        window.addEventListener('mousemove', (e) => {
            STATE.mouseX = Math.max(-0.4, Math.min(0.4, (e.clientX / window.innerWidth) * 2 - 1));
            STATE.mouseY = Math.max(-0.2, Math.min(0.2, -(e.clientY / window.innerHeight) * 2 + 1));
        });
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                STATE.mouseX = Math.max(-0.4, Math.min(0.4, (e.touches[0].clientX / window.innerWidth) * 2 - 1));
                STATE.mouseY = Math.max(-0.2, Math.min(0.2, -(e.touches[0].clientY / window.innerHeight) * 2 + 1));
            }
        }, { passive: true });
        
        window.addEventListener('resize', () => {
            if (STATE.camera && STATE.renderer) {
                STATE.camera.aspect = window.innerWidth / window.innerHeight;
                STATE.camera.updateProjectionMatrix();
                STATE.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    window.onload = init;
})();
