import React, { useState, useEffect } from "react";
import update from "react-addons-update";
import io from "socket.io-client";
import { ViewBoard } from "../../components";
import { calculateWinner, generateNextStepIndex } from "../../utils.js";

const socket = io.connect("http://localhost:3001");

const Board = () => {
  const [cubes, setCubes] = useState([Array(9).fill(null)]);
  const [isPlayerX, setIsPlayerX] = useState(true);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
  const [winnerPosition, setWinnerPosition] = useState(null);
  const [playerCount, setPlayerCount] = useState(null);
  const [room, setRoom] = useState(null);
  const [messageReceived, setMessageReceived] = useState("");

  useEffect(() => {
    const { winnerPlayer, winnerPosition } = calculateWinner(
      cubes[cubes.length - 1]
    );
    setWinnerPosition(winnerPosition);
    setWinnerPlayer(winnerPlayer);
  }, [cubes]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.cubeIndex);
    });
  }, [socket]);

  useEffect(() => {
    changeCubeValue(messageReceived);
  }, [messageReceived]);

  const startGame = (playerCount) => {
    if (playerCount === 2) {
      const roomPrompt = prompt("Write room name");
      if (roomPrompt) {
        setRoom(roomPrompt);
        setPlayerCount(playerCount);
        socket.emit("join_room", roomPrompt);
      }
    } else {
      setPlayerCount(playerCount);
    }
  };

  const changeCubeValue = (cubeIndex) => {
    socket.emit("send_message", { cubeIndex, room });
    const lastCubes = cubes[cubes.length - 1];
    if (!winnerPlayer && lastCubes[cubeIndex] === null) {
      const copiedLastCubes = update(lastCubes, {
        [cubeIndex]: { $set: isPlayerX ? "X" : "O" },
      });
      const newCubes = update(cubes, {
        $splice: [[cubes.length, 0, copiedLastCubes]],
      });

      const LastLocalCube = [...lastCubes];
      LastLocalCube[cubeIndex] = "X";
      const { winnerPlayer: _localWinnerPlayer } =
        calculateWinner(LastLocalCube);

      if (playerCount === 1 && !_localWinnerPlayer) {
        const nextStepIndex = generateNextStepIndex(cubeIndex, cubes);
        copiedLastCubes[nextStepIndex] = !isPlayerX ? "X" : "O";
      } else {
        setIsPlayerX(!isPlayerX);
      }
      setCubes(newCubes);
    }
  };

  const startNew = () => {
    setCubes([Array(9).fill(null)]);
    setIsPlayerX(true);
    setWinnerPlayer(null);
    setWinnerPosition(null);
    setPlayerCount(null);
    setRoom(null);
  };
  const startInSameRoom = () => {
    setCubes([Array(9).fill(null)]);
    setIsPlayerX(true);
    setWinnerPlayer(null);
    setWinnerPosition(null);
  };

  const goBackStep = () => {
    if (cubes.length > 1) {
      const newCubes = update(cubes, { $splice: [[cubes.length - 1, 1]] });
      setCubes(newCubes);
      if (playerCount !== 1) {
        setIsPlayerX(!isPlayerX);
      }
    }
  };

  return (
    <ViewBoard
      lastCubes={cubes[cubes.length - 1]}
      winnerPosition={winnerPosition}
      isPlayerX={isPlayerX}
      isOneStep={cubes.length > 1}
      winnerPlayer={winnerPlayer}
      playerCount={playerCount}
      room={room}
      startGameHandler={startGame}
      changeCubeValueHandler={changeCubeValue}
      startNewHandler={startNew}
      goBackStepHandler={goBackStep}
      startInSameRoom={startInSameRoom}
    />
  );
};

export { Board };
