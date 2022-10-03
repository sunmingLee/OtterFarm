import "./Tetris.css";

import Board from "../../../components/Tetris/Board/Board";
import GameController from "../../../components/Tetris/GameController/GameController";
import GameStats from "../../../components/Tetris/GameStats/GameStats";
import Previews from "../../../components/Tetris/Previews/Previews";

import { useBoard } from "../../../hooks/useBoard";
import { useGameStats } from "../../../hooks/useGameStats";
import { usePlayer } from "../../../hooks/usePlayer";

const Tetris = ({ rows, columns, setGameOver, gameStats, addLinesCleared }) => {
  // const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer();
  const [board, setBoard] = useBoard({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared,
  });

  return (
    <div className="Tetris">
      <Board board={board} />

      <GameStats gameStats={gameStats} />
      <Previews tetrominoes={player.tetrominoes} />

      <GameController
        board={board}
        gameStats={gameStats}
        player={player}
        setGameOver={setGameOver}
        setPlayer={setPlayer}
      />
    </div>
  );
};

export default Tetris;
