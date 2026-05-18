/**
 * PROJECT MASTER CORE: a1
 * FIX UPGRADE: DEEP RECURSIVE BLINK TRACKER & REALISM SYNC
 * RULES: CAMERA DISTANCE (4.3), WAIST FOCUS LOCK, 99% MATTE SKIN SHADERS
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        mixer: null,
        bones: { neck: null, head: null, spine: null },
        blink: {
            targets: [], // गहरे स्कैन से मिले सभी ब्लिंक मेश का डेटा
            timer: 0, nextBlinkTime: 1.5, state: 'open', duration: 0.0
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // a1 RULE: परफेक्ट फुल बॉडी और ड्रेस चेंज प्रूफ कैमरा बाउंड्स
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // a1 RULE: सिनेमैटिक फिल्मिक टोन मैपिंग (प्लास्टिक ग्लो खत्म करने के लिए)
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        STATE.renderer.toneMappingExposure = 1.0; 
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // एचडी थ्री-पॉइंट स्टूडियो लाइटिंग डेटा
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

            // 🎯 DEEP RECURSIVE SCANNER: मॉडल के सबसे अंदरूनी हिस्से तक स्कैन करना
            parseModelNodes(STATE.avatar);

            if (gltf.animations && gltf.animations.length > 0) {
                STATE.mixer = new THREE.AnimationMixer(STATE.avatar);
                gltf.animations.forEach((clip) => {
                    STATE.mixer.clipAction(clip).play();
                });
            }

            // a1 RULE: मॉडल बेस ग्राउंड पोजीशन फिक्स
            STATE.avatar.position.set(0, -1.35, 0);
            
            // पहला ब्लिंक टाइमर एक्टिवेट
            STATE.blink.nextBlinkTime = STATE.clock.getElapsedTime() + 2.0;
            animate();
        });

        setupEvents();
    }

    // 🎯 अवारी/एवाटूर्न नोड्स को गहराई से खोजने वाला मास्टर स्कैनर फंक्शन
    function parseModelNodes(rootNode) {
        rootNode.traverse(function (node) {
            // 1. मेश मटीरियल और स्किन रीयलिज्म ट्यूनिंग
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                
                if (node.material) {
                    node.material.roughness = 0.85; // 99% मैट फिनिश नेचुरल लुक
                    node.material.metalness = 0.0;
                    if (node.material.map) {
                        node.material.map.anisotropy = 8; // शार्प पोर्स डिटेल्स
                        node.material.map.needsUpdate = true;
                    }
                }

                // 2. एवाटूर्न हिडन मोर्फ टारगेट स्कैनर (आई-ब्लिंक के लिए)
                if (node.morphTargetDictionary && node.morphTargetInfluences) {
                    Object.keys(node.morphTargetDictionary).forEach(key => {
                        let name = key.toLowerCase();
                        // उन सभी कीज़ को कैप्चर करना जो आँखों को बंद करती हैं
                        if (name.includes('blink') || name.includes('eye_close') || name.includes('eyesclosed') || name.includes('blinkleft') || name.includes('blinkright')) {
                            
                            // यह लाइन मेश के मोर्फ इन्फ्लुएंस को जावास्क्रिप्ट कंट्रोल में खींच लेती है
                            node.morphTargetInfluences[node.morphTargetDictionary[key]] = 0;
                            
                            STATE.blink.targets.push({
                                mesh: node,
                                index: node.morphTargetDictionary[key]
                            });
                        }
                    });
                }
            }
            
            // 3. हड्डियों (Bones) का डेटा सिंक
            if (node.isBone) {
                let n = node.name;
                if (n.includes('Neck') || n.toLowerCase() === 'neck') STATE.bones.neck = node;
                if (n.includes('Head') || n.toLowerCase() === 'head') STATE.bones.head = node;
                if (n.includes('Spine1') || n.includes('Spine2') || n.name === 'Spine') {
                    // अगर मुख्य स्पाइन मिल जाए तो उसे लॉक करो
                    if(!STATE.bones.spine || n.includes('Spine1')) {
                        STATE.bones.spine = node;
                    }
                }
            }
        });
    }

    // 🎯 नेचुरल आई-ब्लिंक मोशन रनर
    function updateBlinking(currentTime) {
        if (STATE.blink.targets.length === 0) return;

        if (STATE.blink.state === 'open') {
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.07); // 0.07 सेकंड में पलकें बंद
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'opening';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'opening') {
            STATE.blink.duration += 0.016;
            let progress = Math.min(1.0, STATE.blink.duration / 0.07); // 0.07 सेकंड में पलकें वापस खुली
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = 1.0 - progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'open';
                // हर 3 से 5 सेकंड में नेचुरल रैंडम पलकें झपकेंगी
                STATE.blink.nextBlinkTime = currentTime + 3.0 + Math.random() * 2.0; 
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        let delta = STATE.clock.getDelta();
        let time = STATE.clock.getElapsedTime();
        
        if (STATE.mixer) STATE.mixer.update(delta);

        // ब्लिंक लूप इंजन एक्टिवेटेड
        updateBlinking(time);
        
        // हेड एंगल स्मूथ ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // a1 RULE: यूनिवर्सल ड्रेस-प्रूफ बेल्ट सेंटर लॉक
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
