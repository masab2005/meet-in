"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session check

    if (session) {
      router.replace("/home");
    } else {
      router.replace("/landing");
    }
  }, [session, status, router]);

  return null; // Nothing to render, just redirect
}
