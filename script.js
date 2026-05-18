    // 🎯 मॉडिफाइड ब्लिंक इंजन: जो एनीमेशन के ऊपर अपना हक जमाएगा
    function updateBlinking(currentTime) {
        if (STATE.blink.targets.length === 0) return;

        if (STATE.blink.state === 'open') {
            if (currentTime >= STATE.blink.nextBlinkTime) {
                STATE.blink.state = 'closing';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'closing') {
            STATE.blink.duration += 0.016; 
            let progress = Math.min(1.0, STATE.blink.duration / 0.05); // फ़ास्ट क्लोज़
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'opening';
                STATE.blink.duration = 0.0;
            }
        } else if (STATE.blink.state === 'opening') {
            STATE.blink.duration += 0.016;
            let progress = Math.min(1.0, STATE.blink.duration / 0.06); // स्मूथ ओपन
            
            STATE.blink.targets.forEach(t => {
                t.mesh.morphTargetInfluences[t.index] = 1.0 - progress;
            });

            if (progress >= 1.0) {
                STATE.blink.state = 'open';
                STATE.blink.nextBlinkTime = currentTime + 2.0 + Math.random() * 3.0; 
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        let delta = STATE.clock.getDelta();
        let time = STATE.clock.getElapsedTime();
        
        // 1. पहले डिफ़ॉल्ट एनीमेशन को अपडेट होने दो (यह आँखों को खोल देगा)
        if (STATE.mixer) {
            STATE.mixer.update(delta);
        }

        // 2. 🎯 क्रिटिकल फिक्स: एनीमेशन चलने के ठीक बाद ब्लिंक इंजन चलाओ 
        // ताकि हमारा कोड एनीमेशन के प्रभाव को जबरदस्ती दबा (Override) सके
        updateBlinking(time);
        
        // हेड एंगल ट्रैकिंग
        if (STATE.bones.neck) {
            STATE.bones.neck.rotation.y = THREE.MathUtils.lerp(STATE.bones.neck.rotation.y, STATE.mouseX * 0.12, 0.05);
            STATE.bones.neck.rotation.x = THREE.MathUtils.lerp(STATE.bones.neck.rotation.x, (STATE.mouseY * 0.08) - 0.02, 0.05);
        }
        if (STATE.bones.head) {
            STATE.bones.head.rotation.y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(STATE.bones.head.rotation.y, STATE.mouseX * 0.15, 0.05));
            STATE.bones.head.rotation.x = THREE.MathUtils.lerp(STATE.bones.head.rotation.x, (STATE.mouseY * 0.10) - 0.03, 0.05);
        }

        // a1 RULE: यूनिवर्सल वेस्ट फोकस लॉक
        if (STATE.camera && STATE.bones.spine) {
            const targetPos = new THREE.Vector3();
            STATE.bones.spine.getWorldPosition(targetPos);
            STATE.camera.lookAt(targetPos);
        }

        STATE.renderer.render(STATE.scene, STATE.camera);
    }
