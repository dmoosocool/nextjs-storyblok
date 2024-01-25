import { draftMode } from "next/headers";

const baseUrl = "https://api-us.storyblok.com/v2/cdn";

const getAuthParams = () => {
  const { isEnabled } = draftMode();
  const token = isEnabled
    ? process.env.STORYBLOK_PREVIEW_TOKEN
    : process.env.STORYBLOK_PUBLIC_TOKEN;

  const params = new URLSearchParams();
  params.append("token", token ?? "");
  params.append("version", isEnabled ? "draft" : "published");
  return params;
};

export const getPost = async (slug: string) => {};

export const getPosts = async () => {
  const authParams = getAuthParams();
  console.log(authParams);
  // const token = getToken();
  // const url = `${baseUrl}/stories?token=${token}&starts_with=posts&version=published`;
  return authParams;
};

interface IStoryblokOriginalContentProps {
  _uid: string;
}
interface IHomePageData extends IStoryblokOriginalContentProps {
  title?: string;
  description?: string;
}

interface IHomePageDataResponse {
  story: {
    name: string;
    created_at: string;
    published_at: string;
    uuid: string;
    id: number;
    slug: string;
    full_slug: string;
    sort_by_date: string | null;
    tag_list: string[];
    is_startpage: boolean;
    parent_id: number;
    group_id: string;
    first_published_at: string;
    content: IHomePageData;
  };
  cv: string;
  rels: any[];
  links: string[];
}

export const getHomePageData = async (): Promise<
  IHomePageDataResponse | undefined
> => {
  const authParams = getAuthParams();

  // console.log(authParams);
  const url = new URL(`${baseUrl}/stories/home?${authParams.toString()}`);
  const resp = await fetch(url.href, { next: { tags: ["home"] } });
  if (resp.ok) {
    const data = (await resp.json()) as IHomePageDataResponse;
    return data;
  }
  return undefined;
};
