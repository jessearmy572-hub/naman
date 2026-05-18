/**
 * PROJECT MASTER CORE: a1 
 * ENGINE: GLTF ANIMATION MIXER ACTIVE (NATURAL MOTION)
 * CAMERA: FIXED FULL BODY FIT (NO HEAD CUT)
 */

"use strict";

(function () {
    // a1 मास्टर डेटा स्ट्रक्चर
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        mixer: null, // 🎯 तुम्हारी फाइल का नेचुरल मोशन प्ले करने वाला प्लेयर
        bones: {
            neck: null, head: null
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // 🎯 फिक्स मैनुअल कैमरा सेटिंग्स: सिर से पैर तक फुल बॉडी बिना कटे दिखाने के लिए
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.15, 2.3); // परफेक्ट दूरी और ऊंचाई पर लॉक

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // सॉफ्ट नेचुरल रीयलिस्टिक लाइटिंग
        const ambient = new THREE.AmbientLight(0xffffff, 1.4);
        STATE.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xfff5ea, 1.1);
        sun.position.set(1, 3, 2);
        STATE.scene.add(sun);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // 🎯 एनिमेशन प्लेयर चालू करना और फाइल का नेचुरल मोशन प्ले करना
            if (gltf.animations && gltf.animations.length > 0) {
                STATE.mixer = new THREE.AnimationMixer(STATE.avatar);
                // फाइल के पहले एनिमेशन (जो कि नेचुरल पोज़ है) को प्ले करना
                const action = STATE.mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // हेड ट्रैकिंग के लिए हड्डियां ढूंढना
            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck')) STATE.bones.neck = node;
                    if (n.includes('Head')) STATE.bones.head = node;
                }
            });

            // मॉडल को स्क्रीन के निचले हिस्से में सेट करना
            STATE.avatar.position.set(0, -0.95, 0);

            animate();
        });

        setupEvents();
    }

    function animate() {
        requestAnimationFrame(animate);
        let delta = STATE.clock.getDelta();
        
        // 🎯 हर फ्रेम में एनिमेशन प्लेयर को अपडेट करना ताकि मोशन चलता रहे
        if (STATE.mixer) {
            STATE.mixer.update(delta);
        }
        
        // माउस और टच के साथ गर्दन और सिर का नेचुरल घूमना
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
