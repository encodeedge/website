import React from "react";

interface VideoEmbedProps {
  url: string;
  caption?: string;
}

function getEmbedUrl(url: string): string {
  if (!url) return "";
  // YouTube watch URL
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  return url;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, caption }) => {
  const embedUrl = getEmbedUrl(url);

  return (
    <figure className="my-8 not-prose">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-md bg-black-900">
        <iframe
          src={embedUrl}
          title={caption || "Video Embed"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
export default VideoEmbed;

