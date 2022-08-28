import { WINNER_LINES } from "../constants";

export const calculateWinner = (cubes) => {
  for (let i = 0; i < WINNER_LINES.length; i++) {
    const [a, b, c] = WINNER_LINES[i];
    if (cubes[a] && cubes[a] === cubes[b] && cubes[a] === cubes[c]) {
      return {
        winnerPlayer: cubes[a],
        winnerPosition: [a, b, c],
      };
    }
  }
  if (!cubes.includes(null)) {
    return {
      winnerPlayer: "The game ended in a draw",
      winnerPosition: null,
    };
  }
  return {
    winnerPlayer: null,
    winnerPosition: null,
  };
};

export const generateLogicalStep = (lastCubes, cubeIndex, player) => {
  let logicalStep = false;
  for (let i = 0; i < WINNER_LINES.length; i++) {
    const [a, b, c] = WINNER_LINES[i];
    const aIsNull =
      lastCubes[b] &&
      lastCubes[c] &&
      lastCubes[b] === lastCubes[c] &&
      lastCubes[c] === player &&
      lastCubes[a] === null &&
      cubeIndex !== a;
    const bIsNull =
      lastCubes[a] &&
      lastCubes[c] &&
      lastCubes[a] === lastCubes[c] &&
      lastCubes[c] === player &&
      lastCubes[b] === null &&
      cubeIndex !== b;
    const cIsNull =
      lastCubes[a] &&
      lastCubes[b] &&
      lastCubes[a] === lastCubes[b] &&
      lastCubes[b] === player &&
      lastCubes[c] === null &&
      cubeIndex !== c;

    if (aIsNull) {
      logicalStep = a;
    } else if (bIsNull) {
      logicalStep = b;
    } else if (cIsNull) {
      logicalStep = c;
    }
  }
  return logicalStep;
};

export const generateNextStepIndex = (cubeIndex, cubes) => {
  let lastCubes = [...cubes[cubes.length - 1]];
  lastCubes[cubeIndex] = "X";
  let randomStepIndex = null;
  const freeCubes = lastCubes.filter((el) => el === null);

  if (freeCubes.length > 1) {
    while (true) {
      randomStepIndex = Math.floor(Math.random() * 9);
      if (
        lastCubes[randomStepIndex] === null &&
        cubeIndex !== randomStepIndex
      ) {
        break;
      }
    }

    const withOLogicalStepIndex = generateLogicalStep(
      lastCubes,
      cubeIndex,
      "O"
    );
    const withXLogicalStepIndex = generateLogicalStep(
      lastCubes,
      cubeIndex,
      "X"
    );

    if (withOLogicalStepIndex || withOLogicalStepIndex === 0) {
      return withOLogicalStepIndex;
    } else if (withXLogicalStepIndex || withXLogicalStepIndex === 0) {
      return withXLogicalStepIndex;
    } else {
      return randomStepIndex;
    }
  }
};
