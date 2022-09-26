import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  SPEED_STEP,
  SPAWN_INTERVAL,
} from "../../components/FallingGame/constants";
import {
  controlOptions,
  dotsState,
  timeState,
} from "../../components/FallingGame/atom";
import { createDot, calculatePoints } from "../../components/FallingGame/utils";
import Item from "../../components/FallingGame/Item";
import Score from "../../components/FallingGame/Score";
import Timer from "../../components/FallingGame/Timer";
import "./FallingGame.css";
import otter from "../../assets/images/otter-basket.png";
import Button from "@material-ui/core/Button";

const FallingGame = () => {
  const [dots, updateDots] = useRecoilState(dotsState);
  const [controlState, setControlState] = useRecoilState(controlOptions);
  const [score, setScore] = useState(0);
  const [time, setTime] = useRecoilState(timeState);
  const intervalRef = useRef();
  const fieldRef = useRef();
  const requestRef = useRef();

  const OtterStyle = {
    position: "absolute",
    bottom: 0,
    left: "630px",
    height: "200px",
  };

  const advanceStep = useCallback(() => {
    const addScore = (dot) => {
      setScore((prev) => prev + calculatePoints(dot));
    };
    updateDots((oldDots) => {
      const newDots = [];
      oldDots.map((dot) => {
        const dotX =
          ((fieldRef.current.offsetWidth - dot.height) * dot.x) / 100;
        const y = dot.y + (SPEED_STEP * controlState.speed) / 60;
        const otterX = parseInt(otterRef.current.style.left.slice(0, -2));
        var hasEaten = false;
        if (
          Math.abs(dotX - otterX) <= otterRef.current.offsetWidth &&
          y >=
            fieldRef.current.offsetHeight -
              otterRef.current.offsetHeight -
              dot.height / 2
        ) {
          hasEaten = true;
          addScore(dot);
        }

        const newY = dot.y + (SPEED_STEP * controlState.speed) / 60;
        if (
          newY <= fieldRef.current.offsetHeight - dot.height / 2 &&
          !hasEaten
        ) {
          newDots.push({
            ...dot,
            y: newY,
          });
        }
      });

      return newDots;
    });

    requestRef.current = requestAnimationFrame(advanceStep);
  }, [controlState.speed, updateDots]);

  // 게임 시작
  const onStart = useCallback(() => {
    setControlState({ ...controlState, isRunning: true });
  }, [controlState, setControlState]);

  const spawnDot = useCallback(() => {
    updateDots((oldDots) => [...oldDots, createDot()]);
  }, [updateDots]);

  useEffect(() => {
    const stop = () => {
      intervalRef.current && clearInterval(intervalRef.current);
      requestRef.current && cancelAnimationFrame(requestRef.current);
    };
    if (controlState.isRunning) {
      intervalRef.current = setInterval(spawnDot, SPAWN_INTERVAL);
      requestRef.current = requestAnimationFrame(advanceStep);
    } else {
      stop();
    }
    return () => stop();
  }, [controlState.isRunning, advanceStep, spawnDot]);

  const clear = useCallback(() => {
    setControlState({ ...controlState, isRunning: false, speed: 10 });
    updateDots([]);
    setScore(0);
    setTime(5);
  }, [setControlState, setScore, updateDots, controlState, setTime]);

  // 수달 좌우로 움직이기
  const otterRef = useRef();
  let moveBy = 10;
  useEffect(() => {
    const moveOtter = (e) => {
      let newLeft;
      switch (e.key) {
        case "ArrowLeft":
          newLeft = parseInt(otterRef.current.style.left) - moveBy;
          if (newLeft < 0) {
            newLeft = 0;
          }
          break;
        case "ArrowRight":
          newLeft = parseInt(otterRef.current.style.left) + moveBy;
          if (newLeft > fieldRef.current.offsetWidth * 0.9) {
            newLeft = fieldRef.current.offsetWidth * 0.9;
          }
          break;
        default:
          break;
      }
      otterRef.current.style.left = `${newLeft}px`;
    };

    document.addEventListener("keydown", moveOtter);

    return () => {
      document.removeEventListener("keydown", moveOtter);
    };
  }, []);

  // 1초씩 제한시간 감소
  useEffect(() => {
    if (controlState.isRunning) {
      const interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [controlState.isRunning, time]);

  // 게임 시작 전
  if (!controlState.isRunning) {
    return (
      <div className="falling-game">
        <div className="title">먹이 냠냠</div>
        <div className="game-over-wrap">
          <div className="game-over"></div>
          <div>
            <h1>수달은 아직도 배고프다</h1>
            <div className="game-button-wrap">
              <Button
                style={{
                  fontFamily: "neo",
                  fontWeight: "bold",
                  backgroundColor: "#DAB49D",
                  marginLeft: "10px",
                }}
                variant="contained"
                onClick={clear}
              >
                게임방법
              </Button>
              <Button
                style={{
                  fontFamily: "neo",
                  fontWeight: "bold",
                  backgroundColor: "#DAB49D",
                  marginLeft: "10px",
                }}
                variant="contained"
                onClick={onStart}
              >
                시작하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // 게임 시작 후

    // 게임중
    if (time > 0) {
      return (
        <div className="falling-game">
          <div className="title">먹이 냠냠</div>
          <div className="game-main">
            <div className="panel">
              <Score score={score} />
              <Timer />
            </div>
            <div className="field" ref={fieldRef}>
              {dots.map((dot, index) => {
                const x =
                  ((fieldRef.current.offsetWidth - dot.height) * dot.x) / 100;
                return (
                  <Item key={`dot-${index}`} {...dot} x={x} index={index} />
                );
              })}
              <img
                style={OtterStyle}
                src={otter}
                alt="basket otter"
                ref={otterRef}
              />
            </div>
          </div>
        </div>
      );
    } else {
      // 게임 종료
      return (
        <div className="falling-game">
          <div className="title">먹이 냠냠</div>
          <div className="game-over-wrap">
            <div className="game-over"></div>
            <div>
              <h1>Game Over!!!</h1>
              <Score style={{ fontSize: "50px" }} score={score} />
              <Button
                style={{
                  fontFamily: "neo",
                  fontWeight: "bold",
                  backgroundColor: "#DAB49D",
                  marginLeft: "10px",
                }}
                variant="contained"
                onClick={clear}
              >
                다시하기
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default FallingGame;
