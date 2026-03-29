import { useToast } from "../context/ToastContext";

const ShareButton = ({ title, path = "", className = "" }) => {
  const { showToast } = useToast();

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? new URL(path || window.location.pathname, window.location.origin).toString()
        : path;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: title,
          url: shareUrl
        });

        showToast({
          title: "Shared",
          message: "The share menu is open for this post.",
          type: "success"
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast({
          title: "Link Copied",
          message: "The post link is ready to paste anywhere.",
          type: "success"
        });
        return;
      }

      showToast({
        title: "Share Unavailable",
        message: "Your browser does not support sharing here.",
        type: "error",
        duration: 4200
      });
    } catch (_error) {
      showToast({
        title: "Share Cancelled",
        message: "You can try again whenever you are ready.",
        type: "info"
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className || "rounded-full border border-white/15 px-4 py-2 text-sm font-semibold"}
    >
      Share
    </button>
  );
};

export default ShareButton;
