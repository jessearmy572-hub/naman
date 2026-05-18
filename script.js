/**
 * PROJECT MASTER CORE: a1 (UNIVERSAL AVATURN CORE - AUTOMATIC FULL BODY SCREEN FIT)
 */

"use strict";

(function () {
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
        
        // कैमरा इनिशियलाइजेशन (ऑटो-फिट होने तक यह डिफॉल्ट रहेगा)
        STATE.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0, 3); 

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.5);
        STATE.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xfff5ea, 1.2);
        sun.position.set(1, 3, 2);
        STATE.scene.add(sun);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // 🔍 एवाटूर्न कंकाल मैपिंग
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

            // हाथों को नीचे लटकाने का पोज़ लगाना
            applyAvaturnPose();
            
            // 🎯 मॉडल को ग्राउंड लेवल पर सेट करके ऑटोमैटिक कैमरा फिट फंक्शन चलाना
            STATE.avatar.position.set(0, 0, 0);
            autoFitCameraToAvatar();

            animate();
        });

        setupEvents();
    }

    // 🎯 सबसे जरूरी फार्मूला: जो हर डिवाइस के हिसाब से कैमरा खुद एडजस्ट करता है
    function autoFitCameraToAvatar() {
        if (!STATE.avatar || !STATE.camera) return;

        // मॉडल का पूरा साइज और हाइट नापना
        const box = new THREE.Box3().setFromObject(STATE.avatar);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = STATE.camera.fov * (Math.PI / 180);
        
        // स्क्रीन के आस्पेक्ट रेश्यो के हिसाब से कैमरे की सही दूरी का हिसाब लगाना
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        // मोबाइल (पर्ट्रेट स्क्रीन) पर पैर न कटें, इसलिए थोड़ा और एक्स्ट्रा स्पेस देना
        if (window.innerWidth < window.innerHeight) {
            cameraZ *= 1.4; 
        } else {
            cameraZ *= 1.1;
        }

        // कैमरे को मॉडल के बिल्कुल सामने सेंटर पर लॉक करना
        STATE.camera.position.z = cameraZ;
        STATE.camera.position.y = center.y; 
        STATE.camera.lookAt(center);

        // मॉडल की बेस पोजीशन को स्क्रीन के नीचे के हिस्से में सिंक करना
        STATE.avatar.position.y = -size.y / 2;
    }

    function applyAvaturnPose() {
        // दोनों हाथों को 100% नीचे नेचुरल लॉक रखना
        if (STATE.bones.leftArm) STATE.bones.leftArm.rotation.set(0, 0, -1.32); 
        if (STATE.bones.leftForearm) STATE.bones.leftForearm.rotation.set(0, 0, -0.1);

        if (STATE.bones.rightArm) STATE.bones.rightArm.rotation.set(0, 0, 1.32); 
        if (STATE.bones.rightForearm) STATE.bones.rightForearm.rotation.set(0, 0, 0.1);
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        
        // स्थिर और नेचुरल ब्रीदिंग इफेक्ट
        if (STATE.avatar) {
            const baseBox = new THREE.Box3().setFromObject(STATE.avatar);
            const size = baseBox.getSize(new THREE.Vector3());
            STATE.avatar.position.y = (-size.y / 2) + (Math.sin(time * 1.3) * 0.003);
        }
        
        // हेड और आई ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.20, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.12, 0.05);
        }

        applyAvaturnPose();

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
        
        // स्क्रीन रोटेट करने या रीसाइज करने पर वापस ऑटो-फिट करना
        window.addEventListener('resize', () => {
            if (STATE.camera && STATE.renderer) {
                STATE.camera.aspect = window.innerWidth / window.innerHeight;
                STATE.camera.updateProjectionMatrix();
                STATE.renderer.setSize(window.innerWidth, window.innerHeight);
                autoFitCameraToAvatar(); // रीसाइज पर ऑटो-कैलकुलेट
            }
        });
    }

    window.onload = init;
})();
