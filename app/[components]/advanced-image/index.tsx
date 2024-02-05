"use client";

import { isIpfsUrl } from "@crossbell/ipfs-gateway";
import Image, { ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/app/utils";
import { ipfsLinkToHttpLink } from "@/app/utils/ipfs";

export type TImageProps = {
  className?: string;
  src?: string;
  width?: number | string;
  height?: number | string;
  "original-src"?: string;
  imageRef?: React.MutableRefObject<HTMLImageElement>;
  zoom?: boolean;
  blurDataURL?: string;
  placeholder?: "blur";
} & React.HTMLAttributes<HTMLImageElement> &
  ImageProps;

type TImageInfo = {
  url: string;
  height: number;
  width: number;
  type: string;
};
const isLocal = (src: string) =>
  src.startsWith("/") && !src.startsWith("/api/img");

const AdvancedImage = (props: TImageProps) => {
  const [imageInfo, setImageInfo] = useState<TImageInfo | null | undefined>(
    undefined
  );
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const fallbackImg = "/images/blog-fallback.png";

  const coverUrl = useMemo(() => {
    if (typeof props.src === "string") {
      if (isIpfsUrl(props.src)) {
        return ipfsLinkToHttpLink(props.src);
      }
      if (props.src !== "") {
        return props.src;
      }
    }
    return fallbackImg;
  }, [props.src]);

  useEffect(() => {
    const prefetchImage = async (src: string) => {
      const resp = await fetch(
        "/api/image?url=" + encodeURIComponent(ipfsLinkToHttpLink(src))
      );
      return {
        ...(await resp.json()),
        url: src,
      } as TImageInfo | null;
    };

    if (/\/(.*)(.mp4|.mov)$/.test(coverUrl)) {
      setIsVideo(true);
    } else if (coverUrl !== fallbackImg) {
      prefetchImage(coverUrl as string)
        .then((res) => {
          setImageInfo(res);
        })
        .catch(() => {
          setImageInfo(null);
        });
    }
  }, [coverUrl]);

  return (
    <>
      {isVideo && (
        <video
          muted
          controls
          className="max-h-[640px] w-full rounded-lg bg-rss3-grey object-cover"
          src={props.src}
        ></video>
      )}
      {!isVideo && imageInfo && (
        <Image
          {...props}
          unoptimized={isLocal(props.src as string)}
          alt={props.alt}
          src={imageInfo.url}
          height={props.fill ? undefined : props.height || imageInfo.height}
          width={props.fill ? undefined : props.width || imageInfo.width}
          onError={() => {
            setImageInfo({ ...imageInfo, url: fallbackImg });
          }}
          className={cn(
            "max-h-[640px] w-full object-contain",
            props.className,
            !isLoadingComplete && "bg-rss3-grey"
          )}
          priority
          onLoadingComplete={(e) => {
            setIsLoadingComplete(true);
            if (e.naturalWidth === 0) {
              setImageInfo({ ...imageInfo, url: fallbackImg });
            }
          }}
        />
      )}
    </>
  );
};

export default AdvancedImage;
