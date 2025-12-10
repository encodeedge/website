
import React, { useEffect, useRef } from 'react';

const PostComments = () => {
  const commentsSection = useRef<HTMLElement>(null);

  useEffect(() => {
    // Prevent duplicate script injection if the component re-renders
    if (!commentsSection.current || commentsSection.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "encodeedge/website");
    script.setAttribute("data-repo-id", "R_kgDOQbT02Q");
    script.setAttribute("data-category", "Blog Posts Comments");
    script.setAttribute("data-category-id", "DIC_kwDOQbT02c4Czm3k");
    script.setAttribute("data-mapping", "url");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "noborder_light"); // Note: You might want to make this dynamic later
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    commentsSection.current.appendChild(script);
  }, []);

  return (
    <section ref={commentsSection} className="giscus mx-auto mt-10 w-full" />
  );
};

export default PostComments;