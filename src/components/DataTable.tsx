'use client'

import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { SlidersHorizontal } from '@phosphor-icons/react'
import { Skeleton } from './ui/skeleton'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  hiddenColumns?: {
    [key: string]: boolean
  }
  columnTranslations?: {
    [key: string]: string
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hiddenColumns = {},
  columnTranslations,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(hiddenColumns)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex w-full items-end justify-between">
        <h1 className="m-2 text-lg font-semibold text-primary-foreground">
          Últimos registros
        </h1>

        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="ml-auto h-12 w-32 gap-2 rounded bg-indigo-500 font-bold hover:bg-indigo-400"
              >
                Colunas
                <SlidersHorizontal size={24} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnName = column.id
                  const translatedColumnName = columnTranslations
                    ? columnTranslations[columnName]
                    : columnName // Usar o nome original se não houver tradução

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {translatedColumnName}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded border-[2px] border-slate-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-none text-xs font-bold uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-none"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'text-md bg-transparent text-slate-200',
                        index % 2 === 0 && 'bg-zinc-800',
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function DataTableSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Skeleton className="ml-auto h-12 w-32 rounded-sm bg-slate-600" />
      <Skeleton className="h-[400px] w-full rounded-sm bg-slate-600" />
    </div>
  )
}
