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

  const publicationSection = document.querySelector("#publications");
  const publicationPapers = publicationSection
    ? [...publicationSection.querySelectorAll(".paper-box[data-publication-category]")]
    : [];

  if (publicationSection && publicationPapers.length) {
    const categories = [
      {
        key: "long-horizon-embodied",
        title: "Long-Horizon Embodied Intelligence",
        description: "Persistent execution state and spatio-temporal memory for long-horizon manipulation",
      },
      {
        key: "dynamic-worlds",
        title: "Dynamic 4D World Modeling & Reasoning",
        description: "Geometric reconstruction, streaming perception, and physical-world reasoning",
      },
      {
        key: "video-anomaly",
        title: "Track-Centric Video Anomaly Understanding",
        description: "Instance tracking, dense localization, and structured anomaly understanding",
      },
      {
        key: "foundation-model-adaptation",
        title: "Segmentation Foundation Model Adaptation",
        description: "Probabilistic prompting and ambiguity-aware adaptation of vision foundation models",
      },
    ];

    const groups = document.createElement("div");
    groups.className = "publication-groups";
    publicationPapers[0].before(groups);

    categories.forEach((category, index) => {
      const papers = publicationPapers.filter(
        (paper) => paper.dataset.publicationCategory === category.key
      );
      if (!papers.length) return;

      const group = document.createElement("section");
      group.className = "publication-group";
      group.id = `pub-${category.key}`;

      const heading = document.createElement("header");
      heading.className = "publication-group-heading";
      heading.innerHTML = `
        <div>
          <span class="publication-group-index">Research direction ${String(index + 1).padStart(2, "0")}</span>
          <h2>${category.title}</h2>
        </div>
        <div class="publication-group-summary">
          <p>${category.description}</p>
          <span>${papers.length} ${papers.length === 1 ? "paper" : "papers"}</span>
        </div>
      `;

      group.append(heading, ...papers);
      groups.append(group);

      const navCount = publicationSection.querySelector(
        `.publication-categories a[href="#${group.id}"] .publication-category-count`
      );
      if (navCount) {
        navCount.textContent = `${papers.length} ${papers.length === 1 ? "paper" : "papers"}`;
      }
    });

    const categoryLinks = [
      ...publicationSection.querySelectorAll(".publication-categories a"),
    ];
    const categoryGroups = [
      ...publicationSection.querySelectorAll(".publication-group"),
    ];

    categoryLinks.forEach((link) => {
      link.addEventListener("click", () => {
        categoryLinks.forEach((categoryLink) => {
          categoryLink.classList.toggle("is-active", categoryLink === link);
        });
      });
    });

    const categoryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          categoryLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-18% 0px -68%", threshold: 0 }
    );

    categoryGroups.forEach((group) => categoryObserver.observe(group));
  }

  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
