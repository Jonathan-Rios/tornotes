import './globals.css'
import type { Metadata } from 'next'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from '@/hooks'
import { Loading } from '@/components/Loading'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Tornotes',
  description: 'Gerencie suas notas de serviço',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-50">
        <AppProvider>
          <div className="flex h-max min-h-screen flex-col items-center justify-start">
            {children}
          </div>

          <ToastContainer />
          <Loading />
        </AppProvider>
      </body>
    </html>
  )
}
