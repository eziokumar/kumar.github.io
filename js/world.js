/* ==========================================================================
   world.js — the 3D world behind the page.

   A single dark volume you fly through. A pipe establishes the opening shot,
   then seven wireframe structures, one per career stage, warm from cold steel
   to their stage colour as the camera closes in.

   Public API:
     WORLD.init(canvas)   -> true if it started, false if unavailable
     WORLD.setJourney(t)  -> t in [0,1], camera position along the whole run
     WORLD.stageIndex()   -> nearest stage (0..6) or -1 while still at the hero
   Everything degrades to nothing: if this never runs the page still works.
   ========================================================================== */
(function (w) {
  "use strict";

  var HERO_LEAD = 300;
  var GAP = 260;
  var N = 7;
  var START_Z = 150;
  var END_Z = -(HERO_LEAD + (N - 1) * GAP) - 130;

  var ACCENT = {
    hardware: 0x4FB3B8, code: 0x4FB3B8, ar3d: 0x4FB3B8,
    quality: 0x8FA6BD, ndt: 0xF0A63C, oilgas: 0xF0A63C, documentation: 0x4FB3B8
  };
  var ORDER = ['hardware', 'code', 'ar3d', 'quality', 'ndt', 'oilgas', 'documentation'];

  var renderer, scene, camera, probe, hero, groups = [], raf = null;
  var DIM = null, tmp = null;
  var journey = 0, journeyTarget = 0, nearest = -1;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var G = null;   // group under construction
  var running = false;

  /* ---------- construction helpers ---------- */
  function fill(op) {
    return new THREE.MeshBasicMaterial({
      color: 0x060B10, transparent: true, opacity: op === undefined ? 0.92 : op
    });
  }
  function wireMesh(geo, o) {
    o = o || {};
    var holder = new THREE.Object3D();
    if (o.fill !== false) holder.add(new THREE.Mesh(geo, fill(o.fillOpacity)));
    var op = o.opacity === undefined ? 0.85 : o.opacity;
    var line = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, o.angle === undefined ? 12 : o.angle),
      new THREE.LineBasicMaterial({ color: DIM.clone(), transparent: true, opacity: op })
    );
    holder.add(line);
    G.userData.glow.push({ line: line, base: op, hot: o.hot });
    G.add(holder);
    return holder;
  }
  function poly(pts, o) {
    o = o || {};
    var op = o.opacity === undefined ? 0.7 : o.opacity;
    var geo = new THREE.BufferGeometry().setFromPoints(pts.map(function (p) {
      return new THREE.Vector3(p[0], p[1], p[2]);
    }));
    var line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: DIM.clone(), transparent: true, opacity: op
    }));
    G.userData.glow.push({ line: line, base: op, hot: o.hot });
    G.add(line);
    return line;
  }
  function hot(geo, color, op) {
    var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: op === undefined ? 1 : op
    }));
    G.userData.emissive.push({ m: m.material, base: op === undefined ? 1 : op });
    G.add(m);
    return m;
  }

  /* ---------- stage builders ---------- */
  function sHardware() {
    [[-62, 14, -40, -0.5], [58, -18, 30, 0.42], [-40, -34, 70, 0.2]].forEach(function (p) {
      var b = wireMesh(new THREE.BoxGeometry(72, 1.6, 52));
      b.position.set(p[0], p[1], p[2]); b.rotation.z = p[3]; b.rotation.y = p[3] * 0.6;
      for (var i = 0; i < 5; i++) {
        var c = wireMesh(new THREE.BoxGeometry(7 + Math.random() * 7, 3, 6 + Math.random() * 6));
        c.position.set(p[0] + (Math.random() - 0.5) * 54, p[1] + 2.4, p[2] + (Math.random() - 0.5) * 36);
        c.rotation.z = p[3]; c.rotation.y = p[3] * 0.6;
      }
      for (var t = 0; t < 7; t++) {
        var x = p[0] + (Math.random() - 0.5) * 60, z = p[2] + (Math.random() - 0.5) * 44;
        var pts = [[x, p[1] + 1.2, z]];
        for (var s = 0; s < 3; s++) {
          if (Math.random() > 0.5) x += (Math.random() - 0.5) * 30; else z += (Math.random() - 0.5) * 24;
          pts.push([x, p[1] + 1.2, z]);
        }
        poly(pts, { opacity: 0.5 });
      }
    });
    for (var i = 0; i < 6; i++) {
      var card = wireMesh(new THREE.BoxGeometry(34, 9, 1.4));
      card.position.set((i % 2 ? 1 : -1) * (74 + Math.random() * 26), -6 + i * 9, -70 + i * 26);
      card.rotation.y = (i % 2 ? -1 : 1) * 0.5;
    }
    for (var n = 0; n < 22; n++) {
      hot(new THREE.SphereGeometry(0.85, 8, 8), 0x4FB3B8, 0.75)
        .position.set((Math.random() - 0.5) * 220, (Math.random() - 0.5) * 130, (Math.random() - 0.5) * 180);
    }
  }

  function sCode() {
    [[-68, 20, -30, 0.55], [64, -6, 20, -0.5], [-52, -32, 66, 0.4], [58, 34, 74, -0.42]].forEach(function (p) {
      var W = 58, H = 38;
      var f = wireMesh(new THREE.BoxGeometry(W, H, 1.2), { fillOpacity: 0.95 });
      f.position.set(p[0], p[1], p[2]); f.rotation.y = p[3];
      for (var L = 0; L < 6; L++) {
        var len = 10 + Math.random() * 30;
        var ln = hot(new THREE.BoxGeometry(len, 0.7, 0.5), L === 2 ? 0xF0A63C : 0x4FB3B8, L === 2 ? 0.95 : 0.42);
        ln.position.set(p[0], p[1], p[2]); ln.rotation.y = p[3];
        ln.translateX(-W / 2 + len / 2 + 5); ln.translateY(6 - L * 5); ln.translateZ(0.9);
      }
    });
    poly([[-30, 26, -120], [-44, 10, -120], [-30, -6, -120]], { opacity: 0.8, hot: 0xF0A63C });
    poly([[30, 26, -120], [44, 10, -120], [30, -6, -120]], { opacity: 0.8, hot: 0xF0A63C });
    for (var i = 0; i < 26; i++) {
      hot(new THREE.BoxGeometry(1.2, 1.2, 1.2), 0x4FB3B8, 0.55)
        .position.set((Math.random() - 0.5) * 230, (Math.random() - 0.5) * 140, (Math.random() - 0.5) * 190);
    }
  }

  function sAr3d() {
    var core = new THREE.IcosahedronGeometry(21, 1);
    G.userData.spin = [wireMesh(core, { angle: 1, opacity: 0.9, hot: 0x4FB3B8 })];
    var hs = [];
    [[18, 10, 11], [-16, -9, 14], [7, 19, -10]].forEach(function (p) {
      var r = hot(new THREE.RingGeometry(2.6, 3.2, 22), 0xF0A63C, 0.95);
      r.position.set(p[0], p[1], p[2]); hs.push(r);
    });
    G.userData.hots = hs;
    var B = 34, T = 9;
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(function (s) {
      poly([[s[0] * B - s[0] * T, s[1] * B, 26], [s[0] * B, s[1] * B, 26], [s[0] * B, s[1] * B - s[1] * T, 26]],
        { opacity: 0.85, hot: 0xF0A63C });
    });
    for (var i = 0; i < 6; i++) {
      var o = wireMesh(new THREE.OctahedronGeometry(5 + Math.random() * 4, 0), { opacity: 0.45 });
      o.position.set((i % 2 ? 1 : -1) * (70 + Math.random() * 40), (Math.random() - 0.5) * 90, -90 + i * 32);
    }
  }

  function sQuality() {
    wireMesh(new THREE.BoxGeometry(104, 3, 5)).position.set(0, 22, -10);
    var j1 = wireMesh(new THREE.BoxGeometry(3, 22, 5)); j1.position.set(-30, 10, -10);
    var j2 = wireMesh(new THREE.BoxGeometry(3, 22, 5)); j2.position.set(26, 10, -10);
    G.userData.jaws = [j1, j2];
    for (var i = 0; i <= 18; i++) {
      var x = -46 + i * 5.2, h = (i % 4 === 0) ? 6 : 3;
      poly([[x, 25, -10], [x, 25 + h, -10]], { opacity: 0.7, hot: 0xF0A63C });
    }
    wireMesh(new THREE.TorusGeometry(12, 0.9, 6, 36), { fill: false, opacity: 0.8 }).position.set(62, 8, -46);
    G.userData.needle = hot(new THREE.BoxGeometry(9, 0.8, 0.8), 0xF0A63C, 1);
    G.userData.needle.position.set(62, 8, -45);
    for (var b = 0; b < 8; b++) {
      var m = wireMesh(new THREE.BoxGeometry(11, 11, 11));
      m.position.set(-72 + b * 21, -26, 30 + (Math.random() - 0.5) * 60);
      m.rotation.y = Math.random() * 0.7;
    }
  }

  function sNdt() {
    var pipe = wireMesh(new THREE.CylinderGeometry(17, 17, 340, 26, 1, true), { fill: false, opacity: 0.55 });
    pipe.rotation.x = Math.PI / 2;
    var inner = new THREE.Mesh(new THREE.CylinderGeometry(16.6, 16.6, 340, 26, 1, true), fill(0.9));
    inner.rotation.x = Math.PI / 2; inner.material.side = THREE.BackSide; G.add(inner);

    for (var i = -2; i <= 2; i++) {
      wireMesh(new THREE.TorusGeometry(17.4, 1.1, 6, 28), { fill: false, opacity: 0.9, hot: 0xF0A63C })
        .position.z = i * 62;
    }
    for (var c = -3; c <= 3; c++) {
      wireMesh(new THREE.BoxGeometry(5, 30, 26)).position.set(0, -30, c * 50);
    }
    G.userData.ring = hot(new THREE.TorusGeometry(21, 0.4, 8, 56), 0xF0A63C, 1);
    G.userData.halo = hot(new THREE.TorusGeometry(26, 2.8, 8, 42), 0xF0A63C, 0.14);
    var arcs = [];
    for (var a = 0; a < 3; a++) {
      var m = hot(new THREE.TorusGeometry(19 + a * 4.5, 0.2, 6, 34, Math.PI * 0.72), 0xF0A63C, 0.5 - a * 0.13);
      m.rotation.z = -Math.PI * 0.36; arcs.push({ m: m, base: 0.5 - a * 0.13 });
    }
    G.userData.arcs = arcs;
  }

  function sOilGas() {
    function run(a, b, r) {
      var A = new THREE.Vector3(a[0], a[1], a[2]), B = new THREE.Vector3(b[0], b[1], b[2]);
      var m = wireMesh(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 10, 1, true), { fill: false, opacity: 0.7 });
      m.position.copy(A).lerp(B, 0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    }
    run([-110, -26, -60], [14, -26, -60], 5.4);
    run([14, -26, -60], [14, 28, -60], 5.4);
    run([14, 28, -60], [116, 28, -60], 5.4);
    run([-80, 18, 44], [88, 18, 44], 4);
    run([-84, -40, 10], [96, -40, 10], 6.4);
    run([40, -40, 10], [40, 8, 10], 3.2);
    run([-50, 44, -10], [-50, -10, -10], 3.2);

    [[14, 28, -60], [40, 8, 10], [-80, 18, 44], [-50, 44, -10]].forEach(function (p) {
      var v = wireMesh(new THREE.TorusGeometry(6.6, 1.6, 6, 16), { fill: false, opacity: 0.95, hot: 0xF0A63C });
      v.position.set(p[0], p[1], p[2]); v.rotation.y = Math.PI / 2;
    });
    for (var i = -1; i <= 1; i++) {
      wireMesh(new THREE.BoxGeometry(4, 92, 4)).position.set(-92, 8, i * 74);
      wireMesh(new THREE.BoxGeometry(4, 92, 4)).position.set(100, 8, i * 74);
      wireMesh(new THREE.BoxGeometry(196, 4, 4)).position.set(4, 54, i * 74);
    }
    poly([[100, 54, 0], [100, 86, 0]], { opacity: 0.7 });
    G.userData.flare = hot(new THREE.SphereGeometry(3.4, 10, 10), 0xF0A63C, 0.9);
    G.userData.flare.position.set(100, 88, 0);
  }

  function sDocs() {
    for (var i = 0; i < 13; i++) {
      var s = wireMesh(new THREE.BoxGeometry(46, 0.6, 62),
        { opacity: i === 12 ? 0.95 : 0.5, hot: i === 12 ? 0xF0A63C : undefined });
      s.position.set(-26 + i * 1.8, -30 + i * 4.6, -10);
      s.rotation.y = i * 0.05;
    }
    for (var L = 0; L < 6; L++) {
      var len = 14 + Math.random() * 22;
      var ln = hot(new THREE.BoxGeometry(len, 0.4, 1.3), L === 5 ? 0xF0A63C : 0x4FB3B8, L === 5 ? 0.95 : 0.42);
      ln.position.set(-26 + 12 * 1.8 - 16 + len / 2, -30 + 12 * 4.6 + 0.8, -28 + L * 8);
      ln.rotation.y = 12 * 0.05;
    }
    var bits = [];
    for (var b = 0; b < 40; b++) {
      var m = hot(new THREE.BoxGeometry(1.7, 1.7, 1.7), 0x4FB3B8, 0.8);
      m.position.set(62 + (Math.random() - 0.5) * 70, (Math.random() - 0.5) * 110, (Math.random() - 0.5) * 130);
      bits.push(m);
    }
    G.userData.bits = bits;
    for (var sh = 0; sh < 5; sh++) {
      wireMesh(new THREE.BoxGeometry(30, 46, 3), { opacity: 0.4 }).position.set(-96, 0, -80 + sh * 40);
    }
  }

  var BUILDERS = [sHardware, sCode, sAr3d, sQuality, sNdt, sOilGas, sDocs];

  /* ---------- the hero establishing shot ---------- */
  function buildHero() {
    G = new THREE.Group();
    G.userData.glow = []; G.userData.emissive = [];
    var pipe = wireMesh(new THREE.CylinderGeometry(19, 19, 260, 30, 1, true), { fill: false, opacity: 0.6 });
    pipe.rotation.z = Math.PI / 2;
    var inner = new THREE.Mesh(new THREE.CylinderGeometry(18.6, 18.6, 260, 30, 1, true), fill(0.94));
    inner.rotation.z = Math.PI / 2; inner.material.side = THREE.BackSide; G.add(inner);
    for (var i = -2; i <= 2; i++) {
      var s = wireMesh(new THREE.TorusGeometry(19.4, 1.2, 6, 30), { fill: false, opacity: 0.9, hot: 0xF0A63C });
      s.rotation.y = Math.PI / 2; s.position.x = i * 52;
    }
    for (var c = -2; c <= 2; c++) {
      wireMesh(new THREE.BoxGeometry(26, 32, 5)).position.set(c * 46, -33, 0);
    }
    G.userData.ring = hot(new THREE.TorusGeometry(23, 0.45, 8, 48), 0xF0A63C, 1);
    G.userData.ring.rotation.y = Math.PI / 2;
    G.userData.halo = hot(new THREE.TorusGeometry(28, 3, 8, 36), 0xF0A63C, 0.13);
    G.userData.halo.rotation.y = Math.PI / 2;
    G.position.z = 0;
    scene.add(G);
    return G;
  }

  /* ---------- public ---------- */
  function supported() {
    if (typeof THREE === 'undefined') return false;
    if (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  function init(canvas) {
    if (!supported()) return false;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) { return false; }

    DIM = new THREE.Color(0x27394A);
    tmp = new THREE.Color();

    renderer.setPixelRatio(Math.min(w.devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04070A);
    scene.fog = new THREE.FogExp2(0x04070A, 0.0042);

    camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.5, 1500);
    probe = new THREE.PointLight(0xF0A63C, 2.2, 190, 2);
    scene.add(probe);
    scene.add(new THREE.AmbientLight(0x33465A, 0.5));

    hero = buildHero();

    BUILDERS.forEach(function (fn, i) {
      G = new THREE.Group();
      G.position.z = -(HERO_LEAD + i * GAP);
      G.userData.glow = []; G.userData.emissive = []; G.userData.key = ORDER[i];
      fn();
      scene.add(G);
      groups.push(G);
    });

    var gridLo = new THREE.GridHelper(2000, 130, 0x1E3A44, 0x0E1C24);
    gridLo.position.set(0, -84, -(HERO_LEAD + (N - 1) * GAP) / 2);
    gridLo.material.transparent = true; gridLo.material.opacity = 0.28;
    scene.add(gridLo);
    var gridHi = gridLo.clone();
    gridHi.material = gridLo.material.clone(); gridHi.material.opacity = 0.1;
    gridHi.position.y = 100; scene.add(gridHi);

    var dg = new THREE.BufferGeometry(), dp = [];
    for (var i2 = 0; i2 < 3000; i2++) {
      dp.push((Math.random() - 0.5) * 440, (Math.random() - 0.5) * 280,
        START_Z - Math.random() * (START_Z - END_Z + 200));
    }
    dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
    scene.add(new THREE.Points(dg, new THREE.PointsMaterial({
      color: 0x5E7F94, size: 0.7, transparent: true, opacity: 0.5
    })));

    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('resize', onResize);
    running = true;
    clock = new THREE.Clock();
    raf = requestAnimationFrame(tick);
    return true;
  }

  var clock;

  function onMove(e) {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / innerHeight) * 2 - 1;
  }
  function onResize() {
    if (!renderer) return;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }

  function setJourney(t) { journeyTarget = Math.max(0, Math.min(1, t)); }
  function stageIndex() { return nearest; }

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!running) return;
    var t = clock.getElapsedTime();

    journey += (journeyTarget - journey) * 0.07;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    var camZ = START_Z + journey * (END_Z - START_Z);
    camera.position.set(mouse.x * 22, 4 - mouse.y * 20, camZ);
    camera.lookAt(mouse.x * 8, -mouse.y * 8, camZ - 140);
    probe.position.set(0, 4, camZ - 50);

    /* hero pipe: ring rides ahead while we approach it */
    var hd = Math.abs(camZ - hero.position.z);
    var hvis = Math.max(0, Math.min(1, 1 - (hd - 120) / 180));
    hero.visible = hvis > 0.012;
    if (hero.visible) {
      hero.userData.glow.forEach(function (o) {
        tmp.setHex(o.hot !== undefined ? o.hot : 0xF0A63C);
        o.line.material.color.copy(DIM).lerp(tmp, hvis);
        o.line.material.opacity = o.base * (0.22 + 0.78 * hvis);
      });
      hero.userData.emissive.forEach(function (o) { o.m.opacity = o.base * hvis; });
      var hx = -70 + Math.sin(t * 0.5) * 46;
      hero.userData.ring.position.x = hx;
      hero.userData.halo.position.x = hx;
      hero.userData.halo.scale.setScalar(1 + Math.sin(t * 2.6) * 0.05);
    }

    /* stages */
    var best = -1, bestD = 1e9;
    groups.forEach(function (g, i) {
      var d = Math.abs(camZ - g.position.z);
      if (d < bestD) { bestD = d; best = i; }
      var vis = Math.max(0, Math.min(1, 1 - (d - 110) / 170));
      g.visible = vis > 0.012;
      if (!g.visible) return;
      var acc = ACCENT[g.userData.key];
      g.userData.glow.forEach(function (o) {
        tmp.setHex(o.hot !== undefined ? o.hot : acc);
        o.line.material.color.copy(DIM).lerp(tmp, vis);
        o.line.material.opacity = o.base * (0.22 + 0.78 * vis);
      });
      g.userData.emissive.forEach(function (o) { o.m.opacity = o.base * vis; });
    });
    nearest = (bestD < GAP * 0.85) ? best : -1;

    var g3 = groups[2];
    if (g3 && g3.visible) {
      g3.userData.spin.forEach(function (o) { o.rotation.x = t * 0.13; o.rotation.y = t * 0.19; });
      g3.userData.hots.forEach(function (r, n) {
        r.lookAt(camera.position);
        r.scale.setScalar(1 + Math.sin(t * 2.4 + n) * 0.18);
      });
    }
    var g4 = groups[3];
    if (g4 && g4.visible) {
      var o4 = Math.sin(t * 0.9) * 4.5;
      g4.userData.jaws[0].position.x = -30 - o4;
      g4.userData.jaws[1].position.x = 26 + o4;
      g4.userData.needle.rotation.z = Math.sin(t * 1.7) * 0.95;
    }
    var g5 = groups[4];
    if (g5 && g5.visible) {
      var local = camZ - g5.position.z - 58;
      g5.userData.ring.position.z = local;
      g5.userData.halo.position.z = local;
      g5.userData.halo.scale.setScalar(1 + Math.sin(t * 2.6) * 0.05);
      g5.userData.arcs.forEach(function (a, n) {
        a.m.position.z = local + 7 + n * 5.5;
        a.m.material.opacity = a.base * (0.5 + 0.5 * Math.sin(t * 3 - n * 0.9));
      });
    }
    var g6 = groups[5];
    if (g6 && g6.visible && g6.userData.flare) {
      g6.userData.flare.scale.setScalar(1 + Math.sin(t * 5.2) * 0.22);
    }
    var g7 = groups[6];
    if (g7 && g7.visible) {
      g7.userData.bits.forEach(function (b, n) {
        b.position.y += Math.sin(t * 1.3 + n) * 0.05;
        b.rotation.x = t * 0.4 + n; b.rotation.y = t * 0.3 + n;
      });
    }

    renderer.render(scene, camera);
  }

  w.WORLD = { init: init, setJourney: setJourney, stageIndex: stageIndex, supported: supported };
})(window);
