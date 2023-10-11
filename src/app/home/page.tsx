'use client'

import Link from 'next/link'
import { api } from '@/lib/axios'
import { DataTableSkeleton } from '@/components/DataTable'
import { Header } from '@/components/Header'
import { useEffect, useState } from 'react'
import { ConfigForm } from '@/components/ConfigForm'
import {
  GearSix,
  PencilSimpleLine,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { useLocalStorage } from '@/hooks/LocalStorage'
import { ServiceDataTable } from './ServiceDataTable'
import { TextField } from '@/components/TextField'

interface SheetsData {
  columns: any[]
  rows: any[]
}

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { config, isConfigValid } = useLocalStorage()
  const [configIsVisible, setConfigIsVisible] = useState<boolean>(false)
  const [sheetsData, setSheetsData] = useState<SheetsData>()

  useEffect(() => {
    async function loadTornotes() {
      setIsLoading(true)
      await api
        .get(`/tornotes?sheetId=${config?.sheetId}`)
        .then((res) => {
          setSheetsData(res.data)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    if (!isConfigValid()) {
      setConfigIsVisible(true)
      setIsLoading(false)
    } else {
      setConfigIsVisible(false)
      loadTornotes()
    }
  }, [config?.sheetId, isConfigValid])

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-start p-4 lg:w-[1280px] lg:p-8">
      <Header />

      {/*       <div className="mb-6 flex w-full items-end gap-6">
        <TextField
          label="Pesquisar"
          placeholder="Pesquisar"
          className="flex w-full "
        />

        <button
          onClick={() => setConfigIsVisible(!configIsVisible)}
          className="flex h-10 items-center justify-center rounded bg-slate-600 p-4 font-bold text-zinc-500 transition-colors hover:bg-slate-700"
        >
          <MagnifyingGlass size={24} weight="fill" className="fill-white" />
        </button>
      </div> */}

      <div className="mb-6 flex w-full items-center justify-end gap-6">
        {isConfigValid() && (
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center gap-2 rounded bg-orange-400 p-4 font-bold text-zinc-900 transition-colors hover:bg-orange-300 lg:w-[200px]"
          >
            <span className="text-md">Novo registro</span>
            <PencilSimpleLine size={24} />
          </Link>
        )}

        <button
          onClick={() => setConfigIsVisible(!configIsVisible)}
          className="flex h-12 items-center justify-center rounded bg-slate-600 p-4 font-bold text-zinc-500 transition-colors hover:bg-slate-700"
        >
          <GearSix size={24} weight="fill" className="fill-white" />
        </button>
      </div>

      {configIsVisible && (
        <div className="mb-6 flex w-full ">
          <ConfigForm />
        </div>
      )}

      <div className="flex w-full flex-col items-center justify-start gap-4">
        <div className="w-full">
          {isLoading ? (
            <DataTableSkeleton />
          ) : config?.sheetId && sheetsData ? (
            <ServiceDataTable data={sheetsData} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
