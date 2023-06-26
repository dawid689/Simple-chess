const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const width = 8;
let playerMove = "black";
playerDisplay.textContent = "black";

const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "grey" : "creamy");
    } else {
      square.classList.add(i % 2 === 0 ? "creamy" : "grey");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }

    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }

    gameBoard.append(square);
  });
}

createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();

  const correctMove = draggedElement.firstChild.classList.contains(playerMove);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  const opponentMove = playerMove === "white" ? "black" : "white";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentMove);
  const whichPiece = draggedElement.id;

  const targetId =
    Number(e.target.getAttribute("square-id")) ||
    Number(e.target.parentNode.getAttribute("square-id"));
  const startId = Number(startPositionId);

  if (correctMove) {
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = "You cannot go here!";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }
    if (
      whichPiece === "pawn" &&
      takenByOpponent &&
      startId + width === targetId
    ) {
      infoDisplay.textContent = "You cannot go here!";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      return;
    }
    if (valid) {
      e.target.append(draggedElement);
      checkForWin();
      changePlayer();
      return;
    }
  }
}

function changePlayer() {
  if (playerMove === "black") {
    reverseIds();
    playerMove = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerMove = "black";
    playerDisplay.textContent = "black";
  }
}

function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", width * width - 1 - i)
  );
}

function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}

function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));
  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  const taken = target.classList.contains("piece");

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      // TODO: pawn promotion
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        (startId + width === targetId && !taken) ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case "knight":
      if (
        startId + width * 2 + 1 === targetId ||
        startId + width * 2 - 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;
    case "bishop":
      // TODO: preventing jumping over figures during diagonal movements
      if (
        // first direction
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          )) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          )) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          )) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 + 4}"].firstChild`
          )) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 + 5}"].firstChild`
          )) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 + 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 6 + 6}"].firstChild`
          )) ||
        // second direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          )) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          )) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          )) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 - 4}"].firstChild`
          )) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 - 5}"].firstChild`
          )) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 - 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 6 - 6}"].firstChild`
          )) ||
        // third direction
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          )) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          )) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          )) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 + 4}"].firstChild`
          )) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 + 5}"].firstChild`
          )) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 + 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 6 + 6}"].firstChild`
          )) ||
        // fourth direction
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          )) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          )) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          )) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 - 4}"].firstChild`
          )) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 - 5}"].firstChild`
          )) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 - 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 6 - 6}"].firstChild`
          ))
      ) {
        return true;
      }
      break;
    case "rook":
      if (
        // first direction
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        // second direction
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        // third direction
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        // fourth direction
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "queen":
      // TODO: preventing jumping over figures during diagonal movements
      if (
        // first direction
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          )) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          )) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          )) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 + 4}"].firstChild`
          )) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 + 5}"].firstChild`
          )) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 + 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 6 + 6}"].firstChild`
          )) ||
        // second direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          )) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          )) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          )) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 - 4}"].firstChild`
          )) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 - 5}"].firstChild`
          )) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 - 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 6 - 6}"].firstChild`
          )) ||
        // third direction
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          )) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          )) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          )) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 + 4}"].firstChild`
          )) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 + 5}"].firstChild`
          )) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId - width + 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 2 + 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 3 + 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 4 + 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 5 + 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId - width * 6 + 6}"].firstChild`
          )) ||
        // fourth direction
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          )) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          )) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          )) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 - 4}"].firstChild`
          )) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 - 5}"].firstChild`
          )) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(
            `[square-id="${startId + width - 1}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 2 - 2}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 3 - 3}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 4 - 4}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 5 - 5}"].firstChild`
          ) &&
          !document.querySelector(
            `[square-id="${startId + width * 6 - 6}"].firstChild`
          )) ||
        // fifth direction
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)
            .firstChild) ||
        // sixth direction
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)
            .firstChild) ||
        // seventh direction
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 6}"]`).firstChild) ||
        // eighth direction
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 6}"]`).firstChild)
      ) {
        return true;
      }
      break;
    case "king":
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width - 1 === targetId ||
        startId + width + 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
      ) {
        return true;
      }
      break;
  }
}

function checkForWin() {
  // TODO: the proper rules of checking and checkmating the king
  const kings = Array.from(document.querySelectorAll("#king"));
  if (!kings.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.innerHTML = "Black player wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.innerHTML = "White player wins!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}
