/**
 * PROJECT MASTER CORE: a1 (FIXED NECK ROTATION & STRUCTURAL INTEGRITY)
 */

const HAND_CONTROL_PANEL = {
    leftArm:  { x: 0.15, y: 0.1,  z: -1.35 }, 
    rightArm: { x: 0.15, y: -0.1, z: 1.35  }, 
    leftForearm:  { x: 0.0, y: 0.2,  z: 0.2   }, 
    rightForearm: { x: 0.0, y: -0.2, z: -0.2  }  
};

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        bones: { head: null, neck: null, leftArm: null, rightArm: null, leftForearm: null, rightForearm: null },
        morphs: [], blinkIdx: null, mouthIdx: null, 
        mouseX: 0, mouseY: 0 // डिफ़ॉल्ट रूप से सेंटर में लॉक
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        STATE.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.45, 1.95);

        STATE.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        STATE.renderer.setSize(window.innerWidth, window.innerHeight);
        STATE.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        const loader = new THREE.GLTFLoader();
        loader.load(url, function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let name = node.name.toLowerCase();
                    if (name.includes('head')) STATE.bones.head = node;
                    if (name.includes('neck')) STATE.bones.neck = node;
                    if (name === 'leftarm') STATE.bones.leftArm = node;
                    if (name === 'rightarm') STATE.bones.rightArm = node;
                    if (name === 'leftforearm') STATE.bones.leftForearm = node;
                    if (name === 'rightforearm') STATE.bones.rightForearm = node;
                }
                if (node.isMesh && node.morphTargetDictionary) {
                    STATE.morphs.push(node);
                    let dict = node.morphTargetDictionary;
                    for (let key in dict) {
                        if (key.toLowerCase().includes('blink')) STATE.blinkIdx = dict[key];
                        if (key.toLowerCase().includes('mouthopen') || key.toLowerCase().includes('viseme_aa')) STATE.mouthIdx = dict[key];
                    }
                }
            });

            applyHandPose();
            STATE.avatar.position.set(0, -1.38, 0);
            animate();
        }, undefined, function () {
            if (url !== "https://models.readyplayer.me/64a6603a6e9d690a29b5bb89.glb") {
                loadModel("https://models.readyplayer.me/64a6603a6e9d690a29b5bb89.glb");
            }
        });
        setupEvents();
    }

    function applyHandPose() {
        if (STATE.bones.leftArm) STATE.bones.leftArm.rotation.set(HAND_CONTROL_PANEL.leftArm.x, HAND_CONTROL_PANEL.leftArm.y, HAND_CONTROL_PANEL.leftArm.z);
        if (STATE.bones.rightArm) STATE.bones.rightArm.rotation.set(HAND_CONTROL_PANEL.rightArm.x, HAND_CONTROL_PANEL.rightArm.y, HAND_CONTROL_PANEL.rightArm.z);
        if (STATE.bones.leftForearm) STATE.bones.leftForearm.rotation.set(HAND_CONTROL_PANEL.leftForearm.x, HAND_CONTROL_PANEL.leftForearm.y, HAND_CONTROL_PANEL.leftForearm.z);
        if (STATE.bones.rightForearm) STATE.bones.rightForearm.rotation.set(HAND_CONTROL_PANEL.rightForearm.x, HAND_CONTROL_PANEL.rightForearm.y, HAND_CONTROL_PANEL.rightForearm.z);
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();

        // नेचुरल ब्रीदिंग
        let breath = Math.sin(time * 1.5) * 0.012;
        if (STATE.avatar) STATE.avatar.position.y = -1.38 + breath;

        // गर्दन घुमाना (सीमित एंगल के साथ रीयलिस्टिक ट्रैकिंग)
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.25, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.15, 0.05);
        }

        // पलकें झपकना
        if (STATE.morphs.length > 0 && STATE.blinkIdx !== null) {
            let blink = (Math.sin(time * 2.5) > 0.98) ? 1.0 : 0.0;
            for (let i = 0; i < STATE.morphs.length; i++) {
                STATE.morphs[i].morphTargetInfluences[STATE.blinkIdx] = blink;
            }
        }

        STATE.renderer.render(STATE.scene, STATE.camera);
    }

    function setupEvents() {
        window.addEventListener('mousemove', (e) => {
            // रोटेशन एंगल्स को बहुत ज्यादा मुड़ने से रोकने के लिए लिमिट लगाई है
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
