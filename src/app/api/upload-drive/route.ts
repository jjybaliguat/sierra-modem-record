import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import fs from 'fs';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

auth.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN})

const drive = google.drive({
  version: 'v3',
  auth,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer: any = Buffer.from(bytes);

    // Save to a temporary file
    const tempFilePath = path.join(os.tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    const uploadRes = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: ['1MvyMSG64BPEYdXUNpNs7a4tyoF9Lk3V-'], // replace with your Drive folder ID
      },
      media: {
        body: fs.createReadStream(tempFilePath),
      },
    });

    const fileId = uploadRes.data.id;

    if (!fileId) {
    throw new Error("File ID is undefined after upload.");
    }
    // Make the uploaded file public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get file URL
    const result = await drive.files.get({
      fileId,
      fields: 'id, webViewLink, webContentLink',
    });

    // Clean up temp file
    await unlink(tempFilePath);

    return NextResponse.json(result.data, { status: 200 });
  } catch (err: any) {
    console.error('Upload Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}