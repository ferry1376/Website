const SUPPORTED_LANGUAGES = ["en", "fa"];
const DEFAULT_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "preferredLanguage";

const getLanguageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang");
  return SUPPORTED_LANGUAGES.includes(language) ? language : null;
};

const setLanguageInUrl = (language) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  return url.toString();
};

const getPreferredLanguage = () => {
  const urlLanguage = getLanguageFromUrl();
  if (urlLanguage) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, urlLanguage);
    return urlLanguage;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }

  const documentLanguage = document.documentElement.lang;
  if (SUPPORTED_LANGUAGES.includes(documentLanguage)) {
    return documentLanguage;
  }

  return DEFAULT_LANGUAGE;
};

const applyLanguage = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const setupLanguageToggle = (language) => {
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLanguage = button.dataset.language;
      if (!SUPPORTED_LANGUAGES.includes(selectedLanguage)) return;

      if (selectedLanguage === language) {
        applyLanguage(selectedLanguage);
        return;
      }

      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
      window.location.assign(setLanguageInUrl(selectedLanguage));
    });
  });
};

const currentLanguage = getPreferredLanguage();
applyLanguage(currentLanguage);
setupLanguageToggle(currentLanguage);

const SITE_DATA_URL = `content/site.${currentLanguage}.json`;
const ARTICLES_DATA_URL = `content/articles.${currentLanguage}.json`;

const setText = (element, value) => {
  if (element && typeof value === "string" && value.trim() !== "") {
    element.textContent = value;
  }
};

const setHtml = (element, value) => {
  if (element && typeof value === "string" && value.trim() !== "") {
    element.innerHTML = value;
  }
};

const setAttr = (element, attribute, value) => {
  if (element && typeof value === "string" && value.trim() !== "") {
    element.setAttribute(attribute, value);
  }
};

const applyBasicFields = (data) => {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const field = element.dataset.field;
    if (data[field]) {
      if (element.tagName === "IMG") {
        setAttr(element, "src", data[field]);
      } else {
        setText(element, data[field]);
      }
    }
  });

  document.querySelectorAll("[data-alt]").forEach((element) => {
    const field = element.dataset.alt;
    if (data[field]) {
      setAttr(element, "alt", data[field]);
    }
  });

  document.querySelectorAll("[data-aria-label]").forEach((element) => {
    const field = element.dataset.ariaLabel;
    if (data[field]) {
      setAttr(element, "aria-label", data[field]);
    }
  });

  document.querySelectorAll("[data-href]").forEach((element) => {
    const field = element.dataset.href;
    if (data[field]) {
      setAttr(element, "href", data[field]);
    }
  });
};

const renderCards = (cards) => {
  const container = document.querySelector("#home-cards");
  if (!container || !Array.isArray(cards)) return;

  container.innerHTML = cards
    .map(
      (card) => `
      <div class="card">
        <h3>${card.title}</h3>
        <p>${card.body}</p>
      </div>
    `
    )
    .join("");
};

const normalizeListItem = (item) => {
  if (typeof item === "string") return item;
  if (item && typeof item.item === "string") return item.item;
  return "";
};

const renderFocusList = (items) => {
  const container = document.querySelector("#focus-list");
  if (!container || !Array.isArray(items)) return;

  container.innerHTML = items
    .map((item) => normalizeListItem(item))
    .filter((item) => item)
    .map((item) => `<div class="list-item">${item}</div>`)
    .join("");
};

const renderArticlesPlaceholder = (html) => {
  const element = document.querySelector("[data-field='articlesPlaceholder']");
  if (!element || !html) return;
  setHtml(element, html);
};

const renderArticles = (articles) => {
  const container = document.querySelector("#articles-list");
  if (!container || !Array.isArray(articles)) return;

  if (articles.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = articles
    .map(
      (article) => `
      <article class="article-card">
        ${article.image ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" />` : ""}
        <div class="article-meta">${article.date || ""}</div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
      </article>
    `
    )
    .join("");
};

const renderLatestArticles = (articles) => {
  const container = document.querySelector("#latest-articles-list");
  if (!container || !Array.isArray(articles)) return;

  const latest = articles.slice(0, 3);

  container.innerHTML = latest
    .map(
      (article) => `
      <article class="latest-article-card">
        <a href="articles.html" aria-label="Read ${article.title}">
          <div class="latest-article-media">
            ${article.image ? `<img src="${article.image}" alt="${article.imageAlt || article.title}" />` : ""}
          </div>
        </a>
        <a href="articles.html" class="latest-article-title">${article.title}</a>
      </article>
    `
    )
    .join("");
};

fetch(SITE_DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load site content.");
    }
    return response.json();
  })
  .then((data) => {
    applyBasicFields(data);
    renderCards(data.homeCards);
    renderFocusList(data.focusList);
    renderArticlesPlaceholder(data.articlesPlaceholderHtml);
  })
  .catch((error) => {
    console.error(error);
  });

fetch(ARTICLES_DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load articles.");
    }
    return response.json();
  })
  .then((data) => {
    renderArticles(data.articles);
    renderLatestArticles(data.articles);
  })
  .catch((error) => {
    console.error(error);
  });

const initHeroSlider = () => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.querySelectorAll(".hero-dot"));
  const arrows = Array.from(slider.querySelectorAll(".hero-arrow"));

  if (slides.length === 0) return;

  let currentIndex = 0;
  let timerId;

  const setActiveSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
    currentIndex = index;
  };

  const goToSlide = (index) => {
    const normalizedIndex = (index + slides.length) % slides.length;
    setActiveSlide(normalizedIndex);
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startTimer = () => {
    stopTimer();
    timerId = window.setInterval(nextSlide, 4000);
  };

  const stopTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startTimer();
    });
  });

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const direction = arrow.dataset.direction;
      if (direction === "prev") {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
      startTimer();
    });
  });

  slider.addEventListener("mouseenter", stopTimer);
  slider.addEventListener("mouseleave", startTimer);

  setActiveSlide(0);
  startTimer();
};

initHeroSlider();
