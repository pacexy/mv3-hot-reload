export enum Message {
  FileChange = 'file-change',
  Reload = 'reload',
}

const envs = ['development']
const getEnvs = () => {
  if (
    process.env.MV3_HOT_RELOAD_DEV_ENVS &&
    Array.isArray(process.env.MV3_HOT_RELOAD_DEV_ENVS)
  ) {
    envs.push(...process.env.MV3_HOT_RELOAD_DEV_ENVS)
  }
  return envs
}

export const isDev = getEnvs().includes(process.env.NODE_ENV as string)
export const PORT = process.env.MV3_HOT_RELOAD_PORT ?? 9012
