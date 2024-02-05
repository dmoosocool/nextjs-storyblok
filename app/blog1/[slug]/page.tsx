import { Markdown } from "@/app/[components]/rehype/markdown";
import React from "react";
interface IBlogPageProps {
  params: {
    slug: string;
  };
}
const page = async ({ params }: IBlogPageProps) => {
  const slug = `blog/${params.slug}`;
  const resp = await fetch(
    `https://api-us.storyblok.com/v1/cdn/stories/${slug}?token=${
      process.env.STORYBLOK_PREVIEW_TOKEN
    }&version=draft&cv=${Math.floor(Date.now() / 1000)}`
  );

  const data = await resp.json();

  // console.log(data);
  return (
    <div>
      <p>
        Slug: <strong>{slug}</strong>
      </p>
      <h1 className="text-5xl">{data.story.content.title}</h1>
      <p>{data.story.content.description}</p>
      <Markdown content={data.story.content.normalMarkdown} />
    </div>
  );
};

export default page;
