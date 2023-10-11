import { DataTable } from '@/components/DataTable'

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
  }

  return (
    <>
      {columns && rows ? (
        <DataTable
          columns={columns}
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

{
  /* <h2 className="my-40 font-bold text-center text-white">
          Nenhum registro encontrado. <br /> Por favor, verifique se a planilha
          está corretamente configurada.
        </h2> */
}
