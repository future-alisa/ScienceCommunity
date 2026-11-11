"use client";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserDispatchContext } from "@/context/UserContext";
import { finishOAuth } from "@/services/OAuthService";

export default function OAuthCallback() {
  const dispatch = useContext(UserDispatchContext);
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (started.current || !dispatch) return;
    started.current = true;
    const query = new URLSearchParams(window.location.search);
    window.history.replaceState(null, "", window.location.pathname);
    void finishOAuth(query).then(({ token, username }) => {
      dispatch({ type: "Login", user: { name: username, token, email: "", communityId: "", state: "Online" } });
      router.replace("/community");
    }).catch((failure) => setError(failure instanceof Error ? failure.message : "登录失败"));
  }, [dispatch, router]);
  return <main style={{ padding: "3rem" }}>
    <h1>Alisa 授权登录</h1>
    {error ? <><p role="alert">{error}</p><Link href="/signin">返回登录</Link></> : <p role="status">正在确认登录身份…</p>}
  </main>;
}
