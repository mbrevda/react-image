const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

async function delayFetch(url) {
  const [_, delay] = url.pathname.match(/\/delay\/(\d*).*/, '')
  await sleep(delay)
  const request = new Request(url.pathname.replace(/\/delay\/\d*\//, ''))
  return await fetch(request)
}

self.addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url)

  if (!event.request.url.startsWith(url.origin + '/delay/')) {
    console.log('not delaying', event.request.url)
    return fetch(event.request)
  }

  event.respondWith(delayFetch(url))
})
