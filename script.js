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
    const label = dark ? "Invert to light theme" : "Invert to dark theme";
    themeToggle?.setAttribute("aria-label", label);
    themeToggle?.setAttribute("title", label);
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
  const menuToggle = $(".menu-toggle");
  const navMenu = $("#primary-nav");
  const navLinks = $$("#primary-nav a");

  const closeMenu = () => {
    navMenu?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
  };

  menuToggle?.addEventListener("click", () => {
    const open = navMenu?.classList.toggle("open") ?? false;
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

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
      closeMenu();
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
  achievementToggle?.addEventListener("click", () => {
    const expanded = achievementToggle.getAttribute("aria-expanded") === "true";
    $$(".achievement-card.more-card").forEach((card) => {
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
          <svg viewBox="0 0 900 120" preserveAspectRatio="none">
            <path class="signal-glow" d="M0 60 C45 60 55 16 100 16 S155 104 200 104 S255 16 300 16 S355 104 400 104 S455 16 500 16 S555 104 600 104 S655 16 700 16 S755 104 800 104 S855 60 900 60"></path>
            <path class="signal-base" d="M0 60 C45 60 55 16 100 16 S155 104 200 104 S255 16 300 16 S355 104 400 104 S455 16 500 16 S555 104 600 104 S655 16 700 16 S755 104 800 104 S855 60 900 60"></path>
          </svg>
        </div>
        <div class="detail-modal-content" id="detailModalContent"></div>
      </div>
    `;
    document.body.appendChild(dialog);
    return dialog;
  };

  const detailModal = createDetailModal();
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
    return clone;
  };

  const openDetailModal = (card) => {
    if (!detailModal || !detailModalContent || !card) return;

    const source = card.__detailTemplate || card;
    const clone = sanitizeDetailClone(source.cloneNode(true));
    detailModalContent.replaceChildren(clone);

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

    detailModalClose?.focus();
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
  };

  compactAchievementCards();
  $$(".project-card, .achievement-card").forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    const title = card.querySelector("h3")?.textContent.trim() || "details";
    card.setAttribute("aria-label", `Open ${title}`);
  });

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

    const projectCard = event.target.closest(".project-card");
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
      (event.target.matches?.(".project-card") ||
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
     About rotary selector
  --------------------------------------------------------- */
  const focusDial = $("#aboutSelectorDial");
  const focusDescription = $("#aboutSelectorDescription");
  const focusOptions = $$(".selector-option");
  const focusAngles = [0, 72, 144, 216, 288];

  const selectFocus = (button, index) => {
    focusOptions.forEach((item) =>
      item.classList.toggle("active", item === button),
    );
    if (focusDescription)
      focusDescription.textContent = button.dataset.description || "";

    if (focusDial) {
      const angle = focusAngles[index] || 0;
      focusDial.style.transform = `rotate(${angle}deg)`;
      const core = focusDial.querySelector(".selector-core");
      if (core) core.style.transform = `rotate(${-angle}deg)`;
    }
  };

  focusOptions.forEach((button, index) => {
    button.addEventListener("click", () => selectFocus(button, index));
  });

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
    setTimeout(showGuideOnce, reducedMotion ? 80 : 260);
  };

  window.addEventListener(
    "load",
    () => setTimeout(finishLoader, reducedMotion ? 250 : 900),
    { once: true },
  );

  setTimeout(finishLoader, reducedMotion ? 1800 : 4200);

  /* ---------------------------------------------------------
     First-visit guide
  --------------------------------------------------------- */
  const guide = $("#siteGuide");
  const guideClose = $("#guideClose");
  const guideStart = $("#guideStart");
  const GUIDE_KEY = "portfolio-tour-clean";

  const closeGuide = () => {
    if (!guide) return;
    guide.setAttribute("hidden", "");
    guide.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    localStorage.setItem(GUIDE_KEY, "true");
  };

  const showGuideOnce = () => {
    if (!guide || localStorage.getItem(GUIDE_KEY) === "true") return;
    guide.removeAttribute("hidden");
    guide.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => guideStart?.focus(), 80);
  };

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
})();
