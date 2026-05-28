import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Give the DOM time to render before scrolling to hash
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "instant" });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}