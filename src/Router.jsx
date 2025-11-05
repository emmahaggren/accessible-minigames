import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import JumpGame from "./jump-game/JumpGame.jsx";
import MemoryGame from "./memory-game/memory-game.jsx";
import QuizGame from "./quiz-game/quiz-game.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/jump-game",
    element: <JumpGame />,
  },
  {
    path: "/memory-game",
    element: <MemoryGame />,
  },
  {
    path: "/quiz-game",
    element: <QuizGame />,
  }
]);

export default router;