import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ProductSceneProps {
  className?: string;
  /**
   * Optional 0→1 driver for the lighting "story". If omitted the scene falls
   * back to the page scroll progress. Solution section passes a pinned value.
   */
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Three.js product showcase (requirements #1 and #2)
 * ─────────────────────────────────────────────────────────────────────────
 *  - 360° rotation via mouse drag AND touch swipe, with inertial damping.
 *    Built WITHOUT OrbitControls so there is zero plugin dependency.
 *  - A PointLight whose intensity, position and color shift with page scroll,
 *    giving the "UVC / future-tech" glow — kept subtle and tasteful.
 *
 *  TO SWAP THE PRODUCT:
 *    Replace `buildPlaceholderProduct()` below with a GLTF load, e.g.
 *      import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 *      new GLTFLoader().load('/models/product.glb', (g) => group.add(g.scene));
 *    Keep the returned object centered at the origin for correct rotation.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function ProductScene({ className = '' }: ProductSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0); // transparent — blends with the page
    // Cap DPR at 2 for performance on retina / mobile.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;';

    // ── Scene & camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // ── Lighting ──────────────────────────────────────────────────────────
    // Soft ambient + key so the product reads as premium under any scroll.
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    // The hero "story" PointLight — animated by scroll (requirement #2).
    const pointLight = new THREE.PointLight(0x6d4aff, 6, 22, 2);
    pointLight.position.set(2.5, 1.5, 2.5);
    scene.add(pointLight);

    // A second, cooler rim PointLight for depth.
    const rimLight = new THREE.PointLight(0x27d3e0, 3, 20, 2);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    // ── Product (placeholder) ─────────────────────────────────────────────
    const group = new THREE.Group();
    buildPlaceholderProduct(group);
    scene.add(group);

    // Faint particle field for ambience (kept very subtle).
    const particles = buildParticles();
    scene.add(particles);

    // ── Resize handling ───────────────────────────────────────────────────
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Pointer-driven 360° rotation with inertia ────────────────────────
    const state = {
      dragging: false,
      lastX: 0,
      lastY: 0,
      velX: 0,
      velY: 0,
      rotX: 0.15,
      rotY: 0,
    };

    const onDown = (e: PointerEvent) => {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      // Map drag distance to rotation; clamp vertical to avoid flipping.
      state.velY = dx * 0.005;
      state.velX = dy * 0.005;
      state.rotY += state.velY;
      state.rotX = THREE.MathUtils.clamp(state.rotX + state.velX, -0.8, 0.8);
    };
    const onUp = (e: PointerEvent) => {
      state.dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
    };

    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    // ── Scroll → light story ─────────────────────────────────────────────
    // Cool violet at the top → energetic cyan/blue mid → warm green near foot.
    const colorA = new THREE.Color(0x6d4aff);
    const colorB = new THREE.Color(0x1f4fff);
    const colorC = new THREE.Color(0x0f6b53);
    let scrollProgress = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(mount);

    const clock = new THREE.Clock();
    const tmpColor = new THREE.Color();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      // Idle auto-spin when not dragging (skipped for reduced motion).
      if (!state.dragging && !reduced) {
        state.rotY += 0.0025;
        // ease residual drag velocity to zero (inertia)
        state.velY *= 0.94;
        state.velX *= 0.94;
        state.rotY += state.velY;
      }
      group.rotation.y = state.rotY;
      group.rotation.x = state.rotX;
      group.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.06; // gentle float

      // Animate the story light from scroll progress.
      const p = scrollProgress;
      pointLight.intensity = 4 + Math.sin(t * 1.5) * 0.4 + p * 6; // pulse + scroll lift
      pointLight.position.x = Math.cos(p * Math.PI * 2) * 3;
      pointLight.position.y = 1.5 + Math.sin(p * Math.PI * 2) * 1.5;
      pointLight.position.z = 2.5 + Math.sin(p * Math.PI) * 1.5;
      // two-segment color lerp violet→blue→green
      if (p < 0.5) tmpColor.copy(colorA).lerp(colorB, p * 2);
      else tmpColor.copy(colorB).lerp(colorC, (p - 0.5) * 2);
      pointLight.color.copy(tmpColor);

      if (!reduced) particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduced]);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
      aria-label="ドラッグで360°回転できる3Dプロダクト"
      role="img"
    />
  );
}

/**
 * Builds the placeholder product: a faceted core inside a thin metallic ring.
 * Reads as a high-tech sensor module. Swap this out for a real GLTF model.
 */
function buildPlaceholderProduct(group: THREE.Group) {
  // Core — frosted, slightly metallic icosahedron.
  const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xf4f5f7,
    metalness: 0.35,
    roughness: 0.25,
    flatShading: true,
  });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // Inner glowing nucleus to catch the PointLight (emissive accent).
  const glowGeo = new THREE.IcosahedronGeometry(0.7, 0);
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x1f4fff,
    emissive: 0x1f4fff,
    emissiveIntensity: 0.6,
    metalness: 0.1,
    roughness: 0.4,
  });
  group.add(new THREE.Mesh(glowGeo, glowMat));

  // Outer ring — brushed-metal torus.
  const ringGeo = new THREE.TorusGeometry(2, 0.05, 24, 120);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xcfd4dc,
    metalness: 0.95,
    roughness: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  const ring2 = ring.clone();
  ring2.scale.setScalar(0.78);
  ring2.rotation.x = Math.PI / 1.8;
  ring2.rotation.y = Math.PI / 5;
  group.add(ring2);
}

/** Subtle particle field — adds depth without being busy. */
function buildParticles() {
  const count = 320;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 6 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x9aa3b2,
    size: 0.03,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}
