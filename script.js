/**
 * PROJECT MASTER CORE: a1
 * ADVANCED UPDATE: 99% CINEMATIC HUMAN REALISM & BLINK ENGINE FIX
 * SPEC: ULTRA-SHARP SKIN TEXTURES, REAL SHADOWS & UNIVERSAL MORPH TRACKING
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        mixer: null,
        bones: {
            neck: null, head: null, spine: null
        },
        blink: {
            meshes: [], // उन सभी मेश की लिस्ट जिनमें ब्लिंक शेप्स हैं
            targetIndices: [], // उनके रेस्पेक्टिव इंडेक्स
            timer: 0, nextBlinkTime: 1.5, state: 'open', duration: 0.0
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // ड्रेस-प्रूफ कैमरा सेटिंग्स (लॉक्ड डेटा - स्ट्रेट पैरेलल व्यू)
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // क्रिस्प और शार्प पिक्सल्स के लिए
        
        // 🎯 99% रीयलिस्टिक इंसानी चमक के लिए री-इंजीनियर्ड रेंडरिंग सेटिंग्स
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping; // हॉलीवुड फिल्म जैसी कलर ग्रेडिंग
        STATE.renderer.toneMappingExposure = 1.15; // चेहरे और कपड़ों पर लाइट का सही बैलेंस
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // अल्ट्रा-सॉफ्ट नेचुरल परछाइयां

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // 🎯 स्टूडियो क्वालिटी थ्री-पॉइंट लाइटिंग (चेहरे और ड्रेस को उभारने के लिए)
        const ambient = new THREE.AmbientLight(0xffffff, 0.65); // सॉफ्ट बेस लाइट ताकि अंधेरा न रहे
        STATE.scene.add(ambient);

        // मुख्य प्रकाश (सूरज/की-लाइट) जो असली स्किन पोर्स और परछाइयों को विजिबल करेगा
        const sunLight = new THREE.DirectionalLight(0xfff6ed, 1.6);
        sunLight.position.set(1.5, 3.5, 3.5);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048; // हाई-डेफिनिशन शैडो क्वालिटी
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0002;
        sunLight.shadow.normalBias = 0.02; // कपड़ों के कट्स पर गहरी लाइन्स रोकने के लिए
        STATE.scene.add(sunLight);

        // फिल लाइट (चेहरे के दूसरी तरफ की शैडो को सॉफ्ट रखने के लिए)
        const fillLight = new THREE.DirectionalLight(0xdbe9ff, 0.5);
        fillLight.position.set(-2, 1, 2);
        STATE.scene.add(fillLight);

        // रीम लाइट (पीछे से बालों और कंधों पर चमकीली इंसानी आउटलाइन देने के लिए)
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
        rimLight.position.set(-2, 3, -3);
        STATE.scene.add(rimLight);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            STATE.avatar.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // 🎯 स्किन और ड्रेस को 99% असली जैसा बनाने का मास्टर फॉर्मूला
                    if (node.material) {
                        node.material.roughness = 0.70; // प्लास्टिक शाइन पूरी तरह खत्म, नेचुरल स्किन और क्लॉथ मैट फिनिश
                        node.material.metalness = 0.01; // सिर्फ बहुत हल्की रीयलिस्टिक लाइट बाउंस
                        
                        // अगर टेक्सचर इमेज लोड हुई है, तो उसे धुंधला होने से रोककर क्रिस्टल क्लियर करना
                        if (node.material.map) {
                            node.material.map.anisotropy = STATE.renderer.capabilities.getMaxAnisotropy();
                            node.material.map.needsUpdate = true;
                        }
                    }

                    // 🎯 एवाटूर्न आई-ब्लिंक फिक्स (यूनिवर्सल सर्च इंजन)
                    if (node.morphTargetDictionary) {
                        for (let key in node.morphTargetDictionary) {
                            let lowerKey = key.toLowerCase();
                            // 'blink' शब्द वाले सभी शेप्स को ऑटोमैटिकली ढूंढना (चाहें वो आंख के हों या पलकों के)
                            if (lowerKey.includes('blink') && (lowerKey.includes('left') || lowerKey.includes('_l') || lowerKey.includes('right') || lowerKey.includes('_r'))) {
                                STATE.blink.meshes.push(node);
                                STATE.blink.targetIndices.push(node.morphTargetDictionary[key]);
                            }
                        }
                    }
                }
                
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck')) STATE.bones.neck = node;
                    if (n.includes('Head')) STATE.bones.head = node;
                    if (n.includes('Spine1') || n.includes('Spine')) STATE.bones.spine = node;
                }
            });

            // एनिमेशन लूप इंजन
            if (gltf.animations && gltf.animations.length > 0) {
                STATE.mixer = new THREE.AnimationMixer(STATE.avatar);
                gltf.animations.forEach((clip) => {
                    const action = STATE.mixer.clipAction(clip);
                    action.play();
                });
            }

            // मॉडल पोजीशन ग्राउंडेड
            STATE.avatar.position.set(0, -1.35, 0);

            // पहला रैंडम ब्लिंक टाइमर इनिशियलाइज़
            STATE.blink.nextBlinkTime = STATE.clock.getElapsedTime() + 1.5 + Math.random() * 2;

            animate();
        });

        setupEvents();
    }

    // 🎯 नेचुरल आई ब्लिंकिंग एक्ज़ीक्यूशन इंजन
    function updateBlinking(currentTime) {
        if (STATE.blink.meshes.length === 0) return;

        if (STATE.blink.state === 'open') {
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.05); // पलक झपकने की इंसानी स्पीड
            
            for (let i = 0; i < STATE.blink.meshes.length; i++) {
                STATE.blink.meshes[i].morphTargetInfluences[STATE.blink.targetIndices[i]] = progress;
            }

            if (progress >= 1.0) {
                STATE.blink.state = 'opening';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'opening') {
            STATE.blink.duration += 0.016;
            let progress = Math.min(1.0, STATE.blink.duration / 0.06);
            
            for (let i = 0; i < STATE.blink.meshes.length; i++) {
                STATE.blink.meshes[i].morphTargetInfluences[STATE.blink.targetIndices[i]] = 1.0 - progress;
            }

            if (progress >= 1.0) {
                STATE.blink.state = 'open';
                // हर 3 से 4 सेकंड में नेचुरल आई-ब्लिंक लूप रिपीट होगा
                STATE.blink.nextBlinkTime = currentTime + 2.5 + Math.random() * 3.0;
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

        // ब्लिंक रनर
        updateBlinking(time);
        
        // 🎯 परफेक्ट हेड एंगल और फ्रंट फेसिंग ट्रैकिंग रूल (लॉक्ड)
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // यूनिवर्सल ड्रेस-प्रूफ बेल्ट सेंटर लॉक (लॉक्ड डेटा)
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
