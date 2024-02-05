import React, { createElement, Fragment } from "react";
import rehypeInferDescriptionMeta from "rehype-infer-description-meta";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import remarkUnwrapImages from "remark-unwrap-images";
import * as prod from "react/jsx-runtime";
import { unified } from "unified";

import { components } from "./components";
import styles from "./markdown.module.css";

import "katex/dist/katex.min.css";

// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

import {
  rehypeImage,
  RehypeImageCache,
  rehypeLink,
  RehypeLinkCache,
  rehypeMetadata,
  RehypeMetadataCache,
  rehypeSanitize,
  rehypeVideo,
  RehypeVideoCache,
  sanitizeSchema,
} from "./plugins";

const renderCache = new Map<string, RenderMarkdownResult>();

export type RenderMarkdownParams = {
  content: string;
};

export type RenderMarkdownResult = {
  node: React.ReactNode;
  images: string[];
  videos: string[];
  cover: string;
  description: string;
  links: string[];
  metadata: RehypeMetadataCache;
};

export function renderMarkdown({
  content,
}: Pick<RenderMarkdownParams, "content">): RenderMarkdownResult {
  const cached = renderCache.get(content);
  const result =
    cached ??
    ((): RenderMarkdownResult => {
      const imageCache: RehypeImageCache = { images: [] };
      const videoCache: RehypeVideoCache = { videos: [] };
      const linkCache: RehypeLinkCache = { links: [] };
      const metadataCache: RehypeMetadataCache = {};
      const renderer = unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkFrontmatter, ["yaml"])
        .use(rehypeMetadata, { cache: metadataCache })
        .use(remarkUnwrapImages)
        .use(remarkBreaks)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize, sanitizeSchema)
        .use(rehypeInferDescriptionMeta, { truncateSize: 500 })
        .use(rehypeReact, production)
        .use(remarkMath)
        .use(rehypeKatex)
        .use(rehypeImage, { cache: imageCache })
        .use(rehypeVideo, { cache: videoCache })
        // .use(rehypeLink)
        .processSync(content);

      return {
        node: renderer.result as React.ReactNode,
        cover: imageCache.cover ?? "",
        images: imageCache.images,
        videos: videoCache.videos,
        description:
          (renderer.data.meta as { description?: string })?.description ?? "",
        links: linkCache.links,
        metadata: metadataCache,
      };
    })();

  if (!cached) {
    renderCache.set(content, result);
  }

  return result;
}

export function Markdown({ content }: RenderMarkdownParams) {
  if (content === undefined) return <div></div>;
  const markdown = renderMarkdown({ content });
  return <div className={styles.container}>{markdown.node}</div>;
}
