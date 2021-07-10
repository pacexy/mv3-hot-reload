#!/usr/bin/env node
/* eslint-disable no-console */

import chokidar from 'chokidar'
import WebSocket = require('ws')
import { debounce } from 'lodash'
import path from 'path'
import { Message } from '../src/utils'

const PORT = 9012
const DIST_DIRECTORY = path.resolve('dist')

const wss = new WebSocket.Server({ port: PORT })

wss.on('listening', () => {
  console.log('hot reload server is listening...')
})

wss.on('close', () => {
  console.log('hot reload server closed.')
})

wss.on('connection', (ws) => {
  chokidar
    .watch(DIST_DIRECTORY, {
      ignoreInitial: true,
    })
    .on(
      'all',
      debounce(() => {
        console.log('file change detected.')
        ws.send(Message.FileChange)
      }, 500),
    )
})
