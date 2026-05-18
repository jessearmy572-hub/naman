/**
 * PROJECT MASTER CORE: a1 (TOTAL ARM FORCE OVERRIDE)
 */

"use strict";

(function () {
    const STATE = {
        scene: null, camera: null, renderer: null, clock: null, avatar: null,
        allArmBones: [], neckBone: null, headBone: null, mouseX: 0, mouseY: 0
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

        const ambient = new THREE.AmbientLight(0xffffff, 1.5);
        STATE.scene.add(ambient);
        const sun = new THREE.DirectionalLight(0xfff5ea, 1.2);
        sun.position.set(1, 3, 2);
        STATE.scene.add(sun);

        const loader = new THREE.GLTFLoader();
        loader.load("https://raw.githubusercontent.com/jessearmy572-hub/naman/main/model.glb", function (gltf) {
            STATE.avatar = gltf.scene;
            STATE.scene.add(STATE.avatar);

            // 🎯 मॉडल की पूरी रीढ़ और हाथों की हड्डियों को बिना नाम की परवाह किए पकड़ना
            STATE.avatar.traverse(function (node) {
                if (node.isBone) {
                    let n = node.name.toLowerCase();
                    
                    if (n.includes('neck')) STATE.neckBone = node;
                    if (n.includes('head')) STATE.headBone = node;
                    
                    // अगर नाम में इनमें से कुछ भी है, तो उसे लिस्ट में डालो
                    if (n.includes('arm') || n.includes('shoulder') || n.includes('forearm') || n.includes('hand') || n.includes('uparm')) {
                        STATE.allArmBones.push(node);
                    }
                }
            });

            forceHandsDown();
            STATE.avatar.position.set(0, -1.38, 0);
            animate();
        });

        setupEvents();
    }

    function forceHandsDown() {
        // मिली हुई सभी हड्डियों को एक-एक करके नीचे की तरफ मोड़ना
        STATE.allArmBones.forEach(bone => {
            let n = bone.name.toLowerCase();
            
            // बाएं हाथ की पूरी चेन को नीचे और थोड़ा शरीर के पास लाओ
            if (n.includes('left')) {
                bone.rotation.x = 0.2;
                bone.rotation.y = 0.1;
                bone.rotation.z = -1.3; // यह हाथ को नीचे गिराएगा
            }
            
            // दाएं हाथ की पूरी चेन को नीचे और थोड़ा शरीर के पास लाओ
            if (n.includes('right')) {
                bone.rotation.x = 0.2;
                bone.rotation.y = -0.1;
                bone.rotation.z = 1.3; // यह हाथ को नीचे गिराएगा
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        let time = STATE.clock.getElapsedTime();
        
        if (STATE.avatar) STATE.avatar.position.y = -1.38 + (Math.sin(time * 1.5) * 0.012);
        
        if (STATE.neckBone) {
            STATE.neckBone.rotation.y = THREE.MathUtils.lerp(STATE.neckBone.rotation.y, STATE.mouseX * 0.15, 0.05);
            STATE.neckBone.rotation.x = THREE.MathUtils.lerp(STATE.neckBone.rotation.x, STATE.mouseY * 0.10, 0.05);
        }
        if (STATE.headBone) {
            STATE.headBone.rotation.y = THREE.MathUtils.lerp(STATE.headBone.rotation.y, STATE.mouseX * 0.25, 0.05);
            STATE.headBone.rotation.x = THREE.MathUtils.lerp(STATE.headBone.rotation.x, STATE.mouseY * 0.15, 0.05);
        }

        // 🎯 हर सिंगल फ्रेम में फ़ोर्स अप्लाई करो ताकि T-Pose वापस आ ही न सके
        forceHandsDown();

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
