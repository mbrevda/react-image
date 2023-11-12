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

const pageStyles = {
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
}

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
        <h3>
          Elapsed seconds: {Math.trunc(elapsedTime / 1000)} <br />
          (max time: {until})
        </h3>
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

function SelectorCheckBox({name, id, checked, onChange}) {
  return (
    <li style={{cursor: 'pointer'}}>
      <label style={{cursor: 'pointer'}}>
        <input type="checkbox" checked={checked} onChange={onChange} /> {name}
      </label>
    </li>
  )
}

function TestContainer({name, isActive, id, Test, props}) {
  if (!isActive) return null
  return (
    <div className="testCase">
      <h3>{name}</h3>
      <Test {...props} />
    </div>
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
  if (activeTests.length === 0) {
    urlParams.delete('test')
  } else {
    urlParams.set('test', nextState)
  }
  // if (urlParams.get('test') === nextState) return
  url.search = urlParams.toString()
  window.history.pushState({}, '', url.toString())
}

const updateTestCases = (id, include, testList) => {
  let activeCases = getUrlTestCases()

  // tests aren't run if they arent in the list. However we need to have a list
  // otherwise we'll run _all_ tests. Here, we set the list to all tests if
  // there are no active tests
  if (!activeCases.length) activeCases = testList.map((test) => test.id)

  let nextTestCases
  // console.log('pushToUrlState', id, include, testCases)
  if (!include) {
    nextTestCases = activeCases.filter((testCase) => testCase !== id)
  } else {
    nextTestCases = [...activeCases, id].sort()
  }
  // console.log('setting test cases', nextTestCases, nextTestCases.join('-'))
  updateUrlState(nextTestCases)
}

// begin test cases
function TestShouldShow({delay}) {
  return (
    <>
      <Timer delay={delay} />
      <Img
        style={{width: 100}}
        src={`/delay/${delay * 1000}/https://picsum.photos/200`}
        loader={<div>Loading...</div>}
        unloader={<div>❎ test failed</div>}
      />
    </>
  )
}

function TestShouldNotShowAnything({}) {
  return (
    <Img style={{width: 100}} src="" unloader={<div>✅ test passed</div>} />
  )
}

function ShouldShowUnloader({}) {
  return (
    <Img
      style={{width: 100}}
      src="http://127.0.0.1/non-existant-image.jpg"
      loader={<div>Loading...</div>}
      unloader={<div>✅ test passed</div>}
    />
  )
}

function TestChangeSrc({renderId}) {
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

function TestSuspense({delay}) {
  return (
    <>
      <Timer delay={delay} />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
          <Img
            style={{width: 100}}
            src={`/delay/${delay * 1000}/https://picsum.photos/200`}
            useSuspense={true}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

function TestSuspenseWontLoad({}) {
  return (
    <ErrorBoundary onError={<div>✅ test passed</div>}>
      <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
        <Img
          style={{width: 100}}
          src="http://127.0.0.1/non-existant-image.jpg"
          useSuspense={true}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
const TestReuseCache = ({renderId}) => {
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
      <>Suspense should reuse cache and only make one network call</>
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

function TestHooksAndSuspense({delay}) {
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

  return (
    <ErrorBoundary>
      <Timer delay={delay} />
      <Suspense fallback={<div>Loading...</div>}>
        <HooksSuspenseExample rand={delay} />
      </Suspense>
    </ErrorBoundary>
  )
}

function TestHooksLegacy({delay}) {
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

  return (
    <ErrorBoundary>
      <HooksLegacyExample rand={delay} />
    </ErrorBoundary>
  )
}

// end test cases

function App() {
  const [renderId, setRenderId] = useState(Math.random())
  const [swRegistered, setSwRegistered] = useState(false)
  const [testCases, setTestCases] = useState<number[]>(getUrlTestCases())
  let delays: number[] = []

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
    updateUrlState(getUrlTestCases())
  }, [])

  const getDelay = (min = 1, max = 10) => {
    const rand = randSeconds(1, 8)
    delays.push(rand)
    return rand
  }

  const getMaxDelay = () => {
    return delays.reduce((acc, curr) => Math.max(acc, curr), 0)
  }

  const testRegistry = [
    {
      name: 'Should Show',
      id: 1,
      Test: TestShouldShow,
      props: {delay: getDelay(1, 8)},
    },
    {
      name: 'Should not show anything',
      id: 2,
      Test: TestShouldNotShowAnything,
    },
    {
      name: 'Should show unloader',
      id: 3,
      Test: ShouldShowUnloader,
    },
    {
      name: 'Change src',
      id: 4,
      Test: TestChangeSrc,
      props: {renderId},
    },
    {
      name: 'Suspense',
      id: 5,
      Test: TestSuspense,
      props: {delay: getDelay(2, 10)},
    },
    {
      name: 'Suspense wont load',
      id: 6,
      Test: TestSuspenseWontLoad,
    },
    {
      name: 'Suspense - reuse cache',
      id: 7,
      Test: TestReuseCache,
      props: {renderId},
    },
    {
      name: 'Hooks and Suspense',
      id: 8,
      Test: TestHooksAndSuspense,
      props: {delay: getDelay(2, 10)},
    },
    {
      name: 'Hooks Legacy',
      id: 9,
      Test: TestHooksLegacy,
      props: {delay: getDelay(2, 10)},
    },
  ]

  const testIsActive = (id) => testCases.includes(id) || testCases.length === 0
  const testOnClick = (id) => (e) => {
    e.stopPropagation()
    updateTestCases(id, e.target.checked, testRegistry)
  }

  if (!swRegistered) return <div>Waiting for server...</div>

  return (
    <>
      <style dangerouslySetInnerHTML={pageStyles}></style>

      <div className="pageContainer">
        <div className="rightMenu">
          <div>
            <GlobalTimer key={renderId} until={getMaxDelay()} />
            <button
              onClick={() => {
                delays = []
                setRenderId(Math.random())
              }}
            >
              rerender
            </button>
            <br></br>
            <br></br>
            <hr />
            <div>
              <h3>Tests to run:</h3>
              <ul>
                {testRegistry.map((test) => (
                  <SelectorCheckBox
                    key={test.id}
                    id={test.id}
                    name={test.name}
                    checked={testIsActive(test.id)}
                    onChange={testOnClick(test.id)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="testCases">
          {testRegistry.map((test) => (
            <TestContainer
              key={test.id}
              isActive={testIsActive(test.id)}
              {...test}
            />
          ))}
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
