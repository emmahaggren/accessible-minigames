import { useState, useEffect, useCallback, useRef } from "react";
import "./hang-man.css";
import useSound from 'use-sound';
import correctSfx from '../audio/correct.mp3';
import errorSfx from '../audio/error.mp3';
import winSfx from '../audio/win.mp3';
import wrongSfx from '../audio/wrong.mp3';
import ReactDOM from "react-dom";
import Confetti from "react-confetti";

export default function HangmanGame() {
  const [secretWord, setSecretWord] = useState("");
  const [wrongLetters, setWrongLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shownWord, setShownWord] = useState("");
  const [lastGuess, setLastGuess] = useState(null);
  const [playState, setPlayState] = useState("playing"); // "playing", "won", "lost"

  const maxWrong = 10;

  // Hangman-images and their alt texts for each wrong guess count
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

  // get play and stop controls from use-sound
  const [playCorrect, { stop: stopCorrect }] = useSound(correctSfx, { volume: 0.6 });
  const [playWin, { stop: stopWin }] = useSound(winSfx, { volume: 0.8 });
  const [playError, { stop: stopError }] = useSound(errorSfx, { volume: 0.6 });
  const [playWrong, { stop: stopWrong }] = useSound(wrongSfx, { volume: 0.6 });



  // Gets a random word from the wordlist in words.txt
  function selectWord() {
    fetch("src/hangman-game/words.txt")
      .then((response) => response.text())
      .then((text) => {
        const words = text.split("\n");
        const randomIndex = Math.floor(Math.random() * words.length);
        setSecretWord(words[randomIndex].trim().toUpperCase());
      });
  }


  function restartGame() {
    //Reset sounds
    try {
      if (typeof stopWin === 'function') stopWin();
      if (typeof stopCorrect === 'function') stopCorrect();
      if (typeof stopError === 'function') stopError();
      if (typeof stopWrong === 'function') stopWrong();
    } catch {
      // ignore stop errors
    }
    setWrongLetters([]);
    setCorrectLetters([]);
    setWrongGuesses(0);
    setShownWord("");
    setLastGuess(null);
    setPlayState("playing");
    selectWord();
  }

 
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


  useEffect(() => {
    if (secretWord === "") {
      selectWord();
    }
  }, [secretWord]);


  const handleGuess = useCallback(
    (letter) => {
      if (!letter) return;
      letter = letter.toUpperCase();
      if (playState !== "playing") return;
      // The letter was already guessed
      if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
        setLastGuess({ letter, type: "already guessed" });
        try {
          playError();
        } catch (err) {
          void err;
        }
        return;
      }
      if (secretWord.includes(letter)) {
        // The letter was correct
        if (!correctLetters.includes(letter)) {
          setCorrectLetters((prev) => [...prev, letter]);
          setLastGuess({ letter, type: "correct" });
          playCorrect();
        }
      } else {
        // The letter was wrong
        if (!wrongLetters.includes(letter)) {
          setWrongLetters((prev) => [...prev, letter]);
          setWrongGuesses((prev) => prev + 1);
          setLastGuess({ letter, type: "wrong" });
          try {
            playWrong();
          } catch (err) {
            void err;
          }
        }
      }
    },
      [secretWord, correctLetters, wrongLetters, playState, playCorrect, playError]
  );

  useEffect(() => {
    if (!secretWord) return;

    if (wrongGuesses >= maxWrong) {
      setPlayState("lost");
      return;
    }

    let allGuessed = true;
    for (let ch of secretWord) {
      if (ch === " ") continue;
      if (!correctLetters.includes(ch)) {
        allGuessed = false;
        break;
      }
    }

    if (allGuessed) setPlayState("won");
    else setPlayState("playing");
  }, [secretWord, correctLetters, wrongGuesses]);

  
  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        handleGuess(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleGuess]);


  // Play win sound when playState becomes 'won'
  useEffect(() => {
    if (playState === 'won') {
      try {
        playWin();
      } catch {
        // ignore play errors (browser autoplay policies)
      }
    }
  }, [playState, playWin]);

  /*Pop-Up*/
  function GamePopup({
    open,
    title,
    buttonText,
    onClose,
    soundUrl,
    showConfetti,
    message
  }) {
    const buttonRef = useRef(null);
    const audioRef = useRef(null);

    
    useEffect(() => {
      if (open && buttonRef.current) {
        buttonRef.current.focus();
      }
    }, [open]);

    useEffect(() => {
      if (!open || !soundUrl) return;

      const audio = new Audio(soundUrl);
      audioRef.current = audio;
      audio.play().catch(() => {
       
      });



      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }, [open, soundUrl]);

    if (!open) return null;

    return ReactDOM.createPortal(
      <div
        className="overlay"
        role="presentation"
        onClick={onClose}
      >
        {showConfetti && <Confetti />}

        <div
          role="dialog"
          aria-labelledby="popup-title"
          aria-modal="true"
          className="popup"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="popup-title">{title}</h2>

          {message && <p>{message}</p>}

          <button ref={buttonRef} onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>,
      document.body
    );
  }


  return (
    <main style={{ padding: 20 }}>
      <h1 className="title-text" tabIndex="0" aria-describedby="hangman-instructions">
        Hangman Game!
      </h1>

      {/* Visible instructions for sighted users and referenced by aria-describedby */}
      <p id="hangman-instructions" className="instructions">
        Press any letter key to guess a letter.
      </p>

      {/* Live region for screen readers: announces the last guess and win/lose state */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {playState === 'won' && `You won! The word was ${secretWord}.`}
        {playState === 'lost' && `You lost. The word was ${secretWord}.`}
        {lastGuess && playState === 'playing' && (
          lastGuess.type === 'correct' ? `Correct: ${lastGuess.letter}` :
          lastGuess.type === 'wrong' ? `Wrong: ${lastGuess.letter}` :
          lastGuess.type === 'already' ? `Already guessed: ${lastGuess.letter}` :
          ''
        )}
      </div>

      <div className="container">
        <img
          src={images[wrongGuesses].src}
          alt={images[wrongGuesses].alt}
          className="picture"
          tabIndex="0"
        />
      <div>
        {/* Lose popup */}
        {playState === "lost" && (
          <GamePopup
            open={true}
            title="You lose 😢"
            buttonText="Try Again"
            onClose={restartGame}
            soundUrl="/sounds/lose.mp3"
            showConfetti={false}
            message={`The word was: ${secretWord}`}
          />
        )}
       
        {/* Win popup */}
        {playState === "won" && (
          <GamePopup
            open={true}
            title="You win! 🎉"
            buttonText="Play Again"
            onClose={restartGame}
            showConfetti={true}
          />
        )}
      </div>
        <div className="textContainer">
          <p tabIndex="0">
            <strong>Word:</strong> {shownWord}
          </p>

          <p tabIndex="0">
            <strong>Wrong letters:</strong>{" "}
            {wrongLetters.join(", ") || "None"}
          </p>

          <p tabIndex="0">
            <strong>Remaining guesses:</strong>{" "}
            {Math.max(0, maxWrong - wrongGuesses)} / {maxWrong}
          </p>
        </div>
      </div>

      <p>
        <a href="/">Back to front page</a>
      </p>
    </main>
  );
}
