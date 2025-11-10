import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="page">
      <div className="container"> 
        <h1 className="title-text">Welcome!</h1>
        <div className='icons'>
          <a href="memory.html">
           <img
            src="https://eclass.asfa.gr/courses/h5p/libraries/H5P.MemoryGame-1.3/icon.svg"
            alt="Memory game"
            className="icon memory-icon"
           />
          </a>


          <a href="quiz.html">
            <img
            src="https://www.drppt.org/wp-content/uploads/QUIZ-3D.png"
            alt="Quiz game"
            style={{ width: '170px', height: '170px' }}
            className="icon quiz-icon"
            />
          </a>
          <a href="jump.html">
            <img
              src="https://geekanant.gallerycdn.vsassets.io/extensions/geekanant/chrome-dinosaur-game/0.0.1/1638086697139/Microsoft.VisualStudio.Services.Icons.Default"
              alt="Jump game"
              style={{ width: '170px', height: '170px' }}
              className="icon jump-icon"
            />
          </a>
        </div>
      </div>
      <img src="src/images/cat.png" alt="Cat waving" className="cat" />
    </div>
   
  )
}

export default App
