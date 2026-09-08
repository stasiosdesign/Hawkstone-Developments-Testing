/* =========================================================
   Hawkstone — hero image slider (Spatial Cards, GSAP)

   The supplied "Spatial Cards Slider (GSAP)" reference, integrated as
   the image treatment in every service page's hero. The geometry — the
   curve solve, the radius correction loop, the clone count, the
   Draggable/Inertia model, the resize handling — is the reference
   implementation, unchanged.

   What differs, and why:

   1 · The demo's card chrome is gone. Each slide is the photograph and
       nothing else: no panel, no caption bar, no title. The reference's
       Prev/Next buttons go with it, since the hero's own CTAs sit a few
       centimetres below them and a second pair of buttons in between
       reads as a competing call to action. The generated dots stay —
       they are the component's only non-textual control, and without
       them the slider would be drag-only and unreachable by keyboard.

   2 · Initialisation is gated on prefers-reduced-motion, the same check
       assets/js/smooth-scroll.js already makes. Skipped, the authored
       list stays in the page as a plain horizontal strip of the same
       images, because the 3D layout is applied only under the
       data-spatial-slider-drag-status the script itself sets.

   3 · The reference's globals are wrapped in a module scope, and
       teardown restores the pre-init DOM so the reduced-motion switch
       can be thrown either way at runtime.
   ========================================================= */
(function () {
  'use strict';

  const slideDuration = 1;
  const clickEase = 'spatial';

  /* The reference re-measures on width change alone. The card here is sized
     from viewport height as well as width, so a height-only resize changes it
     and the cached geometry would go stale. Watching the card itself catches
     both, and catches nothing else: it is measured in svh, which does not move
     when a mobile toolbar hides, so scrolling a phone never re-initialises. */
  function cardWidth() {
    const el = document.querySelector('[data-spatial-slider-item] .spatial-slider__media');
    return el ? Math.round(el.getBoundingClientRect().width) : 0;
  }

  function debounceOnSizeChange(fn, ms) {
    let lastWidth = window.innerWidth;
    let lastCard = cardWidth();
    let timer;

    return function (...args) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        const width = window.innerWidth;
        const card = cardWidth();
        if (width === lastWidth && card === lastCard) return;
        lastWidth = width;
        lastCard = card;
        fn.apply(this, args);
      }, ms);
    };
  }

  function initSpatialCardsSlider() {
    document.querySelectorAll('[data-spatial-slider-init]').forEach(container => {
      if (container._spatialSliderDraggable) container._spatialSliderDraggable.kill();
      if (container._spatialSliderImageObserver) container._spatialSliderImageObserver.disconnect();

      if (container._spatialSliderProxy) {
        gsap.killTweensOf(container._spatialSliderProxy);
        container._spatialSliderProxy.remove();
      }

      const collection = container.querySelector('[data-spatial-slider-collection]');
      const track = container.querySelector('[data-spatial-slider-list]');
      if (!collection || !track) return;

      gsap.set(track, { clearProps: 'transform' });

      container.querySelectorAll('[data-spatial-slider-item]').forEach(item => {
        gsap.set(item, { clearProps: 'transform' });
      });

      container.querySelectorAll('[data-spatial-slider-clone]').forEach(el => el.remove());

      const originalItems = Array.from(track.querySelectorAll(':scope > [data-spatial-slider-item]:not([data-spatial-slider-clone])'));
      if (!originalItems.length) return;

      container.setAttribute('role', 'region');
      container.setAttribute('aria-roledescription', 'carousel');
      container.setAttribute('aria-label', container.getAttribute('aria-label') || 'Project photographs');
      track.setAttribute('role', 'group');
      track.setAttribute('aria-label', 'Slides');

      const dotsWrap = container.querySelector('[data-spatial-slider-generate-dots]');

      if (dotsWrap) {
        const dots = Array.from(dotsWrap.querySelectorAll('[data-spatial-slider-control]'));

        if (dots.length) {
          const template = dots[0];
          dots.slice(1).forEach(dot => dot.remove());

          for (let i = 1; i <= originalItems.length; i++) {
            const dot = i === 1 ? template : template.cloneNode(true);
            dot.setAttribute('data-spatial-slider-control', String(i));
            dot.setAttribute('data-spatial-slider-control-status', 'not-active');
            if (i > 1) dotsWrap.appendChild(dot);
          }
        }
      }

      const controls = Array.from(container.querySelectorAll('[data-spatial-slider-control]'));
      const totalEl = container.querySelector('[data-spatial-slider-total-slide]');
      const indicators = Array.from(container.querySelectorAll('[data-spatial-slider-active-slide]'));
      const mod = (value, total) => ((value % total) + total) % total;
      const formatNumber = value => value < 10 ? '0' + value : String(value);

      if (totalEl) totalEl.textContent = formatNumber(originalItems.length);

      originalItems.forEach((item, index) => {
        item.removeAttribute('data-spatial-slider-item-status');
        item.removeAttribute('aria-hidden');
        item.setAttribute('role', 'group');
        item.setAttribute('aria-label', `Slide ${index + 1} of ${originalItems.length}`);
      });

      controls.forEach(btn => {
        const value = btn.getAttribute('data-spatial-slider-control');

        if (value === 'prev') btn.setAttribute('aria-label', 'Previous slide');
        if (value === 'next') btn.setAttribute('aria-label', 'Next slide');

        if (/^\d+$/.test(value)) {
          btn.setAttribute('aria-label', `Go to slide ${value}`);
          btn.setAttribute('aria-current', 'false');
        }
      });

      /* The 3D layout is scoped to this attribute in CSS, so it has to be
         set before the first measurement — the reference relies on it
         being authored into the markup, which would leave the no-JS and
         reduced-motion states with every card stacked on the first. */
      container.setAttribute('data-spatial-slider-drag-status', 'grab');

      const containerStyles = getComputedStyle(container);
      const trackStyles = getComputedStyle(track);
      const curve = Math.abs(parseFloat(containerStyles.getPropertyValue('--slider-curve'))) || 12;
      const directionValue = parseFloat(containerStyles.getPropertyValue('--slider-direction'));
      const direction = directionValue < 0 ? -1 : 1;
      const gap = parseFloat(trackStyles.columnGap) || 0;
      const curveRadians = curve * Math.PI / 180;

      const firstRect = originalItems[0].getBoundingClientRect();
      const itemWidth = firstRect.width;
      const itemHeight = firstRect.height;

      const perspectiveValue = parseFloat(getComputedStyle(track).perspective);
      const perspective = Number.isFinite(perspectiveValue) ? perspectiveValue : 1200;

      const getProjectedEdgeX = (radius, angle, side) => {
        const radians = angle * Math.PI / 180;
        const rotation = -direction * radians;
        const localX = side * itemWidth / 2;

        const centerX = Math.sin(radians) * radius;
        const centerZ = direction * radius * (1 - Math.cos(radians));

        const x = centerX + localX * Math.cos(rotation);
        const z = centerZ - localX * Math.sin(rotation);

        return x * perspective / (perspective - z);
      };

      let spatialRadius = itemWidth / Math.sin(curveRadians);

      for (let i = 0; i < 8; i++) {
        const nextLeft = getProjectedEdgeX(spatialRadius, curve, -1);
        const currentRight = itemWidth / 2;
        const currentGap = nextLeft - currentRight;
        const correction = gap - currentGap;

        spatialRadius += correction / Math.sin(curveRadians);
      }

      const stepDistance = Math.sin(curveRadians) * spatialRadius;
      const tangentRatio = (-direction * spatialRadius) / (perspective - direction * spatialRadius);
      const edgeAngle = Math.acos(gsap.utils.clamp(-1, 1, tangentRatio)) * 180 / Math.PI;
      const maxSideItems = Math.ceil(edgeAngle / curve);
      const maxLoopItems = maxSideItems * 2;

      const getSpatialPosition = offset => {
        const angle = gsap.utils.clamp(-edgeAngle, edgeAngle, offset * curve);
        const radians = angle * Math.PI / 180;

        return {
          x: Math.sin(radians) * spatialRadius,
          z: direction * spatialRadius * (1 - Math.cos(radians)),
          rotationY: -direction * angle
        };
      };

      const containerRect = container.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const originX = trackRect.left + trackRect.width / 2;
      const leftLimit = containerRect.left - originX;
      const rightLimit = containerRect.right - originX;

      const isOffsetInside = offset => {
        if (Math.abs(offset * curve) >= edgeAngle) return false;

        const position = getSpatialPosition(offset);
        const scale = perspective / (perspective - position.z);
        const radians = Math.abs(position.rotationY) * Math.PI / 180;
        const halfWidth = Math.abs(Math.cos(radians)) * itemWidth * scale / 2;
        const x = position.x * scale;

        return x + halfWidth >= leftLimit && x - halfWidth <= rightLimit;
      };

      const getVisibleCount = () => {
        let left = 0;
        let right = 0;

        for (let i = 1; i < maxSideItems && isOffsetInside(i); i++) right = i;
        for (let i = 1; i < maxSideItems && isOffsetInside(-i); i++) left = i;

        return Math.min(maxLoopItems, 1 + left + right + 2);
      };

      const minItemsNeeded = getVisibleCount();
      const neededItems = originalItems.length >= minItemsNeeded
        ? originalItems.length
        : Math.ceil(minItemsNeeded / originalItems.length) * originalItems.length;

      for (let i = originalItems.length; i < neededItems; i++) {
        const clone = originalItems[i % originalItems.length].cloneNode(true);
        clone.setAttribute('data-spatial-slider-clone', '');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }

      const items = Array.from(track.querySelectorAll(':scope > [data-spatial-slider-item]'));
      const totalItems = items.length;

      track.style.height = itemHeight + 'px';

      items.forEach(item => item.setAttribute('data-spatial-slider-item-status', 'not-active'));

      const proxy = document.createElement('div');
      proxy.setAttribute('data-spatial-slider-proxy', '');

      Object.assign(proxy.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        pointerEvents: 'none',
        opacity: '0'
      });

      container.appendChild(proxy);
      container._spatialSliderProxy = proxy;

      gsap.set(proxy, { x: 0 });

      const setX = items.map(item => gsap.quickSetter(item, 'x', 'px'));
      const setZ = items.map(item => gsap.quickSetter(item, 'z', 'px'));
      const setRotationY = items.map(item => gsap.quickSetter(item, 'rotationY', 'deg'));

      const getIndex = () => -gsap.getProperty(proxy, 'x') / stepDistance;

      const nearestDelta = (index, realIndex) => {
        const loop = Math.round((realIndex - index) / totalItems);
        return index - (realIndex - loop * totalItems);
      };

      const getSlideDelta = (target, realIndex) => {
        let bestDelta = 0;
        let bestDistance = Infinity;

        items.forEach((item, index) => {
          if (index % originalItems.length !== target) return;

          const delta = nearestDelta(index, realIndex);
          const distance = Math.abs(delta);

          if (distance < bestDistance) {
            bestDelta = delta;
            bestDistance = distance;
          }
        });

        return bestDelta;
      };

      let lastActiveIndex = null;

      const updateActiveUI = (activeIndex, activeSlideIndex) => {
        if (activeIndex === lastActiveIndex) return;

        items.forEach((item, index) => {
          item.setAttribute('data-spatial-slider-item-status', index === activeIndex ? 'active' : 'inview');
        });

        indicators.forEach(el => el.textContent = formatNumber(activeSlideIndex + 1));

        controls.forEach(btn => {
          const value = btn.getAttribute('data-spatial-slider-control');
          if (!/^\d+$/.test(value)) return;

          const isActive = parseInt(value, 10) - 1 === activeSlideIndex;
          btn.setAttribute('data-spatial-slider-control-status', isActive ? 'active' : 'not-active');
          btn.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        lastActiveIndex = activeIndex;
      };

      const render = () => {
        const realIndex = getIndex();
        const activeIndex = mod(Math.round(realIndex), totalItems);
        const activeSlideIndex = activeIndex % originalItems.length;

        items.forEach((item, index) => {
          const position = getSpatialPosition(nearestDelta(index, realIndex));

          setX[index](position.x);
          setZ[index](position.z);
          setRotationY[index](position.rotationY);
        });

        updateActiveUI(activeIndex, activeSlideIndex);
      };

      controls.forEach(btn => {
        const value = btn.getAttribute('data-spatial-slider-control');
        btn.disabled = false;

        btn.onclick = () => {
          gsap.killTweensOf(proxy);

          const currentIndex = getIndex();
          let targetIndex;

          if (value === 'next' || value === 'prev') {
            targetIndex = Math.round(currentIndex) + (value === 'next' ? 1 : -1);
          } else if (/^\d+$/.test(value)) {
            const targetSlide = Math.max(0, Math.min(originalItems.length - 1, parseInt(value, 10) - 1));
            targetIndex = currentIndex + getSlideDelta(targetSlide, currentIndex);
          } else {
            return;
          }

          gsap.to(proxy, {
            x: -targetIndex * stepDistance,
            duration: slideDuration,
            ease: clickEase,
            onUpdate: render
          });
        };
      });

      container._spatialSliderDraggable = Draggable.create(proxy, {
        type: 'x',
        trigger: collection,
        inertia: true,
        throwResistance: 2000,
        dragResistance: 0.05,
        maxDuration: 1,
        minDuration: 0.5,
        edgeResistance: 0.75,
        overshootTolerance: 0,
        snap: value => Math.round(value / stepDistance) * stepDistance,
        onDrag: render,
        onThrowUpdate: render,
        onThrowComplete: () => {
          container.setAttribute('data-spatial-slider-drag-status', 'grab');
          render();
        },
        onPress: () => container.setAttribute('data-spatial-slider-drag-status', 'grabbing'),
        onDragStart: () => container.setAttribute('data-spatial-slider-drag-status', 'grabbing'),
        onRelease: () => container.setAttribute('data-spatial-slider-drag-status', 'grab')
      })[0];

      render();

      // Fix for Lazy Loading images on Safari
      container._spatialSliderImageObserver = new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting) return;
        container.querySelectorAll('[data-spatial-slider-item] img[loading="lazy"]').forEach(img => {
          img.loading = 'eager';
        });
        observer.disconnect();
      });
      container._spatialSliderImageObserver.observe(container);
    });

    if (initSpatialCardsSlider._resize) window.removeEventListener('resize', initSpatialCardsSlider._resize);

    initSpatialCardsSlider._resize = debounceOnSizeChange(initSpatialCardsSlider, 200);
    window.addEventListener('resize', initSpatialCardsSlider._resize);
  }

  /* Put the DOM back the way it was authored, so the plain strip the CSS
     falls back to is the plain strip again. */
  function teardownSpatialCardsSlider() {
    if (initSpatialCardsSlider._resize) {
      window.removeEventListener('resize', initSpatialCardsSlider._resize);
      initSpatialCardsSlider._resize = null;
    }

    document.querySelectorAll('[data-spatial-slider-init]').forEach(container => {
      if (container._spatialSliderDraggable) {
        container._spatialSliderDraggable.kill();
        container._spatialSliderDraggable = null;
      }
      if (container._spatialSliderImageObserver) {
        container._spatialSliderImageObserver.disconnect();
        container._spatialSliderImageObserver = null;
      }
      if (container._spatialSliderProxy) {
        gsap.killTweensOf(container._spatialSliderProxy);
        container._spatialSliderProxy.remove();
        container._spatialSliderProxy = null;
      }

      container.querySelectorAll('[data-spatial-slider-clone]').forEach(el => el.remove());
      container.querySelectorAll('[data-spatial-slider-item]').forEach(item => {
        gsap.set(item, { clearProps: 'transform' });
        item.removeAttribute('data-spatial-slider-item-status');
      });

      const track = container.querySelector('[data-spatial-slider-list]');
      if (track) track.style.height = '';

      container.removeAttribute('data-spatial-slider-drag-status');
    });
  }

  function ready() {
    if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;
    if (!document.querySelector('[data-spatial-slider-init]')) return;

    const plugins = [Draggable];
    if (typeof InertiaPlugin !== 'undefined') plugins.push(InertiaPlugin);
    if (typeof CustomEase !== 'undefined') plugins.push(CustomEase);
    gsap.registerPlugin(...plugins);

    if (typeof CustomEase !== 'undefined' && !CustomEase.get('spatial')) {
      CustomEase.create('spatial', '0.25, 0.1, 0, 1');
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let running = false;

    const sync = () => {
      if (reduce.matches) {
        if (running) teardownSpatialCardsSlider();
        running = false;
      } else {
        initSpatialCardsSlider();
        running = true;
      }
    };

    if (reduce.addEventListener) reduce.addEventListener('change', sync);
    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }
})();
