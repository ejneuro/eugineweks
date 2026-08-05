/* Behaviours: theme, scroll reveals, animated counters, meters,
   typing effect and contact form validation. */

import { profile } from "./data.js";
import {
  renderNav,
  renderSocials,
  renderStats,
  renderSkills,
  renderJourney,
  renderServices,
  renderExperience,
  renderProjects,
  renderContactInfo,
  renderFooter,
} from "./components.js";

/* ---------- Theme ---------- */

function applyStoredTheme() {
  const stored = localStorage.getItem("ew-theme");
  if (stored) document.documentElement.dataset.theme = stored;
}

function initThemeToggles() {
  const root = document.documentElement;
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("ew-theme", next);
    }),
  );
}

/* ---------- Scroll reveal ---------- */

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Animated counters ---------- */

function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );
  nodes.forEach((n) => io.observe(n));
}

/* ---------- Skill meters ---------- */

function initMeters() {
  const nodes = document.querySelectorAll("[data-meter]");
  if (!nodes.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = `${entry.target.dataset.meter}%`;
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );
  nodes.forEach((n) => io.observe(n));
}

/* ---------- Typing effect ---------- */

function initTyping() {
  const el = document.querySelector("[data-typed]");
  if (!el) return;
  const words = profile.roles;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = words[0];
    return;
  }
  let word = 0;
  let char = 0;
  let deleting = false;

  const tick = () => {
    const full = words[word];
    char += deleting ? -1 : 1;
    el.textContent = full.slice(0, char);
    let delay = deleting ? 45 : 85;
    if (!deleting && char === full.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && char === 0) {
      deleting = false;
      word = (word + 1) % words.length;
      delay = 320;
    }
    setTimeout(tick, delay);
  };
  tick();
}

/* ---------- Contact form ---------- */

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const note = form.querySelector("[data-form-note]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      note.textContent = "Please fill in your name, email and message.";
      note.classList.remove("is-success");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "That email address doesn't look right.";
      note.classList.remove("is-success");
      return;
    }
    note.textContent = `Thanks ${name}! Your message is ready to send — connect a mail service to deliver it.`;
    note.classList.add("is-success");
    form.reset();
  });
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  renderNav();
  initThemeToggles();
  renderSocials();
  renderStats();
  renderSkills();
  renderJourney();
  renderServices();
  renderExperience();
  const projectsMount = document.querySelector("[data-projects]");
  if (projectsMount) renderProjects(projectsMount.dataset.limit ? Number(projectsMount.dataset.limit) : undefined);
  renderContactInfo();
  renderFooter();

  initTyping();
  initReveal();
  initCounters();
  initMeters();
  initContactForm();

  document.body.classList.add("page-enter");
});
