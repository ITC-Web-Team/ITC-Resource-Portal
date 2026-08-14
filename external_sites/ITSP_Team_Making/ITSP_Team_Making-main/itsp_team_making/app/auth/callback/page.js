"use client";

import { Suspense } from "react";
import CallbackInner from "./CallbackInner";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading...</div>}>
      <CallbackInner />
    </Suspense>
  );
}