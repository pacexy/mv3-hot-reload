import { isDev, Message, PORT } from './utils'

const ws = new WebSocket(`ws://localhost:${PORT}`)

if (isDev) {
  ws.addEventListener('message', (event) => {
    if (event.data === Message.FileChange) {
      chrome.runtime.sendMessage(Message.Reload)
    }
  })
}
