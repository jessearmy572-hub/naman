/**
 * PROJECT MASTER CORE: a1
 * UPDATE: PERFECT FRONT FACING LOOK LOCK (SAMNE DEKHNA)
 * ENGINE: GLTF ANIMATION + HD LIGHTING + SHADOWS
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
        
        // कैलिब्रेटेड फुल-बॉडी कैमरा दूरी (जूते से सिर तक परफेक्ट विजुअल)
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.05, 4.3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // प्रीमियम रेंडर सेटिंग्स
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;
        STATE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        STATE.renderer.toneMappingExposure = 1.0; 
        STATE.renderer.shadowMap.enabled = true;
        STATE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // एचडी लाइटिंग
        const ambient = new THREE.AmbientLight(0xffffff, 0.9);
        STATE.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
        sunLight.position.set(2, 4, 3);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0001;
        STATE.scene.add(sunLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
                    if (node.material) {
                        node.material.roughness = 0.65;
                        node.material.metalness = 0.0;
                    }
                }
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck')) STATE.bones.neck = node;
                    if (n.includes('Head')) STATE.bones.head = node;
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
            STATE.avatar.position.set(0, -1.32, 0);

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
        
        // 🎯 मॉडल को बिल्कुल सामने की तरफ (Front) फोकस रखने का मास्टर फार्मूला
        // डिफ़ॉल्ट ऑफ-सेट को हटाकर माउस ट्रैकिंग को बिल्कुल सीधा (Centered) कर दिया है
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05); // सीधा देखने के लिए झुकाव फिक्स
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05); // आँखों का फोकस कैमरा की तरफ लॉक
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
