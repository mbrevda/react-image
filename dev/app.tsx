import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
  memo,
  forwardRef,
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

function GlobalTimer({until, testRegistry, runResults}) {
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const maxTimeReached = elapsedTime / 1000 > until + 3

  useEffect(() => {
    if (maxTimeReached) return
    const timer = setTimeout(() => setElapsedTime(Date.now() - startTime), 1000)
    return () => clearTimeout(timer)
  }, [elapsedTime])

  const totalTests = testRegistry.length
  const passedTests = Object.values(runResults).filter(
    (status) => status === 'pass',
  ).length
  const failedTests = Object.values(runResults).filter(
    (status) => status === 'fail',
  ).length
  let testsStatus
  if (passedTests + failedTests !== totalTests) {
    testsStatus = 'pending'
  } else if (failedTests > 0) {
    testsStatus = 'fail'
  } else {
    testsStatus = 'pass'
  }

  return (
    <div>
      <h3>React Image visual tests</h3>
      <div style={{color: 'grey'}}>
        Test will load on page load. For a test to pass, one or more images
        should show in a green box or the text "{<Results status="pass" />}"
        should show. Note that test are delayed by a random amount of time.
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
      <b>
        All Tests: <Results status={testsStatus} />
      </b>
      {failedTests > 0 && (
        <>
          <br />
          <span style={{color: 'red'}}>Failed Tests: {failedTests}!</span>
          <br />
        </>
      )}
      <br />
      <br />
      {testRegistry.map((test) => {
        return (
          <span key={test.id}>
            {test.name}:{' '}
            {runResults[test.id] ? (
              <Results status={runResults[test.id]} />
            ) : (
              <span>❓ pending</span>
            )}
            <br />
          </span>
        )
      })}
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

function TestContainer({
  name,
  isActive,
  id,
  Test,
  props,
  runResults,
  setRunResults,
}) {
  if (!isActive) return null
  return (
    <div className="testCase">
      <h3>{name}</h3>
      {/* <Results status={runResults} /> */}
      <Test {...props} setRunResults={setRunResults} />
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

function ResultView({status}, ref) {
  if (status === 'pending' || !status) return <span ref={ref}>❓ pending</span>
  if (status === 'pass') return <span ref={ref}>✅ passed</span>
  if (status === 'fail') return <span ref={ref}>❌ failed</span>
  return null
}
const Results = forwardRef<HTMLSpanElement, {status: string}>(ResultView)

// begin test cases
function TestShouldShow({delay, setRunResults}) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setTimeout(
      () => {
        setRunResults(imgRef.current?.src ? 'pass' : 'fail')
      },
      (delay + 1) * 1000,
    )
  })

  return (
    <>
      <Timer delay={delay} />
      <Img
        ref={imgRef}
        style={{width: 100}}
        src={`/delay/${delay * 1000}/https://picsum.photos/200`}
        loader={<Results status="pending" />}
        unloader={
          <div>
            <Results status="fail" />
          </div>
        }
      />
    </>
  )
}

function TestShouldNotShowAnything({setRunResults}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const unloaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      setRunResults(unloaderRef.current?.innerText ? 'pass' : 'fail')
    }, 100)
  })

  return (
    <Img
      ref={imgRef}
      style={{width: 100}}
      src=""
      unloader={<Results ref={unloaderRef} status="pass" />}
    />
  )
}

function ShouldShowUnloader({setRunResults}) {
  const unloaderRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setTimeout(() => {
      setRunResults(
        unloaderRef.current && unloaderRef.current.innerText ? 'pass' : 'fail',
      )
    }, 100)
  })

  return (
    <Img
      style={{width: 100}}
      src="http://127.0.0.1/non-existant-image.jpg"
      loader={<div>Loading...</div>}
      unloader={<Results status="pass" ref={unloaderRef} />}
    />
  )
}

function TestChangeSrc({setRunResults}) {
  const getSrc = () => {
    const rand = randSeconds(500, 900)
    return `https://picsum.photos/200?test=TestChangeSrc&rand=${rand}`
  }
  const [src, setSrc] = useState([getSrc()])
  const [loaded, setLoaded] = useState<boolean | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onFirstLoad = () => setSrc((prev) => [...prev, getSrc()])
    const onSecondLoad = () => {
      setLoaded(true)
      setRunResults('pass')
    }

    if (src.length === 1) {
      if (imgRef.current?.src === src[1]) {
        onFirstLoad()
      } else {
        imgRef.current?.addEventListener('load', onFirstLoad)
      }
    } else {
      if (imgRef.current?.src === src[2]) {
        onSecondLoad()
      } else {
        imgRef.current?.addEventListener('load', onSecondLoad)
      }
    }
  }, [src])

  let testResults
  if (loaded === null) testResults = 'pending'
  if (loaded === true) testResults = 'pass'
  if (loaded === false) testResults = 'fail'

  return (
    <>
      <Results status={testResults} />
      <br />
      Src list:
      {src.map((url, index) => {
        return (
          <div key={index}>
            {index + 1}. <code>{url}</code>
          </div>
        )
      })}
      <br />
      <div style={{color: 'grey'}}>
        This test will load an image and then switch to a different sources. It
        should then rerender with the new source. To manually confirm, ensure
        the loaded image's source is the second item in the <code>src</code>{' '}
        list
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

function TestSuspense({delay, setRunResults}) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setTimeout(
      () => {
        const onLoad = () => {
          setRunResults(imgRef.current?.src ? 'pass' : 'fail')
        }

        if (imgRef.current?.src) {
          onLoad()
        } else {
          imgRef.current?.addEventListener('load', onLoad)
        }
      },
      (delay + 1) * 1000,
    )
  })

  return (
    <>
      <Timer delay={delay} />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
          <Img
            ref={imgRef}
            style={{width: 100}}
            src={`/delay/${delay * 1000}/https://picsum.photos/200`}
            useSuspense={true}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

function TestSuspenseWontLoad({setRunResults}) {
  const resRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      setRunResults(resRef.current?.innerText ? 'pass' : 'fail')
    }, 100)
  })

  return (
    <ErrorBoundary onError={<Results status="pass" ref={resRef} />}>
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

const TestReuseCache = ({setRunResults}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const src = `https://picsum.photos/200?rand=${randSeconds(500, 900)}`
  const [networkCalls, setNetworkCalls] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      const entires = performance.getEntriesByName(src)
      setNetworkCalls(entires.length)

      if (imgRef.current?.src === src) {
        setRunResults('pass')
      }
    }, 1000)
  })

  let testResults
  if (networkCalls === 0) testResults = 'pending'
  if (networkCalls === 1) testResults = 'pass'
  if (networkCalls > 1) testResults = 'fail'

  return (
    <div>
      <>Suspense should reuse cache and only make one network call</>
      <div>
        <Results status={testResults} />
        {testResults === 'fail' && (
          <span>
            If DevTools is open, ensure "Disable Cache" in the network tab is
            disabled
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
            ref={imgRef}
            style={{width: 100, margin: '10px'}}
            src={src}
            useSuspense={true}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function TestHooksAndSuspense({delay, setRunResults}) {
  const imgRef = useRef<HTMLImageElement>(null)

  const HooksSuspenseExample = ({rand}) => {
    useEffect(() => {
      setTimeout(
        () => {
          const onLoad = () => {
            setRunResults(imgRef.current?.src ? 'pass' : 'fail')
          }
          if (imgRef.current?.src) {
            onLoad()
          } else {
            imgRef.current?.addEventListener('load', onLoad)
          }
        },
        (delay + 1) * 1000,
      )
    })

    const {src} = useImage({
      srcList: [
        'https://www.example.com/foo.png',
        `/delay/${rand * 1000}/https://picsum.photos/200`, // will be loaded
      ],
    })

    return (
      <div>
        <img src={src} ref={imgRef} />
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

function TestHooksLegacy({delay, setRunResults}) {
  const imgRef = useRef<HTMLImageElement>(null)

  const {src, isLoading, error} = useImage({
    srcList: [
      'https://www.example.com/non-existant-image.jpg',
      `/delay/${delay * 1000}/https://picsum.photos/200`, // will be loaded
    ],
    useSuspense: false,
  })

  const HooksLegacyExample = ({rand}) => {
    useEffect(() => {
      const onLoad = () => {
        setRunResults(imgRef.current?.src ? 'pass' : 'fail')
      }
      if (imgRef.current?.src) {
        onLoad()
      } else {
        imgRef.current?.addEventListener('load', onLoad)
      }
    }, [src])

    return (
      <div>
        <Timer delay={rand} />
        {isLoading && <div>Loading...</div>}
        {error && <div>Error! {error.msg}</div>}
        {src && <img src={src} ref={imgRef} />}
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
  // const [runResults, setRunResults] = useState({})
  let delays: number[] = []
  let runResults = {}

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

  const resetTests = () => {
    delays = []
    runResults = []
    setRenderId(Math.random())
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
    resetTests()
  }

  if (!swRegistered) return <div>Waiting for server...</div>

  return (
    <>
      <style dangerouslySetInnerHTML={pageStyles}></style>

      <div className="pageContainer">
        <div className="rightMenu">
          <div>
            <GlobalTimer
              key={renderId}
              until={getMaxDelay()}
              testRegistry={testRegistry.filter((test) =>
                testIsActive(test.id),
              )}
              runResults={runResults}
            />
            <button onClick={resetTests}>rerender</button>
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
              runResults={runResults[test.id]}
              setRunResults={(status) => (runResults[test.id] = status)}
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
