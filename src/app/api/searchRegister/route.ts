import { google } from 'googleapis'
import { NextResponse } from 'next/server'

type SheetForm = {
  client: string
  noteCode: string
  serviceDescription: string
  workedDate: string
  materials: string
  laborCost: string
  total: string
  payed: boolean
  imageLink: string
  sheetId: string
}

export async function GET(request: Request, response: Response) {
  try {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    const searchText = searchParams.get('searchText')
    const sheetId = searchParams.get('sheetId')

    if (searchText && sheetId) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // replace escaped newlines
        },
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      })

      const sheets = google.sheets({ version: 'v4', auth })

      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId || '',
        range: 'A:J',
      })

      if (!data.values) {
        return NextResponse.json({ error: 'No data found.' })
      }

      const columns = data.values.shift() || []

      const headers = [
        {
          accessorKey: 'date',
          hidden: true,
        },
        {
          accessorKey: 'noteCode',
        },
        {
          accessorKey: 'client',
        },
        {
          accessorKey: 'serviceDescription',
        },
        {
          accessorKey: 'workedDate',
        },
        {
          accessorKey: 'materials',
        },
        {
          accessorKey: 'laborCost',
        },
        {
          accessorKey: 'total',
        },
        {
          accessorKey: 'payed',
        },
        {
          accessorKey: 'imageLink',
        },
      ]

      const formattedColumns = headers.map((column, index) => {
        return {
          ...column,
          header: columns[index],
        }
      })

      data.values.sort((a, b) => {
        const dateA = new Date(a[0]).getTime() // Assumindo que a data está na primeira coluna (índice 0)
        const dateB = new Date(b[0]).getTime()

        return dateB - dateA // Ordenar em ordem decrescente com base na data
      })

      const searchRegExp = new RegExp(searchText, 'i') // 'i' para corresponder a maiúsculas e minúsculas

      // Filtre as linhas que contenham o texto pesquisado em qualquer coluna
      const filteredRows = data.values.filter((row) => {
        return row.some((cell) => searchRegExp.test(cell))
      })

      const formattedRows = filteredRows.map((row) => {
        const formattedRow: any = {}

        row.forEach((cell, index) => {
          const column = formattedColumns[index]

          formattedRow[column.accessorKey] = cell
        })

        return formattedRow
      })

      return NextResponse.json({
        columns: formattedColumns,
        rows: formattedRows,
      })
    } else {
      return NextResponse.json({ error: 'Parameters not found' })
    }
  } catch (error) {
    return NextResponse.json({ error })
  }
}
