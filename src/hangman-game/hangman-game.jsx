import { useState, useEffect, useCallback } from 'react'

export default function HangmanGame() {

  const [secretWord, setSecretWord] = useState("");
  const [wrongLetters, setWrongLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shownWord, setShownWord] = useState("");
  const [lastGuess, setLastGuess] = useState(null);
  const [playState, setPlayState] = useState("playing"); // "playing", "won", "lost"
  const maxWrong = 10;



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
      <h1>Hangman Game</h1>
      <p>
        This is a placeholder for the Hangman Game.
      </p>
      <p>
        <strong>Secret Word:</strong> {secretWord}
      </p>
      <p>
        <strong>Shown Word:</strong> {shownWord}
      </p>

      <p>
        <strong>Wrong letters:</strong> {wrongLetters.join(', ') || 'None'}
      </p>
      <p>
        <strong>Remaining guesses:</strong> {Math.max(0, maxWrong - wrongGuesses)} / {maxWrong}
      </p>

      <p>
        <a href="/">Back to front page</a>
      </p>
    </main>
  )
}
