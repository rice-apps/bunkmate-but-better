import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const getImagePublicUrl = (bucketName:string, fullPath:string) => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/render/image/public/${bucketName}/${fullPath}`;
};

export const getBlurImage = (fullSrc: string) => {
  return `${fullSrc}?w=128&h=128&quality=20`;
}
