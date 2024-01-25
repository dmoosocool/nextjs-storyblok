import { getHomePageData } from "@/modules/storyblok/api";
import { draftMode } from "next/headers";

export default async function Home() {
  const data = await getHomePageData();
  return (
    <div className="flex flex-col">
      <div>DraftMode: {draftMode().isEnabled ? "true" : "false"}</div>
      {data?.story.content.title && <h1>{data.story.content.title}</h1>}
      {data?.story.content.description && (
        <p>{data.story.content.description}</p>
      )}
    </div>
  );
}
