import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const planeUrl = new URL('../assets/stylized_ww1_plane.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFE00FF,0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);
// to disable zoom
orbit.enableZoom = false;

// to disable pan
orbit.enablePan = false;



// Camera positioning
camera.position.set(1.5, 1.5, 1.5);
orbit.update();
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

// Sets a 12 by 12 gird helper
//const gridHelper = new THREE.GridHelper(12, 12);
//scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
//const axesHelper = new THREE.AxesHelper(4);
//scene.add(axesHelper);

const assetLoader = new GLTFLoader();

var mixer;
assetLoader.load(planeUrl.href, function(gltf) {
    const model = gltf.scene;
   // console.log(model.children[1].material.opacity)
    scene.add(model);
    model.position.set(0, 0, 0);


    mixer = new THREE.AnimationMixer( model );
        
        gltf.animations.forEach( ( clip ) => {
          
            mixer.clipAction( clip ).play();
          
        } );

    // Create an AnimationMixer, and get the list of AnimationClip instances
    /* mixer = new THREE.AnimationMixer( model );
    const clips = gltf.animations;

    // Play a specific animation
    const clip = THREE.AnimationClip.findByName( clips, 'myAnimation' );
    const action = mixer.clipAction( clip );
    action.play();

    // Play all animations
    clips.forEach( function ( clip ) {
    mixer.clipAction( clip ).play();
    } ); */

}, undefined, function(error) {
    console.error(error);
});

var clock = new THREE.Clock();
function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});