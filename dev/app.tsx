import React, {Suspense, useState, useEffect, useRef} from 'react'
import {createRoot} from 'react-dom/client'
import {Img, useImage} from '../src/index'
//const {Img, useImage} = require('../cjs')

interface ErrorBoundary {
  props: {
    children: React.ReactNode
    onError?: React.ReactNode
  }
}
class ErrorBoundary extends React.Component implements ErrorBoundary {
  state: {
    hasError: boolean
  }
  onError: React.ReactNode

  constructor(props) {
    super(props)
    this.state = {hasError: false}
    this.onError = props.onError
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: error}
  }

  render() {
    if (this.state.hasError) {
      if (this.onError) return this.onError
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

const randSeconds = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

function Timer({until}) {
  const startTimeRef = useRef(Date.now())
  const [time, setTime] = useState(Date.now() - startTimeRef.current)
  const style = {position: 'fixed', right: '40px', width: '250px'}
  const maxTImeReached = time / 1000 - 5 > until

  useEffect(() => {
    const timer = setTimeout(
      () => setTime(Date.now() - startTimeRef.current),
      1000
    )
    return () => clearTimeout(timer)
  }, [time])

  return (
    <div style={style}>
      <h3>React Image visual tests</h3>
      Test will load on page load. For a test to pass, one or more images should
      show in a green box or the text "✅ test passed" should show. Note that
      test are delayed by a random amount of time.
      {time < 15000 && <h3>Elapsed seconds: {Math.trunc(time / 1000)}</h3>}
      <br />
      {maxTImeReached && <h3>'Max time elapsed!'</h3>}
      note: if devtools is open, disable "Disable cache" or artificial delay may
      trigger twice twice
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
      {isLoading && <div>Loading... (rand={rand})</div>}
      {error && <div>Error! {error.msg}</div>}
      {src && <img src={src} />}
      {!isLoading && !error && !src && (
        <div>Nothing to show - thats not good!</div>
      )}
    </div>
  )
}

const HooksSuspenseExample = ({rand}) => {
  const {src, isLoading, error} = useImage({
    srcList: [
      'https://www.example.com/foo.png',
      `/delay/${rand * 1000}/https://picsum.photos/200`, // will be loaded
    ],
  })

  return (
    <div>
      <h3>using hooks & suspense</h3>
      <img src={src} />
    </div>
  )
}

function App() {
  const imageOn404 =
    'https://i9.ytimg.com/s_p/OLAK5uy_mwasty2cJpgWIpr61CqWRkHIT7LC62u7s/sddefault.jpg?sqp=CJz5ye8Fir7X7AMGCNKz4dEF&rs=AOn4CLC-JNn9jj-oFw94oM574w36xUL1iQ&v=5a3859d2'
  const tmdbImg =
    'https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfask.jpg'

  // http://i.imgur.com/ozEaj1Z.jpg
  const rand1 = randSeconds(1, 8)
  const rand2 = randSeconds(2, 10)
  const rand3 = randSeconds(2, 10)
  const rand4 = randSeconds(2, 10)

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `img { border: 5px solid green;}
           h3 {padding-top: 20px;}
           body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }
          `,
        }}
      ></style>

      <Timer until={Math.max(rand1, rand2)} />
      {/* <div>
        <h3>Should show (delayed {rand1} seconds)</h3>
        <Img
          style={{width: 100}}
          src={`/delay/${rand1 * 1000}/https://picsum.photos/200`}
          loader={<div>Loading...</div>}
          unloader={<div>this is the unloader</div>}
        />
      </div>

      {/* <div>
        <h3>Should not show anything</h3>
        <Img style={{width: 100}} src={[imageOn404]} />
      </div>   */}
      <div>
        <h3>Should show unloader</h3>
        <Img
          style={{width: 100}}
          src="http://127.0.0.1/non-existant-image.jpg"
          loader={<div>Loading...</div>}
          unloader={<div>✅ test passed</div>}
        />
      </div>
      <div>
        <h3>Suspense (delayed {rand2} seconds)</h3>
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
      <div>
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
      <div>
        <h3>Suspense should reuse cache (only one network call)</h3>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading... (Suspense fallback)</div>}>
            <Img
              style={{width: 100}}
              src={`https://picsum.photos/200`}
              useSuspense={true}
            />
            <div style={{width: '50px'}} />
            <Img
              style={{width: 100}}
              src={`https://picsum.photos/200`}
              useSuspense={true}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading... (hooks, rand={rand3})</div>}>
            <HooksSuspenseExample rand={rand3} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div>
        <ErrorBoundary>
          <HooksLegacyExample rand={rand4} />
        </ErrorBoundary>
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
const rootElement = document.getElementById('root')
createRoot(rootElement!).render(<App />)
