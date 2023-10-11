import { google } from 'googleapis'
import { NextResponse } from 'next/server'

type SheetForm = {
  sheetId: string
}

export async function POST(request: Request, response: Response) {
  const body = (await request.json()) as SheetForm

  try {
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

    await sheets.spreadsheets.values.update({
      spreadsheetId: body.sheetId,
      range: 'A1', // Célula que você deseja limpar
      valueInputOption: 'RAW', // Você pode usar "RAW" ou "USER_ENTERED" dependendo do seu caso
      requestBody: {
        values: [
          [''], // Valor vazio para limpar a célula
        ],
      },
    })

    await sheets.spreadsheets.values.append({
      spreadsheetId: body.sheetId,
      range: 'A1', // Altere para A1
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            'Registro',
            'Código da Nota',
            'Cliente',
            'Descrição de Serviço',
            'Data de Realização',
            'Materiais',
            'Mão de obra',
            'Total',
            'Foi pago?',
            'Imagem',
          ],
        ],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('-error:', error)
    return NextResponse.json({ success: false })
  }
}
