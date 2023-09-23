import { google } from "googleapis";
import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises"; // Usando o fs/promises para promisify as operações de sistema de arquivos
import { createReadStream, writeFile } from "node:fs";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { Readable } from "node:stream";

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const generatedFileName: string = data.get("generatedFileName") as string;
    const folderId: string = data.get("folderId") as string;
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = path.extname(file.name);

    const fileUploadName = `${generatedFileName}${extension}`;

    const fileMetadata = {
      name: fileUploadName,
      parents: [folderId],
    };

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // replace escaped newlines
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Criar um fluxo a partir do buffer
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const media = {
      mimeType: file.type,
      body: stream, // Usar o fluxo como corpo do arquivo
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "webViewLink",
    });

    return NextResponse.json({
      link: response?.data?.webViewLink,
    });
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo no Google Drive:", error);
    throw error;
  }
}
