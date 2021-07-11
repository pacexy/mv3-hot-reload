export enum Message {
  FileChange = 'file-change',
  Reload = 'reload',
}

export const isDev = process.env.NODE_ENV === 'development'

export const PORT = process.env.MV3_HOT_RELOAD_PORT ?? 9012
