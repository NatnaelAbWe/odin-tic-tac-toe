// biulding the game console //

// biulding the game board

function GameBoard(){

  const row = 3;
  const column = 3;
  const board = [];

  for(let i = 0; i < row; i++){
    board[i] = []
    for(j = 0; j < column; j++){
      board[i].push('')
    }
  }

  const getBoard = () => board;

  const resetBoard = () => {
    for(let i = 0; i < row; i++){
      board[i] = []
      for(j = 0; j < column; j++){
        board[i].push('')
      }
    }        
  }

  const placeMarker = (row, col, marker) => {
    if (board[row][col] === '') {
      board[row][col] = marker;
      return true; 
    }
    return false; 
  };

  const printBoard = () => {
    board.forEach(row => {console.log(row.join(' | '))});
  }
  
  return{getBoard, resetBoard, placeMarker, printBoard}
}

function Player(name, marker){

  const getname = () => name
  const getmarker = () => marker

  return {getname, getmarker}
}

const GameController = (() => {
const board = GameBoard.getBoard(); // ✅ gets the real game board

  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let currentPlayer = player1;
  let gameOver = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (row, col) => {
    if (gameOver) return;

    const marker = currentPlayer.getmarker(); // or getMarker(), depending on your naming
    const success = gameBoard.placeMarker(row, col, marker);

    if (!success) {
      console.log("Cell already taken!");
      return;
    }

    gameBoard.printBoard(); // optional for debugging

    if (checkWinner(marker)) {
      console.log(`${currentPlayer.getname()} wins!`);
      gameOver = true;
      return;
    }

    if (checkTie()) {
      console.log("It's a tie!");
      gameOver = true;
      return;
    }

    switchPlayer();
  };

  const checkWinner = (marker) => {
    const board = gameBoard.getBoard();
  
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === marker && board[i][1] === marker && board[i][2] === marker) {
        return true;
      }
    }
  
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] === marker && board[1][i] === marker && board[2][i] === marker) {
        return true;
      }
    }
  
    // Check diagonals
    if (
      (board[0][0] === marker && board[1][1] === marker && board[2][2] === marker) ||
      (board[0][2] === marker && board[1][1] === marker && board[2][0] === marker)
    ) {
      return true;
    }
  
    return false;
  };
  

  const checkTie = () => {
    const board = gameBoard.getBoard();
    return board.flat().every(cell => cell !== '');
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    console.log("Game reset!");
  };

  const getCurrentPlayer = () => currentPlayer;

const getWinner = () => {
  if (!gameOver) return null;
  return currentPlayer;
};


return {
  playRound,
  resetGame,
  getCurrentPlayer,
  getWinner
};

})();

const DisplayController = (() => {
  const boardContainer = document.getElementById("game-board");
  const playerTurnText = document.getElementById("player-turn");
  const gameResultText = document.getElementById("game-result");
  const restartBtn = document.getElementById("restart-btn");

  const renderBoard = () => {
    boardContainer.innerHTML = ''; // Clear previous cells
    const board = GameBoard().getBoard(); // This is just to get size

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.row = row;
        cellDiv.dataset.col = col;

        cellDiv.addEventListener("click", () => {
          if (cellDiv.textContent !== "") return;

          GameController.playRound(row, col);

          updateBoard();
          updateTurn();

          if (checkGameOver()) {
            endGame();
          }
        });

        boardContainer.appendChild(cellDiv);
      }
    }
  };

  const updateBoard = () => {
    const board = GameBoard().getBoard();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      const row = cell.dataset.row;
      const col = cell.dataset.col;
      cell.textContent = board[row][col];
    });
  };

  const updateTurn = () => {
    if (!checkGameOver()) {
      const current = GameController.getCurrentPlayer();
      playerTurnText.textContent = `${current.getname()}'s turn (${current.getmarker()})`;
    }
  };

  const checkGameOver = () => {
    const result = gameResultText.textContent;
    return result.includes("wins") || result.includes("tie");
  };

  const endGame = () => {
    const winner = GameController.getWinner();
    if (winner) {
      gameResultText.textContent = `${winner.getname()} wins!`;
    } else {
      gameResultText.textContent = `It's a tie!`;
    }
  };

  const resetDisplay = () => {
    GameController.resetGame();
    gameResultText.textContent = "";
    playerTurnText.textContent = `Player 1's turn (X)`;
    renderBoard();
  };

  restartBtn.addEventListener("click", resetDisplay);

  // Initial render
  renderBoard();
})();



