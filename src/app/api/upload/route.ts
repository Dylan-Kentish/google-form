import { Readable } from 'stream';

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env.mjs';

type File = Blob & {
  name: string;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const driveService = google.drive({ version: 'v3', auth });

    const stream = new Readable();
    stream.push(Buffer.from(await file.arrayBuffer()));
    stream.push(null);

    const response = await driveService.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    if (!response.data.id) {
      console.error(response);
      throw new Error('Failed to upload file');
    }

    return NextResponse.json({ fileId: response.data.id });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
