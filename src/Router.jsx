import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HangmanGame from "./hangman-game/hangman-game.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/hangman-game",
    element: <HangmanGame />,
  }
]);

export default router;