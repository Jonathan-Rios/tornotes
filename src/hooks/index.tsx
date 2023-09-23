import React from "react";

import { LocalStorageProvider } from "./LocalStorage";
import { LoadingProvider } from "./Loading";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <LoadingProvider>
    <LocalStorageProvider>{children}</LocalStorageProvider>
  </LoadingProvider>
);
