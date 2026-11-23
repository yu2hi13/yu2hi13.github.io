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

  // publication filter: one category plus an optional first-author toggle
  const state = { cat: "all", lead: false };
  const catButtons = $$("#publications [data-filter]:not([data-filter=lead])");
  const leadButton = $("#publications [data-filter=lead]");
  const applyFilter = () => {
    catButtons.forEach((x) => x.classList.toggle("is-on", x.dataset.filter === state.cat));
    leadButton?.classList.toggle("is-on", state.lead);
    $$(".pub").forEach((p) => {
      p.hidden = !((state.cat === "all" || p.dataset.cat === state.cat) && (!state.lead || p.hasAttribute("data-lead")));
    });
  };
  catButtons.forEach((b) => b.addEventListener("click", () => { state.cat = b.dataset.filter; applyFilter(); }));
  leadButton?.addEventListener("click", () => { state.lead = !state.lead; applyFilter(); });

  // news: show the latest items first
  const news = $(".news");
  const newsToggle = $(".news-toggle");
  if (news && newsToggle && $(".news-more", news)) {
    news.classList.add("is-collapsed");
    newsToggle.dataset.label = newsToggle.textContent;
    newsToggle.addEventListener("click", () => {
      const collapsed = news.classList.toggle("is-collapsed");
      newsToggle.setAttribute("aria-expanded", String(!collapsed));
      newsToggle.textContent = collapsed ? newsToggle.dataset.label : "Show fewer";
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

  // gentle reveal on scroll
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const items = $$(".chapter, .about-card, .interest, .table, .news-card, .rows, .list-card");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  $$('a[href^="http"]').forEach((a) => { a.target = "_blank"; a.rel = "noopener noreferrer"; });
})();
