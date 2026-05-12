import { google } from 'googleapis'
import { Readable } from 'stream'
import { getDriveAuthClient } from './auth'

function getDrive() {
  return google.drive({ version: 'v3', auth: getDriveAuthClient() })
}

async function findFolder(name: string, parentId: string): Promise<string | null> {
  const drive = getDrive()
  const escaped = name.replace(/'/g, "\\'")
  const res = await drive.files.list({
    q: `name='${escaped}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
    fields: 'files(id)',
    spaces: 'drive',
  })
  return res.data.files?.[0]?.id ?? null
}

async function createFolder(name: string, parentId: string): Promise<string> {
  const drive = getDrive()
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  })
  return res.data.id!
}

async function ensureFolder(name: string, parentId: string): Promise<string> {
  const existing = await findFolder(name, parentId)
  if (existing) return existing
  return createFolder(name, parentId)
}

/**
 * Resolves/creates a nested folder path inside the configured root Drive folder.
 * Returns the leaf folder ID.
 */
export async function ensureFolderPath(segments: string[]): Promise<string> {
  const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID
  if (!rootId) throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID not configured in .env.local')

  let parentId = rootId
  for (const seg of segments) {
    parentId = await ensureFolder(seg, parentId)
  }
  return parentId
}

export async function searchReportFiles(): Promise<{
  id: string
  name: string
  webViewLink?: string
  createdTime?: string
}[]> {
  const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID
  if (!rootId) return []
  const drive = getDrive()
  const res = await drive.files.list({
    q: `name contains 'Reporte' and mimeType='text/plain' and '${rootId}' in ancestors and trashed=false`,
    fields: 'files(id,name,webViewLink,createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 24,
  })
  return (res.data.files ?? []).map(f => ({
    id:          f.id!,
    name:        f.name!,
    webViewLink: f.webViewLink ?? undefined,
    createdTime: f.createdTime ?? undefined,
  }))
}

export async function uploadFile(params: {
  parentId: string
  fileName: string
  mimeType: string
  contentBase64: string
}): Promise<{ id: string; webViewLink?: string }> {
  const drive = getDrive()
  const buffer = Buffer.from(params.contentBase64, 'base64')

  const res = await drive.files.create({
    requestBody: {
      name: params.fileName,
      parents: [params.parentId],
    },
    media: {
      mimeType: params.mimeType,
      body: Readable.from(buffer),
    },
    fields: 'id,webViewLink',
  })
  return { id: res.data.id!, webViewLink: res.data.webViewLink ?? undefined }
}
