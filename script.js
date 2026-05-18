/**
 * PROJECT MASTER CORE: a1 (DIRECT SKELETON FORCE POSE)
 */

// 🛠️ कंट्रोल पैनल - हाथों को परफेक्ट पोजीशन में लाने के लिए एंगल्स
const HAND_CONTROL_PANEL = {
    leftArm:  { x: 0.3,  y: 0.0,  z: -1.20 }, // बायां हाथ नीचे
    rightArm: { x: 0.3,  y: 0.0,  z: 1.20  }  // दायां हाथ नीचे
};

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        bones: { head: null, neck: null, leftArm: null, rightArm: null },
        mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        STATE.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.45, 1.95);

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.outputEncoding = THREE.sRGBEncoding;

        const container = document.getElementById('canvas-viewport');
        if (container) container.appendChild(STATE.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.4);
        STATE.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xfff5ea, 1.2);
        sun.position.set(1, 3, 2);
        STATE.scene.add(sun);

        // मॉडल लोड करना
        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // 🎯 डायरेक्ट बाईपास: मॉडल के स्केलेटन में घुसकर हड्डियों को ढूंढना
            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let name = node.name;
                    if (name.toLowerCase().includes('head')) STATE.bones.head = node;
                    if (name.toLowerCase().includes('neck')) STATE.bones.neck = node;
                    
                    // नाम चाहे जो भी हो, अगर LeftArm या RightArm का कोई भी हिस्सा है तो पकड़ लो
                    if (name.includes('LeftArm') || name.includes('leftArm') || name === 'LeftArm') {
                        STATE.bones.leftArm = node;
                    }
                    if (name.includes('RightArm') || name.includes('rightArm') || name === 'RightArm') {
                        STATE.bones.rightArm = node;
                    }
                }
            });

            // हाथों की पोजीशन को जबरदस्ती सेट करना
            forcePose();
            STATE.avatar.position.set(0, -1.38, 0);
            animate();
        });

        setupEvents();
    }

    function forcePose() {
        // अगर ट्रेवर्स से नहीं मिला, तो डायरेक्ट स्केलेटन से एंगल्स अप्लाई करना
        if (STATE.bones.leftArm) STATE.bones.leftArm.rotation.set(HAND_CONTROL_PANEL.leftArm.x, HAND_CONTROL_PANEL.leftArm.y, HAND_CONTROL_PANEL.leftArm.z);
        if (STATE.bones.rightArm) STATE.bones.rightArm.rotation.set(HAND_CONTROL_PANEL.rightArm.x, HAND_CONTROL_PANEL.rightArm.y, HAND_CONTROL_PANEL.rightArm.z);
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        
        if (STATE.avatar) STATE.avatar.position.y = -1.38 + (Math.sin(time * 1.5) * 0.012);
        
        // गर्दन और सिर की स्मूथ ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.25, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.15, 0.05);
        }

        // 🎯 हर फ्रेम में हाथों को लॉक रखना ताकि कोई दूसरा एनीमेशन इन्हें वापस T-Pose में न ले जाए
        forcePose();

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
    }

    window.onload = init;
})();
