import React, { useEffect } from "react";

export const ReferenceItem = ({
  title,
  url,
  description,
  type,
  affiliate,
  image,
}: {
  title: string;
  url: string;
  description?: string;
  type?: string;
  affiliate?: string;
  image?: string;
}) => {
  const resolveImageSrc = (img: any): string | null => {
    if (!img) return null;
    try {
      if (typeof img === "string") return img;
      if (Array.isArray(img) && img.length) return resolveImageSrc(img[0]);
      if (img?.src && typeof img.src === "string") return img.src;
      if (img?.url && typeof img.url === "string") return img.url;
      if (img?.path && typeof img.path === "string") return img.path;
      if (img?.filepath && typeof img.filepath === "string") return img.filepath;
      if (img?.publicPath && img?.filename) return `${img.publicPath}${img.filename}`;
      if (img?.data?.publicPath && img?.data?.filename) return `${img.data.publicPath}${img.data.filename}`;
      if (img?.image?.src && typeof img.image.src === "string") return img.image.src;
      if (img?.id && typeof img.id === "string") return img.id;
      return null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("ReferenceItem.resolveImageSrc error", err);
      return null;
    }
  };

  const imageSrc = resolveImageSrc(image as any);

  useEffect(() => {
    try {
      // Safe, concise logging for debugging in browser console
      // eslint-disable-next-line no-console
      console.log("ReferenceItem - image type:", typeof image, Array.isArray(image) ? `array(${image.length})` : null);
      // eslint-disable-next-line no-console
      console.log("ReferenceItem - resolved imageSrc:", imageSrc ?? null);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("ReferenceItem - logging error", e);
    }
  }, [image, imageSrc]);

  return (
    <div className="rounded-lg border p-4 bg-muted/5">
      <div className="flex items-start gap-4">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="h-20 w-16 rounded-md object-cover flex-shrink-0" />
        ) : (
          <div className="h-20 w-16 rounded-md bg-muted-foreground/10 flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">No image</div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
                {title}
              </a>
              {type && <div className="text-xs text-muted-foreground mt-1">{type}</div>}
            </div>
            {affiliate ? (
              <div className="text-right">
                <a href={url} target="_blank" rel="noreferrer" className="inline-block rounded bg-sidebar-primary hover:bg-sidebar-primary/90 px-3 py-1 text-xs font-medium text-white">
                Buy
                </a>
              </div>
            ) : null}
          </div>

          {description && <p className="text-sm text-muted-foreground mt-3">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReferenceItem;
