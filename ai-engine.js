/* =====================================================================================
PRIYA AI AVATAR ULTIMATE ENGINE v12 FINAL
FULLY FIXED + FALLBACK SYSTEMS + AVATURN SAFE VERSION
===================================================================================== */

/* =====================================================================================
IMPORTANT

REQUIRED LIBRARIES:

   <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>   <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js"></script>   <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js"></script>HTML REQUIRED:

<canvas id="avatarCanvas"></canvas>

Put your avaturn .glb model:
./avatar.glb

===================================================================================== */

"use strict";

/* =====================================================================================
CONFIG
===================================================================================== */

const CONFIG = {
GEMINI_API_KEY: "",

GEMINI_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",

CAMERA: {
    fov: 35,
    near: 0.1,
    far: 1000,
    x: 0,
    y: 1.4,
    z: 2.2
},

LIGHTING: {
    ambient: 1.5,
    directional: 2.2
},

MODEL_PATH: "./avatar.glb"

};

/* =====================================================================================
GLOBALS
===================================================================================== */

let scene;
let camera;
let renderer;
let controls;
let avatar;
let mixer;
let clock = new THREE.Clock();

let headBone = null;
let spineBone = null;

const STATE = {
processing: false,
mood: "neutral",
morphMeshes: [],
webcamEnabled: false,
audioLevel: 0,
currentDressColor: 0xffffff,
userName: "Naman"
};

/* =====================================================================================
MEMORY
===================================================================================== */

const Memory = {
prefix: "priya_ai_",

get(key, fallback = "") {
    try {
        return localStorage.getItem(this.prefix + key) || fallback;
    } catch {
        return fallback;
    }
},

set(key, value) {
    try {
        localStorage.setItem(this.prefix + key, value);
    } catch {}
}

};

/* =====================================================================================
SCENE INIT
===================================================================================== */

function initScene() {
const canvas = document.getElementById("avatarCanvas");

scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

camera = new THREE.PerspectiveCamera(
    CONFIG.CAMERA.fov,
    window.innerWidth / window.innerHeight,
    CONFIG.CAMERA.near,
    CONFIG.CAMERA.far
);

camera.position.set(
    CONFIG.CAMERA.x,
    CONFIG.CAMERA.y,
    CONFIG.CAMERA.z
);

renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.outputColorSpace = THREE.SRGBColorSpace;

controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.target.set(0, 1.2, 0);

controls.enableDamping = true;

/* LIGHTS */

const ambient = new THREE.AmbientLight(
    0xffffff,
    CONFIG.LIGHTING.ambient
);

scene.add(ambient);

const dir = new THREE.DirectionalLight(
    0xffffff,
    CONFIG.LIGHTING.directional
);

dir.position.set(5, 10, 7);

scene.add(dir);

const hemi = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    1.2
);

scene.add(hemi);

window.addEventListener("resize", onResize);

}

function onResize() {
camera.aspect = window.innerWidth / window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth, window.innerHeight);

}

/* =====================================================================================
LOAD AVATAR
===================================================================================== */

function loadAvatar() {
const loader = new THREE.GLTFLoader();

loader.load(
    CONFIG.MODEL_PATH,

    (gltf) => {
        avatar = gltf.scene;

        scene.add(avatar);

        mixer = new THREE.AnimationMixer(avatar);

        if (gltf.animations.length > 0) {
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }

        avatar.traverse((obj) => {
            /* MORPHS */

            if (
                obj.isMesh &&
                obj.morphTargetDictionary &&
                obj.morphTargetInfluences
            ) {
                STATE.morphMeshes.push(obj);
            }

            /* BONES */

            if (obj.isBone) {
                const n = obj.name.toLowerCase();

                if (n.includes("head")) {
                    headBone = obj;
                }

                if (
                    n.includes("spine") ||
                    n.includes("chest")
                ) {
                    spineBone = obj;
                }
            }

            /* SHADOWS */

            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        console.log("Avatar Loaded");
        console.log("Morph Meshes:", STATE.morphMeshes.length);
    },

    undefined,

    (err) => {
        console.error("Avatar Load Error:", err);
    }
);

}

/* =====================================================================================
MORPH SYSTEM
===================================================================================== */

function setMorph(name, value) {
STATE.morphMeshes.forEach((mesh) => {
const idx = mesh.morphTargetDictionary[name];

    if (idx !== undefined) {
        mesh.morphTargetInfluences[idx] = value;
    }
});

}

function resetFace() {
const names = [
"mouthSmileLeft",
"mouthSmileRight",
"eyeBlinkLeft",
"eyeBlinkRight",
"jawOpen",
"mouthOpen",
"browInnerUp",
"mouthFrownLeft",
"mouthFrownRight"
];

names.forEach((n) => setMorph(n, 0));

}

function expression(type) {
resetFace();

switch (type) {
    case "happy":
        setMorph("mouthSmileLeft", 0.8);
        setMorph("mouthSmileRight", 0.8);
        break;

    case "sad":
        setMorph("mouthFrownLeft", 0.7);
        setMorph("mouthFrownRight", 0.7);
        break;

    case "cute":
        setMorph("mouthSmileLeft", 0.4);
        setMorph("mouthSmileRight", 0.4);
        break;
}

}

/* =====================================================================================
AUTO BLINK
===================================================================================== */

let blinkTimer = 0;

function autoBlink(delta) {
blinkTimer += delta;

if (blinkTimer > 3 + Math.random() * 2) {
    blinkTimer = 0;

    setMorph("eyeBlinkLeft", 1);
    setMorph("eyeBlinkRight", 1);

    setTimeout(() => {
        setMorph("eyeBlinkLeft", 0);
        setMorph("eyeBlinkRight", 0);
    }, 120);
}

}

/* =====================================================================================
BREATHING
===================================================================================== */

function breathing(time) {
if (!spineBone) return;

const scale = 1 + Math.sin(time * 2) * 0.01;

spineBone.scale.set(scale, scale, scale);

}

/* =====================================================================================
HEAD FOLLOW
===================================================================================== */

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
mouseX = (e.clientX / window.innerWidth) * 2 - 1;
mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

function headTracking() {
if (!headBone) return;

headBone.rotation.y = mouseX * 0.3;

headBone.rotation.x = -mouseY * 0.15;

}

/* =====================================================================================
WEBCAM
===================================================================================== */

async function initWebcam() {
try {
const stream = await navigator.mediaDevices.getUserMedia({
video: true
});

    const video = document.createElement("video");

    video.srcObject = stream;

    video.autoplay = true;

    video.playsInline = true;

    video.style.display = "none";

    document.body.appendChild(video);

    STATE.webcamEnabled = true;

    console.log("Webcam Started");
} catch (err) {
    console.log("Webcam Denied");
}

}

/* =====================================================================================
DRESS SYSTEM
===================================================================================== */

const DRESS_COLORS = {
red: 0xff0000,
green: 0x00aa55,
blue: 0x3366ff,
white: 0xffffff,
black: 0x111111,
pink: 0xff69b4
};

function changeDress(colorName) {
const color = DRESS_COLORS[colorName];

if (!color || !avatar) return false;

avatar.traverse((obj) => {
    if (!obj.isMesh) return;

    const n = obj.name.toLowerCase();

    if (
        n.includes("dress") ||
        n.includes("outfit") ||
        n.includes("cloth") ||
        n.includes("top") ||
        n.includes("body")
    ) {
        if (obj.material && obj.material.color) {
            obj.material.color.set(color);
        }
    }
});

STATE.currentDressColor = color;

Memory.set("dress", colorName);

return true;

}

/* =====================================================================================
LIP SYNC
===================================================================================== */

function fakeLipSyncStart() {
window.fakeLipInterval = setInterval(() => {
if (speechSynthesis.speaking) {
const level = Math.random() * 0.9;

        setMorph("jawOpen", level);

        setMorph("mouthOpen", level);
    } else {
        clearInterval(window.fakeLipInterval);

        setMorph("jawOpen", 0);

        setMorph("mouthOpen", 0);
    }
}, 80);

}

/* =====================================================================================
SPEECH
===================================================================================== */

function speak(text) {
speechSynthesis.cancel();

const utter = new SpeechSynthesisUtterance(text);

utter.rate = 1;

utter.pitch = 1.1;

utter.lang = "hi-IN";

fakeLipSyncStart();

speechSynthesis.speak(utter);

}

/* =====================================================================================
LOCAL AI FALLBACK
===================================================================================== */

function localAI(message) {
const msg = message.toLowerCase();

if (msg.includes("love")) {
    return "Main bhi aapse bohot pyaar karti hoon babu ❤️";
}

if (msg.includes("sad")) {
    return "Aww babu udaas mat ho 😢";
}

if (msg.includes("kiss")) {
    return "Sharma rahi hoon main 😘";
}

if (msg.includes("hello")) {
    return "Hello babu 🥰";
}

return "Main yahin hoon babu ❤️";

}

/* =====================================================================================
GEMINI AI
===================================================================================== */

async function askAI(message) {
if (!CONFIG.GEMINI_API_KEY) {
return localAI(message);
}

try {
    const body = {
        contents: [
            {
                parts: [
                    {
                        text:
                            "You are Priya, a cute emotional AI girlfriend. Reply in Hinglish.\nUser: " +
                            message
                    }
                ]
            }
        ]
    };

    const res = await fetch(
        `${CONFIG.GEMINI_URL}?key=${CONFIG.GEMINI_API_KEY}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)
        }
    );

    const data = await res.json();

    return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        localAI(message)
    );
} catch {
    return localAI(message);
}

}

/* =====================================================================================
MAIN CHAT
===================================================================================== */

async function sendMessageToPriya(message) {
if (STATE.processing) {
return "Ek second babu 😘";
}

STATE.processing = true;

try {
    const msg = message.toLowerCase();

    /* DRESS */

    if (msg.includes("red")) {
        changeDress("red");

        expression("happy");

        const r = "Maine red dress pehen li babu ❤️";

        speak(r);

        STATE.processing = false;

        return r;
    }

    if (msg.includes("green")) {
        changeDress("green");

        expression("happy");

        const r = "Green dress pehen li babu 💚";

        speak(r);

        STATE.processing = false;

        return r;
    }

    if (msg.includes("pink")) {
        changeDress("pink");

        expression("cute");

        const r = "Pink dress pehen li babu 💖";

        speak(r);

        STATE.processing = false;

        return r;
    }

    /* AI */

    const reply = await askAI(message);

    if (
        reply.includes("❤️") ||
        reply.includes("😘") ||
        reply.includes("love") ||
        reply.includes("pyaar")
    ) {
        expression("happy");
    }

    speak(reply);

    STATE.processing = false;

    return reply;
} catch (err) {
    console.error(err);

    STATE.processing = false;

    return "Error aa gaya babu 😢";
}

}

/* =====================================================================================
TOUCH INTERACTION
===================================================================================== */

window.addEventListener("click", () => {
expression("cute");

speak("Aww touch kiya aapne 😘");

});

/* =====================================================================================
ANIMATION LOOP
===================================================================================== */

function animate() {
requestAnimationFrame(animate);

const delta = clock.getDelta();

const elapsed = clock.elapsedTime;

if (mixer) mixer.update(delta);

autoBlink(delta);

breathing(elapsed);

headTracking();

controls.update();

renderer.render(scene, camera);

}

/* =====================================================================================
BACKGROUND VIDEO
===================================================================================== */

function createBackgroundVideo() {
const video = document.createElement("video");

video.src =
    "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4";

video.autoplay = true;

video.loop = true;

video.muted = true;

video.playsInline = true;

video.style.position = "fixed";

video.style.top = "0";

video.style.left = "0";

video.style.width = "100%";

video.style.height = "100%";

video.style.objectFit = "cover";

video.style.zIndex = "-1";

document.body.appendChild(video);

}

/* =====================================================================================
INIT
===================================================================================== */

async function init() {
createBackgroundVideo();

initScene();

loadAvatar();

await initWebcam();

animate();

console.log("PRIYA AI READY");

}

window.addEventListener("load", init);

/* =====================================================================================
GLOBALS
===================================================================================== */

window.sendMessageToPriya = sendMessageToPriya;
