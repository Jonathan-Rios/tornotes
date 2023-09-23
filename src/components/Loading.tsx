"use client";

import { useLoading } from "@/hooks/Loading";

interface ILoadingProps {
  forceShow?: boolean;
}

export function Loading({ forceShow = false }) {
  const { isLoading } = useLoading();

  if (forceShow || isLoading) {
    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="w-16 h-16 border-t-4 border-solid rounded-full border-slate-200 animate-spin">
          <div className="w-16 h-16 border-t-4 border-solid rounded-full border-slate-200 animate-spin"></div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
