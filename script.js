/**
 * PROJECT MASTER CORE: a1 (CAMERA ZOOM - PERFECT FIT)
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        neckBone: null, headBone: null, mouseX: 0, mouseY: 0
    };

    function init() {
        STATE.clock = new THREE.Clock();
        STATE.scene = new THREE.Scene();
        
        // 🎯 कैमरे की पोजीशन (Z-axis = 0.9) को पास लाया गया है ताकि हाथ स्क्रीन से बाहर छिप जाएं
        STATE.camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.45, 0.9); 

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

            // मॉडल को छुए बिना सिर्फ सिर और गर्दन को माउस/टच ट्रैकिंग के लिए सिंक करना
            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let n = node.name.toLowerCase();
                    if (n.includes('neck')) STATE.neckBone = node;
                    if (n.includes('head')) STATE.headBone = node;
                }
            });

            // मॉडल को स्क्रीन के निचले हिस्से में सही तरीके से टिकाना
            STATE.avatar.position.set(0, -1.45, 0);
            animate();
        });

        setupEvents();
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        
        // नेचुरल ब्रीदिंग मोशन
        if (STATE.avatar) STATE.avatar.position.y = -1.45 + (Math.sin(time * 1.5) * 0.005);
        
        // स्मूथ फेस ट्रैकिंग
        if (STATE.neckBone) {
            STATE.neckBone.rotation.y = THREE.MathUtils.lerp(STATE.neckBone.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.neckBone.rotation.x = THREE.MathUtils.lerp(STATE.neckBone.rotation.x, STATE.mouseY * 0.08, 0.05);
        }
        if (STATE.headBone) {
            STATE.headBone.rotation.y = THREE.MathUtils.lerp(STATE.headBone.rotation.y, STATE.mouseX * 0.20, 0.05);
            STATE.headBone.rotation.x = THREE.MathUtils.lerp(STATE.headBone.rotation.x, STATE.mouseY * 0.12, 0.05);
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
