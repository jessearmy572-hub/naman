/**
 * PROJECT MASTER CORE: a1 (AVATURN ENGINE - NATURAL HANDS DOWN)
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
        
        // फुल बॉडी/हाफ बॉडी फ्रेमिंग ताकि मॉडल स्क्रीन में परफेक्ट दिखे
        STATE.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        STATE.camera.position.set(0, 0.25, 1.5); 

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

            // 🎯 एवाटूर्न (Avaturn / Mixamo) के कंकाल को स्कैन करना
            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let n = node.name.toLowerCase();
                    
                    // गर्दन और सिर
                    if (n.includes('neck')) STATE.bones.neck = node;
                    if (n.includes('head')) STATE.bones.head = node;
                    
                    // बाएं हाथ की पूरी चेन (एवाटूर्न नेमिंग बाईपास)
                    if (n.includes('leftarm') || n.includes('arm_l') || (n.includes('left') && n.includes('arm') && !n.includes('forearm'))) {
                        STATE.bones.leftArm = node;
                    }
                    if (n.includes('leftforearm') || n.includes('forearm_l')) {
                        STATE.bones.leftForearm = node;
                    }
                    
                    // दाएं हाथ की पूरी चेन (एवाटूर्न नेमिंग बाईपास)
                    if (n.includes('rightarm') || n.includes('arm_r') || (n.includes('right') && n.includes('arm') && !n.includes('forearm'))) {
                        STATE.bones.rightArm = node;
                    }
                    if (n.includes('rightforearm') || n.includes('forearm_r')) {
                        STATE.bones.rightForearm = node;
                    }
                }
            });

            // एवाटूर्न मॉडल पर नेचुरल पोज़ अप्लाई करना
            applyAvaturnPose();
            
            STATE.avatar.position.set(0, -1.2, 0);
            animate();
        });

        setupEvents();
    }

    function applyAvaturnPose() {
        // 🎯 एवाटूर्न बाएं हाथ को नीचे लटकाना (X और Z एक्सिस रोटेशन)
        if (STATE.bones.leftArm) {
            STATE.bones.leftArm.rotation.x = 0.2;
            STATE.bones.leftArm.rotation.y = 0.0;
            STATE.bones.leftArm.rotation.z = -1.35; // नीचे की ओर झुकाव
        }
        if (STATE.bones.leftForearm) {
            STATE.bones.leftForearm.rotation.set(0, 0, 0);
        }

        // 🎯 एवाटूर्न दाएं हाथ को नीचे लटकाना
        if (STATE.bones.rightArm) {
            STATE.bones.rightArm.rotation.x = 0.2;
            STATE.bones.rightArm.rotation.y = 0.0;
            STATE.bones.rightArm.rotation.z = 1.35; // नीचे की ओर झुकाव
        }
        if (STATE.bones.rightForearm) {
            STATE.bones.rightForearm.rotation.set(0, 0, 0);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        
        // नेचुरल ब्रीदिंग मोशन
        if (STATE.avatar) STATE.avatar.position.y = -1.2 + (Math.sin(time * 1.4) * 0.005);
        
        // सिर और गर्दन की ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.25, 0.05);
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, STATE.mouseY * 0.15, 0.05);
        }

        // हर फ्रेम में एवाटूर्न पोज़ को फ़ोर्स करना
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
