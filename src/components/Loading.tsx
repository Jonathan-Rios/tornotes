'use client'

import { useLoading } from '@/hooks/Loading'

interface ILoadingProps {
  forceShow?: boolean
}

export function Loading({ forceShow = false }) {
  const { isLoading } = useLoading()

  if (forceShow || isLoading) {
    return (
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-slate-200">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-slate-200"></div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
