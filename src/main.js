import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild(renderer.domElement);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true; // Enable shadows for the light
scene.add(pointLight);

// Load 3D Model
const loader = new GLTFLoader();
let model;
loader.load('/models/your-model.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5); // Adjust scale to zoom in
    model.position.set(0, -1, 0); // Adjust position to center the car
    model.rotation.y = Math.PI / 4; // Rotate the car slightly for a better view

    // Enable shadows for the model
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(model);

    // GSAP Scroll Animation
    gsap.to(camera.position, {
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
        },
        z: 10, // Move the camera closer to the model
        y: 15, // Slightly raise the camera
        onUpdate: () => {
            camera.lookAt(model.position); // Ensure the camera always looks at the model
        },
    });
}, undefined, (error) => {
    console.error('Error loading model:', error);
    alert('Error loading model. Please check the console for more details.');
});

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping
controls.dampingFactor = 0.05;

// Position the Camera
camera.position.set(0, 1, 15); // Adjust camera position to zoom in on the car
camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene

// Add a Gradient Background (Optional)
scene.background = new THREE.Color(0x0077ff); // Blue background to match the section

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Required for damping
    if (model) {
        model.rotation.y += 0.005; // Slow rotation for a smooth effect
    }
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});