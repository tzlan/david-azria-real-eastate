import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import type { ListingImage } from "../../src/lib/types";

const PHOTOS_DIR = path.resolve("public/photos");
const MAX_WIDTH = 1600;
const MAX_PHOTOS = 15;

/**
 * Les URLs du CDN Facebook expirent : on télécharge, on redimensionne et on sert les photos depuis le site.
 */
export async function savePhotos(folder: string, urls: string[]): Promise<ListingImage[]> {
  const dir = path.join(PHOTOS_DIR, folder);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const images: ListingImage[] = [];
  for (const [i, url] of urls.slice(0, MAX_PHOTOS).entries()) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const file = `${i + 1}.webp`;
      const info = await sharp(Buffer.from(await res.arrayBuffer()))
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(dir, file));
      images.push({ src: `/photos/${folder}/${file}`, width: info.width, height: info.height });
    } catch (err) {
      console.warn(`  ⚠ photo ${i + 1} ignorée : ${(err as Error).message}`);
    }
  }
  return images;
}

export async function deletePhotos(folder: string): Promise<void> {
  await rm(path.join(PHOTOS_DIR, folder), { recursive: true, force: true });
}
