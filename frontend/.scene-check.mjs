import { writeFile } from 'node:fs/promises'

const tabs = await (await fetch('http://127.0.0.1:9222/json')).json()
const page = tabs.find((tab) => tab.type === 'page')
if (!page) throw new Error('No browser page is available for the scene check')

const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.onopen = resolve
  socket.onerror = reject
})

let commandId = 0
const pending = new Map()
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data)
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message)
    pending.delete(message.id)
  }
}
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++commandId
  pending.set(id, resolve)
  socket.send(JSON.stringify({ id, method, params }))
})

await send('Page.enable')
await send('Runtime.enable')
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 640, y: 300, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 640, y: 300, button: 'left', clickCount: 1 })
await new Promise((resolve) => setTimeout(resolve, 1100))
const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
await writeFile('frontend/overworld-scene-check.png', Buffer.from(screenshot.result.data, 'base64'))
const state = await send('Runtime.evaluate', {
  expression: `({ canvas: Boolean(document.querySelector('#phaser-game canvas')), modal: Boolean(document.querySelector('[role="dialog"]')) })`,
  returnByValue: true,
})
console.log(JSON.stringify(state.result.result.value))
socket.close()
