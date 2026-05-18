/**
 * PROJECT MASTER CORE: a1 
 * ENGINE: UNIVERSAL AVATURN AUTOMATIC FULL SCREEN FIT
 * LOOK: 100% NATURAL HUMAN POSE (ARMS DOWN)
 */

"use strict";

(function () {
    // a1 सेव्ड डेटा स्ट्रक्चर
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        bones: {
            leftArm: null, leftForearm: null,
            rightArm: null, rightForearm: null,
            neck: null, head: null
        },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // डायनेमिक कैमरा (यह स्क्रीन साइज के हिसाब से खुद को एडजस्ट करेगा)
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        // नेचुरल रीयलिस्टिक लाइटिंग (सॉफ्ट शैडोज के साथ)
        const ambient = new THREE.AmbientLight(0xffffff, 1.4);
        STATE.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xfff5ea, 1.1);
        sun.position.set(1, 3, 2);
        STATE.scene.add(sun);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // एवाटूर्न फुल बॉडी पार्ट नेम्स की सटीक स्कैनिंग
            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let n = node.name;
                    if (n.includes('Neck')) STATE.bones.neck = node;
                    if (n.includes('Head')) STATE.bones.head = node;
                    if (n.includes('LeftArm')) STATE.bones.leftArm = node;
                    if (n.includes('LeftForeArm')) STATE.bones.leftForearm = node;
                    if (n.includes('RightArm')) STATE.bones.rightArm = node;
                    if (n.includes('RightForeArm')) STATE.bones.rightForearm = node;
                }
            });

            // हाथों को स्वाभाविक रूप से नीचे सेट करना
            applyNaturalNormalPose();
            
            // कैमरा ऑटो-फिट इंजन को रन करना ताकि पूरी बॉडी स्क्रीन में समा जाए
            STATE.avatar.position.set(0, 0, 0);
            autoFitCameraToScreen();

            animate();
        });

        setupEvents();
    }

    // 🎯 मास्टर फार्मूला: हर डिवाइस पर ऑटोमैटिक फुल बॉडी स्क्रीन फिट के लिए
    function autoFitCameraToScreen() {
        if (!STATE.avatar || !STATE.camera) return;

        const box = new THREE.Box3().setFromObject(STATE.avatar);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = STATE.camera.fov * (Math.PI / 180);
        
        // स्क्रीन रेश्यो के हिसाब से कैमरे की परफेक्ट दूरी कैलकुलेट करना
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        // मोबाइल पर्ट्रेट व्यू के लिए एक्स्ट्रा सेफ गैप देना
        if (window.innerWidth < window.innerHeight) {
            cameraZ *= 1.35; 
        } else {
            cameraZ *= 1.1;
        }

        STATE.camera.position.z = cameraZ;
        STATE.camera.position.y = center.y; 
        STATE.camera.lookAt(center);

        // मॉडल के पैरों को ग्राउंड पर अलाइन करना
        STATE.avatar.position.y = -size.y / 2;
    }

    // 🎯 नेचुरल नॉर्मल इंसान पोज़ लॉजिक (आर्म्स डाउन)
    function applyNaturalNormalPose() {
        if (STATE.bones.leftArm) {
            STATE.bones.leftArm.rotation.set(0, 0, -1.32); // बायां हाथ नीचे झुका हुआ
        }
        if (STATE.bones.leftForearm) {
            STATE.bones.leftForearm.rotation.set(0, 0, -0.1);
        }

        if (STATE.bones.rightArm) {
            STATE.bones.rightArm.rotation.set(0, 0, 1.32); // दायां हाथ नीचे झुका हुआ
        }
        if (STATE.bones.rightForearm) {
            STATE.bones.rightForearm.rotation.set(0, 0, 0.1);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        
        // हल्का सा नेचुरल ब्रीदिंग मोशन
        if (STATE.avatar) {
            const baseBox = new THREE.Box3().setFromObject(STATE.avatar);
            const size = baseBox.getSize(new THREE.Vector3());
            STATE.avatar.position.y = (-size.y / 2) + (Math.sin(time * 1.3) * 0.003);
        }
        
        // माउस और टच के साथ गर्दन और सिर का घूमना
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.20, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.12, 0.05);
        }

        // हर फ्रेम में नेचुरल पोज़ को बनाए रखना
        applyNaturalNormalPose();

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
        
        // स्क्रीन का साइज बदलते ही ऑटोमैटिकली दोबारा री-कैलकुलेट करना
        window.addEventListener('resize', () => {
            if (STATE.camera && STATE.renderer) {
                STATE.camera.aspect = window.innerWidth / window.innerHeight;
                STATE.camera.updateProjectionMatrix();
                STATE.renderer.setSize(window.innerWidth, window.innerHeight);
                autoFitCameraToScreen();
            }
        });
    }

    window.onload = init;
})();
