(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // mobile menu
  const button = $(".menu-button");
  const nav = $(".nav");
  button?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
  $$(".nav a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    button?.setAttribute("aria-expanded", "false");
  }));

  // active section in the nav
  const navLinks = $$('.nav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60%" });
  sections.forEach((s) => spy.observe(s));

  // typed tagline
  const tag = $(".hero-tagline em");
  if (tag && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const text = tag.textContent;
    tag.textContent = "";
    let i = 0;
    const step = () => { tag.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, 38 + Math.random() * 40); };
    setTimeout(step, 450);
  }

  // compact long author lists, keep first, last, self and marked authors
  $$(".pub").forEach((paper, index) => {
    const authors = $(".paper-authors", paper);
    if (!authors || !$(".me", authors)) return;
    const tokens = authors.innerHTML.trim().split(/,\s*/);
    if (tokens.length <= 8) return;
    const compact = [];
    let omitted = false;
    tokens.forEach((token, i) => {
      const probe = document.createElement("span");
      probe.innerHTML = token;
      const keep = i === 0 || i === tokens.length - 1 || probe.querySelector(".me") || /[*†]/.test(probe.textContent);
      if (keep) {
        if (omitted) compact.push('<span class="authors-ellipsis">…</span>');
        compact.push(token);
        omitted = false;
      } else omitted = true;
    });
    if (!compact.some((t) => t.includes("authors-ellipsis"))) return;
    const full = document.createElement("span");
    full.id = `authors-${index + 1}`;
    full.innerHTML = authors.innerHTML;
    full.hidden = true;
    const short = document.createElement("span");
    short.innerHTML = compact.join(", ");
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "paper-authors-toggle";
    toggle.textContent = "All authors";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", full.id);
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      full.hidden = !open;
      short.hidden = open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Fewer" : "All authors";
    });
    authors.replaceChildren(short, full, document.createTextNode(" "), toggle);
  });

  // publication filter
  const filterButtons = $$(".pub-filter button");
  filterButtons.forEach((b) => b.addEventListener("click", () => {
    const f = b.dataset.filter;
    filterButtons.forEach((x) => x.classList.toggle("is-active", x === b));
    $$(".pub").forEach((p) => {
      p.hidden = !(f === "all" || (f === "lead" ? p.hasAttribute("data-lead") : p.dataset.cat === f));
    });
  }));

  // news: show the latest items first
  const news = $(".news");
  const newsToggle = $(".news-toggle");
  if (news && newsToggle && $(".news-more", news)) {
    news.classList.add("is-collapsed");
    newsToggle.addEventListener("click", () => {
      const collapsed = news.classList.toggle("is-collapsed");
      newsToggle.setAttribute("aria-expanded", String(!collapsed));
      newsToggle.textContent = collapsed ? "Show earlier news" : "Show fewer";
    });
  } else if (newsToggle) newsToggle.hidden = true;

  // WeChat id copy
  const toast = $(".toast");
  const say = (msg) => { toast.textContent = msg; toast.classList.add("show"); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove("show"), 2200); };
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const id = b.dataset.copy;
    try { await navigator.clipboard.writeText(id); say(`WeChat ID copied: ${id}`); } catch { say(`WeChat ID: ${id}`); }
  }));

  // only play preview videos while visible
  const vids = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) v.play?.().catch(() => {}); else v.pause?.();
  }), { threshold: 0.2 });
  $$(".pub-thumb video[autoplay]").forEach((v) => vids.observe(v));
  $$(".work").forEach((d) => d.addEventListener("toggle", () => {
    const v = $("video", d);
    if (!v) return;
    if (d.open) { v.muted = true; v.loop = true; v.play?.().catch(() => {}); } else v.pause?.();
  }));

  // gentle reveal on scroll
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const items = $$(".block-head, .interest, .work, .news li, .tally, .pub, .row, .awards li, .service li");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  $$('a[href^="http"]').forEach((a) => { a.target = "_blank"; a.rel = "noopener noreferrer"; });
})();
