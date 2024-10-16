// import React, { useEffect, useState } from 'react'

// export default function SayHello () {
//     const greetings = ["Hello", "Ciao", "Hola"]

//     const [index, setIndex] = useState(0)
//     useEffect(() => {
//         document.title = greetings[index]
//     })

//     function updateGreeting () {
//         setIndex(Math.floor(Math.random() * greetings.length))
//     }
//   return (
//     <button onClick={updateGreeting}>Say Hi</button>
//   )
// }

import React, { useEffect, useState } from 'react'

export default function windowSize () {
    const [size, setSize] = useState(getSize())

    function getSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    
    useEffect(() => {
        function handleResize () {
            setSize(getSize())
        }
    window.addEventListener('resize', handleResize)
    }, [])
}  
  return (
    <p>Width: {size.width}, Height: {size.height}</p>
  )

