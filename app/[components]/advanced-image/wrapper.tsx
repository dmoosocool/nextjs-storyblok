/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

interface AdvancedWrapperProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

const videoSuffix = [".mp4", ".mov"];

const isVideoUrl = (src?: string) => {
  return videoSuffix.some((suffix) => src?.endsWith(suffix));
};

const AdvancedWrapper = ({ src }: AdvancedWrapperProps) => {
  if (!src) return null;

  if (src.startsWith("//")) {
    src = "https:" + src;
  }
  return isVideoUrl(src) ? (
    <video
      muted
      controls
      autoPlay
      className="max-h-[640px] w-full rounded-lg bg-rss3-grey"
      src={src}
    />
  ) : (
    <img
      src={src}
      className="max-h-[640px] w-full rounded-lg bg-rss3-grey object-contain"
    />
  );
};

export default AdvancedWrapper;
