import { Root } from "mdast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { ipfsLinkToHttpLink } from "../../../utils/ipfs";

export type RehypeVideoCache = {
  videos: string[];
};

export const rehypeVideo: Plugin<Array<{ cache: RehypeVideoCache }>, Root> =
  (config) => (tree: Root) => {
    const cache = config?.cache ?? { videos: [] };

    visit(tree, { tagName: "video" }, (node, index, parent) => {
      processVideoNode(node, cache, index, parent);
    });
  };

function processVideoNode(node: any, cache: any, index: any, parent: any) {
  if (node.children) {
    node.children.forEach((child: any) => {
      if (child.tagName === "source" && child.properties) {
        const videoUrl = getUrl(child.properties.src);
        if (videoUrl) {
          cache.videos.push(videoUrl);
          // Temporarily set the video source to a 1 second clip to get the video thumbnail
          child.properties.src = videoUrl + "#t=1.0";
          node.properties.controls = true;
          node.properties.preload = "metadata";
          node.properties.muted = true;
          node.properties.style =
            "width: 100%; max-height: 640px; border-radius: 8px;";
          // Wrap the video node with a div so its width fits the container
          const divNode = {
            type: "element",
            tagName: "div",
            children: [node],
          };

          if (parent && parent.children && typeof index === "number") {
            parent.children[index] = divNode;
          }
        }
      }
    });
  }
}

function getUrl(src: unknown): string {
  const url = typeof src === "string" && src ? src : "";
  return ipfsLinkToHttpLink(url);
}
