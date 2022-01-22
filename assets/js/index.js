import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const acretionMaxDistance = 5;
const acretionMinDistance = 2;
const acretionGap = 0.01;

const starCount = 1000;
const starInnerRadius = 25;
const starOuterRadius = 250;

const thetaMax = 6.28;

const getDir = num => num * (Math.random() > 0.5 ? -1 : 1);

const generateAcretionDisks = () => {
  const ringCount = (acretionMaxDistance - acretionMinDistance) / acretionGap;
  let levels = [];
  for (let i = 0; i < ringCount; i = i + 2) {
    const g = i + 1;
    const [start, end] = [acretionMinDistance + i * acretionGap, acretionMinDistance + g * acretionGap];
    levels.push([start, end]);
  }
  return levels;
}

const generateStars = () => {
  let stars = [];
  for (let i = 0; i < starCount; i = i + 2) {
    const x = (Math.random() * (starOuterRadius - starInnerRadius)) + starInnerRadius;
    const y = (Math.random() * (starOuterRadius - starInnerRadius)) + starInnerRadius;
    const z = (Math.random() * (starOuterRadius - starInnerRadius)) + starInnerRadius;
    stars.push([getDir(x), getDir(y), getDir(z)]);
  }
  return stars;
}

window.onload = () => {
  let camera, controls, scene, renderer;

  const acretionLevels = generateAcretionDisks();
  const stars = generateStars();

  let rings = [];
  const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Texture(0x000000);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(100, 50, 0);

    camera.rotation.x = 2.25;
    camera.rotation.y = 0.04;
    camera.rotation.z = -3;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 5;
    controls.maxDistance = 15;

    const holeGeometry = new THREE.SphereGeometry();
    const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
    scene.add(holeMesh);

    for(const dir of [-1, 1]) {
      const cylinder = new THREE.CylinderGeometry(2, 0.25, 35, 64, 24, true);
      const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
      cylinderMesh.rotation.x = 1.5 * dir;
      cylinderMaterial.transparent = true;
      cylinderMaterial.opacity = 0.25;
      cylinderMesh.position.z = 18 * dir;
      cylinderMesh.position.y = 1.25;
      scene.add(cylinderMesh);
    }

    for (const [inner, outer] of acretionLevels) {
      const thetaStart = Math.random() * thetaMax;
      const geometry = new THREE.RingGeometry(inner, outer, 64, 0, thetaStart, 5);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      rings.push(mesh);
      scene.add(mesh);
    }

    for (const [x, y, z] of stars) {
      const holeGeometry = new THREE.SphereGeometry(0.1, 24, 24);
      const holeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);
      holeMesh.position.x = x;
      holeMesh.position.y = y;
      holeMesh.position.z = z;
      scene.add(holeMesh);
    }

    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  const animate = () => {
    setTimeout(() => requestAnimationFrame(animate), 50);
    for (const ring of rings) {
      const int = Math.random();
      if (!Math.ceil(int) === 1) continue;
      ring.rotation.z += 0.1;
    }
    controls.update();
    render();
  }

  const render = () => {
    renderer.render(scene, camera);
  }

  init();
  animate();
};