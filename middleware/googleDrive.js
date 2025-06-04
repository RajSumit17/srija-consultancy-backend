import { google } from 'googleapis';
import { PassThrough } from 'stream';
import { config } from 'dotenv';
config()

const auth = new google.auth.GoogleAuth({
  keyFile: 'key_path_service_account.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const uploadToDrive = async (fileBuffer, fileName, mimeType, folderId) => {
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName,
    parents: [process.env.FOLDER_ID],
  };

  const bufferStream = new PassThrough();
  bufferStream.end(fileBuffer); // ✅ Push the buffer into the stream

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: mimeType,
      body: bufferStream,
    },
    fields: 'id',
  });

  const fileId = response.data.id;

  // Make the file public
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Get sharable URL
  const result = await drive.files.get({
    fileId,
    fields: 'webViewLink',
  });

  return result.data.webViewLink;
};
