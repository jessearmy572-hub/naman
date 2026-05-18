/**
 * PROJECT MASTER CORE: a1
 * DATA UPDATE: HD REALISM & SHADOW MAPPING ENGINE
 * CAMERA: FIXED FULL BODY FIT (NO HEAD CUT)
 * ENGINE: FULL GLTF ANIMATION PLAYBACK
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        mixer: null,
        bones: {
            neck: null, head: null
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // a1 कैलिब्रेटेड कैमरा सेटिंग्स (लॉक्ड डेटा)
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.2, 3.0); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 🎯 न्यू एचडी डेटा: एडवांस्ड कलर और लाइटिंग रेंडरिंग एक्टिवेशन
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping; // सिनेमाई एचडी टोनमैपिंग
        STATE.renderer.toneMappingExposure = 1.0; 
        STATE.renderer.shadowMap.enabled = true; // रीयल-टाइम परछाइयां ऑन
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // सॉफ्ट शैडो इफ़ेक्ट

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // 🎯 री-इंजीनियर्ड लाइटिंग डेटा (असली दुनिया जैसी चमक के लिए)
        const ambient = new THREE.AmbientLight(0xffffff, 0.9); // सॉफ्ट बेस लाइट
        STATE.scene.add(ambient);

        // मुख्य सूरज की रोशनी जो चेहरे पर परफेक्ट कट्स और परछाइयां बनाएगी
        const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
        sunLight.position.set(2, 4, 3);
        sunLight.castShadow = true; // इस लाइट से परछाइयां बनेंगी
        sunLight.shadow.mapSize.width = 2048; // हाई क्वालिटी शैडो रेजोल्यूशन
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0001;
        STATE.scene.add(sunLight);

        // बैकलाइट (Rim Light) बालों और कंधों को बैकग्राउंड से अलग चमकाने के लिए
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
        rimLight.position.set(-2, 2, -2);
        STATE.scene.add(rimLight);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // एवाटूर्न मॉडल पर शैडो को एक्टिवेट करना
            STATE.avatar.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    // कपड़ों और स्किन के टेक्सचर को और ज्यादा क्रिस्प (HD) करना
                    if (node.material) {
                        node.material.roughness = 0.65; // अत्यधिक प्लास्टिक जैसी शाइन को हटाना
                        node.material.metalness = 0.0;
                    }
                }
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck')) STATE.bones.neck = node;
                    if (n.includes('Head')) STATE.bones.head = node;
                }
            });

            // एनिमेशन लूप इंजन (लॉक्ड डेटा नियम)
            if (gltf.animations && gltf.animations.length > 0) {
                STATE.mixer = new THREE.AnimationMixer(STATE.avatar);
                gltf.animations.forEach((clip) => {
                    const action = STATE.mixer.clipAction(clip);
                    action.play();
                });
            }

            // मॉडल पोजीशन (लॉक्ड डेटा नियम)
            STATE.avatar.position.set(0, -1.0, 0);

            animate();
        });

        setupEvents();
    }

    function animate() {
        requestAnimationFrame(animate);
        let delta = STATE.clock.getDelta();
        
        if (STATE.mixer) {
            STATE.mixer.update(delta);
        }
        
        // गर्दन और सिर की स्मूथ माउस/टच ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.20, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.12, 0.05);
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
