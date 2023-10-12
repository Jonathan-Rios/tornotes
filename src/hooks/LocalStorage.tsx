'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface LocalStorageProviderProps {
  children: React.ReactNode
}

interface Config {
  sheetId: string
  folderId: string
}

interface LocalStorageContextData {
  config: Config | null
  saveLocalStorageConfig(data: Config): void

  saveLocalStorageAcceptTerm(): void
  getLocalStorageAcceptTerm(): boolean
  loadLocalStorageConfig(): void

  isConfigValid(): boolean
}

const LocalStorageContext = createContext<LocalStorageContextData>(
  {} as LocalStorageContextData,
)

const LocalStorageProvider: React.FC<LocalStorageProviderProps> = ({
  children,
}) => {
  const loadLocalStorageConfig = useCallback(() => {
    const configs = getLocalStorageConfig()

    if (configs) {
      setConfig(configs)
    }
  }, [])

  useEffect(() => {
    loadLocalStorageConfig()
  }, [loadLocalStorageConfig])

  const [config, setConfig] = useState<Config | null>(null)

  function getLocalStorageConfig() {
    const configs = JSON.parse(localStorage.getItem('@Tornotes:config') || '{}')

    return configs
  }

  function isConfigValid() {
    if (!config?.folderId || !config?.sheetId) {
      return false
    }

    return true
  }

  function saveLocalStorageConfig(data: Config) {
    localStorage.setItem('@Tornotes:config', JSON.stringify(data))
  }

  function getLocalStorageAcceptTerm() {
    const configs = JSON.parse(localStorage.getItem('@Tornotes:term') || '{}')

    return configs?.accept || false
  }

  function saveLocalStorageAcceptTerm() {
    localStorage.setItem('@Tornotes:term', JSON.stringify({ accept: true }))
  }

  return (
    <LocalStorageContext.Provider
      value={{
        saveLocalStorageConfig,
        config,

        saveLocalStorageAcceptTerm,
        getLocalStorageAcceptTerm,

        loadLocalStorageConfig,
        isConfigValid,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  )
}

function useLocalStorage(): LocalStorageContextData {
  const context = useContext(LocalStorageContext)

  if (!context) {
    throw new Error(
      'useLocalStorage must be used within a LocalStorageProvider',
    )
  }

  return context
}

export { LocalStorageProvider, useLocalStorage }
