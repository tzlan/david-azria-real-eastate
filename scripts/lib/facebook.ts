import { z } from "zod";

const ImageSchema = z.object({ src: z.string().url(), width: z.number(), height: z.number() });
const MediaSchema = z.object({ image: ImageSchema.optional() }).optional();

const AttachmentSchema = z.object({
  media_type: z.string().optional(),
  media: MediaSchema,
  subattachments: z.object({ data: z.array(z.object({ media_type: z.string().optional(), media: MediaSchema })) }).optional(),
});

export const FbPostSchema = z.object({
  id: z.string(),
  message: z.string().optional(),
  created_time: z.string(),
  updated_time: z.string(),
  permalink_url: z.string().url(),
  attachments: z.object({ data: z.array(AttachmentSchema) }).optional(),
});
export type FbPost = z.infer<typeof FbPostSchema>;

const PageSchema = z.object({
  data: z.array(FbPostSchema),
  paging: z.object({ next: z.string().url().optional() }).optional(),
});

const FIELDS = [
  "id",
  "message",
  "created_time",
  "updated_time",
  "permalink_url",
  "attachments{media_type,media{image{src,width,height}},subattachments.limit(30){media_type,media{image{src,width,height}}}}",
].join(",");

/** Récupère les posts publiés de la Page (les plus récents d'abord). */
export async function fetchPagePosts(opts: { pageId: string; token: string; version: string; maxPosts: number }): Promise<FbPost[]> {
  const url = new URL(`https://graph.facebook.com/${opts.version}/${opts.pageId}/posts`);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("limit", "50");
  url.searchParams.set("access_token", opts.token);

  const posts: FbPost[] = [];
  let next: string | undefined = url.toString();
  while (next && posts.length < opts.maxPosts) {
    const res: Response = await fetch(next);
    const body: unknown = await res.json();
    if (!res.ok) {
      const msg = (body as { error?: { message?: string } }).error?.message ?? res.statusText;
      throw new Error(`Graph API ${res.status} : ${msg}`);
    }
    const page = PageSchema.parse(body);
    posts.push(...page.data);
    next = page.paging?.next;
  }
  return posts.slice(0, opts.maxPosts);
}

/** URLs des photos du post, dans l'ordre, sans doublons. */
export function postImageUrls(post: FbPost): string[] {
  const urls: string[] = [];
  for (const a of post.attachments?.data ?? []) {
    const subs = a.subattachments?.data ?? [];
    if (subs.length) {
      for (const s of subs) if (s.media_type !== "video" && s.media?.image) urls.push(s.media.image.src);
    } else if (a.media_type !== "video" && a.media?.image) {
      urls.push(a.media.image.src);
    }
  }
  return [...new Set(urls)];
}
