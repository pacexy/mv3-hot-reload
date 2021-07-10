import { isDev, Message } from './utils'

const ws = new WebSocket('ws://localhost:9012')

if (isDev) {
  ws.addEventListener('message', (event) => {
    if (event.data === Message.FileChange) {
      chrome.runtime.sendMessage(Message.Reload)
    }
  })
}
