/**
 * PROJECT MASTER CORE: a1 (HINTS APPLIED - NO AUTO-SAVE)
 * FIX: FULL BODY 3D SHADER DEPTH & ANIMATION BLINK OVERRIDE
 * SPEC: ACES FILMIC GRADE, RE-BALANCED STUDIO LIGHTS, FORCED MORPH INFLUENCE
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
        
        // a1 HINT LOCKED: परफेक्ट फुल बॉडी व्यू के लिए कैमरा बाउंड्स
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // टोन मैपिंग जो स्किन के एक्स्ट्रा प्लास्टिक ग्लो को खत्म करेगी
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        STATE.renderer.toneMappingExposure = 0.95; // स्किन और कपड़ों के फीचर्स को गहराई देने के लिए एक्सपोज़र थोड़ा कम किया
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // 🎯 फुल-बॉडी री-बैलेंस्ड लाइटिंग (ताकि चेहरा और ड्रेस दोनों 3D रियलिस्टिक लगें)
        const ambient = new THREE.AmbientLight(0xffffff, 0.4); 
        STATE.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.5);
        sunLight.position.set(1.5, 3.5, 3.5); // पोजीशन थोड़ी ऊपर की ताकि पूरी बॉडी पर परछाइयां पड़ें
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0005; // कट्स पर अनचाही लाइन्स रोकने के लिए
        sunLight.shadow.normalBias = 0.03;
        STATE.scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xe8f2ff, 0.5);
        fillLight.position.set(-2, 1.5, 2.5);
        STATE.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.8); // बालों को गहराई देने के लिए पीछे से लाइट
        rimLight.position.set(-1, 3, -3);
        STATE.scene.add(rimLight);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // एवाटूर्न नोड्स को गहराई से खंगालना
            STATE.avatar.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // स्किन और ड्रेस को रिस्पॉन्सिव रीयलिस्टिक मटीरियल में बदलना
                    if (node.material) {
                        node.material.roughness = 0.90; // चमक पूरी तरह गायब, ओरिजिनल मैट टेक्सचर विज़िबल
                        node.material.metalness = 0.0;
                        if (node.material.map) {
                            node.material.map.anisotropy = 8; // ज़ूम करने पर भी स्किन पोर्स धुंधले नहीं होंगे
                            node.material.map.needsUpdate = true;
                        }
                    }

                    // आई-ब्लिंक मोर्फ कीज़ को डिटेक्ट करना
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
                
                // a1 HINT LOCKED: बोन्स सिंक
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

    // 🎯 एनीमेशन को ओवरराइड करने वाला फोर्सफुल ब्लिंक लूप
    function updateBlinking(currentTime) {
        if (STATE.blink.targets.length === 0) return;

        if (STATE.blink.state === 'open') {
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.05); // इंसानी पलक झपकने की रियल स्पीड
            
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
                STATE.blink.nextBlinkTime = currentTime + 2.5 + Math.random() * 2.5; // हर 2.5 से 5 सेकंड में ब्लिंक
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        let delta = STATE.clock.getDelta();
        let time = STATE.clock.getElapsedTime();
        
        // 1. पहले डिफ़ॉल्ट एनीमेशन को चलने दें (जो आँखों को खोल देता है)
        if (STATE.mixer) {
            STATE.mixer.update(delta);
        }

        // 2. 🎯 एनीमेशन के ठीक बाद ब्लिंक इंजन चलाकर उसे ओवरराइड करना
        updateBlinking(time);
        
        // हेड एंगल रोटेशन
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // a1 HINT LOCKED: यूनिवर्सल बेल्ट सेंटर लॉक
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
