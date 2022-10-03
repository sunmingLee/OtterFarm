import React, { useState } from "react";
import "./Tetris.css";
import Game from "../../components/Tetris/Game/Game";
import Menu from "../../components/Tetris/Menu/Menu";

//hooks
import { useGameOver } from "../../hooks/useGameOver";
function Tetris() {
  const [firstTime, setFirstTime] = useState(true); //첫 시도인지 확인

  const start = () => {
    setFirstTime(false);

    console.log("hi");
  };
  return (
    <div className="tetris">
      {firstTime ? (
        <Menu handleStart={start} />
      ) : (
        <Game rows={20} columns={10} />
      )}
    </div>
  );
}

export default Tetris;
