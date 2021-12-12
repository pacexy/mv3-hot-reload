#!/usr/bin/env node
/* eslint-disable no-console */

import chokidar from 'chokidar'
import WebSocket = require('ws')
import debounce from 'lodash/debounce'
import path from 'path'
import { Message } from '../src/utils'

interface Config {
  port?: number
  directory?: string
  exclude?: string[]
}

let port = 9012
let directory = 'dist'
let exclude: string[] = []
const quiet = !!process.env.QUIET

try {
  const CONFIG_PATH = path.resolve('mv3-hot-reload.config.js')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config: Config = require(CONFIG_PATH)

  port = config.port || port
  directory = config.directory || directory
  exclude = config.exclude || exclude
} catch (err) {
  // ignore
}

const directoryPath = path.resolve(directory)
const excludePaths = exclude.map((file) => path.join(directoryPath, file))

const wss = new WebSocket.Server({ port })

wss.on('listening', () => {
  console.log('hot reload server is listening...')
})

wss.on('close', () => {
  console.log('hot reload server closed.')
})

wss.on('connection', (ws) => {
  const watcher = chokidar.watch(directoryPath, {
    ignoreInitial: true,
  })

  watcher.on(
    'all',
    debounce((_, path) => {
      if (!excludePaths.includes(path)) {
        if (!quiet) {
          console.log(`File change detected. Path: ${path}`)
        }
        ws.send(Message.FileChange)
      }
    }, 500),
  )

  ws.on('close', () => {
    watcher.close()
  })
})
