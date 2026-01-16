const SITE_DATA_URL = "content/site.json";
const ARTICLES_DATA_URL = "content/articles.json";

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
  })
  .catch((error) => {
    console.error(error);
  });
