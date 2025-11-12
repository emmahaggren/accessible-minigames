import { useState, useEffect, useCallback } from 'react'
import './hang-man.css'
import cat from "../images/cat.png";

export default function HangmanGame() {

  const [secretWord, setSecretWord] = useState("");
  const [wrongLetters, setWrongLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shownWord, setShownWord] = useState("");
  const [lastGuess, setLastGuess] = useState(null);
  const [playState, setPlayState] = useState("playing"); // "playing", "won", "lost"
  const maxWrong = 10;
  const images = [
    {src :"src/images/0.png", alt: "A blank image"},
    {src :"src/images/1.png", alt: "A hill"},
    {src :"src/images/2.png", alt: "A hill and half a stem"},
    {src :"src/images/3.png", alt: "A hill and a finished stem"},
    {src :"src/images/4.png", alt: "A hill, stem and rope"},
    {src :"src/images/5.png", alt: "A hung head"},
    {src :"src/images/6.png", alt: "A hung head and torso"},
    {src :"src/images/7.png", alt: "A hung head, torso and one arm"},
    {src :"src/images/8.png", alt: "A hung head, torso and both arms"},
    {src :"src/images/9.png", alt: "A hung body with a leg missing"},
    {src :"src/images/10.png", alt: "A fully hung man"},
    
    ]



  // Gets a random word from the wordlist in words.txt
  function selectWord(){
    fetch("src/hangman-game/words.txt")
    .then(response => response.text())
    .then(text => {
      const words = text.split("\n");
      const randomIndex = Math.floor(Math.random() * words.length);
      setSecretWord(words[randomIndex].trim());
    });
  }

  // Update shown word when correct letters or secret word changes
  useEffect(() => {
    let display = "";
    for (let char of secretWord) {
      if (correctLetters.includes(char)) {
        display += char + " ";
      } else {
        display += "_ ";
      }
    }
    setShownWord(display.trim());
  }, [correctLetters, secretWord]);

    // Select a word if none is selected yet
  useEffect(() => {
    if (secretWord === "") {
      selectWord();
    }
  }, [secretWord]);


  // Handles a guessed letter
  const handleGuess = useCallback((letter) => {
    if (!letter) return;
    letter = letter.toUpperCase();
    if (secretWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        setCorrectLetters((prev) => [...prev, letter]);
        setLastGuess({ letter, type: 'correct' });
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        setWrongLetters((prev) => [...prev, letter]);
        setWrongGuesses((prev) => prev + 1);
        setLastGuess({ letter, type: 'wrong' });
      }
    }
  }, [secretWord, correctLetters, wrongLetters]);

  // Determine play state (playing/won/lost) when guesses change.
  useEffect(() => {
    if (!secretWord) return;
    if (wrongGuesses >= maxWrong) {
      setPlayState('lost');
      return;
    }
    let allGuessed = true;
    for (let ch of secretWord) {
      if (ch === ' ') continue;
      if (!correctLetters.includes(ch)) {
        allGuessed = false;
        break;
      }
    }
    if (allGuessed) setPlayState('won');
    else setPlayState('playing');
  }, [secretWord, correctLetters, wrongGuesses]);

  // Listen for keyboard input. Filters to A-Z and ignores other keys.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        console.log("Play state:", playState);
        if (playState !== "playing") return;
        handleGuess(key);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playState, handleGuess]);








  return (
    <main style={{ padding: 20 }}>
      <h1 className="title-text"tabIndex="0">Hangman Game!</h1>
      <div className = 'container'>
        <img 
        src={images[wrongGuesses].src}
        alt={images[wrongGuesses].alt}
        className='picture'
        tabIndex="0"
        />

      
      <div className= "textContainer" >
      <p tabIndex="0">
        {/*<strong>Secret Word:</strong> {secretWord} */} 
      </p>
      <p tabIndex="0">
        <strong>Word:</strong> {shownWord}
      </p>

      <p tabIndex="0">
        <strong>Wrong letters:</strong> {wrongLetters.join(', ') || 'None'}
      </p>
      <p tabIndex="0">
        <strong>Remaining guesses:</strong> {Math.max(0, maxWrong - wrongGuesses)} / {maxWrong}
      </p>
        
      </div>
      </div>
 

      <p>
        <a href="/">Back to front page</a>
      </p>
  
    </main>
  )
}
