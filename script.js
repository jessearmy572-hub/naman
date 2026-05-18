/**
 * PROJECT MASTER CORE: a1
 * FIX: FORCED BLINK ENGINE & PORE-LEVEL REALISM
 * SPEC: ACES FILMIC GRADE, RE-INITIALIZED MORPH TARGETS, 99% MATTE SKIN
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        mixer: null,
        bones: { neck: null, head: null, spine: null },
        blink: {
            targets: [], // मेश और उनके मॉर्फ इंडेक्स का डेटा
            timer: 0, nextBlinkTime: 1.5, state: 'open', duration: 0.0
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // सिनेमैटिक टोन मैपिंग - जो चेहरे के एक्स्ट्रा व्हाइट ग्लो को हटाकर रियल स्किन टोन देगा
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        STATE.renderer.toneMappingExposure = 1.0; // ग्लो कम करने के लिए एक्सपोज़र को बैलेंस किया
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // स्टूडियो लाइटिंग - चेहरे के फीचर्स को गहराई देने के लिए
        const ambient = new THREE.AmbientLight(0xffffff, 0.5); 
        STATE.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xfff8f2, 1.2);
        sunLight.position.set(1, 2.5, 3);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0001;
        STATE.scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xebf3ff, 0.4);
        fillLight.position.set(-1.5, 1, 2);
        STATE.scene.add(fillLight);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            STATE.avatar.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // 🎯 99% इंसानी त्वचा टेक्सचर फिक्स (मैट फिनिश + हाई डेफिनिशन)
                    if (node.material) {
                        node.material.roughness = 0.85; // चमक पूरी तरह खत्म, नेचुरल मैट स्किन
                        node.material.metalness = 0.0;
                        
                        if (node.material.map) {
                            node.material.map.anisotropy = 8; // पोर्स और स्किन डिटेल्स को शार्प करने के लिए
                            node.material.map.needsUpdate = true;
                        }
                    }

                    // 🎯 आई-ब्लिंक फोर्स स्कैनर
                    if (node.morphTargetDictionary && node.morphTargetInfluences) {
                        // मेश के अंदर ब्लिंक से जुड़े सभी कीज़ को ढूंढना
                        Object.keys(node.morphTargetDictionary).forEach(key => {
                            let name = key.toLowerCase();
                            if (name.includes('blink') || name.includes('eye_close') || name.includes('eyesclosed')) {
                                // मॉर्फ टारगेट इन्फ्लुएंस एरे को फोर्स री-इनिशियलाइज़ करना ताकि कोड इस पर कंट्रोल पा सके
                                node.morphTargetInfluences[node.morphTargetDictionary[key]] = 0;
                                STATE.blink.targets.push({
                                    mesh: node,
                                    index: node.morphTargetDictionary[key]
                                });
                            }
                        });
                    }
                }
                
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck')) STATE.bones.neck = node;
                    if (n.includes('Head')) STATE.bones.head = node;
                    if (n.includes('Spine1') || n.includes('Spine')) STATE.bones.spine = node;
                }
            });

            if (gltf.animations && gltf.animations.length > 0) {
                STATE.mixer = new THREE.AnimationMixer(STATE.avatar);
                gltf.animations.forEach((clip) => {
                    STATE.mixer.clipAction(clip).play();
                });
            }

            STATE.avatar.position.set(0, -1.35, 0);
            STATE.blink.nextBlinkTime = STATE.clock.getElapsedTime() + 1.0;
            animate();
        });

        setupEvents();
    }

    // 🎯 ब्लिंक इंजन - जो जबरदस्ती पलकों के मेश को मूव करेगा
    function updateBlinking(currentTime) {
        if (STATE.blink.targets.length === 0) return;

        if (STATE.blink.state === 'open') {
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.06); // 0.06 सेकंड में आँखें बंद
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'opening';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'opening') {
            STATE.blink.duration += 0.016;
            let progress = Math.min(1.0, STATE.blink.duration / 0.06); // 0.06 सेकंड में आँखें वापस खुली
            
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
        
        if (STATE.mixer) STATE.mixer.update(delta);

        // ब्लिंक फंक्शन को हर फ्रेम पर चलाना
        updateBlinking(time);
        
        // हेड एंगल ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // यूनिवर्सल बेल्ट सेंटर लॉक
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
