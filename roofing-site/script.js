/* ============================================================
   Apex Roofing — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Frosted nav on scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // gentle stagger for siblings entering together
          const delay = Math.min(i * 70, 280);
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Animated stat counters ---- */
  const nums = document.querySelectorAll(".stat__num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const val = Math.round(ease(p) * target);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const countIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((el) => countIO.observe(el));
  } else {
    nums.forEach(animateCount);
  }

  /* ---- Subtle hero parallax ---- */
  const heroBg = document.querySelector(".hero__bg");
  if (heroBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = "translateY(" + y * 0.18 + "px)";
        }
      },
      { passive: true }
    );
  }

  /* ---- Quote form ---- */
  const form = document.getElementById("quoteForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const valid = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        note.textContent = "Please add your name and a valid email.";
        return;
      }
      note.textContent =
        "Thanks, " + name.split(" ")[0] + "! We'll be in touch within 24 hours.";
      form.reset();
    });
  }
})();
