"use client";
import { ImgHTMLAttributes, useEffect, useState } from "react";
import { resolveStorageUrl } from "@/services/StorageUrlCache";

export function useStorageResource(source: string) {
  const [resolved, setResolved] = useState({ source: "", url: "", error: false, expiresAt: 0 });
  const managed = /\/attachments\/(?:covers|[a-fA-F0-9]{32})\/[a-f0-9]{32}\.[a-z0-9]{1,8}$/.test(source);
  useEffect(() => {
    if (!managed) return;
    let active = true;
    const load = () => resolveStorageUrl(source)
      .then(url => { if (active) setResolved({ source, url, error: !url, expiresAt: Date.now() + 60 * 1000 }); })
      .catch(() => { if (active) setResolved(previous => previous.source === source && previous.url && previous.expiresAt > Date.now()
        ? previous : { source, url: "", error: true, expiresAt: 0 }); });
    load();
    const timer = setInterval(load, 60 * 1000);
    return () => { active = false; clearInterval(timer); };
  }, [source, managed]);
  if (!source) return { url: "", status: "empty" as const };
  if (!managed) return { url: source, status: "ready" as const };
  if (resolved.source !== source) return { url: "", status: "loading" as const };
  return { url: resolved.url, status: resolved.error ? "error" as const : "ready" as const };
}

export function useStorageUrl(source: string) {
  return useStorageResource(source).url;
}

export default function StorageImage({ src = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const url = useStorageUrl(src);
  return <img {...props} src={url || undefined} />;
}
