import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tornotes",
  description: "Gerencie suas notas de serviço",
};

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "@/hooks";
import { Loading } from "@/components/Loading";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-50">
        <AppProvider>
          <div className="flex flex-col items-center justify-start min-h-screen h-max">
            {children}
          </div>

          <ToastContainer />
          <Loading />
        </AppProvider>
      </body>
    </html>
  );
}
