import { writeFile } from 'node:fs/promises'

const tabs = await (await fetch('http://127.0.0.1:9222/json')).json()
const page = tabs.find((tab) => tab.type === 'page' && tab.url.includes('5174'))
if (!page) throw new Error('Task 2 browser page unavailable')
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
let id = 0
const pending = new Map()
const errors = []
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data)
  if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id) }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails)
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry)
  if (message.method === 'Network.loadingFailed' && !message.params.canceled) errors.push(message.params)
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) errors.push(message.params.response)
}
const send = (method, params = {}) => new Promise((resolve) => {
  const commandId = ++id
  pending.set(commandId, resolve)
  socket.send(JSON.stringify({ id: commandId, method, params }))
})
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.result?.exceptionDetails) throw new Error(JSON.stringify(result.result.exceptionDetails))
  return result.result?.result?.value
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const screenshot = async (name) => {
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile(`frontend/${name}.png`, Buffer.from(shot.result.data, 'base64'))
}
await send('Page.enable')
await send('Runtime.enable')
await send('Network.enable')
await send('Log.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1376, height: 768, deviceScaleFactor: 1, mobile: false })
await send('Page.reload', { ignoreCache: true })
await wait(16000)
await screenshot('task2-intro-desktop')
console.log('Initial:', JSON.stringify(await evaluate(`({canvas:!!document.querySelector('canvas'),width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth})`)))
console.log('Failed resources:', JSON.stringify(await evaluate(`performance.getEntriesByType('resource').filter(e=>e.responseStatus>=400).map(e=>e.name)`)))
if (process.argv.includes('--baseline')) {
  console.log('Browser errors:', JSON.stringify(errors))
  socket.close()
  process.exit(0)
}
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
await wait(1300)
await screenshot('task2-map-desktop')
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 210, y: 350, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 210, y: 350, button: 'left', clickCount: 1 })
await wait(500)
console.log('Island click:', JSON.stringify(await evaluate(`({modal:document.querySelector('[role="dialog"]')?.textContent})`)))
await evaluate(`document.querySelector('[aria-label="Close"]')?.click()`)
await screenshot('task2-selection-desktop')
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
await wait(500)
await screenshot('task2-map-mobile')
await send('Page.reload', { ignoreCache: true })
await wait(16000)
await screenshot('task2-intro-mobile')
console.log('Mobile:', JSON.stringify(await evaluate(`({canvas:document.querySelector('canvas')?.getBoundingClientRect().toJSON(),width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollHeight>innerHeight||document.documentElement.scrollWidth>innerWidth})`)))
console.log('Browser errors:', JSON.stringify(errors))
socket.close()
