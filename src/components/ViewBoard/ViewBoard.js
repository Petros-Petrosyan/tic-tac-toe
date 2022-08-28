import React from "react";
import classes from "./ViewBoard.module.scss";
import { Cubes } from "../";

const ViewBoard = (props) => {
  const {
    lastCubes,
    winnerPosition,
    isPlayerX,
    isOneStep,
    winnerPlayer,
    playerCount,
    changeCubeValueHandler,
    startNewHandler,
    goBackStepHandler,
    startGameHandler,
    room,
    startInSameRoom,
  } = props;

  const printCubes = lastCubes.map((cube, i) => {
    return (
      <Cubes
        key={i}
        value={cube}
        winnerPosition={winnerPosition}
        cubeIndex={i}
        changeCubeValueHandler={changeCubeValueHandler}
      />
    );
  });

  let currentPlayer;
  let startBtn = null;
  let leaveRoomBtn = null;
  let previousStepBtn = null;
  if (winnerPlayer) {
    let currentPlayerText =
      winnerPlayer.length > 1 ? winnerPlayer : `Winner Player: ${winnerPlayer}`;
    currentPlayer = <h2>{currentPlayerText}</h2>;
    startBtn = (
      <div className={classes.main__button}>
        <button onClick={!room ? startNewHandler : startInSameRoom}>
          Start new
        </button>
      </div>
    );

    if (room) {
      leaveRoomBtn = (
        <div className={classes.main__button}>
          <button onClick={startNewHandler}>Leave Room</button>
        </div>
      );
    }
  } else {
    currentPlayer = <h2>Player {isPlayerX ? "X" : "O"}</h2>;
    if (isOneStep && !room) {
      previousStepBtn = (
        <div className={classes.main__button}>
          <button onClick={goBackStepHandler}>One step back</button>
        </div>
      );
    }
  }

  let content = (
    <main className={classes.main}>
      <header>
        <h1>Tic Tac Toe</h1>
      </header>
      <section className={classes.main__start}>
        <div
          onClick={() => startGameHandler(2)}
          className={classes.main__start__section}
        >
          PLAY WITH FRIENDS
        </div>
        <div
          onClick={() => startGameHandler(1)}
          className={classes.main__start__section}
        >
          PLAY WITH COMPUTER
        </div>
      </section>
    </main>
  );

  if (playerCount) {
    content = (
      <main className={classes.main}>
        <header>
          <h1>Tic Tac Toe</h1>
          {currentPlayer}
        </header>
        <section className={classes.main__container}>{printCubes}</section>
        <footer>
          <div className={classes.main__flex}>
            {startBtn}
            {leaveRoomBtn}
          </div>

          {previousStepBtn}
        </footer>
      </main>
    );
  }

  return content;
};

export { ViewBoard };
