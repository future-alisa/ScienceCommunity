"use client";
import { CSSProperties, useState } from "react";
import { useStorageResource } from "@/components/storage-image";

type Props = { src?: string; title: string; description?: string; kind?: "community" | "document"; style?: CSSProperties; className?: string; priority?: boolean };
export function coverTheme(text: string) {
  if (/数学|高数|极限|导数|积分|微分|级数|向量|calculus/i.test(text)) return { bg: "#e8efe9", ink: "#325d4a", label: "MATHEMATICS", symbol: "∫" };
  if (/物理|力学|量子|physics/i.test(text)) return { bg: "#e9edf5", ink: "#435f86", label: "PHYSICS", symbol: "λ" };
  if (/计算机|算法|编程|computer/i.test(text)) return { bg: "#eae9f0", ink: "#635575", label: "COMPUTER SCIENCE", symbol: "⌘" };
  if (/生物|生命/i.test(text)) return { bg: "#e8efe7", ink: "#576f47", label: "LIFE SCIENCES", symbol: "ψ" };
  if (/化学|分子/i.test(text)) return { bg: "#f3ece2", ink: "#8c6846", label: "CHEMISTRY", symbol: "Δ" };
  return { bg: "#edf0ed", ink: "#52665a", label: "SCIENCE COMMUNITY", symbol: "∞" };
}

export default function CoverImage({ src = "", title, description = "", kind = "document", style, className, priority = false }: Props) {
  const { url, status } = useStorageResource(src);
  const [failed, setFailed] = useState("");
  const [loadedSource, setLoadedSource] = useState("");
  const theme = coverTheme(title + " " + description);
  const sizing: CSSProperties = { display: "block", width: "100%", aspectRatio: "2 / 1", objectFit: "cover", ...style };
  if (src && status !== "error" && (!url || failed !== url)) return <span className={className}
    style={{ ...sizing, position: "relative", overflow: "hidden", background: "var(--surface-soft, #f1f3f2)" }}
    role={loadedSource === src ? undefined : "img"} aria-label={loadedSource === src ? undefined : `${title}封面加载中`} aria-busy={loadedSource !== src}>
    {url && <img src={url} alt={`${title}封面`} loading={priority ? "eager" : "lazy"} decoding="async" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, opacity: loadedSource === src ? 1 : 0 }}
      onLoad={() => setLoadedSource(src)} onError={() => setFailed(url)} />}
  </span>;
  return <svg className={className} role="img" aria-label={`${title}默认封面`} viewBox="0 0 1200 600" style={sizing}>
    <rect width="1200" height="600" fill={theme.bg} />
    <g stroke={theme.ink} opacity=".07" strokeWidth="1">
      {[200,300,400,500,600,700,800,900,1000,1100].map(x => <path key={x} d={`M${x} 0V600`} />)}
      {[100,200,300,400,500].map(y => <path key={y} d={`M0 ${y}H1200`} />)}
    </g>
    <circle cx="965" cy="270" r="215" fill="none" stroke={theme.ink} opacity=".13" />
    <circle cx="965" cy="270" r="162" fill="none" stroke={theme.ink} opacity=".08" />
    <path d="M690 435C790 435 765 210 890 225S1020 430 1200 110" fill="none" stroke={theme.ink} strokeWidth="4" opacity=".32" />
    <text x="877" y="385" fill={theme.ink} opacity=".22" fontFamily="Georgia,serif" fontSize="250">{theme.symbol}</text>
    <rect x="72" y="76" width="36" height="5" rx="2" fill={theme.ink} />
    <text x="72" y="130" fill={theme.ink} fontFamily="sans-serif" fontSize="21" letterSpacing="4">{theme.label}</text>
    <text x="68" y="325" fill={theme.ink} fontFamily="Georgia,serif" fontSize="104">{kind === "community" ? "Explore." : title.match(/^\d{2}/)?.[0] || "Read."}</text>
    <text x="72" y="400" fill={theme.ink} fontFamily="sans-serif" fontSize="34">{title.length > 18 ? title.slice(0,17) + "…" : title}</text>
    <text x="72" y="530" fill={theme.ink} opacity=".65" fontFamily="sans-serif" fontSize="17" letterSpacing="3">{kind === "community" ? "LEARN · CONNECT · DISCOVER" : "FOUNDATIONS · IDEAS · KNOWLEDGE"}</text>
  </svg>;
}
