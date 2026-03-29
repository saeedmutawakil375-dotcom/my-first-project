const extractYouTubeVideoId = (url = "") => {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.replace("/", "");
    }

    if (host.includes("youtube.com")) {
      const directId = parsedUrl.searchParams.get("v");
      if (directId) {
        return directId;
      }

      const liveMatch = parsedUrl.pathname.match(/\/live\/([^/]+)/);
      if (liveMatch?.[1]) {
        return liveMatch[1];
      }

      const embedMatch = parsedUrl.pathname.match(/\/embed\/([^/]+)/);
      if (embedMatch?.[1]) {
        return embedMatch[1];
      }
    }
  } catch (_error) {
    return "";
  }

  return "";
};

const getYouTubeEmbedUrl = (url = "") => {
  const videoId = extractYouTubeVideoId(url);
  return videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : "";
};

const getYouTubeThumbnail = (url = "") => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
};

export { extractYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnail };
