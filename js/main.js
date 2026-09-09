/* ==========================================================================
   main.js — loads the data files, renders every section from them, and drives
   the world behind the page.

   Nothing on this page is written in the markup. If a fact is not in /data it
   does not render, which is how the accuracy rule is enforced mechanically.
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = window.ART ? window.ART.esc : function (s) { return String(s); };
  var D = {};   // loaded data

  /* ====================================================================
     BOOT
     ==================================================================== */
  var FILES = ['site', 'career', 'expertise', 'ndt', 'industrial', 'tech', 'certifications'];

  Promise.all(FILES.map(function (f) {
    return fetch('data/' + f + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(f + '.json — ' + r.status);
      return r.json();
    });
  })).then(function (sets) {
    FILES.forEach(function (f, i) { D[f] = sets[i]; });
    render();
    wire();
  }).catch(function (err) {
    console.error('Portfolio data failed to load:', err);
    var m = $('main');
    if (m) {
      var p = document.createElement('p');
      p.style.cssText = 'padding:120px 48px;color:#8798A9;font-size:15px';
      p.textContent = 'Content could not be loaded. Please refresh.';
      m.prepend(p);
    }
  });

  /* ====================================================================
     RENDER
     ==================================================================== */
  function render() {
    site();
    career();
    expertise();
    ndt();
    industrial();
    system();
    techProjects();
    ar();
    certs();
    resume();
  }

  /* ---------- identity, hero, readout, footer ---------- */
  function site() {
    var s = D.site;
    $('navLoc').textContent = s.location.replace('United Arab Emirates', 'UAE').toUpperCase();
    $('heroTitle').textContent = s.title.toUpperCase();
    $('heroEmployer').textContent = '/ ' + s.employer.toUpperCase();
    $('heroLead').textContent = s.oneLine;
    $('heroChips').innerHTML = s.chips.map(function (c, i) {
      return '<span class="tag' + (i === 0 ? ' tag-amber' : '') + '">' + esc(c.toUpperCase()) + '</span>';
    }).join('');

    s.stats.slice(0, 4).forEach(function (st, i) {
      $('ro' + i + 'v').textContent = st.value;
      $('ro' + i + 'v').classList.toggle('amber', !!st.accent);
      $('ro' + i + 'l').textContent = st.label;
    });

    $('footLeft').textContent = s.name.toUpperCase() + ' · ' + s.location.replace('United Arab Emirates', 'UAE').toUpperCase();
    $('footRight').textContent = s.headline.replace(/\s*\|\s*/g, ' · ').toUpperCase();
    document.title = s.name + ' — ' + s.headline;
  }

  /* ---------- career ---------- */
  var openRole = null;

  function career() {
    var c = D.career;

    $('stageRail').innerHTML = c.stages.map(function (st, i) {
      return '<button class="stage" data-stage="' + i + '" type="button" aria-label="' + esc(st.title) + '">' +
        (window.ART.STAGE[st.id] || '') +
        '<span class="lbl"><span class="n">' + esc(st.no) + '</span>' +
        '<span class="t">' + esc(st.title) + '</span></span></button>';
    }).join('');

    $('rolesTrack').innerHTML = c.roles.map(function (r, i) {
      var last = i === c.roles.length - 1;
      var dot = r.current ? 'amber now' : (r.stage === 'ndt' || r.stage === 'documentation' || r.id === 'miracle') ? 'amber'
              : (r.stage === 'code' || r.stage === 'quality') ? 'teal' : '';
      var per = r.periodNeeded
        ? '<span class="gap-marker">[DATES NEEDED]</span>'
        : '<span class="per">' + esc(shortPeriod(r.period)) + '</span>';
      return '<button class="role" type="button" data-role="' + esc(r.id) + '">' +
        '<span class="dot ' + dot + '"></span>' + per +
        '<span class="ttl">' + esc(r.title) + (r.qualifier ? ' <q>(' + esc(r.qualifier) + ')</q>' : '') + '</span>' +
        '<span class="co">' + esc(r.company) + '<br>' + esc(r.location) + '</span></button>';
    }).join('');

    showRole(c.roles.filter(function (r) { return r.current; })[0] || c.roles[c.roles.length - 1]);
  }

  function shortPeriod(p) {
    if (!p) return '';
    return p.replace(/January/g, 'Jan').replace(/February/g, 'Feb').replace(/March/g, 'Mar')
      .replace(/April/g, 'Apr').replace(/June/g, 'Jun').replace(/July/g, 'Jul')
      .replace(/August/g, 'Aug').replace(/September/g, 'Sep').replace(/October/g, 'Oct')
      .replace(/November/g, 'Nov').replace(/December/g, 'Dec').toUpperCase();
  }

  function showRole(r) {
    if (!r) return;
    openRole = r.id;
    var side = '';
    if (r.id === 'alfa') {
      side = '<div class="side-label">ACTIVE PROJECTS</div><ul class="side-list">' +
        D.industrial.projects.map(function (p) {
          return '<li><em>' + esc(p.no) + '</em><span>' + esc(p.name) + '</span></li>';
        }).join('') + '</ul>';
    } else if (r.equipment) {
      side = '<div class="side-label">INSPECTION EQUIPMENT</div><ul class="side-list">' +
        r.equipment.map(function (e) { return '<li><em>·</em><span>' + esc(e) + '</span></li>'; }).join('') + '</ul>';
    } else if (r.methods) {
      side = '<div class="side-label">METHODS PERFORMED</div><ul class="side-list">' +
        r.methods.map(function (m) { return '<li><em>·</em><span>' + esc(m) + '</span></li>'; }).join('') + '</ul>';
    } else if (r.tech) {
      side = '<div class="side-label">TECHNOLOGIES</div><ul class="side-list">' +
        r.tech.map(function (t) { return '<li><em>·</em><span>' + esc(t) + '</span></li>'; }).join('') + '</ul>';
    } else if (r.achievements) {
      side = '<div class="side-label">OUTCOMES</div><ul class="side-list">' +
        r.achievements.slice(0, 5).map(function (a) { return '<li><em>·</em><span>' + esc(a) + '</span></li>'; }).join('') + '</ul>';
    }

    var badge = r.current
      ? '<span class="tag tag-amber">CURRENT</span>'
      : '<span class="tag">' + esc(r.industry || '') + '</span>';
    var ctx = r.context ? '<span style="font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--muted-2)">' +
      esc(r.context.toUpperCase()) + '</span>' : '';

    $('roleDetail').innerHTML =
      '<div class="stripe"></div>' +
      '<div class="body">' +
        '<div class="badge-row">' + badge + ctx + '</div>' +
        '<h3>' + esc(r.title) + (r.qualifier ? ' <q style="quotes:none;font-weight:400;font-size:16px;color:var(--muted-2)">(' + esc(r.qualifier) + ')</q>' : '') + '</h3>' +
        '<div class="meta">' + esc(r.company) + (r.companyNote ? ' · ' + esc(r.companyNote) : '') +
          ' · ' + esc(r.location) + ' · ' +
          (r.periodNeeded ? '<span class="gap-marker">[DATES NEEDED]</span>' : esc(r.period)) + '</div>' +
        '<p>' + esc(r.summary) + '</p>' +
        '<ul>' + (r.responsibilities || []).slice(0, 6).map(function (x) {
          return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<div class="chips">' + (r.tags || r.skills || []).slice(0, 8).map(function (t) {
          return '<span class="tag">' + esc(t.toUpperCase()) + '</span>'; }).join('') + '</div>' +
      '</div>' +
      (side ? '<div class="side">' + side + '</div>' : '');

    Array.prototype.forEach.call(document.querySelectorAll('.role'), function (b) {
      b.classList.toggle('is-open', b.dataset.role === r.id);
    });
  }

  /* ---------- expertise ---------- */
  function expertise() {
    var e = D.expertise;
    $('expNote').textContent = e.note;

    $('expGrid').innerHTML = e.groups.map(function (g) {
      var icon = window.ART.ICON[g.icon] || '';
      var body;
      if (g.certified) {
        body = '<div class="chips">' + g.certified.map(function (m) {
            return '<span class="tag tag-amber method-chip">' + esc(m) + '</span>'; }).join('') + '</div>' +
          '<div class="sub">' + esc(g.supportedLabel) + '</div>' +
          '<div class="chips">' + g.supported.map(function (m) {
            return '<span class="tag method-chip">' + esc(m) + '</span>'; }).join('') + '</div>';
      } else {
        body = '<div class="chips">' + g.items.map(function (it) {
          return '<span class="chip">' + esc(it) + '</span>'; }).join('') + '</div>';
      }
      var foot = g.footer ? '<div class="foot"><div class="k">' + esc(g.footer.label) +
        '</div><div class="v">' + esc(g.footer.text) + '</div></div>' : '';
      return '<div class="panel exp reveal' + (g.accent ? ' panel-amber is-ndt' : '') + '">' +
        '<div class="top">' + icon + '<span>' + esc(g.no) + '</span></div>' +
        '<h3>' + esc(g.title) + '</h3><div class="meta">' + esc(g.meta.toUpperCase()) + '</div><hr>' +
        body + foot + '</div>';
    }).join('');

    var arrow = '<svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="#F0A63C" stroke-width="1.4" aria-hidden="true"><path d="M0 5h17M13 1l4 4-4 4"/></svg>';
    $('bridge').innerHTML = '<span class="k">WHY IT COMPOUNDS</span><div class="flow">' +
      e.bridge.map(function (b) { return '<b>' + esc(b) + '</b>'; }).join(arrow) + '</div>';
  }

  /* ---------- NDT methods ---------- */
  function ndt() {
    $('ndtGrid').innerHTML = D.ndt.methods.map(function (m) {
      var badge = m.status === 'level2'
        ? '<span class="cert-badge l2">LEVEL II</span>'
        : '<span class="cert-badge sup">SUPPORTED</span>';
      return '<article class="panel ndt-card reveal">' +
        (window.ART.NDT[m.diagram] || '') +
        '<div class="body"><div class="head"><span class="code">' + esc(m.code) + '</span>' + badge + '</div>' +
        '<div class="nm">' + esc(m.name) + '</div><p class="ds">' + esc(m.desc) + '</p>' +
        (m.note ? '<p class="xtra">' + esc(m.note) + '</p>' : '') +
        '</div></article>';
    }).join('');
  }

  /* ---------- industrial projects ---------- */
  function industrial() {
    var d = D.industrial;
    $('industrialNotice').textContent = d.disclaimer;

    var feat = d.projects.filter(function (p) { return p.featured; });
    var rest = d.projects.filter(function (p) { return !p.featured; });

    $('projFeatured').innerHTML = feat.map(function (p, i) {
      return '<article class="panel proj reveal' + (i === 0 ? ' panel-amber' : '') + '" style="padding:0">' +
        '<div class="inner">' + (window.ART.PROJ[p.diagram] || '') +
        '<div class="body"><div class="top"><span class="no">' + esc(p.no) + '</span>' +
        '<span class="tag' + (i === 0 ? ' tag-amber' : '') + '">' + esc(p.scope.toUpperCase()) + '</span></div>' +
        '<h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p>' +
        '<div class="chips">' + p.tags.map(function (t) {
          return '<span class="tag">' + esc(t.toUpperCase()) + '</span>'; }).join('') + '</div>' +
        '</div></div></article>';
    }).join('');

    $('projGrid').innerHTML = rest.map(function (p) {
      return '<article class="panel proj reveal">' +
        '<div class="top"><span class="no">' + esc(p.no) + '</span>' + (window.ART.ICON[p.icon] || '') + '</div>' +
        '<h3>' + esc(p.name) + '</h3><div class="scope">' + esc(p.scope) + '</div>' +
        '<div class="chips tags">' + p.tags.map(function (t) {
          return '<span class="tag">' + esc(t.toUpperCase()) + '</span>'; }).join('') + '</div></article>';
    }).join('');
  }

  /* ---------- NDT management system ---------- */
  function system() {
    var s = D.tech.ndtSystem;
    $('systemIntro').textContent = s.intro;
    $('systemGap').innerHTML = '<b>[ CONTENT NEEDED ]</b><span>' + esc(s.contentNeeded) + '</span>';

    var iconMap = { people: 'people', box: 'box', case: 'case', doc: 'docS', lock: 'lock' };
    $('modGrid').innerHTML = s.clusters.map(function (c) {
      return '<div class="panel cluster reveal' + (c.accent ? ' panel-amber is-accent' : '') + '">' +
        '<div class="ch">' + (window.ART.ICON[iconMap[c.icon]] || '') + '<span class="ct">' + esc(c.label) + '</span></div>' +
        '<ul class="mods">' + c.modules.map(function (m) {
          return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    }).join('');

    $('lifecycle').innerHTML = '<div class="k">' + esc(s.lifecycle.label) + '</div>' +
      window.ART.flow(s.lifecycle.steps, s.lifecycle.rail, 'arrLife');
  }

  /* ---------- technology projects ---------- */
  function techProjects() {
    var t = D.tech;
    var sc = t.smartCart;

    $('smartCart').innerHTML =
      '<div class="inner"><div class="body">' +
        '<div class="badge-row"><span class="tag tag-amber">' + esc(sc.badge) + '</span>' +
        '<span class="when">' + esc(sc.period.toUpperCase()) + '</span></div>' +
        '<h3>' + esc(sc.title) + '</h3><p>' + esc(sc.desc) + '</p>' +
        '<div class="chips">' + sc.tech.map(function (x) {
          return '<span class="tag">' + esc(x.toUpperCase()) + '</span>'; }).join('') + '</div>' +
      '</div><div class="slot">[ SCREENSHOT ]</div></div>' +
      '<div class="flow-strip">' + window.ART.flow(sc.workflow, sc.workflowRail, 'arrCart') + '</div>';

    $('siteCols').innerHTML = [t.shopify, t.cms].map(function (c) {
      return '<div class="panel site-card reveal">' +
        '<div class="hd"><h3>' + esc(c.title) + '</h3>' +
        '<span class="count">' + (c.sites.length < 10 ? '0' : '') + c.sites.length + ' SITES</span></div>' +
        '<div class="meta">' + esc(c.meta.toUpperCase()) + '</div>' +
        '<ul class="site-list">' + c.sites.map(function (x, i) {
          var wide = (c.sites.length % 2 === 1 && i === c.sites.length - 1) || x.length > 22;
          return '<li' + (wide ? ' class="wide"' : '') + '>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<div class="chips tech">' + c.tech.map(function (x) {
          return '<span class="tag">' + esc(x.toUpperCase()) + '</span>'; }).join('') + '</div></div>';
    }).join('');
  }

  /* ---------- AR ---------- */
  function ar() {
    var a = D.tech.ar;
    $('arBlock').innerHTML =
      '<div class="ar-cols">' +
        '<div class="panel panel-amber ar-device reveal">' + window.ART.AR_DEVICE + '</div>' +
        '<div class="ar-body">' +
          '<div class="panel reveal" style="padding:24px 28px">' +
            '<h3 style="font-family:var(--display);font-weight:700;font-size:22px;margin-bottom:8px;color:var(--text)">' + esc(a.title) + '</h3>' +
            '<p style="font-size:13.5px;line-height:1.66;color:#97A6B6;text-wrap:pretty">' + esc(a.desc) + '</p>' +
          '</div>' +
          '<div class="ar-two">' +
            '<div class="panel reveal"><div class="k">ON RECOGNITION, DISPLAYS</div><ul>' +
              a.onRecognition.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
            '<div class="panel reveal"><div class="k">INTERACTIVE AR</div><ul>' +
              a.interactive.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
              '<div class="chips" style="margin-top:18px;padding-top:16px;border-top:1px dashed #22303D">' +
              a.tags.map(function (x) { return '<span class="tag">' + esc(x.toUpperCase()) + '</span>'; }).join('') +
              '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="panel vision reveal"><div class="hd"><span>' + esc(a.visionLabel) + '</span>' +
        '<span class="tag" style="color:var(--amber);border-color:var(--amber-dim)">CONCEPT ONLY</span></div>' +
        window.ART.flow(a.vision, null, 'arrAR') + '</div>' +
      '<div class="ar-foot">' +
        '<div class="accuracy"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F0A63C" stroke-width="1.8" style="flex-shrink:0;margin-top:3px" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V13M12 16.2v.1"/></svg>' +
        '<span>' + esc(a.accuracy) + '</span></div>' +
        '<div class="gap-note"><b>[ ASSETS NEEDED ]</b><span>' + esc(a.assetsNeeded) + '</span></div>' +
      '</div>';
  }

  /* ---------- certifications ---------- */
  function certs() {
    var c = D.certifications;
    $('certGap').innerHTML = '<b>[ DETAILS NEEDED ]</b><span>' + esc(c.detailsNeeded) + '</span>';
    $('asntLabel').textContent = c.asnt.label;
    $('asntIssuer').textContent = c.asnt.issuer.toUpperCase();
    $('filmStrip').innerHTML = window.ART.filmStrip(c.asnt.items);

    $('certGroups').innerHTML = c.groups.map(function (g) {
      return '<div class="panel cert-group reveal"><h3>' + esc(g.title) + '</h3>' +
        '<div class="meta">' + esc(g.meta) + '</div>' +
        '<ul class="cert-list">' + g.items.map(function (it) {
          return '<li><span class="d ' + esc(g.dot) + '"></span><span class="t">' + esc(it.name) + '</span>' +
            '<span class="v">' + esc(it.value || '[ ]') + '</span></li>'; }).join('') + '</ul></div>';
    }).join('');
  }

  /* ---------- resume + contact ---------- */
  function resume() {
    var s = D.site, I = window.ART.ICON;

    var dl = s.resume.available
      ? '<a class="btn btn-primary" href="' + esc(s.resume.file) + '" download>' + I.down + 'DOWNLOAD RESUME</a>' +
        '<a class="btn btn-ghost" href="' + esc(s.resume.file) + '" target="_blank" rel="noopener">' + I.eye + 'VIEW RESUME</a>'
      : '<span class="btn btn-primary is-disabled" title="' + esc(s.resume.note) + '">' + I.down + 'DOWNLOAD RESUME</span>' +
        '<span class="gap-marker" style="align-self:center">[ RESUME PDF NOT SUPPLIED ]</span>';
    $('rcActions').innerHTML = dl;

    var certList = D.certifications.asnt.items.map(function (i) { return i.code; }).join(', ');
    var facts = [
      ['CURRENT ROLE', s.title],
      ['EMPLOYER', s.employer],
      ['BASED IN', s.location],
      ['CERTIFICATION', 'ASNT NDT Level II — ' + certList],
      ['EDUCATION', 'Diploma in Information Technology, QUEST International University']
    ];
    $('facts').innerHTML = facts.map(function (f) {
      return '<li><span class="k">' + esc(f[0]) + '</span><span class="v">' + esc(f[1]) + '</span></li>';
    }).join('');

    $('openTo').textContent = s.openTo;

    var c = s.contact;
    $('links').innerHTML =
      '<button class="link" id="copyEmail" type="button" data-email="' + esc(c.email) + '">' + I.mail +
        '<span><span class="lb">EMAIL</span><span class="vl">' + esc(c.email) + '</span></span>' +
        '<span class="copied" id="copied">COPIED</span></button>' +
      '<a class="link" href="' + esc(c.linkedin.url) + '" target="_blank" rel="noopener">' + I.linked +
        '<span><span class="lb">LINKEDIN</span><span class="vl">' + esc(c.linkedin.label) + '</span></span></a>' +
      '<a class="link" href="' + esc(c.github.url) + '" target="_blank" rel="noopener">' + I.github +
        '<span><span class="lb">GITHUB</span><span class="vl">' + esc(c.github.label) + '</span></span></a>' +
      '<a class="link" href="' + esc(c.whatsapp.url) + '" target="_blank" rel="noopener">' + I.whats +
        '<span><span class="lb">WHATSAPP</span><span class="vl">' + esc(c.whatsapp.label) + '</span></span></a>';
  }

  /* ====================================================================
     INTERACTION + WORLD
     ==================================================================== */
  function wire() {
    var nav = $('nav'), burger = $('navBurger');
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.nav-menu a'), function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      var role = e.target.closest ? e.target.closest('.role') : null;
      if (role) {
        var r = D.career.roles.filter(function (x) { return x.id === role.dataset.role; })[0];
        showRole(r);
        return;
      }
      var st = e.target.closest ? e.target.closest('.stage') : null;
      if (st) { jumpToStage(+st.dataset.stage); return; }
      var ce = e.target.closest ? e.target.closest('#copyEmail') : null;
      if (ce) {
        var em = ce.dataset.email;
        if (navigator.clipboard) navigator.clipboard.writeText(em).then(flash).catch(flash);
        else flash();
      }
    });

    function flash() {
      var c = $('copied');
      if (!c) return;
      c.classList.add('on');
      setTimeout(function () { c.classList.remove('on'); }, 1600);
    }

    /* reveal on scroll */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('in'); });
    }

    /* the world */
    var worldOn = window.WORLD && window.WORLD.init($('world'));
    if (!worldOn) { $('world').style.display = 'none'; }

    var bounds = null;
    function measure() {
      var career = $('career');
      bounds = {
        max: Math.max(1, document.body.scrollHeight - innerHeight),
        cTop: career.offsetTop - innerHeight * 0.6,
        cBot: career.offsetTop + career.offsetHeight - innerHeight * 0.2
      };
    }
    measure();
    addEventListener('resize', measure);

    /* journey: 0 → .10 approaching the pipe, .10 → .74 through the seven
       stages while the career section is on screen, .74 → 1 for the rest. */
    function journeyAt(y) {
      if (!bounds) return 0;
      if (y <= bounds.cTop) return bounds.cTop > 0 ? (y / bounds.cTop) * 0.10 : 0;
      if (y <= bounds.cBot) return 0.10 + ((y - bounds.cTop) / Math.max(1, bounds.cBot - bounds.cTop)) * 0.64;
      return 0.74 + ((y - bounds.cBot) / Math.max(1, bounds.max - bounds.cBot)) * 0.26;
    }

    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a'));
    var lastStage = -2, ticking = false;

    function frame() {
      ticking = false;
      var y = scrollY;

      $('progress').style.width = (Math.min(1, y / bounds.max) * 100) + '%';
      $('readout').classList.toggle('show', y > innerHeight * 0.4);

      if (worldOn) window.WORLD.setJourney(journeyAt(y));

      var idx = worldOn ? window.WORLD.stageIndex() : stageFromScroll(y);
      if (idx !== lastStage) {
        lastStage = idx;
        Array.prototype.forEach.call(document.querySelectorAll('.stage'), function (el, i) {
          el.classList.toggle('on', i === idx);
        });
        var st = D.career.stages[idx];
        $('roStage').textContent = st ? ('STAGE ' + st.no + ' · ' + st.title.toUpperCase()) : 'SCAN ACTIVE';
      }

      var here = '';
      sections.forEach(function (s) { if (s.offsetTop - 140 <= y) here = s.id; });
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + here);
      });
    }

    function stageFromScroll(y) {
      if (!bounds || y < bounds.cTop || y > bounds.cBot) return -1;
      var f = (y - bounds.cTop) / Math.max(1, bounds.cBot - bounds.cTop);
      return Math.max(0, Math.min(6, Math.round(f * 6)));
    }

    addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }, { passive: true });
    frame();

    window.jumpToStage = jumpToStage;
    function jumpToStage(i) {
      if (!bounds) return;
      var y = bounds.cTop + ((i + 0.5) / 7) * (bounds.cBot - bounds.cTop);
      scrollTo({ top: y, behavior: 'smooth' });
    }
  }
})();
