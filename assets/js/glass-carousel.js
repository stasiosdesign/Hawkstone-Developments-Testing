/* =========================================================
   Hawkstone — hero image carousel (Liquid Glass)

   The supplied "Liquid Glass Carousel" reference, integrated as the
   image treatment in every service page's hero. Three changes were
   needed to make it a hero strip rather than a full-screen demo;
   everything else — the shader, the scroll/drag/snap model, the
   texture handling, the WebGL and reduced-motion fallbacks — is the
   reference implementation.

   1 · The demo's caption, counter and per-item label markup is gone,
       and with it the only thing GSAP was doing (a caption fade and a
       matchMedia wrapper). Reduced motion is gated with the platform's
       own window.matchMedia, the same check assets/js/smooth-scroll.js
       already uses, so the pages carry no animation library.

   2 · Panels are cover-cropped to a fixed portrait ratio. The strip is
       specified as a row of vertical images and the practice's
       photography is landscape, so the crop happens once per texture
       on the canvas the reference already used for downsizing.

   3 · The lens's vertical half-extent is set in fractions of the strip
       height rather than scaled by the section's aspect ratio. In the
       reference both axes are multiplied by W/H, which leaves the
       vertical extent — and therefore whether the glass edge is visible
       at all — dependent on the viewport's shape. In a full-height demo
       section that is invisible; across a hero strip at desktop, tablet
       and phone widths it is the difference between a glass bar with
       edges and a flat magnification. The horizontal axis keeps the
       reference's aspect scaling, which is what makes it stable.

   Without WebGL, or with prefers-reduced-motion set, the authored list
   stays in the page as a plain horizontal strip of the same images.
   ========================================================= */
(function () {
  'use strict';

  /* ---- Strip geometry ---- */
  const panelAspect = 0.75;      // portrait crop applied to every image
  const panelHeight = 0.66;      // panel height as a share of the strip
  const panelGap = 34;           // px between panels
  const panelWidthMax = 0.78;    // a panel never passes this share of the width
  const wheel = 'off';           // the strip must never swallow page scroll

  /* ---- Lens ----
     lensVertical: half-extent up and down, as a share of strip height.
     Just under 0.5 puts the glass edge inside the strip, clear of the
     panels beneath it. lensHorizontal: half-extent left and right, as a
     share of strip width. Over 0.5 runs the glass off both ends, so the
     strip reads as a bar rather than an oval sitting in the middle. */
  const lensVertical = 0.47;
  const lensHorizontal = 0.66;
  const lensRotation = 90;
  const lensVerticalNarrow = 0.46;
  const lensHorizontalNarrow = 0.78;
  const lensRotationNarrow = 90;

  /* The reference ships a cyan ring. The site runs on a warm stone
     palette, so the ring takes --accent-2 and the glow is eased back:
     the effect belongs to the photography, not over it. */
  const lensColor = '#C6AA71';
  const lensGlow = 3.2;
  const lensRing = 1;
  const lensRingRadius = 0.49;
  const lensRingWidth = 0.012;
  const lensRimLine = 0.55;
  const lensNova = 0.05;
  const lensDispersion = 4.5;
  const lensRimWave = 0.045;
  const lensZoom = 0.2;
  const lensVignette = 0;
  const lensShimmer = true;

  /* Finer shader detail, as supplied */
  const lensNovaSize = 12;
  const lensShimmerFreq = 12;
  const lensShimmerSpeed = 3.5;
  const lensShimmerDepth = 0.12;
  const lensRimStart = 0.578;
  const lensRimFreq1 = 2;
  const lensRimFreq2 = 1;
  const lensRimLinePos = 0.488;
  const lensRimLineWidth = 0.003;
  const lensVignetteSize = 0.3;
  const lensSamples = 16;

  const textureDetail = 1.5;
  const narrowBreakpoint = 768;

  const repeats = 4;
  const ease = 0.09;
  const dragSpeed = 1.6;
  const touchSpeed = 1;
  const touchEase = 0.22;
  const friction = 0.865;
  const snapIdle = 120;
  const snapEase = 0.05;
  const shrinkMax = 60;
  const shrinkAttack = 0.25;
  const shrinkDecay = 0.06;
  const clickSlop = 6;
  const touchClickSlop = 12;
  const flickIdle = 90;

  const vertexShader = `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
  `;

  const fragmentShader = `
    #define PI 3.14159265
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTex;
    uniform vec2  uRes;
    uniform vec2  uCenter;
    uniform float uSizeX;
    uniform float uSizeY;
    uniform float uAspect;
    uniform float uZoom;
    uniform float uDispersion;
    uniform float uGlow;
    uniform float uWhiteGlow;
    uniform float uNovaSize;
    uniform float uBlueRing;
    uniform float uRingRadius;
    uniform float uRingWidth;
    uniform float uShimmer;
    uniform float uShimmerFreq;
    uniform float uShimmerSpeed;
    uniform float uShimmerDepth;
    uniform float uTime;
    uniform float uRimStart;
    uniform float uRimTangential;
    uniform float uRimFreq1;
    uniform float uRimFreq2;
    uniform vec3  uBlueColor;
    uniform float uRimLine;
    uniform float uRimLinePos;
    uniform float uRimLineWidth;
    uniform float uVignette;
    uniform float uVignetteSize;
    uniform float uRotation;
    uniform int   uSamples;

    const int MAX_SAMPLES = 16;

    vec3 discLens(vec2 center, float aspectCorrect, out float outA) {
      vec2 p = (vUv - center);
      p.x *= aspectCorrect;
      float ca = cos(uRotation), sa = sin(uRotation);
      p = mat2(ca, -sa, sa, ca) * p;
      vec2 halfSize = vec2(uSizeX, uSizeY);
      float dist = length(p / halfSize);
      outA = 0.0;

      float maskND = dist;
      if (maskND > 1.0) return vec3(0.0);

      float shapeND = clamp(maskND, 0.0, 1.0);
      float nd = clamp(dist, 0.0, 1.0);
      vec2  offset = vUv - center;
      vec2  radialDir = normalize(offset + 1e-6);
      vec2  tangentDir = vec2(-radialDir.y, radialDir.x);
      float angle = atan(p.y, p.x);

      float pull = uZoom * 0.30 * (nd * nd);
      float rimStrength = smoothstep(uRimStart, 1.0, nd);
      float fluidWave = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
      float rScreen = (uSizeX + uSizeY) * 0.5;
      vec2  rimOff = tangentDir * fluidWave * rimStrength * rScreen * uRimTangential;

      vec2 baseUV = center + offset * (1.0 - pull) + rimOff;

      float rimMask = smoothstep(0.55, 1.0, nd);
      vec2  dispDir = offset * uDispersion * 0.004 * rimMask;
      int N = uSamples;
      if (N < 2) N = 2;
      if (N > MAX_SAMPLES) N = MAX_SAMPLES;
      vec3 col = vec3(0.0);
      vec3 caW = vec3(0.0);
      for (int i = 0; i < MAX_SAMPLES; i++) {
        if (i >= N) break;
        float t = float(i) / float(N - 1);
        vec2 sUV = baseUV + dispDir * (t - 0.5);
        vec3 s = texture2D(uTex, sUV).rgb;
        vec3 w = vec3(
          exp(-pow((t - 0.00) / 0.38, 2.0)),
          exp(-pow((t - 0.50) / 0.38, 2.0)),
          exp(-pow((t - 1.00) / 0.38, 2.0))
        );
        col += s * w;
        caW += w;
      }
      col /= max(caW, vec3(0.001));

      col *= mix(0.91, 1.0, smoothstep(0.0, 0.38, shapeND));

      float r2 = shapeND * shapeND * 0.25;
      float gs = max(uNovaSize * uGlow * 0.003, 0.004);
      float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
      nova *= uWhiteGlow * (uGlow / 17.0) * 1.15;
      col += vec3(nova);

      float dC = shapeND * 0.5;
      float tR = clamp(uRingRadius, 0.1, 0.49);
      float rW = max(uRingWidth, 0.003);
      float ring = exp(-pow((dC - tR) / rW, 2.0));
      ring *= uBlueRing * (uGlow / 17.0) * 1.8;
      if (uShimmer > 0.5) ring *= sin(angle * uShimmerFreq + uTime * uShimmerSpeed) * uShimmerDepth + (1.0 - uShimmerDepth);
      float ringAura = exp(-pow((dC - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0);
      col += uBlueColor * (ring + ringAura);
      col += vec3(exp(-pow((dC - uRimLinePos) / max(uRimLineWidth, 0.0001), 2.0)) * uRimLine);

      outA = smoothstep(1.0, 0.93, maskND);
      return col;
    }

    void main(){
      vec3 base = texture2D(uTex, vUv).rgb;
      vec3 outc = base;

      float a = 0.0;
      vec3 c = discLens(uCenter, uAspect, a);
      outc = mix(outc, c, a);

      if (uVignette > 0.001) {
        vec2 vc = vUv - 0.5;
        vc.x *= uAspect;
        float d = length(vc) / max(uVignetteSize, 0.0001);
        float vig = 1.0 - uVignette * smoothstep(0.5, 1.0, d);
        outc *= clamp(vig, 0.0, 1.0);
      }

      gl_FragColor = vec4(outc, 1.0);
    }
  `;

  function backgroundOf(element) {
    let node = element;
    while (node && node !== document.documentElement) {
      const color = getComputedStyle(node).backgroundColor;
      if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color;
      node = node.parentElement;
    }
    return '#ffffff';
  }

  function setupInstance(THREE, wrapper) {
    const mount = wrapper.querySelector('[data-glass-carousel-canvas]');
    const items = Array.from(wrapper.querySelectorAll('[data-glass-carousel-item]'));
    if (!mount || !items.length) return null;
    if (wrapper.getAttribute('data-glass-carousel') === 'canvas') return null;

    const total = items.length;
    let W = Math.max(1, mount.clientWidth);
    let H = Math.max(1, mount.clientHeight);
    let narrow = W < narrowBreakpoint;
    let panelH = 0;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, canvas: mount });
    } catch {
      return null; // no webgl, the authored list stays as it is
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    renderer.setClearColor(new THREE.Color(backgroundOf(wrapper)), 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -100, 100);
    camera.position.z = 10;

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const sources = items.map((item) => ({
      tex: null,
      aspect: panelAspect,
      image: item.querySelector('[data-glass-carousel-image]') || item.querySelector('img'),
    }));

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    /* Cover-crop to the strip's portrait ratio and cap the height at what
       the panel can actually show. The reference did the second half of
       this on the same canvas; the crop is the addition. */
    function fitToPanel(image) {
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      if (!width || !height) return image;

      let sw = width;
      let sh = height;
      if (width / height > panelAspect) sw = Math.round(height * panelAspect);
      else sh = Math.round(width / panelAspect);
      const sx = Math.round((width - sw) / 2);
      const sy = Math.round((height - sh) / 2);

      const cap = Math.round(panelH * Math.min(window.devicePixelRatio || 1, 2) * textureDetail);
      const outH = cap > 0 ? Math.min(sh, cap) : sh;
      const outW = Math.max(1, Math.round(outH * panelAspect));

      const scaled = document.createElement('canvas');
      scaled.width = outW;
      scaled.height = Math.max(1, outH);
      scaled.getContext('2d').drawImage(image, sx, sy, sw, sh, 0, 0, scaled.width, scaled.height);
      return scaled;
    }

    function adoptTexture(source) {
      const image = source.image;
      if (!image || !image.naturalWidth || !image.naturalHeight) return;
      source.aspect = panelAspect;
      measurePanel();
      const url = image.currentSrc || image.src;
      loader.load(url, (tex) => {
        tex.image = fitToPanel(tex.image);
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.anisotropy = maxAnisotropy;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        source.tex = tex;
        measurePanel();
        recomputeTotal();
        if (!userInteracted) {
          scroll = centerForIndex(0);
          target = scroll;
        }
      }, undefined, () => {
        console.warn('Glass Carousel: image failed to load', url);
      });
    }

    function bindTextures() {
      sources.forEach((source) => {
        if (!source.image) return;
        if (source.image.complete) adoptTexture(source);
        else source.image.addEventListener('load', () => adoptTexture(source), { once: true });
      });
    }

    function measurePanel() {
      let widest = 1;
      for (let i = 0; i < sources.length; i++) widest = Math.max(widest, sources[i].aspect);
      panelH = Math.min(H * panelHeight, (W * panelWidthMax) / widest);
    }
    measurePanel();

    function slotWidth(index) {
      return sources[index].aspect * panelH + panelGap;
    }

    let offsets = [];
    let totalWidth = 0;
    function recomputeTotal() {
      offsets = [];
      let acc = 0;
      for (let i = 0; i < sources.length; i++) {
        offsets.push(acc);
        acc += slotWidth(i);
      }
      totalWidth = acc;
    }
    recomputeTotal();

    function slotCenter(index) {
      return offsets[index] + slotWidth(index) / 2 - panelGap / 2;
    }

    function centerForIndex(index) {
      const loop = Math.floor(index / total);
      const s = ((index % total) + total) % total;
      return slotCenter(s) + loop * totalWidth;
    }

    function nearestIndex(value) {
      if (!totalWidth) return 0;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < total; i++) {
        const center = slotCenter(i);
        const k = Math.round((value - center) / totalWidth);
        const dist = Math.abs(center + k * totalWidth - value);
        if (dist < bestDist) {
          bestDist = dist;
          best = i + k * total;
        }
      }
      return best;
    }

    function sourceIndex(value) {
      return ((nearestIndex(value) % total) + total) % total;
    }

    const panelGeometry = new THREE.PlaneGeometry(1, 1);
    const pool = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < total; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true });
        const mesh = new THREE.Mesh(panelGeometry, mat);
        mesh.visible = false;
        scene.add(mesh);
        pool.push({ mesh, mat, srcIndex: i, bound: false });
      }
    }

    let scroll = centerForIndex(0);
    let target = scroll;
    let userInteracted = false;
    let velocity = 0;
    let prevScroll = 0;
    let scrollEnergy = 0;
    let lastInput = performance.now();
    let snapped = false;

    const dpr = renderer.getPixelRatio() || 1;
    const bufferW = () => Math.max(1, Math.round(W * dpr));
    const bufferH = () => Math.max(1, Math.round(H * dpr));
    let rt = new THREE.WebGLRenderTarget(bufferW(), bufferH());
    const lensScene = new THREE.Scene();
    const lensCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const lensUniforms = {
      uTex: { value: rt.texture },
      uRes: { value: new THREE.Vector2(bufferW(), bufferH()) },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uSizeX: { value: narrow ? lensVerticalNarrow : lensVertical },
      uSizeY: { value: (narrow ? lensHorizontalNarrow : lensHorizontal) * (W / H) },
      uRotation: { value: 0 },
      uAspect: { value: W / H },
      uZoom: { value: lensZoom },
      uDispersion: { value: lensDispersion },
      uGlow: { value: lensGlow },
      uWhiteGlow: { value: lensNova },
      uNovaSize: { value: lensNovaSize },
      uBlueRing: { value: lensRing },
      uRingRadius: { value: lensRingRadius },
      uRingWidth: { value: lensRingWidth },
      uShimmer: { value: lensShimmer ? 1 : 0 },
      uShimmerFreq: { value: lensShimmerFreq },
      uShimmerSpeed: { value: lensShimmerSpeed },
      uShimmerDepth: { value: lensShimmerDepth },
      uTime: { value: 0 },
      uRimStart: { value: lensRimStart },
      uRimTangential: { value: lensRimWave },
      uRimFreq1: { value: lensRimFreq1 },
      uRimFreq2: { value: lensRimFreq2 },
      uBlueColor: { value: new THREE.Color(lensColor) },
      uRimLine: { value: lensRimLine },
      uRimLinePos: { value: lensRimLinePos },
      uRimLineWidth: { value: lensRimLineWidth },
      uVignette: { value: lensVignette },
      uVignetteSize: { value: lensVignetteSize },
      uSamples: { value: lensSamples },
    };
    const lensMat = new THREE.ShaderMaterial({ uniforms: lensUniforms, vertexShader, fragmentShader });
    const lensQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lensMat);
    lensScene.add(lensQuad);

    function applyLook() {
      renderer.setClearColor(new THREE.Color(backgroundOf(wrapper)), 1);
      const active = sourceIndex(scroll);
      measurePanel();
      recomputeTotal();
      scroll = centerForIndex(active);
      target = scroll;
      lensUniforms.uAspect.value = W / H;
      lensUniforms.uSizeX.value = narrow ? lensVerticalNarrow : lensVertical;
      lensUniforms.uSizeY.value = (narrow ? lensHorizontalNarrow : lensHorizontal) * (W / H);
      lensUniforms.uRotation.value = ((narrow ? lensRotationNarrow : lensRotation) * Math.PI) / 180;
    }
    applyLook();

    let panelRects = [];
    let centeredPanel = null;

    function layout() {
      panelRects = [];
      centeredPanel = null;
      let centeredDist = Infinity;
      const half = W / 2;
      const buffer = panelH;

      pool.forEach((p, poolIdx) => {
        const rep = Math.floor(poolIdx / total);
        const i = p.srcIndex;
        const src = sources[i];

        let x = slotCenter(i) - scroll;
        x = ((x % totalWidth) + totalWidth) % totalWidth;
        x += (rep - Math.floor(repeats / 2)) * totalWidth;
        if (x > half + totalWidth) x -= totalWidth * repeats;

        const centerX = x;
        if (centerX < -half - buffer || centerX > half + buffer) {
          p.mesh.visible = false;
          return;
        }

        const shrink = 1 - 0.25 * scrollEnergy;
        const h = panelH * shrink;
        const w = src.aspect * panelH * shrink;

        if (src.tex && !p.bound) {
          p.mat.map = src.tex;
          p.mat.color.set(0xffffff);
          p.mat.needsUpdate = true;
          p.bound = true;
        }

        p.mesh.visible = true;
        p.mesh.position.set(centerX, 0, 0);
        p.mesh.scale.set(w, h, 1);

        const sx = centerX + W / 2;
        const sy = H / 2;
        panelRects.push({
          left: sx - w / 2,
          right: sx + w / 2,
          top: sy - h / 2,
          bottom: sy + h / 2,
          poolIdx,
          srcIndex: i,
          centerX,
        });

        if (Math.abs(centerX) < centeredDist) {
          centeredDist = Math.abs(centerX);
          centeredPanel = { srcIndex: i, poolIdx };
        }
      });
    }

    const el = mount;
    wrapper.setAttribute('data-glass-carousel-wheel', wheel);

    function rectOf(px, py) {
      const bounds = el.getBoundingClientRect();
      const x = px - bounds.left;
      const y = py - bounds.top;
      for (let i = 0; i < panelRects.length; i++) {
        const r = panelRects[i];
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return r;
      }
      return null;
    }

    let dragging = false;
    let dragPointerId = null;
    let dragLastX = 0;
    let dragDist = 0;
    let dragVel = 0;
    let dragMoveT = 0;
    let suppressClick = false;
    let dragPointerType = 'mouse';
    let lastPointerX = NaN;
    let lastPointerY = NaN;
    let pointerInside = false;
    let lastPointerType = 'mouse';

    let pointerState = '';

    function setPointer(v) {
      if (v === pointerState) return;
      pointerState = v;
      wrapper.setAttribute('data-glass-carousel-pointer', v);
    }

    function setHover(on) {
      setPointer(dragging ? 'grabbing' : on ? 'grab' : '');
    }

    function refreshHover() {
      if (!pointerInside || lastPointerType !== 'mouse') return;
      if (!Number.isFinite(lastPointerX)) return;
      setHover(rectOf(lastPointerX, lastPointerY) !== null);
    }

    function onPointerDown(e) {
      suppressClick = false;
      if (dragging) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      dragging = true;
      dragPointerId = e.pointerId;
      dragPointerType = e.pointerType || 'mouse';
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      dragLastX = e.clientX;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      dragDist = 0;
      dragVel = 0;
      dragMoveT = performance.now();
      setHover(false);
      velocity = 0;
      userInteracted = true;
      snapped = false;
      lastInput = dragMoveT;
    }

    function onPointerMove(e) {
      if (dragging && e.pointerId === dragPointerId) {
        const sens = dragPointerType === 'mouse' ? dragSpeed : touchSpeed;
        const dx = e.clientX - dragLastX;
        dragLastX = e.clientX;
        dragDist += Math.abs(dx);
        target -= dx * sens;
        dragVel = dragVel * 0.6 + -dx * sens * 0.4;
        dragMoveT = performance.now();
        lastInput = dragMoveT;
        snapped = false;
      }
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastPointerType = e.pointerType || 'mouse';
      pointerInside = true;
      if (e.pointerType !== 'mouse') return;
      setHover(rectOf(e.clientX, e.clientY) !== null);
    }

    function onPointerUp(e) {
      if (!dragging) return;
      if (e && dragPointerId !== null && e.pointerId !== dragPointerId) return;
      dragging = false;
      if (dragPointerId !== null) {
        try {
          el.releasePointerCapture(dragPointerId);
        } catch {}
        dragPointerId = null;
      }
      velocity = performance.now() - dragMoveT > flickIdle ? 0 : dragVel;
      dragVel = 0;
      lastInput = performance.now();
      snapped = false;
      suppressClick = dragDist > (dragPointerType === 'mouse' ? clickSlop : touchClickSlop);
      if (dragPointerType === 'mouse') setHover(rectOf(lastPointerX, lastPointerY) !== null);
      else setHover(false);
    }

    function onEnter(e) {
      pointerInside = true;
      lastPointerType = e.pointerType || 'mouse';
    }

    function onLeave() {
      pointerInside = false;
      setHover(false);
    }

    /* Clicking an off-centre panel brings it to the middle. The reference
       also followed a link on the centred panel; these items carry none. */
    function onClick(e) {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      const hit = rectOf(e.clientX, e.clientY);
      if (!hit) return;
      if (centeredPanel && hit.poolIdx === centeredPanel.poolIdx) return;
      userInteracted = true;
      velocity = 0;
      target = centerForIndex(nearestIndex(scroll + hit.centerX));
      snapped = true;
      setHover(false);
    }

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('click', onClick);

    let raf = 0;
    function tick() {
      if (!wrapper.isConnected) return destroy();
      if (!dragging) {
        target += velocity;
        velocity *= friction;
        if (Math.abs(velocity) < 0.05) velocity = 0;

        if (!snapped && performance.now() - lastInput > snapIdle) {
          target = centerForIndex(nearestIndex(scroll));
          snapped = true;
        }
      }

      const follow = dragging && dragPointerType !== 'mouse'
        ? touchEase
        : snapped
          ? snapEase
          : ease;
      scroll += (target - scroll) * follow;

      const rawSpeed = scroll - prevScroll;
      prevScroll = scroll;
      const norm = Math.min(1, Math.abs(rawSpeed) / Math.max(1, shrinkMax));
      const k = norm > scrollEnergy ? shrinkAttack : shrinkDecay;
      scrollEnergy += (norm - scrollEnergy) * k;

      layout();
      refreshHover();

      lensUniforms.uTime.value = performance.now() * 0.001;

      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(lensScene, lensCam);

      raf = requestAnimationFrame(tick);
    }

    function onResize() {
      const nextW = mount.clientWidth;
      const nextH = mount.clientHeight;
      if (!nextW || !nextH) return;
      W = nextW;
      H = nextH;
      renderer.setSize(W, H, false);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      rt.setSize(bufferW(), bufferH());
      lensUniforms.uRes.value.set(bufferW(), bufferH());
      narrow = W < narrowBreakpoint;
      applyLook();
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);

    function destroy() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('click', onClick);
      renderer.dispose();
      rt.dispose();
      lensQuad.geometry.dispose();
      lensMat.dispose();
      panelGeometry.dispose();
      pool.forEach((p) => p.mat.dispose());
      sources.forEach((s) => {
        if (s.tex) s.tex.dispose();
      });
      wrapper.setAttribute('data-glass-carousel', '');
    }

    wrapper.setAttribute('data-glass-carousel', 'canvas');
    bindTextures();
    tick();

    return { destroy };
  }

  let instances = [];

  async function start() {
    const wrappers = document.querySelectorAll('[data-glass-carousel]');
    if (!wrappers.length || instances.length) return;
    let THREE;
    try {
      THREE = await import('https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js');
    } catch {
      return; // the authored list stays as it is
    }
    wrappers.forEach((wrapper) => {
      const instance = setupInstance(THREE, wrapper);
      if (instance) instances.push(instance);
    });
  }

  function stop() {
    instances.forEach((instance) => instance.destroy());
    instances = [];
  }

  function init() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => (reduce.matches ? stop() : start());
    if (reduce.addEventListener) reduce.addEventListener('change', sync);
    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
