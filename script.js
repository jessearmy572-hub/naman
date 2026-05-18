/**
 * PROJECT MASTER CORE: a1
 * ADVANCED UPDATE: 99% HUMAN SKIN TEXTURE & NATURAL EYE BLINK ENGINE
 * ENGINE: GLTF ANIMATION + AUTOMATIC LOOK-AT TARGETING + HD LIGHTING
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
            leftMesh: null, rightMesh: null, // आँख के मेश
            targetIndexLeft: -1, targetIndexRight: -1, // ब्लिंक शेप इंडेक्स
            timer: 0, nextBlinkTime: 2.0, state: 'open', duration: 0.0
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // ड्रेसेस-प्रूफ कैमरा सेटिंग्स (लॉक्ड डेटा)
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // प्रीमियम एचडी रेंडर सेटिंग्स
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        STATE.renderer.toneMappingExposure = 1.0; 
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // एचडी रीयलिस्टिक लाइटिंग डेटा
        const ambient = new THREE.AmbientLight(0xffffff, 0.85);
        STATE.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
        sunLight.position.set(2, 4, 3);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0001;
        STATE.scene.add(sunLight);

        // रीम लाइट - बालों और स्किन बॉर्डर्स पर असली ग्लो देने के लिए
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.65);
        rimLight.position.set(-2, 2, -2);
        STATE.scene.add(rimLight);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            STATE.avatar.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // 🎯 99% इंसानों वाली स्किन और क्लॉथ टेक्सचर ट्यूनिंग
                    if (node.material) {
                        node.material.roughness = 0.72; // प्लास्टिक जैसी चमक खत्म, बिल्कुल नेचुरल स्किन रफनेस
                        node.material.metalness = 0.02; // सिर्फ बहुत हल्की सी रीयलिस्टिक रिफ्लेक्शन
                        if (node.material.map) node.material.map.anisotropy = 4; // टेक्सचर क्लेरिटी शार्प करने के लिए
                    }

                    // 🎯 आँख के मेश और ब्लिंक शेप्स (Morph Targets) को खोजना
                    if (node.morphTargetDictionary) {
                        // रेडी प्लेयर मी / एवाटूर्न मॉडल्स के स्टैंडर्ड ब्लिंक नाम ट्रैक करना
                        let leftBlink = node.morphTargetDictionary['eyeBlinkLeft'] || node.morphTargetDictionary['eyeBlink_L'] || node.morphTargetDictionary['eyesBlinkLeft'];
                        let rightBlink = node.morphTargetDictionary['eyeBlinkRight'] || node.morphTargetDictionary['eyeBlink_R'] || node.morphTargetDictionary['eyesBlinkRight'];
                        
                        if (leftBlink !== undefined) {
                            STATE.blink.leftMesh = node;
                            STATE.blink.targetIndexLeft = leftBlink;
                        }
                        if (rightBlink !== undefined) {
                            STATE.blink.rightMesh = node;
                            STATE.blink.targetIndexRight = rightBlink;
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

            // पहला ब्लिंक टाइम सेट करना
            STATE.blink.nextBlinkTime = STATE.clock.getElapsedTime() + 2 + Math.random() * 3;

            animate();
        });

        setupEvents();
    }

    // 🎯 नेचुरल आई ब्लिंकिंग (पलकें झपकना) का मास्टर इंजन
    function updateBlinking(currentTime) {
        if (!STATE.blink.leftMesh || !STATE.blink.rightMesh) return;

        let leftMesh = STATE.blink.leftMesh;
        let rightMesh = STATE.blink.rightMesh;
        let idxL = STATE.blink.targetIndexLeft;
        let idxR = STATE.blink.targetIndexRight;

        if (STATE.blink.state === 'open') {
            // अगर पलकें खुली हैं, तो चेक करो कि झपकने का समय हुआ या नहीं
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            // पलकें बंद हो रही हैं (स्पीड: 0.05 सेकंड)
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.05);
            leftMesh.morphTargetInfluences[idxL] = progress;
            rightMesh.morphTargetInfluences[idxR] = progress;

            if (progress >= 1.0) {
                STATE.blink.state = 'opening';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'opening') {
            // पलकें वापस खुल रही हैं (स्पीड: 0.06 सेकंड)
            STATE.blink.duration += 0.016;
            let progress = Math.min(1.0, STATE.blink.duration / 0.06);
            leftMesh.morphTargetInfluences[idxL] = 1.0 - progress;
            rightMesh.morphTargetInfluences[idxR] = 1.0 - progress;

            if (progress >= 1.0) {
                STATE.blink.state = 'open';
                // अगला ब्लिंक रैंडमली 3 से 5 सेकंड के बीच होगा
                STATE.blink.nextBlinkTime = currentTime + 3.0 + Math.random() * 2.5;
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

        // 🎯 ब्लिंक इंजन को हर फ्रेम में रन करना
        updateBlinking(time);
        
        // सामने की तरफ कैमरा फोकस और स्मूथ माउस ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // यूनिवर्सल वेस्ट फोकस (ड्रेस-प्रूफ लॉक)
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
                STATE.mouseY = Math.max(-0.2, Math.min(0.2, -(e.clientY / window.innerHeight) * 2 + 1));
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
