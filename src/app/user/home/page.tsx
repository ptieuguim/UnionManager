"use client";

import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

// Import dynamique avec ssr=false pour éviter le rendu côté serveur
const AcceuilSection = dynamic(
  () => import("@/components/HomePage/AcceuilSection").then(mod => mod.AcceuilSection),
  { ssr: false, loading: () => <div className="flex items-center justify-center min-h-screen">Chargement...</div> }
);

export default function UserHomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
      <AcceuilSection />
    </Suspense>
  );
}
