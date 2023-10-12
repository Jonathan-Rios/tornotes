import { DataTable } from '@/components/DataTable'
import { Eye, MagnifyingGlass } from '@phosphor-icons/react'

interface ServiceDataTableProps {
  data: {
    columns: any[]
    rows: any[]
  }
}

export function ServiceDataTable({ data }: ServiceDataTableProps) {
  const { columns, rows } = data

  const columnTranslations = {
    date: 'Registro',
    noteCode: 'Código da Nota',
    client: 'Cliente',
    serviceDescription: 'Descrição do Serviço',
    workedDate: 'Data de Realização',
    materials: 'Materiais',
    laborCost: 'Mão de obra',
    total: 'Total',
    payed: 'Pago',
    imageLink: 'Link da Imagem',
    actions: 'Ações',
  }

  const formattedColumns = [
    ...columns.map((column) => {
      return {
        ...column,
        header: () => (
          <div className={column.align || 'text-left'}>{column.header}</div>
        ),
        cell: ({ row }: { row: any }) => (
          <div className={column.align || 'text-left'}>
            {row.original[column.accessorKey]}
          </div>
        ),
      }
    }),
    {
      header: () => <div className="text-center">Visualizar</div>,
      accessorKey: 'actions',
      cell: () => (
        <div className="text-center">
          <button className="group">
            <MagnifyingGlass
              size={24}
              weight="bold"
              className="fill-indigo-400 transition ease-in group-hover:fill-indigo-300"
            />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      {columns && rows ? (
        <DataTable
          columns={formattedColumns}
          data={rows}
          hiddenColumns={{
            date: false,
            materials: false,
            laborCost: false,
            total: false,
            noteCode: false,
            imageLink: false,
            payed: false,
          }}
          columnTranslations={columnTranslations}
        />
      ) : (
        <></>
      )}
    </>
  )
}
