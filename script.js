(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const qs = (selector, scope = document) => scope.querySelector(selector);

  const qsa = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];

  /* =========================================================
     THEME
  ========================================================= */

  const themeToggle = qs("#themeToggle");

  const updateThemeLabel = () => {
    const dark = root.dataset.theme === "dark";

    themeToggle?.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );

    themeToggle?.setAttribute(
      "title",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
  };

  updateThemeLabel();

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = next;

    localStorage.setItem("portfolio-theme", next);

    updateThemeLabel();
  });

  /* =========================================================
     MOBILE NAVIGATION
  ========================================================= */

  const menuToggle = qs(".menu-toggle");
  const navMenu = qs("#primary-nav");

  const closeMenu = () => {
    if (!navMenu || !menuToggle) {
      return;
    }

    navMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Open menu");
  };

  menuToggle?.addEventListener("click", () => {
    if (!navMenu) return;

    const open = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(open));

    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  qsa("#primary-nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* =========================================================
     HEADER SCROLL STATE
  ========================================================= */

  const header = qs(".site-header");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, { passive: true });

  /* =========================================================
     ACTIVE SECTION NAVIGATION
  ========================================================= */

  const navLinks = qsa("#primary-nav a");

  const trackedSections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");

      return href && href.startsWith("#") ? qs(href) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && trackedSections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = `#${entry.target.id}`;

          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        });
      },
      {
        rootMargin: "-90px 0px -65% 0px",
        threshold: 0,
      },
    );

    trackedSections.forEach((section) => {
      navObserver.observe(section);
    });
  }

  /* =========================================================
     HERO NAME — TYPE / ERASE / REPEAT
  ========================================================= */

  const firstEl = qs("#typedFirstName");

  const lastEl = qs("#typedLastName");

  const first = "Chavali";
  const last = "Uddipa Dattudu";

  if (firstEl && lastEl) {
    if (reduceMotion) {
      firstEl.textContent = first;

      lastEl.textContent = last;
    } else {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      (async () => {
        while (true) {
          /* Type first name */
          for (let i = 0; i <= first.length; i += 1) {
            firstEl.textContent = first.slice(0, i);

            await sleep(i === 0 ? 220 : 72);
          }

          /* Type last name */
          for (let i = 0; i <= last.length; i += 1) {
            lastEl.textContent = last.slice(0, i);

            await sleep(i === 0 ? 120 : 62);
          }

          /* Hold */
          await sleep(1500);

          /* Erase last name */
          for (let i = last.length; i >= 0; i -= 1) {
            lastEl.textContent = last.slice(0, i);

            await sleep(i === last.length ? 100 : 42);
          }

          /* Erase first name */
          for (let i = first.length; i >= 0; i -= 1) {
            firstEl.textContent = first.slice(0, i);

            await sleep(i === first.length ? 80 : 48);
          }

          await sleep(380);
        }
      })();
    }
  }

  /* =========================================================
     SCROLL REVEALS
  ========================================================= */

  root.classList.add("reveal-ready");

  const revealItems = qsa(".reveal");

  if (revealItems.length) {
    revealItems.forEach((item, index) => {
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 5, 4) * 55}ms`,
      );
    });

    if ("IntersectionObserver" in window && !reduceMotion) {
      const observer = new IntersectionObserver(
        (entries, io) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("reveal-visible");

            io.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.04,
        },
      );

      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("reveal-visible"));
    }

    /* Safety fallback */
    window.setTimeout(() => {
      revealItems.forEach((item) => item.classList.add("reveal-visible"));
    }, 1800);
  }

  /* =========================================================
     RECRUITER COUNTERS
  ========================================================= */

  const counters = qsa("[data-counter]");

  const animateCounter = (element) => {
    if (!element || element.dataset.counted === "true") {
      return;
    }

    element.dataset.counted = "true";

    const target = Number.parseFloat(element.dataset.counter || "0");

    const suffix = element.dataset.suffix || "";

    const decimals = String(target).includes(".")
      ? String(target).split(".")[1].length
      : 0;

    if (!Number.isFinite(target)) {
      element.textContent = `0${suffix}`;

      return;
    }

    if (reduceMotion) {
      element.textContent = `${target.toFixed(decimals)}${suffix}`;

      return;
    }

    const duration = 900;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);

      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    element.textContent = `0${suffix}`;

    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);

          io.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
      },
    );

    counters.forEach((element) => observer.observe(element));
  } else {
    counters.forEach(animateCounter);
  }

  /* =========================================================
     PROJECT FILTERS
  ========================================================= */

  const filterButtons = qsa(".project-filter");

  const projectCards = qsa(".project-card");

  const filterStatus = qs("#projectFilterStatus");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const active = item === button;

        item.classList.toggle("active", active);

        item.setAttribute("aria-pressed", String(active));
      });

      let visible = 0;

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "")
          .split(/\s+/)
          .filter(Boolean);

        const show = filter === "all" || categories.includes(filter);

        card.hidden = !show;

        if (show) {
          visible += 1;
        }
      });

      if (filterStatus) {
        filterStatus.textContent =
          filter === "all"
            ? `Showing all ${visible} engineering projects.`
            : `Showing ${visible} ${button.textContent.trim()} projects.`;
      }
    });
  });

  /* =========================================================
     ACHIEVEMENT EXPANSION
  ========================================================= */

  const achievementToggle = qs("#achievementsToggle");

  achievementToggle?.addEventListener("click", () => {
    const expanded = achievementToggle.getAttribute("aria-expanded") === "true";

    qsa(".achievement-card.more-card").forEach((card) => {
      card.classList.toggle("visible", !expanded);
    });

    achievementToggle.setAttribute("aria-expanded", String(!expanded));

    achievementToggle.textContent = expanded
      ? "View more achievements ↓"
      : "Show fewer ↑";
  });

  /* =========================================================
     IMAGE LIGHTBOX
  ========================================================= */

  const lightbox = qs("#lightbox");

  const lightboxImg = qs("#lightboxImg");

  const stage = qs("#lightboxStage");

  const closeBtn = qs("#lightboxClose");

  const zoomIn = qs("#lightboxZoomIn");

  const zoomOut = qs("#lightboxZoomOut");

  const zoomReset = qs("#lightboxZoomReset");

  const caption = qs("#lightboxCaption");

  let lastFocused = null;

  let baseScale = 1;
  let zoom = 1;

  let panX = 0;
  let panY = 0;

  let dragging = false;
  let pointerId = null;

  let startX = 0;
  let startY = 0;

  let startPanX = 0;
  let startPanY = 0;

  let naturalW = 0;
  let naturalH = 0;

  const stageSize = () => {
    if (!stage) {
      return {
        width: 1,
        height: 1,
      };
    }

    const rect = stage.getBoundingClientRect();

    return {
      width: Math.max(1, rect.width - 32),
      height: Math.max(1, rect.height - 96),
    };
  };

  const calcBaseScale = () => {
    if (!naturalW || !naturalH) {
      return 1;
    }

    const box = stageSize();

    return Math.min(box.width / naturalW, box.height / naturalH, 1);
  };

  const limits = () => {
    const box = stageSize();

    const visualW = naturalW * baseScale * zoom;

    const visualH = naturalH * baseScale * zoom;

    return {
      x: Math.max(0, (visualW - box.width) / 2),
      y: Math.max(0, (visualH - box.height) / 2),
    };
  };

  const clampPan = () => {
    const max = limits();

    panX = Math.min(max.x, Math.max(-max.x, panX));

    panY = Math.min(max.y, Math.max(-max.y, panY));

    if (zoom <= 1.001) {
      panX = 0;
      panY = 0;
    }
  };

  const render = () => {
    clampPan();

    if (!lightboxImg) {
      return;
    }

    const scale = baseScale * zoom;

    lightboxImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;

    stage?.classList.toggle("can-pan", zoom > 1.001);

    if (zoomReset) {
      zoomReset.textContent =
        zoom <= 1.001 ? "Fit" : `${Math.round(zoom * 100)}%`;
    }
  };

  const fit = () => {
    baseScale = calcBaseScale();

    zoom = 1;

    panX = 0;
    panY = 0;

    render();
  };

  const changeZoom = (factor) => {
    zoom = Math.min(5, Math.max(1, Number((zoom * factor).toFixed(3))));

    if (zoom <= 1.001) {
      zoom = 1;
      panX = 0;
      panY = 0;
    }

    render();
  };

  const openLightbox = (src, alt = "") => {
    if (!lightbox || !lightboxImg || !src) {
      return;
    }

    lastFocused = document.activeElement;

    lightboxImg.style.visibility = "hidden";

    lightboxImg.src = src;

    lightboxImg.alt = alt;

    if (caption) {
      caption.textContent = alt;
    }

    document.body.style.overflow = "hidden";

    if (typeof lightbox.showModal === "function") {
      if (!lightbox.open) {
        lightbox.showModal();
      }
    } else {
      lightbox.setAttribute("open", "");

      lightbox.classList.add("fallback-open");
    }

    closeBtn?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) {
      return;
    }

    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    }

    lightbox.removeAttribute("open");

    lightbox.classList.remove("fallback-open");

    if (lightboxImg) {
      lightboxImg.removeAttribute("src");

      lightboxImg.style.transform = "";

      lightboxImg.style.visibility = "";
    }

    naturalW = 0;
    naturalH = 0;

    zoom = 1;
    baseScale = 1;

    panX = 0;
    panY = 0;

    document.body.style.overflow = "";

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }

    lastFocused = null;
  };

  /* Project / achievement images */

  qsa(".lightbox-img").forEach((img) => {
    img.tabIndex = 0;

    img.setAttribute("role", "button");

    const show = () => {
      openLightbox(img.currentSrc || img.src, img.alt || "");
    };

    img.addEventListener("click", show);

    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        show();
      }
    });
  });

  /* Certificates */

  qsa(".certificate-view, .credential-image").forEach((button) => {
    button.addEventListener("click", () => {
      const image = qs("img", button);

      if (!image) {
        return;
      }

      openLightbox(
        image.currentSrc || image.src,
        image.alt || button.getAttribute("aria-label") || "",
      );
    });
  });

  /* Image load */

  lightboxImg?.addEventListener("load", () => {
    naturalW = lightboxImg.naturalWidth || 1;

    naturalH = lightboxImg.naturalHeight || 1;

    fit();

    lightboxImg.style.visibility = "visible";
  });

  /* Controls */

  zoomIn?.addEventListener("click", () => changeZoom(1.25));

  zoomOut?.addEventListener("click", () => changeZoom(0.8));

  zoomReset?.addEventListener("click", fit);

  closeBtn?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  /* Pointer pan */

  stage?.addEventListener("pointerdown", (event) => {
    if (zoom <= 1.001) {
      return;
    }

    dragging = true;

    pointerId = event.pointerId;

    startX = event.clientX;

    startY = event.clientY;

    startPanX = panX;

    startPanY = panY;

    stage.classList.add("is-panning");

    stage.setPointerCapture?.(event.pointerId);
  });

  stage?.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    panX = startPanX + event.clientX - startX;

    panY = startPanY + event.clientY - startY;

    render();
  });

  const endDrag = () => {
    dragging = false;
    pointerId = null;

    stage?.classList.remove("is-panning");
  };

  stage?.addEventListener("pointerup", endDrag);

  stage?.addEventListener("pointercancel", endDrag);

  /* Wheel zoom */

  stage?.addEventListener(
    "wheel",
    (event) => {
      if (!lightbox?.open) {
        return;
      }

      event.preventDefault();

      changeZoom(event.deltaY < 0 ? 1.12 : 0.89);
    },
    {
      passive: false,
    },
  );

  /* Keyboard controls */

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.open) {
      return;
    }

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
      fit();
    } else if (event.key === "ArrowLeft" && zoom > 1) {
      event.preventDefault();
      panX += 40;
      render();
    } else if (event.key === "ArrowRight" && zoom > 1) {
      event.preventDefault();
      panX -= 40;
      render();
    } else if (event.key === "ArrowUp" && zoom > 1) {
      event.preventDefault();
      panY += 40;
      render();
    } else if (event.key === "ArrowDown" && zoom > 1) {
      event.preventDefault();
      panY -= 40;
      render();
    }
  });

  /* Resize */

  window.addEventListener("resize", () => {
    if (!lightbox?.open || !naturalW) {
      return;
    }

    const currentZoom = zoom;

    baseScale = calcBaseScale();

    zoom = currentZoom;

    render();
  });

  /* =========================================================
     SCROLL PROGRESS
  ========================================================= */

  const scrollProgress = qs("#scrollProgress");

  const updateScrollProgress = () => {
    if (!scrollProgress) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  updateScrollProgress();

  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const backToTop = qs("#backToTop");

  const updateTopButton = () => {
    backToTop?.classList.toggle("is-visible", window.scrollY > 650);
  };

  updateTopButton();

  window.addEventListener("scroll", updateTopButton, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
})();

/* =========================================================
   V11 POINTER SPOTLIGHT
========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (reduceMotion || !canHover) {
    return;
  }

  const cards = [...document.querySelectorAll(".spotlight-card")];

  cards.forEach((card) => {
    const updateSpotlight = (event) => {
      const rect = card.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 100;

      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--spot-x", `${x}%`);

      card.style.setProperty("--spot-y", `${y}%`);
    };

    card.addEventListener("pointermove", updateSpotlight);

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--spot-x", "50%");

      card.style.setProperty("--spot-y", "50%");
    });
  });

  /* =======================================================
     SUBTLE PROJECT TILT
  ======================================================= */

  const tiltCards = [...document.querySelectorAll('[data-tilt="subtle"]')];

  tiltCards.forEach((card) => {
    const onMove = (event) => {
      const rect = card.getBoundingClientRect();

      const px = (event.clientX - rect.left) / rect.width;

      const py = (event.clientY - rect.top) / rect.height;

      const ry = (px - 0.5) * 2.2;

      const rx = (0.5 - py) * 1.8;

      card.style.transform = `perspective(1000px)
           rotateX(${rx.toFixed(2)}deg)
           rotateY(${ry.toFixed(2)}deg)
           translateY(-3px)`;
    };

    const reset = () => {
      card.style.transform = "";
    };

    card.addEventListener("pointermove", onMove);

    card.addEventListener("pointerleave", reset);
  });
})();

/* =========================================================
   V11 RESEARCH INTEREST ROTATION
========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    return;
  }

  const tags = [
    ...document.querySelectorAll(".research-card .interest-tags span"),
  ];

  if (tags.length < 2) {
    return;
  }

  let index = 0;

  tags[index].classList.add("research-active");

  window.setInterval(() => {
    tags[index].classList.remove("research-active");

    index = (index + 1) % tags.length;

    tags[index].classList.add("research-active");
  }, 2400);
})();
