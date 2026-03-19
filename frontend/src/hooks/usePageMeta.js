import { useEffect } from "react";

const DEFAULT_TITLE = "Atlas Wire";
const DEFAULT_DESCRIPTION =
  "Atlas Wire delivers global news, trending coverage, markets, sport, entertainment, science, and health from one modern front page.";

const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
};

const usePageMeta = ({ title, description } = {}) => {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = ensureMetaTag('meta[name="description"]', {
      name: "description"
    });
    const ogTitleTag = ensureMetaTag('meta[property="og:title"]', {
      property: "og:title"
    });
    const ogDescriptionTag = ensureMetaTag('meta[property="og:description"]', {
      property: "og:description"
    });
    const twitterTitleTag = ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title"
    });
    const twitterDescriptionTag = ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description"
    });

    const nextTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    const nextDescription = description || DEFAULT_DESCRIPTION;

    const previousDescription = descriptionTag.getAttribute("content") || "";
    const previousOgTitle = ogTitleTag.getAttribute("content") || "";
    const previousOgDescription = ogDescriptionTag.getAttribute("content") || "";
    const previousTwitterTitle = twitterTitleTag.getAttribute("content") || "";
    const previousTwitterDescription = twitterDescriptionTag.getAttribute("content") || "";

    document.title = nextTitle;
    descriptionTag.setAttribute("content", nextDescription);
    ogTitleTag.setAttribute("content", nextTitle);
    ogDescriptionTag.setAttribute("content", nextDescription);
    twitterTitleTag.setAttribute("content", nextTitle);
    twitterDescriptionTag.setAttribute("content", nextDescription);

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      descriptionTag.setAttribute("content", previousDescription || DEFAULT_DESCRIPTION);
      ogTitleTag.setAttribute("content", previousOgTitle || DEFAULT_TITLE);
      ogDescriptionTag.setAttribute("content", previousOgDescription || DEFAULT_DESCRIPTION);
      twitterTitleTag.setAttribute("content", previousTwitterTitle || DEFAULT_TITLE);
      twitterDescriptionTag.setAttribute(
        "content",
        previousTwitterDescription || DEFAULT_DESCRIPTION
      );
    };
  }, [description, title]);
};

export default usePageMeta;
