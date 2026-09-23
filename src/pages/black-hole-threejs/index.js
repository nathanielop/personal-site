import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const holeRadius = 1.7;
const diskInnerRadius = 2;
const diskOuterRadius = 6.5;
const diskRingGap = 0.03;

const starCount = 2600;
const starFieldInnerRadius = 40;
const starFieldOuterRadius = 320;

const hotColor = new THREE.Color(0xfff1d0);
const coolColor = new THREE.Color(0xff4d17);

const lensStrength = 1.15;

const lensingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uAspect: { value: 1 },
    uRadius: { value: 0.1 },
    uStrength: { value: lensStrength }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uCenter;
    uniform float uAspect;
    uniform float uRadius;
    uniform float uStrength;
    varying vec2 vUv;

    void main() {
      vec2 delta = vUv - uCenter;
      delta.x *= uAspect;
      float b = length(delta);
      vec2 dir = b > 0.00001 ? delta / b : vec2(0.0);

      float rs = uRadius;
      float alpha = uStrength * rs * rs / max(b, 0.0001);
      float sourceR = b - alpha;

      vec2 sampleDelta = dir * max(sourceR, 0.0);
      sampleDelta.x /= uAspect;
      vec4 color = texture2D(tDiffuse, uCenter + sampleDelta);

      color.rgb *= smoothstep(0.0, rs * 0.06, sourceR);

      float shadowR = rs * sqrt(uStrength);
      float ring = exp(-pow((b - shadowR * 1.04) / (shadowR * 0.16), 2.0));
      color.rgb += vec3(1.0, 0.85, 0.6) * ring * 0.55;

      gl_FragColor = color;
    }
  `
};

const random = (min, max) => min + Math.random() * (max - min);

const createDiskRings = () => {
  const rings = [];
  for (let inner = diskInnerRadius; inner < diskOuterRadius; inner += diskRingGap * 2) {
    const outer = inner + diskRingGap;
    const t = (inner - diskInnerRadius) / (diskOuterRadius - diskInnerRadius);
    const geometry = new THREE.RingGeometry(
      inner,
      outer,
      160,
      1,
      random(0, Math.PI * 2),
      random(1.2, Math.PI * 2)
    );
    const material = new THREE.MeshBasicMaterial({
      color: hotColor.clone().lerp(coolColor, t),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: random(0.12, 0.45),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    rings.push({ mesh, speed: random(0.2, 0.6) / (0.35 + t) });
  }
  return rings;
};

const createStarField = () => {
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const radius = random(starFieldInnerRadius, starFieldOuterRadius);
    const theta = random(0, Math.PI * 2);
    const phi = Math.acos(random(-1, 1));
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
  });
  return new THREE.Points(geometry, material);
};

window.onload = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.0016);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.up.set(0, 0, 1);
  camera.position.set(0, -9.5, 3.6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 60;
  controls.target.set(0, 0, 0);
  controls.update();

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const lensingPass = new ShaderPass(lensingShader);
  composer.addPass(lensingPass);

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.1,
    0.5,
    0.02
  );
  composer.addPass(bloom);

  for (const dir of [1, -1]) {
    const jet = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 0.2, 34, 64, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x9cc4ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    jet.rotation.x = (dir * Math.PI) / 2;
    jet.position.z = dir * 17;
    scene.add(jet);
  }

  const rings = createDiskRings();
  for (const { mesh } of rings) scene.add(mesh);

  scene.add(createStarField());

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloom.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onWindowResize);

  const clock = new THREE.Clock();
  const lensCenter = new THREE.Vector3();
  const lensEdge = new THREE.Vector3();

  const updateLensing = () => {
    lensCenter.set(0, 0, 0).project(camera);
    lensEdge.setFromMatrixColumn(camera.matrixWorld, 1).setLength(holeRadius).project(camera);
    lensingPass.uniforms.uCenter.value.set(
      lensCenter.x * 0.5 + 0.5,
      lensCenter.y * 0.5 + 0.5
    );
    lensingPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    lensingPass.uniforms.uRadius.value = Math.max(
      Math.abs((lensEdge.y - lensCenter.y) * 0.5),
      0.01
    );
  };

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    for (const { mesh, speed } of rings) mesh.rotation.z += speed * delta;
    controls.update();
    updateLensing();
    composer.render();
  };

  animate();
};
