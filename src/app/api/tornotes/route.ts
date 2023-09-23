import { google } from "googleapis";
import { NextResponse } from "next/server";

type SheetForm = {
  client: string;
  noteCode: string;
  serviceDescription: string;
  workedDate: string;
  materials: string;
  laborCost: string;
  total: string;
  payed: boolean;
  imageLink: string;
  sheetId: string;
};

export async function POST(request: Request, response: Response) {
  const body = (await request.json()) as SheetForm;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // replace escaped newlines
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: body.sheetId,
      range: "A1:J1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            body.noteCode,
            body.client,
            body.serviceDescription,
            body.workedDate,
            body.materials,
            body.laborCost,
            body.total,
            body.payed ? "Sim" : "Não",
            body.imageLink || "Imagem não enviada",
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function GET(request: Request, response: Response) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const sheetId = searchParams.get("sheetId");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // replace escaped newlines
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId || "",
      range: "A:J",
    });

    if (!data.values) {
      return NextResponse.json({ error: "No data found." });
    }

    const columns = data.values.shift() || [];

    const headers = [
      {
        accessorKey: "date",
        hidden: true,
      },
      {
        accessorKey: "noteCode",
      },
      {
        accessorKey: "client",
      },
      {
        accessorKey: "serviceDescription",
      },
      {
        accessorKey: "workedDate",
      },
      {
        accessorKey: "materials",
      },
      {
        accessorKey: "laborCost",
      },
      {
        accessorKey: "total",
      },
      {
        accessorKey: "payed",
      },
      {
        accessorKey: "imageLink",
      },
    ];

    const formattedColumns = headers.map((column, index) => {
      return {
        ...column,
        header: columns[index],
      };
    });

    data.values.sort((a, b) => {
      const dateA = new Date(a[0]).getTime(); // Assumindo que a data está na primeira coluna (índice 0)
      const dateB = new Date(b[0]).getTime();

      return dateB - dateA; // Ordenar em ordem decrescente com base na data
    });

    // const rows = data.values.slice(0, data.values.length);
    const rows = data.values.slice(0, 10); // Limitar a 10 linhas

    const formattedRows = rows.map((row) => {
      const formattedRow: any = {};

      row.forEach((cell, index) => {
        const column = formattedColumns[index];

        formattedRow[column.accessorKey] = cell;
      });

      return formattedRow;
    });

    return NextResponse.json({
      columns: formattedColumns,
      rows: formattedRows,
    });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
