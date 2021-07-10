export enum Message {
  FileChange = 'file-change',
  Reload = 'reload',
}

export const isDev = process.env.NODE_ENV === 'development'
