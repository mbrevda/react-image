import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react'
import {createRoot} from 'react-dom/client'
import {Img, useImage} from '../src/index'
import {ErrorBoundary} from './ErrorBoundry'

navigator.serviceWorker.register('/sw.js', {scope: './'})
new EventSource('/esbuild').addEventListener('change', () => location.reload())

const randSeconds = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

function Timer({delay}) {
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const maxTimeReached = elapsedTime / 1000 > delay
  const remainingTime = delay - Math.trunc(elapsedTime / 1000)

  useEffect(() => {
    if (maxTimeReached) return
    const timer = setTimeout(() => setElapsedTime(Date.now() - startTime), 1000)
    return () => clearTimeout(timer)
  }, [elapsedTime])

  useEffect(() => {
    setStartTime(Date.now())
    setElapsedTime(0)
  }, [delay])

  return (
    <div>
      Delayed: {delay} seconds
      {!maxTimeReached && <>, image should show in: {remainingTime}s</>}
      <br />
      <br />
    </div>
  )
}

function GlobalTimer({until}) {
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const maxTimeReached = elapsedTime / 1000 - 2 > until

  useEffect(() => {
    if (maxTimeReached) return
    const timer = setTimeout(() => setElapsedTime(Date.now() - startTime), 1000)
    return () => clearTimeout(timer)
  }, [elapsedTime])

  return (
    <div>
      <h3>React Image visual tests</h3>
      <div style={{color: 'grey'}}>
        Test will load on page load. For a test to pass, one or more images
        should show in a green box or the text "✅ test passed" should show.
        Note that test are delayed by a random amount of time.
      </div>
      {!maxTimeReached ? (
        <h3>Elapsed seconds: {Math.trunc(elapsedTime / 1000)}</h3>
      ) : (
        <>
          <h3>Max time elapsed!</h3>
          All images should be loaded at this point
          <br />
        </>
      )}
      <br />
    </div>
  )
}

const HooksLegacyExample = ({rand}) => {
  const {src, isLoading, error} = useImage({
    srcList: [
      'https://www.example.com/non-existant-image.jpg',
      `/delay/${rand * 1000}/https://picsum.photos/200`, // will be loaded
    ],
    useSuspense: false,
  })

  return (
    <div>
      <h3>Using hooks Legacy</h3>
      <Timer delay={rand} />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error! {error.msg}</div>}
      {src && <img src={src} />}
      {!isLoading && !error && !src && (
        <div>Nothing to show - thats not good!</div>
      )}
    </div>
  )
}

const HooksSuspenseExample = ({rand}) => {
  const {src} = useImage({
    srcList: [
      'https://www.example.com/foo.png',
      `/delay/${rand * 1000}/https://picsum.photos/200`, // will be loaded
    ],
  })

  return (
    <div>
      <img src={src} />
    </div>
  )
}

const ReuseCache = ({renderId}) => {
  const src = `https://picsum.photos/200?rand=${renderId}`
  const [networkCalls, setNetworkCalls] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      const entires = performance.getEntriesByName(src)
      setNetworkCalls(entires.length)
    }, 1000)
  })

  return (
    <div>
      <h3>Suspense should reuse cache and only make one network call</h3>
      <div>
        {networkCalls < 1 && <span>❓ test pending</span>}
        {networkCalls === 1 && <span>✅ test passed</span>}
        {networkCalls > 1 && (
          <span>
            ❌ test failed. If DevTools is open, ensure "Disable Cache" in the
            network tab is disabled
          </span>
        )}
      </div>
      <div>Network Calls detected: {networkCalls} (expecting just 1)</div>
      <br />
      <div style={{color: 'grey'}}>
        To test this manually, check the Network Tab in DevTools to ensure the
        url
        <code> {src} </code> was only called once
      </div>
      <br />
      <br />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
          <Img
            style={{width: 100, margin: '10px'}}
            src={src}
            useSuspense={true}
          />
          <Img
            style={{width: 100, margin: '10px'}}
            src={src}
            useSuspense={true}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function ChangeSrc({renderId}) {
  const getSrc = () => {
    const rand = randSeconds(500, 900)
    return `https://picsum.photos/200?rand=${rand}`
  }
  const [src, setSrc] = useState([getSrc()])
  const [loadedSecondSource, setLoadedSecondSource] = useState<null | boolean>(
    null,
  )
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (src.length < 2) return

    let id = setInterval(
      () => setLoadedSecondSource(imgRef.current?.src === src[1]),
      250,
    )
    return () => clearInterval(id)
  }, [renderId, src])

  useEffect(() => {
    // switch sources after 1 second
    setTimeout(() => setSrc((prev) => [...prev, getSrc()]), 1000)
  }, [renderId])

  // on rerender, reset the src list
  useEffect(() => {
    setSrc(() => [getSrc()])
    setLoadedSecondSource(null)
  }, [renderId])

  return (
    <>
      <h3>
        Change <code>src</code>
      </h3>
      <div>
        {loadedSecondSource === null && <span>❓ test pending</span>}
        {loadedSecondSource === true && <span>✅ test passed</span>}
        {loadedSecondSource === false && <span>❌ test failed</span>}
      </div>
      Src list:
      {src.map((url, index) => {
        return (
          <div>
            {index + 1}. <code>{url}</code>
          </div>
        )
      })}
      <br />
      <div style={{color: 'grey'}}>
        This test will load an image and then switch sources after 1 second. It
        should then rerender with the new source. To manually confirm, ensure
        the loaded image's source is the second item in the Src list
      </div>
      <br />
      <Img
        ref={imgRef}
        style={{width: 100}}
        src={src.at(-1) as string}
        loader={<div>Loading...</div>}
        unloader={<div>this is the unloader</div>}
      />
    </>
  )
}

function TestCheckBox({name, id, checked, onChange}) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} /> {name}
      </label>
    </li>
  )
}

const getUrlTestCases = () => {
  const urlParams = new URLSearchParams(window.location.search)
  if (!urlParams.has('test') || !urlParams.get('test')) return []
  const uniqueTests = [...new Set(urlParams.get('test')?.split('-'))]
  return uniqueTests
    .map((test) => parseInt(test, 10))
    .filter((test) => !isNaN(test))
}

const updateUrlState = (activeTests) => {
  const url = new URL(window.location.href)
  const urlParams = new URLSearchParams(url.searchParams)
  const nextState = activeTests.join('-')
  if (urlParams.get('test') === nextState) return
  urlParams.set('test', nextState)
  url.search = urlParams.toString()
  window.history.pushState({}, '', url.toString())
}

const pushToUrlState = (id, include) => {
  const testCases = getUrlTestCases()

  let nextTestCases
  // console.log('pushToUrlState', id, include, testCases)
  if (!include) {
    nextTestCases = testCases.filter((testCase) => testCase !== id)
  } else {
    nextTestCases = [...testCases, id].sort()
  }
  // console.log('setting test cases', nextTestCases, nextTestCases.join('-'))
  updateUrlState(nextTestCases)
}

function App() {
  const imageOn404 =
    'https://i9.ytimg.com/s_p/OLAK5uy_mwasty2cJpgWIpr61CqWRkHIT7LC62u7s/sddefault.jpg?sqp=CJz5ye8Fir7X7AMGCNKz4dEF&rs=AOn4CLC-JNn9jj-oFw94oM574w36xUL1iQ&v=5a3859d2'
  const tmdbImg =
    'https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfask.jpg'
  const locationRef = useRef(window.location.href)

  // http://i.imgur.com/ozEaj1Z.jpg
  const rand1 = randSeconds(1, 8)
  const rand2 = randSeconds(2, 10)
  const rand3 = randSeconds(2, 10)
  const rand4 = randSeconds(2, 10)
  const rand5 = randSeconds(2, 10)
  const [renderId, setRenderId] = useState(Math.random())
  const [swRegistered, setSwRegistered] = useState(false)
  const [testCases, setTestCases] = useState<number[]>(getUrlTestCases())

  console.log('testCases', testCases)
  useLayoutEffect(() => {
    navigator.serviceWorker.ready.then(() => setSwRegistered(true))
  }, [])

  useEffect(() => {
    // monkey patch pushState to catch url changes
    var pushState = history.pushState
    history.pushState = function () {
      pushState.apply(history, arguments)
      setTestCases(getUrlTestCases())
    }

    // run once on mount
    console.log('onMount', getUrlTestCases())
    updateUrlState(getUrlTestCases())
  }, [])

  const testIsActive = (id) => testCases.includes(id)
  const testOnClick = (id) => (e) => {
    e.stopPropagation()
    pushToUrlState(id, e.target.checked)
  }

  if (!swRegistered) return <div>Waiting for server...</div>

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `img { border: 5px solid green;}
           h3 {padding-top: 20px;}
           body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }
          .pageContainer {
            display: flex;
            flex-direction: row-reverse;
          }
          .testCases {
              margin: 10px;
              flex: 0 0 80%;
              display: grid;
              grid-template-columns: auto auto auto auto;
              grid-template-rows: auto auto auto auto;
          }
          .testCase {
            padding: 10px;
            border: lightgrey solid 1px;
          }
          `,
        }}
      ></style>

      <div className="pageContainer">
        <div className="rightMenu">
          <div>
            <GlobalTimer until={Math.max(rand1, rand2, rand3, rand4)} />
            <button onClick={() => setRenderId(Math.random())}>rerender</button>
            <br></br>
            <br></br>
            <hr />
            <div>
              <h3>Tests to run:</h3>
              <ul>
                <TestCheckBox
                  id={1}
                  name="checkbox 1"
                  checked={testIsActive(1)}
                  onChange={testOnClick(1)}
                />
                <TestCheckBox
                  id={2}
                  name="checkbox 2"
                  checked={testIsActive(2)}
                  onChange={testOnClick(2)}
                />
                <TestCheckBox
                  id={3}
                  name="checkbox 3"
                  checked={testIsActive(3)}
                  onChange={testOnClick(3)}
                />
                <TestCheckBox
                  id={4}
                  name="checkbox 4"
                  checked={testIsActive(4)}
                  onChange={testOnClick(4)}
                />
              </ul>
            </div>
          </div>
        </div>

        <div className="testCases">
          <div className="testCase">
            <h3>Should show</h3>
            <Timer delay={rand1} />
            <Img
              style={{width: 100}}
              src={`/delay/${rand1 * 1000}/https://picsum.photos/200`}
              loader={<div>Loading...</div>}
              unloader={<div>❎ test failed</div>}
            />
          </div>
          <div className="testCase">
            <h3>Should not show anything</h3>
            <Img
              style={{width: 100}}
              src=""
              unloader={<div>✅ test passed</div>}
            />
          </div>
          <div className="testCase">
            <h3>Should show unloader</h3>
            <Img
              style={{width: 100}}
              src="http://127.0.0.1/non-existant-image.jpg"
              loader={<div>Loading...</div>}
              unloader={<div>✅ test passed</div>}
            />
          </div>
          <div className="testCase">
            <ChangeSrc renderId={renderId} />
          </div>
          <div className="testCase">
            <h3>Suspense</h3>
            <Timer delay={rand2} />
            <ErrorBoundary>
              <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
                <Img
                  style={{width: 100}}
                  src={`/delay/${rand2 * 1000}/https://picsum.photos/200`}
                  useSuspense={true}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="testCase">
            <h3>Suspense wont load</h3>
            <ErrorBoundary onError={<div>✅ test passed</div>}>
              <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
                <Img
                  style={{width: 100}}
                  src="http://127.0.0.1/non-existant-image.jpg"
                  useSuspense={true}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="testCase">
            <ReuseCache renderId={renderId} />
          </div>
          <div className="testCase">
            <div>
              <ErrorBoundary>
                <h3>using hooks & suspense</h3>
                <Timer delay={rand3} />
                <Suspense fallback={<div>Loading...</div>}>
                  <HooksSuspenseExample rand={rand3} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
          <div className="testCase">
            <ErrorBoundary>
              <HooksLegacyExample rand={rand4} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}

const node = document.createElement('div')
node.id = 'root'
document.body.appendChild(node)
const rootElement = document.getElementById('root') as HTMLElement
createRoot(rootElement).render(<App />)
