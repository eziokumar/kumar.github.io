(() => {
  "use strict";

  /* ---------------- year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const SUN = '<path d="M12 3v2.2M12 18.8V21M4.2 4.2l1.55 1.55M18.25 18.25l1.55 1.55M3 12h2.2M18.8 12H21M4.2 19.8l1.55-1.55M18.25 5.75l1.55-1.55" stroke-linecap="round"/><circle cx="12" cy="12" r="4.6"/>';
  const MOON = '<path d="M12 3a6.5 6.5 0 1 0 9 9 9 9 0 1 1-9-9Z"/>';

  function applyTheme(mode) {
    if (mode === "light") {
      root.setAttribute("data-theme", "light");
      themeIcon.innerHTML = SUN;
    } else {
      root.removeAttribute("data-theme");
      themeIcon.innerHTML = MOON;
    }
  }
  const savedTheme = localStorage.getItem("kumar-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(savedTheme || (prefersLight ? "light" : "dark"));

  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("kumar-theme", next);
  });

  /* ---------------- mobile nav ---------------- */
  const navMenu = document.getElementById("navMenu");
  const navBurger = document.getElementById("navBurger");
  navBurger.addEventListener("click", () => navMenu.classList.toggle("open"));
  navMenu.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => navMenu.classList.remove("open"))
  );

  /* ---------------- active nav link on scroll ---------------- */
  const navLinks = Array.from(navMenu.querySelectorAll("a"));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const link = navLinks.find(a => a.getAttribute("href") === "#" + entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach(s => navObserver.observe(s));

  /* ---------------- header border on scroll ---------------- */
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.style.borderBottomColor = window.scrollY > 10
      ? "var(--panel-border)"
      : "transparent";
  }, { passive: true });

  /* ---------------- scroll reveal ---------------- */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  function observeReveal(root = document) {
    root.querySelectorAll(".reveal, .reveal-stagger, .t-item").forEach(t => revealObserver.observe(t));
  }
  observeReveal();

  /* ---------------- timeline track fill ---------------- */
  function wireTimelineTrack(sectionId, trackId) {
    const section = document.getElementById(sectionId);
    const track = document.getElementById(trackId);
    if (!section || !track) return;

    function update() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.75 - rect.top) / rect.height));
      track.style.height = (progress * 100) + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
  wireTimelineTrack("experience", "expTrack");
  wireTimelineTrack("education", "eduTrack");

  /* ---------------- typed role text ---------------- */
  const roles = ["Front-End Developer.", "Web Designer.", "NDT Inspector.", "Problem Solver."];
  const typedEl = document.getElementById("typedRole");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeTick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeTick, 1400);
        return;
      }
    } else {
      charIdx--;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeTick, deleting ? 35 : 65);
  }
  if (typedEl) typeTick();

  /* ---------------- skill gauges ---------------- */
  const gauges = document.querySelectorAll(".gauge");
  const gaugeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const gauge = entry.target;
        const value = gauge.getAttribute("data-value");
        const fill = gauge.querySelector(".gauge-fill");
        requestAnimationFrame(() => { fill.style.width = value + "%"; });
        gaugeObserver.unobserve(gauge);
      });
    },
    { threshold: 0.4 }
  );
  gauges.forEach(g => gaugeObserver.observe(g));

  /* ---------------- filmstrip drag-scroll + arrows ---------------- */
  function wireFilmstrip(strip) {
    let isDown = false, startX = 0, startScroll = 0;
    strip.addEventListener("pointerdown", e => {
      isDown = true;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener("pointermove", e => {
      if (!isDown) return;
      strip.scrollLeft = startScroll - (e.clientX - startX);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(evt =>
      strip.addEventListener(evt, () => { isDown = false; })
    );
  }
  function wireFilmstripNav(btn) {
    btn.addEventListener("click", () => {
      const strip = document.getElementById(btn.getAttribute("data-target"));
      const dir = btn.classList.contains("prev") ? -1 : 1;
      strip.scrollBy({ left: dir * 360, behavior: "smooth" });
    });
  }
  document.querySelectorAll(".filmstrip").forEach(wireFilmstrip);
  document.querySelectorAll(".filmstrip-nav").forEach(wireFilmstripNav);

  /* ---------------- lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  let currentGroup = [];
  let currentIndex = 0;

  function openLightbox(group, index) {
    currentGroup = group;
    currentIndex = index;
    lightboxImg.src = currentGroup[currentIndex].src;
    lightboxImg.alt = currentGroup[currentIndex].alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function stepLightbox(dir) {
    currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
    lightboxImg.src = currentGroup[currentIndex].src;
    lightboxImg.alt = currentGroup[currentIndex].alt || "";
  }

  function wireLightboxGroup(container) {
    const imgs = Array.from(container.querySelectorAll("img"));
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => openLightbox(imgs, i));
    });
  }
  document.querySelectorAll("[data-lightbox-group]").forEach(wireLightboxGroup);

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------------- copy email ---------------- */
  const copyBtn = document.getElementById("copyEmail");
  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.getAttribute("data-email");
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    copyBtn.classList.add("copied");
    setTimeout(() => copyBtn.classList.remove("copied"), 1800);
  });

  /* ---------------- projects (data-driven) ---------------- */
  function buildFilmstrip(domId, lightboxGroupId, images) {
    const wrap = document.createElement("div");
    wrap.className = "filmstrip-wrap reveal";

    const prev = document.createElement("button");
    prev.className = "filmstrip-nav prev";
    prev.setAttribute("data-target", domId);
    prev.setAttribute("aria-label", "Scroll left");
    prev.textContent = "‹";

    const strip = document.createElement("div");
    strip.className = "filmstrip";
    strip.id = domId;
    strip.setAttribute("data-lightbox-group", lightboxGroupId);
    images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${lightboxGroupId} screen ${i + 1}`;
      strip.appendChild(img);
    });

    const next = document.createElement("button");
    next.className = "filmstrip-nav next";
    next.setAttribute("data-target", domId);
    next.setAttribute("aria-label", "Scroll right");
    next.textContent = "›";

    wrap.appendChild(prev);
    wrap.appendChild(strip);
    wrap.appendChild(next);
    return wrap;
  }

  function buildFeaturedProject(project) {
    const fragment = document.createDocumentFragment();
    const images = project.images || [];

    const wrap = document.createElement("div");
    wrap.className = "project-feature reveal";

    const left = document.createElement("div");
    if (project.tagLabel) {
      const tag = document.createElement("span");
      tag.className = "tag-label";
      tag.textContent = project.tagLabel;
      left.appendChild(tag);
    }
    const h4 = document.createElement("h4");
    h4.style.cssText = "font-size:1.6rem;font-style:italic;margin-bottom:14px;";
    h4.textContent = project.title;
    left.appendChild(h4);
    if (project.description) {
      const p = document.createElement("p");
      p.textContent = project.description;
      left.appendChild(p);
    }
    wrap.appendChild(left);

    const frame = document.createElement("div");
    frame.className = "frame";
    frame.setAttribute("data-lightbox-group", project.id);
    const img = document.createElement("img");
    img.src = images[0] || "";
    img.alt = project.title;
    const hint = document.createElement("span");
    hint.className = "zoom-hint";
    hint.textContent = "Click to zoom";
    frame.appendChild(img);
    frame.appendChild(hint);
    wrap.appendChild(frame);

    fragment.appendChild(wrap);
    if (images.length > 1) {
      fragment.appendChild(buildFilmstrip(project.id + "-extra", project.id, images.slice(1)));
    }
    return fragment;
  }

  function buildGalleryProject(project) {
    const fragment = document.createDocumentFragment();

    const label = document.createElement("p");
    label.className = "panel-label reveal";
    label.textContent = project.title;
    fragment.appendChild(label);

    if (project.description) {
      const p = document.createElement("p");
      p.className = "gallery-description reveal";
      p.textContent = project.description;
      fragment.appendChild(p);
    }

    fragment.appendChild(buildFilmstrip(project.id, project.id, project.images || []));
    return fragment;
  }

  function showProjectsStatus(container, message) {
    container.innerHTML = "";
    const p = document.createElement("p");
    p.className = "projects-status";
    p.textContent = message;
    container.appendChild(p);
  }

  async function renderProjects() {
    const container = document.getElementById("projectsContainer");
    if (!container) return;
    try {
      const res = await fetch("data/projects.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load projects.json");
      const projects = await res.json();

      container.classList.remove("projects-loading");
      container.innerHTML = "";

      if (!Array.isArray(projects) || projects.length === 0) {
        showProjectsStatus(container, "No projects yet — add one from the admin page.");
        return;
      }

      projects.forEach(project => {
        container.appendChild(
          project.featured ? buildFeaturedProject(project) : buildGalleryProject(project)
        );
      });

      observeReveal(container);
      container.querySelectorAll(".filmstrip").forEach(wireFilmstrip);
      container.querySelectorAll(".filmstrip-nav").forEach(wireFilmstripNav);
      container.querySelectorAll("[data-lightbox-group]").forEach(wireLightboxGroup);
    } catch (err) {
      console.error(err);
      showProjectsStatus(container, "Couldn't load projects right now.");
    }
  }
  renderProjects();

  /* ---------------- back to top ---------------- */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

})();
