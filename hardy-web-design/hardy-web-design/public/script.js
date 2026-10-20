// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Nav border on scroll
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  links.classList.toggle("is-open", !open);
});
links.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  }
});

// Reveal sections as they scroll into view
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Hide "Visit the site" buttons that don't have a real link yet
document.querySelectorAll('a.visit[href="#"]').forEach((a) => a.classList.add("is-hidden"));

// Project filters
const chips = document.querySelectorAll(".chip");
const projects = document.querySelectorAll("#work [data-cat]");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => {
      c.classList.toggle("is-active", c === chip);
      c.setAttribute("aria-pressed", String(c === chip));
    });
    projects.forEach((p) => {
      const show = f === "all" || p.dataset.cat.split(" ").includes(f);
      p.classList.toggle("is-hidden", !show);
      if (show) p.classList.add("is-in");
    });
  });
});

// Contact form: sends to /api/contact, which emails the message through Resend
const form = document.getElementById("contact-form");
const statusEl = form.querySelector(".form__status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  button.disabled = true;
  statusEl.className = "form__status";
  statusEl.textContent = "Sending…";
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out.error || "Your message didn't send. Please try again.");
    form.reset();
    statusEl.classList.add("is-ok");
    statusEl.textContent = "Thanks! Your message was sent. I'll be in touch soon.";
  } catch (err) {
    statusEl.classList.add("is-error");
    statusEl.textContent = err.message;
  } finally {
    button.disabled = false;
  }
});
