"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Importer dynamiquement le composant HomePageWrapper pour éviter les erreurs SSR
const HomePageWrapper = dynamic(() => import('../components/HomePageWrapper'), {
  ssr: false,
  loading: () => <LoadingComponent />
});

// Composant de chargement simple
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#6BAED6] to-indigo-200">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-indigo-900">Chargement de SyndicManager...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <HomePageWrapper />
    </Suspense>
  );
}
