import './App.css'

function App() {
  return (
    <div className="page">
      <div className="container"> 
        <h1 className="title-text"tabIndex="0">Welcome!</h1>
        <div className='icons'>
          <a href="/hangman-game">
           <img
            src="https://m.media-amazon.com/images/I/61oRYzquhvL.png"
            alt="Hangman game"
            className="hangman-icon"
           />
          </a>


        </div>
      </div>
      <img src="src/images/cat.png" alt="Cat waving" className="cat" />
    </div>
   
  )
}

export default App
