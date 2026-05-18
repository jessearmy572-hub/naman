/**
 * PROJECT MASTER CORE: a1 (DEBUGGER SYSTEM)
 */

const HAND_CONTROL_PANEL = {
    leftArm:  { x: 0.2,  y: 0.1,  z: -1.25 }, 
    rightArm: { x: 0.2,  y: -0.1, z: 1.25  }
};

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        bones: {}, morphs: [], mouseX: 0, mouseY: 0
    };

    function updateStatus(msg) {
        const el = document.getElementById('loading-status');
        if (el) el.innerText = msg;
    }

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

        loadModel("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb");
    }

    function loadModel(url) {
        updateStatus("SCANNING MODEL BONES...");
        const loader = new THREE.GLTFLoader();
        
        loader.load(url, function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            let detectedBones = [];

            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let name = node.name;
                    // अगर नाम में Arm, Shoulder, या Hand आता है तो उसे रिकॉर्ड कर लो
                    if (name.toLowerCase().includes('arm') || name.toLowerCase().includes('shoulder')) {
                        detectedBones.push(name);
                    }

                    // मैचिंग चेक
                    if (name.toLowerCase().includes('head')) STATE.bones.head = node;
                    if (name.toLowerCase().includes('neck')) STATE.bones.neck = node;
                    if (name.toLowerCase() === 'leftarm' || name === 'LeftArm') STATE.bones.leftArm = node;
                    if (name.toLowerCase() === 'rightarm' || name === 'RightArm') STATE.bones.rightArm = node;
                }
            });

            // 🎯 जादू: स्क्रीन के स्टेटस बार में असली नाम प्रिंट करना
            if (detectedBones.length > 0) {
                // पहले 3 नाम दिखाओ जो मिले हैं
                updateStatus("FOUND BONES: " + detectedBones.slice(0, 3).join(', '));
            } else {
                updateStatus("NO ARM BONES FOUND! USING STANDARD POSE.");
            }

            // रोटेशन लगाने की कोशिश
            if (STATE.bones.leftArm) STATE.bones.leftArm.rotation.set(HAND_CONTROL_PANEL.leftArm.x, HAND_CONTROL_PANEL.leftArm.y, HAND_CONTROL_PANEL.leftArm.z);
            if (STATE.bones.rightArm) STATE.bones.rightArm.rotation.set(HAND_CONTROL_PANEL.rightArm.x, HAND_CONTROL_PANEL.rightArm.y, HAND_CONTROL_PANEL.rightArm.z);

            STATE.avatar.position.set(0, -1.38, 0);
            animate();
        });
        setupEvents();
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        if (STATE.avatar) STATE.avatar.position.y = -1.38 + (Math.sin(time * 1.5) * 0.012);
        
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.25, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.15, 0.05);
        }
        STATE.renderer.render(STATE.scene, STATE.camera);
    }

    function setupEvents() {
        window.addEventListener('mousemove', (e) => {
            STATE.mouseX = Math.max(-0.4, Math.min(0.4, (e.clientX / window.innerWidth) * 2 - 1));
            STATE.mouseY = Math.max(-0.2, Math.min(0.2, -(e.clientY / window.innerHeight) * 2 + 1));
        });
    }

    window.onload = init;
})();
