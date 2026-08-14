"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionKey = params.get("accessid");

    if (!sessionKey) return;

    async function fetchUser() {
      const res = await fetch(
        "https://sso.tech-iitb.org/project/getuserdata",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: sessionKey }),
        }
      );

      const user = await res.json();

      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        router.push("/");
      }, 300);
    }

    fetchUser();
  }, [params, router]);

  return <div className="text-white p-6">Logging in...</div>;
}
