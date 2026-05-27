const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.12
});

reveals.forEach((item) => observer.observe(item));

/* 自动高亮当前导航 */
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll(".site-nav a");

navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");
  link.classList.remove("active");

  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});

function setupPublicationRangeFilter() {
  const filterBar = document.getElementById("publicationFilterBar");
  if (!filterBar) return;

  const publicationSections = document.querySelectorAll(".pub-filter-section");
  if (!publicationSections.length) return;

  const inSelectedRange = (range, itemYear) => {
    if (range === "all") return true;
    if (!/^\d{4}$/.test(itemYear)) return false;

    const year = Number(itemYear);
    if (range === "2020s") return year >= 2020 && year <= 2029;
    if (range === "2010s") return year >= 2010 && year <= 2019;
    if (range === "2000s") return year >= 2000 && year <= 2009;
    if (range === "1990s") return year >= 1990 && year <= 1999;
    return false;
  };

  const sectionEmptyStateMap = new Map();
  publicationSections.forEach((section) => {
    const card = section.querySelector(".card");
    if (!card) return;

    const emptyState = document.createElement("p");
    emptyState.className = "pub-empty-state";
    emptyState.textContent = "该年份范围本类别暂无条目。No entries in this category for the selected range.";
    card.appendChild(emptyState);
    sectionEmptyStateMap.set(section, emptyState);
  });

  const applyRangeFilter = (selectedRange) => {
    const buttons = filterBar.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.range === selectedRange);
    });

    publicationSections.forEach((section) => {
      const sectionItems = section.querySelectorAll(".pub-item");
      const list = section.querySelector(".clean-list");
      const emptyState = sectionEmptyStateMap.get(section);
      let visibleCount = 0;

      sectionItems.forEach((item) => {
        const itemYear = (item.dataset.year || "").trim();
        const shouldShow = inSelectedRange(selectedRange, itemYear);
        item.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      if (list) {
        list.classList.toggle("is-empty", visibleCount === 0);
      }
      if (emptyState) {
        emptyState.classList.toggle("visible", visibleCount === 0);
      }
    });
  };

  filterBar.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-btn");
    if (!btn) return;
    applyRangeFilter(btn.dataset.range || "all");
  });

  applyRangeFilter("all");
}

setupPublicationRangeFilter();
