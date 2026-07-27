(() => {
  const button = document.querySelector(".menu-button");
  const menu = document.querySelector(".visible-links");
  const links = [...document.querySelectorAll(".visible-links a")];

  button?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      button?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-20% 0px -70%", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
