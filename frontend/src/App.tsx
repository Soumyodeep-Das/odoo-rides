import { useState } from 'react'
import { Button } from '#components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen min-w-screen">
        <h1 className="">Hello Vite+React</h1>
        <Button onClick={() => setCount(count + 1)}>Click me {count}</Button>
      </div>
    </>
  )
}

export default App
