(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];

  /* ---------------------------------------------------------
     Theme / NOT gate
  --------------------------------------------------------- */
  const themeToggle = $("#themeToggle");

  const updateThemeUI = () => {
    const dark = root.dataset.theme === "dark";
    const label = dark ? "Switch to light theme" : "Switch to dark theme";
    themeToggle?.setAttribute("aria-label", label);
    themeToggle?.setAttribute("title", "Switch light and dark theme");

    const moon = $("#themeMoon");
    const sun = $("#themeSun");
    moon?.setAttribute("aria-hidden", "true");
    sun?.setAttribute("aria-hidden", "true");
  };

  updateThemeUI();

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);

    themeToggle.classList.remove("switching");
    void themeToggle.offsetWidth;
    themeToggle.classList.add("switching");
    setTimeout(() => themeToggle.classList.remove("switching"), 520);

    updateThemeUI();
  });

  /* ---------------------------------------------------------
     Header / navigation
  --------------------------------------------------------- */
  const header = $(".site-header");
  const navLinks = $$("#primary-nav a");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const syncHashNavigation = () => {
    const hash = window.location.hash;
    if (!hash) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
  };

  syncHashNavigation();
  window.addEventListener("hashchange", syncHashNavigation);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = $(link.getAttribute("href") || "");
      link.classList.remove("route-active");
      void link.offsetWidth;
      link.classList.add("route-active");

      target?.classList.remove("signal-hit");
      if (target) {
        void target.offsetWidth;
        target.classList.add("signal-hit");
        setTimeout(() => target.classList.remove("signal-hit"), 700);
      }
      setTimeout(() => link.classList.remove("route-active"), 650);
    });
  });

  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      return href?.startsWith("#") ? $(href) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------------------------------------------------
     Hero typing
  --------------------------------------------------------- */
  const firstNameEl = $("#typedFirstName");
  const lastNameEl = $("#typedLastName");

  if (firstNameEl && lastNameEl) {
    if (reducedMotion) {
      firstNameEl.textContent = "Chavali";
      lastNameEl.textContent = "Uddipa Dattudu";
    } else {
      const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      (async () => {
        while (true) {
          for (let i = 0; i <= 7; i++) {
            firstNameEl.textContent = "Chavali".slice(0, i);
            await pause(i === 0 ? 220 : 72);
          }
          for (let i = 0; i <= 14; i++) {
            lastNameEl.textContent = "Uddipa Dattudu".slice(0, i);
            await pause(i === 0 ? 120 : 62);
          }
          await pause(1500);
          for (let i = 14; i >= 0; i--) {
            lastNameEl.textContent = "Uddipa Dattudu".slice(0, i);
            await pause(i === 14 ? 100 : 42);
          }
          for (let i = 7; i >= 0; i--) {
            firstNameEl.textContent = "Chavali".slice(0, i);
            await pause(i === 7 ? 80 : 48);
          }
          await pause(380);
        }
      })();
    }
  }

  /* ---------------------------------------------------------
     Reveal animations
  --------------------------------------------------------- */
  root.classList.add("reveal-ready");
  const revealItems = $$(".reveal");
  revealItems.forEach((item, index) => {
    item.style.setProperty(
      "--reveal-delay",
      `${Math.min(index % 5, 4) * 55}ms`,
    );
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("reveal-visible"));
  }

  setTimeout(
    () => revealItems.forEach((item) => item.classList.add("reveal-visible")),
    1800,
  );

  /* ---------------------------------------------------------
     Counters
  --------------------------------------------------------- */
  const counters = $$("[data-counter]");

  const animateCounter = (element) => {
    if (!element || element.dataset.counted === "true") return;
    element.dataset.counted = "true";

    const target = Number.parseFloat(element.dataset.counter || "0");
    const suffix = element.dataset.suffix || "";
    const decimals = String(target).includes(".")
      ? String(target).split(".")[1].length
      : 0;

    if (reducedMotion) {
      element.textContent = `${target.toFixed(decimals)}${suffix}`;
      return;
    }

    const start = performance.now();
    const duration = 900;

    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    };

    element.textContent = `0${suffix}`;
    requestAnimationFrame(frame);
  };

  if ("IntersectionObserver" in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------------------------------------------------------
     Achievements expansion
  --------------------------------------------------------- */
  const achievementToggle = $("#achievementsToggle");
  const moreAchievementCards = $$(".achievement-card.more-card");
  moreAchievementCards.forEach((card) => {
    card.hidden = true;
    card.classList.remove("visible");
  });

  achievementToggle?.addEventListener("click", () => {
    const expanded = achievementToggle.getAttribute("aria-expanded") === "true";
    moreAchievementCards.forEach((card) => {
      card.hidden = expanded;
      card.classList.toggle("visible", !expanded);
    });
    achievementToggle.setAttribute("aria-expanded", String(!expanded));
    achievementToggle.textContent = expanded
      ? "View more achievements ↓"
      : "Show fewer ↑";
  });

  /* ---------------------------------------------------------
     Project evidence interaction
  --------------------------------------------------------- */
  const metricItems = $$(".metrics > div[data-evidence-target]");

  const clearEvidence = (metric) => {
    const target = metric?.dataset.evidenceTarget
      ? document.getElementById(metric.dataset.evidenceTarget)
      : null;
    metric?.classList.remove("evidence-active");
    target?.classList.remove("evidence-focus");
  };

  const activateEvidence = (metric) => {
    const target = metric?.dataset.evidenceTarget
      ? document.getElementById(metric.dataset.evidenceTarget)
      : null;

    metricItems.forEach((item) => {
      if (item !== metric) clearEvidence(item);
    });

    metric?.classList.add("evidence-active");
    target?.classList.add("evidence-focus");

    if (target && !reducedMotion) {
      clearTimeout(target.__evidenceTimer);
      target.__evidenceTimer = setTimeout(() => {
        target.classList.remove("evidence-focus");
        metric?.classList.remove("evidence-active");
      }, 1600);
    }
  };

  metricItems.forEach((metric) => {
    const label = metric.querySelector("span")?.textContent?.trim() || "result";
    metric.tabIndex = 0;
    metric.setAttribute("role", "button");
    metric.setAttribute("aria-label", `Highlight ${label} project detail`);

    metric.addEventListener("mouseenter", () => activateEvidence(metric));
    metric.addEventListener("focus", () => activateEvidence(metric));
    metric.addEventListener("mouseleave", () => {
      if (document.activeElement !== metric) clearEvidence(metric);
    });
    metric.addEventListener("blur", () => clearEvidence(metric));
    metric.addEventListener("click", () => activateEvidence(metric));
    metric.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateEvidence(metric);
      }
    });
  });

  /* ---------------------------------------------------------
     Copy email
  --------------------------------------------------------- */
  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    textarea.remove();
    return copied;
  };

  $$(".copy-email-btn[data-copy-email]").forEach((button) => {
    const original = button.textContent.trim();

    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail || "";
      if (!email) return;

      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
          copied = true;
        }
      } catch {
        copied = false;
      }

      if (!copied) copied = fallbackCopy(email);

      clearTimeout(button.__copyTimer);
      button.textContent = copied ? "✓ Copied" : "Copy failed";
      button.classList.toggle("is-copied", copied);

      button.__copyTimer = setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 1800);
    });
  });

  /* ---------------------------------------------------------
     Tactile card click state
  --------------------------------------------------------- */
  $$(
    ".project-card, .credential-card, .achievement-card, .learning-card, .about-extra-card, .snapshot-card, .focus-card, .technical-profile, .experience-card",
  ).forEach((card) => {
    const release = () => {
      clearTimeout(card.__pressTimer);
      card.__pressTimer = setTimeout(
        () => card.classList.remove("is-pressed"),
        260,
      );
    };

    card.addEventListener("pointerdown", () => {
      card.classList.add("is-pressed");
      release();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        card.classList.add("is-pressed");
        release();
      }
    });
  });

  /* ---------------------------------------------------------
     Achievement + project detail modal
  --------------------------------------------------------- */
  const buildExpandingSignalPath = (
    pathElement,
    cycles = 12,
    width = 900,
    height = 140,
    startAmplitude = 7,
    endAmplitude = 42,
  ) => {
    if (!pathElement) return 0;

    const mid = height / 2;
    const samples = 960;
    const points = [];

    for (let i = 0; i <= samples; i += 1) {
      const t = i / samples;
      const x = t * width;
      const amplitude = startAmplitude + (endAmplitude - startAmplitude) * t;
      const y = mid - Math.sin(t * Math.PI * 2 * cycles) * amplitude;
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }

    pathElement.setAttribute("d", `M ${points.join(" L ")}`);
    return pathElement.getTotalLength();
  };

  const animateSignalTip = (
    pathElement,
    tipElement,
    duration = 1000,
    activeClass = "detail-signal-travelling",
  ) => {
    if (!pathElement || !tipElement) return;

    const total = pathElement.getTotalLength();
    if (!total || reducedMotion) {
      const point = pathElement.getPointAtLength(total);
      tipElement.setAttribute("cx", point.x);
      tipElement.setAttribute("cy", point.y);
      return;
    }

    tipElement.classList.add(activeClass);
    const started = performance.now();

    const frame = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const distance = total * (1 - eased);
      const point = pathElement.getPointAtLength(distance);

      tipElement.setAttribute("cx", point.x);
      tipElement.setAttribute("cy", point.y);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        tipElement.classList.remove(activeClass);
      }
    };

    const startPoint = pathElement.getPointAtLength(total);
    tipElement.setAttribute("cx", startPoint.x);
    tipElement.setAttribute("cy", startPoint.y);

    requestAnimationFrame(frame);
  };

  const createDetailModal = () => {
    const existing = document.getElementById("detailModal");
    if (existing) return existing;

    const dialog = document.createElement("dialog");
    dialog.className = "detail-modal";
    dialog.id = "detailModal";
    dialog.setAttribute("aria-label", "Detailed project or achievement view");
    dialog.innerHTML = `
      <div class="detail-modal-panel">
        <button class="detail-modal-close" id="detailModalClose" type="button" aria-label="Close details">×</button>
        <div class="detail-amplify-signal" aria-hidden="true">
          <svg viewBox="0 0 900 140" preserveAspectRatio="none">
            <path class="signal-glow" id="detailSignalGlow"></path>
            <path class="signal-base" id="detailSignalPath"></path>
            <circle class="detail-signal-tip" id="detailSignalTip" cx="0" cy="70" r="4.2"></circle>
          </svg>
        </div>
        <div class="detail-modal-content" id="detailModalContent"></div>
      </div>
    `;
    document.body.appendChild(dialog);
    return dialog;
  };

  const detailModal = createDetailModal();
  $$(".project-card").forEach((card) => {
    card.__detailTemplate = card.cloneNode(true);
  });
  const detailModalContent = document.getElementById("detailModalContent");
  const detailModalClose = document.getElementById("detailModalClose");

  const compactAchievementCards = () => {
    $$(".achievement-card").forEach((card) => {
      card.__detailTemplate = card.cloneNode(true);

      const body =
        card.querySelector(":scope > .achievement-body") ||
        card.querySelector(":scope > div:last-child");

      if (!body) return;

      const paragraphs = [...body.querySelectorAll(":scope > p")];
      const summaryCandidates = paragraphs.filter(
        (paragraph) => !paragraph.querySelector("strong"),
      );

      if (!summaryCandidates.length) return;

      const summaryText = summaryCandidates
        .map((paragraph) => paragraph.textContent.trim())
        .filter(Boolean)
        .join(" ");

      summaryCandidates.forEach((paragraph) => paragraph.remove());

      const summary = document.createElement("p");
      summary.className = "achievement-summary";
      summary.textContent = summaryText;

      const readMore = document.createElement("button");
      readMore.className = "achievement-readmore";
      readMore.type = "button";
      readMore.textContent = "Read more ↗";
      readMore.setAttribute("aria-label", "Read full achievement details");

      body.append(summary, readMore);
    });
  };

  const sanitizeDetailClone = (clone) => {
    clone.classList.remove(
      "reveal",
      "reveal-visible",
      "spotlight-card",
      "more-card",
    );
    clone.classList.add("detail-clone");
    clone
      .querySelectorAll(".reveal, .reveal-visible, .spotlight-card")
      .forEach((element) => {
        element.classList.remove("reveal", "reveal-visible", "spotlight-card");
      });
    clone
      .querySelectorAll(
        ".achievement-summary, .achievement-readmore, .project-detail-trigger",
      )
      .forEach((element) => element.remove());
    clone
      .querySelectorAll("[hidden]")
      .forEach((element) => element.removeAttribute("hidden"));
    clone.querySelectorAll("details").forEach((details) => {
      details.open = true;
    });
    return clone;
  };

  const openDetailModal = (card) => {
    if (!detailModal || !detailModalContent || !card) return;

    const source = card.__detailTemplate || card;
    detailModal.__returnScrollY = window.scrollY || window.pageYOffset || 0;
    const clone = sanitizeDetailClone(source.cloneNode(true));
    detailModalContent.replaceChildren(clone);

    const detailSignalBase = $("#detailSignalPath", detailModal);
    const detailSignalGlow = $("#detailSignalGlow", detailModal);
    const detailSignalTip = $("#detailSignalTip", detailModal);

    if (detailSignalBase && detailSignalGlow && detailSignalTip) {
      buildExpandingSignalPath(detailSignalBase, 12, 900, 140, 7, 42);
      detailSignalGlow.setAttribute("d", detailSignalBase.getAttribute("d"));
      if (reducedMotion) {
        const start = detailSignalBase.getPointAtLength(0);
        detailSignalTip.setAttribute("cx", start.x);
        detailSignalTip.setAttribute("cy", start.y);
      } else {
        animateSignalTip(
          detailSignalBase,
          detailSignalTip,
          1000,
          "detail-signal-travelling",
        );
      }
    }

    detailModal.classList.remove("is-amplifying");
    void detailModal.offsetWidth;
    detailModal.classList.add("is-amplifying");

    if (typeof detailModal.showModal === "function") {
      if (!detailModal.open) detailModal.showModal();
    } else {
      detailModal.setAttribute("open", "");
    }

    document.body.style.overflow = "hidden";

    clearTimeout(detailModal.__amplifyTimer);
    detailModal.__amplifyTimer = setTimeout(() => {
      detailModal.classList.remove("is-amplifying");
    }, 1000);

    detailModalClose?.focus({ preventScroll: true });

    requestAnimationFrame(() => {
      window.scrollTo(0, detailModal.__returnScrollY || 0);
    });
  };

  const closeDetailModal = () => {
    if (!detailModal) return;

    if (typeof detailModal.close === "function" && detailModal.open) {
      detailModal.close();
    }

    detailModal.removeAttribute("open");
    detailModal.classList.remove("fallback-open", "is-amplifying");
    detailModalContent?.replaceChildren();
    document.body.style.overflow = "";
    requestAnimationFrame(() => {
      if (typeof detailModal.__returnScrollY === "number") {
        window.scrollTo(0, detailModal.__returnScrollY);
      }
    });
  };

  compactAchievementCards();
  $$(".project-card:not(.coming-soon-card), .achievement-card").forEach(
    (card) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      const title = card.querySelector("h3")?.textContent.trim() || "details";
      card.setAttribute("aria-label", `Open ${title}`);
    },
  );

  document.addEventListener("click", (event) => {
    const readMore = event.target.closest(".achievement-readmore");
    if (readMore) {
      const card = readMore.closest(".achievement-card");
      if (card) {
        event.preventDefault();
        event.stopPropagation();
        openDetailModal(card);
      }
      return;
    }

    if (event.target.closest(".detail-modal")) return;

    const projectCard = event.target.closest(
      ".project-card:not(.coming-soon-card)",
    );
    if (projectCard && !event.target.closest("a, button, summary, details")) {
      openDetailModal(projectCard);
      return;
    }

    const achievementCard = event.target.closest(".achievement-card");
    if (achievementCard && !event.target.closest("a, button")) {
      openDetailModal(achievementCard);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (detailModal?.open) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDetailModal();
      }
      return;
    }

    if (
      (event.key === "Enter" || event.key === " ") &&
      (event.target.matches?.(".project-card:not(.coming-soon-card)") ||
        event.target.matches?.(".achievement-card"))
    ) {
      event.preventDefault();
      openDetailModal(event.target);
    }
  });

  detailModalClose?.addEventListener("click", closeDetailModal);
  detailModal?.addEventListener("click", (event) => {
    if (event.target === detailModal) closeDetailModal();
  });
  detailModal?.addEventListener("close", () => {
    document.body.style.overflow = "";
    requestAnimationFrame(() => {
      if (typeof detailModal.__returnScrollY === "number") {
        window.scrollTo(0, detailModal.__returnScrollY);
      }
    });
  });

  /* ---------------------------------------------------------
     Unified lightbox
  --------------------------------------------------------- */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxImageWrap = $("#lightboxImageWrap");
  const lightboxStage = $("#lightboxStage");
  const lightboxClose = $("#lightboxClose");
  const lightboxZoomIn = $("#lightboxZoomIn");
  const lightboxZoomOut = $("#lightboxZoomOut");
  const lightboxZoomReset = $("#lightboxZoomReset");
  const lightboxLoading = $("#lightboxLoading");
  const lightboxError = $("#lightboxError");
  const lightboxRetry = $("#lightboxRetry");
  const lightboxCaption = $("#lightboxCaption");

  let zoom = 1;
  let baseScale = 1;
  let naturalW = 0;
  let naturalH = 0;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;
  let lastFocused = null;
  let currentLightboxSource = "";
  let currentLightboxAlt = "";

  const stageBox = () => ({
    width: Math.max(1, (lightboxStage?.clientWidth || 1) - 34),
    height: Math.max(1, (lightboxStage?.clientHeight || 1) - 86),
  });

  const calcBaseScale = () => {
    if (!naturalW || !naturalH) return 1;
    const box = stageBox();
    return Math.min(box.width / naturalW, box.height / naturalH, 1);
  };

  const clampPan = () => {
    const box = stageBox();
    const renderedWidth = naturalW * baseScale * zoom;
    const renderedHeight = naturalH * baseScale * zoom;
    const maxX = Math.max(0, (renderedWidth - box.width) / 2);
    const maxY = Math.max(0, (renderedHeight - box.height) / 2);

    panX = Math.min(maxX, Math.max(-maxX, panX));
    panY = Math.min(maxY, Math.max(-maxY, panY));

    if (zoom <= 1.001) {
      panX = 0;
      panY = 0;
    }
  };

  const renderLightbox = () => {
    if (!lightboxImageWrap) return;
    clampPan();
    lightboxImageWrap.style.transform = `translate(-50%, -50%) translate3d(${panX}px, ${panY}px, 0) scale(${baseScale * zoom})`;

    if (lightboxZoomReset) {
      lightboxZoomReset.textContent =
        zoom <= 1.001 ? "Fit" : `${Math.round(zoom * 100)}%`;
    }
  };

  const setLightboxState = (state) => {
    lightboxLoading?.toggleAttribute("hidden", state !== "loading");
    lightboxError?.toggleAttribute("hidden", state !== "error");
    if (lightboxImageWrap) {
      lightboxImageWrap.style.visibility =
        state === "ready" ? "visible" : "hidden";
    }
  };

  const fitLightbox = () => {
    zoom = 1;
    panX = 0;
    panY = 0;
    baseScale = calcBaseScale();
    renderLightbox();
  };

  const changeZoom = (factor) => {
    zoom = Math.min(5, Math.max(1, Number((zoom * factor).toFixed(3))));
    if (zoom <= 1.001) {
      zoom = 1;
      panX = 0;
      panY = 0;
    }
    renderLightbox();
  };

  const resolveImageUrl = (src) => {
    try {
      return new URL(src, document.baseURI).href;
    } catch {
      return src;
    }
  };

  const getTriggerImage = (trigger) =>
    trigger.matches("img") ? trigger : trigger.querySelector("img");

  const getLightboxSource = (trigger) => {
    const explicit =
      trigger.dataset?.lightboxSrc ||
      trigger.getAttribute?.("data-lightbox-src");

    if (explicit) return explicit;

    const image = getTriggerImage(trigger);
    return (
      image?.currentSrc ||
      image?.getAttribute("src") ||
      trigger.currentSrc ||
      trigger.getAttribute("src") ||
      ""
    );
  };

  const closeLightbox = () => {
    if (!lightbox) return;

    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    }

    lightbox.removeAttribute("open");
    lightbox.classList.remove("fallback-open");
    document.body.style.overflow = "";

    if (lightboxImg) {
      lightboxImg.removeAttribute("src");
      lightboxImg.style.width = "";
      lightboxImg.style.height = "";
    }

    if (lightboxImageWrap) {
      lightboxImageWrap.style.transform = "translate(-50%, -50%)";
      lightboxImageWrap.style.width = "0px";
      lightboxImageWrap.style.height = "0px";
      lightboxImageWrap.style.visibility = "hidden";
    }

    naturalW = 0;
    naturalH = 0;
    zoom = 1;
    baseScale = 1;
    panX = 0;
    panY = 0;
    currentLightboxSource = "";
    currentLightboxAlt = "";

    setLightboxState("loading");
    lastFocused?.focus?.();
    lastFocused = null;
  };

  const openLightbox = async (src, alt = "") => {
    if (!lightbox || !lightboxImg || !lightboxImageWrap || !src) return;

    currentLightboxSource = src;
    currentLightboxAlt = alt;
    lastFocused = document.activeElement;

    if (lightboxCaption) lightboxCaption.textContent = alt;

    setLightboxState("loading");
    lightboxImageWrap.style.width = "0px";
    lightboxImageWrap.style.height = "0px";
    lightboxImageWrap.style.transform = "translate(-50%, -50%)";

    document.body.style.overflow = "hidden";

    if (typeof lightbox.showModal === "function") {
      if (!lightbox.open) lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
      lightbox.classList.add("fallback-open");
    }

    const resolved = resolveImageUrl(src);
    const preload = new Image();
    preload.decoding = "async";
    preload.loading = "eager";

    try {
      await new Promise((resolve, reject) => {
        preload.onload = resolve;
        preload.onerror = reject;
        preload.src = resolved;
      });

      if (preload.decode) {
        try {
          await preload.decode();
        } catch {
          /* A usable decoded frame may already exist. */
        }
      }

      naturalW = preload.naturalWidth || 1;
      naturalH = preload.naturalHeight || 1;

      lightboxImg.src = resolved;
      lightboxImg.alt = alt;
      lightboxImg.width = naturalW;
      lightboxImg.height = naturalH;

      lightboxImageWrap.style.width = `${naturalW}px`;
      lightboxImageWrap.style.height = `${naturalH}px`;

      fitLightbox();
      setLightboxState("ready");
      lightboxClose?.focus();
    } catch {
      setLightboxState("error");
      lightboxClose?.focus();
    }
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(
      ".lightbox-img, .certificate-view, .credential-image, [data-lightbox-src]",
    );

    if (!trigger || trigger.closest("#lightbox")) return;

    const mainProjectOrAchievement = trigger.closest(
      ".project-card, .achievement-card",
    );
    const insideDetailModal = trigger.closest(".detail-modal");
    if (mainProjectOrAchievement && !insideDetailModal) return;

    event.preventDefault();

    const src = getLightboxSource(trigger);
    const image = getTriggerImage(trigger);
    const alt =
      trigger.dataset?.lightboxAlt ||
      image?.alt ||
      trigger.getAttribute("aria-label") ||
      "";

    openLightbox(src, alt);
  });

  lightboxRetry?.addEventListener("click", () => {
    if (currentLightboxSource) {
      openLightbox(currentLightboxSource, currentLightboxAlt);
    }
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightboxZoomIn?.addEventListener("click", () => changeZoom(1.25));
  lightboxZoomOut?.addEventListener("click", () => changeZoom(0.8));
  lightboxZoomReset?.addEventListener("click", fitLightbox);

  lightboxStage?.addEventListener("pointerdown", (event) => {
    if (zoom <= 1.001 || !lightboxImg?.src) return;

    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startPanX = panX;
    startPanY = panY;

    lightboxStage.classList.add("is-panning");
    lightboxStage.setPointerCapture?.(event.pointerId);
  });

  lightboxStage?.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;

    panX = startPanX + event.clientX - startX;
    panY = startPanY + event.clientY - startY;
    renderLightbox();
  });

  const endDrag = () => {
    dragging = false;
    pointerId = null;
    lightboxStage?.classList.remove("is-panning");
  };

  lightboxStage?.addEventListener("pointerup", endDrag);
  lightboxStage?.addEventListener("pointercancel", endDrag);

  lightboxStage?.addEventListener(
    "wheel",
    (event) => {
      if (!lightbox?.open) return;
      event.preventDefault();
      changeZoom(event.deltaY < 0 ? 1.12 : 0.89);
    },
    { passive: false },
  );

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      changeZoom(1.25);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      changeZoom(0.8);
    } else if (event.key === "0") {
      event.preventDefault();
      fitLightbox();
    } else if (event.key === "ArrowLeft" && zoom > 1) {
      event.preventDefault();
      panX += 40;
      renderLightbox();
    } else if (event.key === "ArrowRight" && zoom > 1) {
      event.preventDefault();
      panX -= 40;
      renderLightbox();
    } else if (event.key === "ArrowUp" && zoom > 1) {
      event.preventDefault();
      panY += 40;
      renderLightbox();
    } else if (event.key === "ArrowDown" && zoom > 1) {
      event.preventDefault();
      panY -= 40;
      renderLightbox();
    }
  });

  window.addEventListener("resize", () => {
    if (!lightbox?.open || !naturalW) return;
    baseScale = calcBaseScale();
    renderLightbox();
  });

  /* ---------------------------------------------------------
     Projects — rotary domain selector
  --------------------------------------------------------- */
  const projectSelector = $(".project-selector");
  const projectDial = $("#projectSelectorDial");
  const projectSelectorDescription = $("#projectSelectorDescription");
  const projectSelectorOutput = $("#projectSelectorOutput");
  const projectSelectorCore = $("#projectSelectorAll");
  const projectOptions = $$(".project-selector-option");
  const projectCards = $$(".project-card");
  const projectFilterStatus = $("#projectFilterStatus");

  const projectDomains = {
    all: "ALL PROJECTS",
    rfic: "RFIC PROJECTS",
    analog: "ANALOG / MEMORY PROJECTS",
    eda: "EDA PROJECTS",
    pcb: "PCB PROJECTS",
  };

  const projectAngles = {
    all: 0,
    rfic: 0,
    analog: 90,
    eda: 180,
    pcb: 270,
  };

  let currentProjectFilter = "all";

  const animateProjectCards = (filter) => {
    const visibleCards = [];
    const hiddenCards = [];

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "")
        .split(/\s+/)
        .filter(Boolean);
      const show = filter === "all" || categories.includes(filter);
      (show ? visibleCards : hiddenCards).push(card);
    });

    if (reducedMotion) {
      projectCards.forEach((card) => {
        const show = visibleCards.includes(card);
        card.hidden = !show;
        card.classList.remove("project-filter-in", "project-filter-out");
      });
      return;
    }

    projectCards.forEach((card) =>
      card.classList.remove("project-filter-in", "project-filter-out"),
    );
    hiddenCards.forEach((card) => card.classList.add("project-filter-out"));

    setTimeout(() => {
      hiddenCards.forEach((card) => {
        card.hidden = true;
        card.classList.remove("project-filter-out");
      });

      visibleCards.forEach((card, index) => {
        card.hidden = false;
        card.style.setProperty("--project-enter-delay", `${index * 55}ms`);
        card.classList.add("project-filter-in");
      });
    }, 150);
  };

  const selectProjectDomain = (filter, sourceButton = null) => {
    currentProjectFilter = filter;

    const description =
      sourceButton?.dataset.description ||
      "All project domains are visible. Select a domain to focus the portfolio.";

    projectOptions.forEach((button) => {
      button.classList.toggle(
        "active",
        button === sourceButton || button.dataset.filter === filter,
      );
    });

    projectSelectorCore?.classList.toggle("active", filter === "all");

    if (projectDial) {
      const angle = projectAngles[filter] ?? 0;
      projectDial.style.transform = `rotate(${angle}deg)`;

      const core = projectDial.querySelector(".project-selector-core");
      if (core) core.style.transform = `rotate(${-angle}deg)`;
    }

    if (projectSelectorDescription) {
      projectSelectorDescription.textContent = description;
    }

    if (projectSelectorOutput) {
      projectSelectorOutput.textContent = projectDomains[filter] || "PROJECTS";
    }

    animateProjectCards(filter);

    const visible = projectCards.filter((card) => {
      const categories = (card.dataset.category || "")
        .split(/\s+/)
        .filter(Boolean);
      return filter === "all" || categories.includes(filter);
    }).length;

    if (projectFilterStatus) {
      projectFilterStatus.textContent =
        filter === "all"
          ? `Showing all ${visible} engineering projects.`
          : `Showing ${visible} ${projectDomains[filter]}.`;
    }

    if (projectSelector && !reducedMotion) {
      projectSelector.classList.remove("signal-running");
      void projectSelector.offsetWidth;
      projectSelector.classList.add("signal-running");
      clearTimeout(projectSelector.__signalTimer);
      projectSelector.__signalTimer = setTimeout(
        () => projectSelector.classList.remove("signal-running"),
        750,
      );
    }
  };

  projectOptions.forEach((button) => {
    button.addEventListener("click", () => {
      selectProjectDomain(button.dataset.filter || "all", button);
    });
  });

  projectSelectorCore?.addEventListener("click", () => {
    selectProjectDomain("all", null);
  });

  selectProjectDomain("all", null);

  /* ---------------------------------------------------------
     Academic pathway — signal handoff
  --------------------------------------------------------- */
  const pathway = $(".education-pathway");

  const runPathwayHandoff = () => {
    if (!pathway) return;
    pathway.classList.remove("handoff-active");
    void pathway.offsetWidth;
    pathway.classList.add("handoff-active");
    clearTimeout(pathway.__handoffTimer);
    pathway.__handoffTimer = setTimeout(
      () => pathway.classList.remove("handoff-active"),
      1450,
    );
  };

  if (pathway && "IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runPathwayHandoff();
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.42 },
    );
    observer.observe(pathway);
  }

  pathway?.addEventListener("mouseenter", runPathwayHandoff);

  /* ---------------------------------------------------------
     Experience — sequential signal propagation
  --------------------------------------------------------- */
  const experienceTimeline = $(".experience-timeline");
  const experienceCards = $$(
    ".experience-card",
    experienceTimeline || document,
  );
  let experienceTimer = null;
  let experienceIndex = 0;

  const stopExperienceSignal = () => {
    clearInterval(experienceTimer);
    experienceTimer = null;
    experienceTimeline?.classList.remove("signal-running");
    experienceCards.forEach((card) =>
      card.classList.remove("signal-node-active"),
    );
  };

  const startExperienceSignal = () => {
    if (!experienceTimeline || !experienceCards.length || reducedMotion) return;

    stopExperienceSignal();
    experienceIndex = 0;
    experienceTimeline.classList.add("signal-running");

    const activate = () => {
      experienceCards.forEach((card, index) => {
        card.classList.toggle("signal-node-active", index === experienceIndex);
      });
      experienceIndex = (experienceIndex + 1) % experienceCards.length;
    };

    activate();
    experienceTimer = setInterval(activate, 1250);
    setTimeout(stopExperienceSignal, 4600);
  };

  if (
    experienceTimeline &&
    "IntersectionObserver" in window &&
    !reducedMotion
  ) {
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startExperienceSignal();
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.28 },
    );
    observer.observe(experienceTimeline);
  }

  /* ---------------------------------------------------------
     Reset signal / back to top
  --------------------------------------------------------- */
  const backToTop = $("#backToTop");
  backToTop?.addEventListener("click", () => {
    backToTop.classList.remove("reset-active");
    void backToTop.offsetWidth;
    backToTop.classList.add("reset-active");
    setTimeout(() => backToTop.classList.remove("reset-active"), 650);
  });

  /* ---------------------------------------------------------
     Initial loader
  --------------------------------------------------------- */
  const loader = $("#siteLoader");
  let loaderFinished = false;

  const finishLoader = () => {
    if (loaderFinished) return;
    loaderFinished = true;
    loader?.classList.add("is-done");
    document.body.classList.remove("is-booting");
    setTimeout(showGuideOnce, reducedMotion ? 120 : 320);
  };

  window.addEventListener(
    "load",
    () => setTimeout(finishLoader, reducedMotion ? 180 : 1100),
    { once: true },
  );

  setTimeout(finishLoader, reducedMotion ? 1200 : 2700);

  /* ---------------------------------------------------------
     Footer updated-date typing / clearing / retyping loop
  --------------------------------------------------------- */
  const footerUpdatedText = $("#footerUpdatedText");

  if (footerUpdatedText) {
    const footerText = "Updated September 2026";

    if (reducedMotion) {
      footerUpdatedText.textContent = footerText;
    } else {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      (async () => {
        while (true) {
          footerUpdatedText.textContent = "";

          for (let i = 0; i <= footerText.length; i += 1) {
            footerUpdatedText.textContent = footerText.slice(0, i);
            await wait(i === 0 ? 260 : 48);
          }

          await wait(1800);

          for (let i = footerText.length; i >= 0; i -= 1) {
            footerUpdatedText.textContent = footerText.slice(0, i);
            await wait(i === footerText.length ? 110 : 34);
          }

          await wait(520);
        }
      })();
    }
  }

  /* ---------------------------------------------------------
     First-visit guide
  --------------------------------------------------------- */
  const guide = $("#siteGuide");
  const guideClose = $("#guideClose");
  const guideStart = $("#guideStart");

  const closeGuide = () => {
    if (!guide) return;
    guide.setAttribute("hidden", "");
    guide.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const showGuideOnce = () => {
    if (!guide) return;
    guide.removeAttribute("hidden");
    guide.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => guideStart?.focus(), 80);
  };

  // Safety fallback: every fresh page load gets the quick-tour card,
  // even if the loader's load timing changes.
  setTimeout(() => {
    if (document.body.classList.contains("is-booting")) return;
    if (guide?.hasAttribute("hidden")) showGuideOnce();
  }, 3600);

  guideClose?.addEventListener("click", closeGuide);
  guideStart?.addEventListener("click", closeGuide);
  guide?.addEventListener("click", (event) => {
    if (event.target === guide) closeGuide();
  });

  document.addEventListener("keydown", (event) => {
    if (guide && !guide.hasAttribute("hidden") && event.key === "Escape") {
      event.preventDefault();
      closeGuide();
    }
  });

  /* ---------------------------------------------------------
     Cursor → RF field ripple
  --------------------------------------------------------- */
  if (!matchMedia("(pointer: coarse)").matches) {
    let cursorFrame = 0;
    let cursorX = -300;
    let cursorY = -300;

    const renderCursorField = () => {
      cursorFrame = 0;
      document.body.style.setProperty("--cursor-x", `${cursorX}px`);
      document.body.style.setProperty("--cursor-y", `${cursorY}px`);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        cursorX = event.clientX;
        cursorY = event.clientY;

        if (!cursorFrame) {
          cursorFrame = requestAnimationFrame(renderCursorField);
        }
      },
      { passive: true },
    );

    window.addEventListener(
      "pointerleave",
      () => {
        cursorX = -300;
        cursorY = -300;
        if (!cursorFrame) {
          cursorFrame = requestAnimationFrame(renderCursorField);
        }
      },
      { passive: true },
    );
  }

  /* ---------------------------------------------------------
     Scroll progress
  --------------------------------------------------------- */
  const scrollProgress = $("#scrollProgress");

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  /* ---------------------------------------------------------
     Private academic access
     Note: this is a client-side privacy gate, not cryptographic
     protection for publicly hosted PDF files.
  --------------------------------------------------------- */
  const privateUnlockBtn = $("#privateUnlockBtn");
  const privateDialog = $("#privateAccessDialog");
  const privateClose = $("#privateAccessClose");
  const privateForm = $("#privateAccessForm");
  const privateCode = $("#privateAccessCode");
  const privateMessage = $("#privateAccessMessage");
  const privateTranscripts = $("#privateTranscripts");

  const PRIVATE_CODE_HASH =
    "7969732a4f011aa438ef4c293967bcb70daf65f889ab5bdaec2f54433f2e2a34";

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  privateUnlockBtn?.addEventListener("click", () => {
    privateMessage.textContent = "";
    privateMessage.className = "private-access-message";
    privateCode.value = "";
    privateTranscripts.hidden = true;
    privateDialog?.showModal();
    setTimeout(() => privateCode?.focus(), 80);
  });

  privateClose?.addEventListener("click", () => privateDialog?.close());

  privateDialog?.addEventListener("click", (event) => {
    if (event.target === privateDialog) privateDialog.close();
  });

  privateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const entered = privateCode.value.trim();
    if (!entered) return;

    privateMessage.textContent = "Verifying…";
    privateMessage.className = "private-access-message";

    try {
      const hash = await sha256Hex(entered);

      if (hash === PRIVATE_CODE_HASH) {
        privateMessage.textContent = "Access verified.";
        privateMessage.className = "private-access-message success";
        privateTranscripts.hidden = false;
        privateCode.value = "";
      } else {
        privateMessage.textContent = "Access code not recognised.";
        privateMessage.className = "private-access-message error";
        privateTranscripts.hidden = true;
      }
    } catch {
      privateMessage.textContent =
        "Verification could not be completed in this browser.";
      privateMessage.className = "private-access-message error";
      privateTranscripts.hidden = true;
    }
  });

  /* ---------------------------------------------------------
     Click-to-ripple RF / pond-wave field
     Each left click creates one finite wave source.
     Reflections are represented with rectangular image sources.
     Multiple sources are superposed so overlapping fronts produce
     constructive/destructive interference.
  --------------------------------------------------------- */
  (() => {
    const canvas = document.getElementById("rfWaveCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = reducedMotion;
    const waves = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    let width = 1;
    let height = 1;
    let lastFrame = performance.now();

    const MAX_WAVES = 14;
    const LIFE_MS = 3200;
    const SPEED = 560;
    const WAVELENGTH = 34;
    const K = (Math.PI * 2) / WAVELENGTH;
    const REFLECTION_LOSS = 0.72;
    const RING_SAMPLES = 220;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const isBackgroundClick = (event) => {
      if (event.button !== 0) return false;

      const target = event.target;
      if (!(target instanceof Element)) return false;

      // Only blank/background areas trigger the effect.
      const blocked = target.closest(
        [
          "a",
          "button",
          "input",
          "textarea",
          "select",
          "summary",
          "details",
          "dialog",
          ".site-header",
          ".site-guide-overlay",
          ".lightbox",
          ".detail-modal",
          ".project-card",
          ".experience-card",
          ".credential-card",
          ".achievement-card",
          ".snapshot-card",
          ".technical-profile",
          ".technical-focus",
          ".about-extra-card",
          ".education-row",
          ".education-pathway",
          ".contact",
          "footer",
          ".research-project-card",
        ].join(","),
      );

      return !blocked;
    };

    const addWave = (x, y) => {
      waves.push({
        x,
        y,
        born: performance.now(),
        phase: Math.random() * Math.PI * 2,
      });

      while (waves.length > MAX_WAVES) waves.shift();
    };

    document.addEventListener(
      "pointerdown",
      (event) => {
        if (reduced || !isBackgroundClick(event)) return;
        addWave(event.clientX, event.clientY);
      },
      { passive: true },
    );

    // First-order + second-order rectangular image sources.
    const getImageSources = (wave) => {
      const x = wave.x;
      const y = wave.y;
      const w = width;
      const h = height;

      return [
        { x, y, a: 1.0, p: 0 },
        { x: -x, y, a: REFLECTION_LOSS, p: Math.PI },
        { x: 2 * w - x, y, a: REFLECTION_LOSS, p: Math.PI },
        { x, y: -y, a: REFLECTION_LOSS, p: Math.PI },
        { x, y: 2 * h - y, a: REFLECTION_LOSS, p: Math.PI },

        { x: -x, y: -y, a: REFLECTION_LOSS * REFLECTION_LOSS, p: 0 },
        { x: -x, y: 2 * h - y, a: REFLECTION_LOSS * REFLECTION_LOSS, p: 0 },
        { x: 2 * w - x, y: -y, a: REFLECTION_LOSS * REFLECTION_LOSS, p: 0 },
        {
          x: 2 * w - x,
          y: 2 * h - y,
          a: REFLECTION_LOSS * REFLECTION_LOSS,
          p: 0,
        },
      ];
    };

    const drawInterferingRing = (source, radius, baseAlpha, now) => {
      const sources = waves.flatMap(getImageSources);
      const phaseTime = ((now - source.born) / 1000) * SPEED;

      ctx.beginPath();

      for (let i = 0; i <= RING_SAMPLES; i += 1) {
        const theta = (i / RING_SAMPLES) * Math.PI * 2;
        const px = source.x + Math.cos(theta) * radius;
        const py = source.y + Math.sin(theta) * radius;

        // Superpose all active virtual waves at this point.
        let field = 0;
        for (const other of sources) {
          const dx = px - other.x;
          const dy = py - other.y;
          const distance = Math.hypot(dx, dy);
          const phase = K * (distance - phaseTime) + other.p;
          field += other.a * Math.cos(phase);
        }

        // Normalize the interference response into a visible but restrained range.
        const interference = Math.max(
          -1,
          Math.min(1, field / Math.max(1, sources.length * 0.82)),
        );
        const visibility = 0.28 + 0.72 * Math.abs(interference);
        const signed = interference >= 0 ? 1 : -1;

        // Very small radial perturbation makes overlaps feel like real wave interference.
        const localRadius = radius + interference * 1.8;

        const x = source.x + Math.cos(theta) * localRadius;
        const y = source.y + Math.sin(theta) * localRadius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Periodic micro-breaks make destructive zones visibly thinner/dimmer.
        if (signed < 0 && visibility < 0.42 && i % 6 === 0) {
          ctx.moveTo(x + 1.2, y + 1.2);
        }
      }

      ctx.strokeStyle = `rgba(199, 154, 59, ${Math.min(0.42, baseAlpha * 0.72)})`;
      ctx.lineWidth = 0.68;
      ctx.stroke();
    };

    const draw = (now) => {
      const dt = Math.min(50, now - lastFrame);
      lastFrame = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = waves.length - 1; i >= 0; i -= 1) {
        const wave = waves[i];
        const age = now - wave.born;

        if (age > LIFE_MS) {
          waves.splice(i, 1);
          continue;
        }

        const t = age / LIFE_MS;
        const radius = (age / 1000) * SPEED;

        // Fade in quickly, remain visible, then dissolve during the last ~1 sec.
        const lifeFade =
          t < 0.08 ? t / 0.08 : t > 0.68 ? 1 - (t - 0.68) / 0.32 : 1;

        // Draw the direct front; reflected fronts appear through the image-source
        // interference field below.
        drawInterferingRing(wave, radius, Math.max(0, lifeFade), now);

        // Add a softer reflected fringe using the same physical field.
        if (radius > 40) {
          const fringeAlpha = lifeFade * 0.24;
          drawInterferingRing(wave, radius + 5, fringeAlpha, now);
          drawInterferingRing(
            wave,
            Math.max(12, radius - 5),
            fringeAlpha * 0.65,
            now,
          );
        }
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    // Reposition the field if the document is scrolled so the wave remains
    // attached to viewport click coordinates, matching the visual pond analogy.
    window.addEventListener(
      "scroll",
      () => {
        // Canvas is viewport-fixed; no coordinate conversion is necessary.
      },
      { passive: true },
    );
  })();
})();
