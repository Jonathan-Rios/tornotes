"use client";

import Link from "next/link";
import { api } from "@/lib/axios";
import { DataTableSkeleton } from "@/components/DataTable";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { ConfigForm } from "@/components/ConfigForm";
import { GearSix, PencilSimpleLine } from "@phosphor-icons/react";
import { useLocalStorage } from "@/hooks/LocalStorage";
import { ServiceDataTable } from "./ServiceDataTable";

interface SheetsData {
  columns: any[];
  rows: any[];
}

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { config, isConfigValid } = useLocalStorage();
  const [configIsVisible, setConfigIsVisible] = useState<boolean>(false);
  const [sheetsData, setSheetsData] = useState<SheetsData>();

  useEffect(() => {}, [config?.sheetId]);

  useEffect(() => {
    async function loadTornotes() {
      setIsLoading(true);
      await api
        .get(`/tornotes?sheetId=${config?.sheetId}`)
        .then((res) => {
          setSheetsData(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (!isConfigValid()) {
      setConfigIsVisible(true);
      setIsLoading(false);
    } else {
      setConfigIsVisible(false);
      loadTornotes();
    }
  }, [config?.sheetId, isConfigValid]);

  return (
    <div className="flex flex-1 flex-col items-center justify-start lg:w-[1280px] p-4 lg:p-8 w-full">
      <Header />

      <div className="flex items-center justify-end w-full gap-6 mb-6">
        {isConfigValid() && (
          <Link
            href="/register"
            className="lg:w-[200px] w-full h-12 p-4 gap-2 flex items-center justify-center bg-orange-400 rounded hover:bg-orange-300 text-zinc-900 font-bold transition-colors"
          >
            <span className="text-md">Novo registro</span>
            <PencilSimpleLine size={24} />
          </Link>
        )}

        <button
          onClick={() => setConfigIsVisible(!configIsVisible)}
          className="flex items-center justify-center h-12 p-4 font-bold transition-colors rounded bg-slate-600 hover:bg-slate-700 text-zinc-500"
        >
          <GearSix size={24} weight="fill" className="fill-white" />
        </button>
      </div>

      {configIsVisible && (
        <div className="flex w-full mb-6 ">
          <ConfigForm />
        </div>
      )}

      <div className="flex flex-col items-center justify-start w-full gap-4">
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
  );
}
