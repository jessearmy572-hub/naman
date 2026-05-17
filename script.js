// Global Core Variables
window.App = {
    scene: null, camera: null, renderer: null, clock: null, avatar: null,
    bones: {}, morphs: [], blinkIdx: null, mouthIdx: null,
    mouseX: 0, mouseY: 0
};

(function() {
    App.clock = new THREE.Clock();
    App.scene = new THREE.Scene();
    
    App.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    App.camera.position.set(0, 0.45, 1.95);

    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    App.renderer.outputEncoding = THREE.sRGBEncoding;

    document.getElementById('canvas-viewport').appendChild(App.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    App.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5ea, 1.2);
    sun.position.set(1, 3, 2);
    App.scene.add(sun);

    window.addEventListener('resize', () => {
        App.camera.aspect = window.innerWidth / window.innerHeight;
        App.camera.updateProjectionMatrix();
        App.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
        App.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        App.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
})();
