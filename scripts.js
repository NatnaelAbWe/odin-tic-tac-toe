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

const gameController = (function(){

  const gameBoard = GameBoard();

  const player1 = Player("player x","X")
  const player2 = Player("player O","O")

  let currentPlayer = player1
  
  function getCurrentPlayer(){
    return currentPlayer
  }

  function switchPlayer(){
    currentPlayer = currentPlayer == player1? player2:player1;
  }

  function playRound(row, col) {
    const currentPlayer = getCurrentPlayer();
    const marker = currentPlayer.getmarker();
    const board = gameBoard.getBoard();
  
    if (board[row][col] === '') {
      gameBoard.placeMarker(row, col, marker);
  
      if (checkTheWinner(marker)) {
        console.log(`${currentPlayer.getname()} wins!`);
        gameBoard.printBoard();
        return;
      }
  
      if (isDraw()) {
        console.log("It's a draw!");
        gameBoard.printBoard();
        return;
      }
  
      switchPlayer();
    } else {
      console.log("Invalid move: Cell is already occupied.");
    }
  }
  

  function checkTheWinner(marker){

    const board = gameBoard.getBoard()
    // check the row

    for(let i = 0; i < 3; i++){
      if (board[i][0] == marker && board[i][1] == marker && board[i][2] == marker) {
        return true
      }
    }

    // check the column

    for(let i = 0; i < 3; i++){
      if (board[0][i] == marker && board[1][i] == marker && board[2][i]== marker) {
        return true
      }
    }

    // check the diagonall -> from left to write 

    
      
    if(board[0][0] == marker && board[1][1] == marker && board[2][2] == marker){
      return true
    }
    
    if (
      board[0][2] == marker &&
      board[1][1] == marker &&
      board[2][0] == marker
    ) {
      return true;
    }
    
    return false
  }

  function isDraw(){

    const board = gameBoard.getBoard()

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if (board[i][j] == ''){
          return false
        }
      }
    }
    return true
  }

  function resetGame(){
    gameBoard.resetBoard();
  currentPlayer = player1;
  console.log("Game reset. Player X starts.");
  gameBoard.printBoard();
  }

  return {
    playRound,
    resetGame,
    getBoard: gameBoard.getBoard,
    getCurrentPlayer,
    checkWinner: checkTheWinner,
    isDraw
  };
  
  
})();


// dom object

const board = document.querySelector('#board')
const resetBtn = document.querySelector('#reset-btn')
const statusMsg = document.querySelector('#status-msg')

function renderBoard() {
  const boardState = gameController.getBoard();
  board.innerHTML = ''; // Clear previous cells

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = boardState[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;
      board.appendChild(cell);
    }
  }
}

board.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell')) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    // Save current player BEFORE the move
    const currentPlayer = gameController.getCurrentPlayer();
    const marker = currentPlayer.getmarker();
    const name = currentPlayer.getname();

    gameController.playRound(row, col);
    renderBoard();

    // Check for winner/draw before showing turn
    if (gameController.checkWinner(marker)) {
      statusMsg.textContent = `${name} wins!`;
    } else if (gameController.isDraw()) {
      statusMsg.textContent = "It’s a draw!";
    } else {
      statusMsg.textContent = `${gameController.getCurrentPlayer().getname()}'s turn`;
    }
  }
});


function updateStatus() {
  const boardState = gameController.getBoard();
  const currentPlayer = gameController.getCurrentPlayer();
  const marker = currentPlayer.getmarker();

  if (gameController.checkWinner(marker)) {
    statusMsg.textContent = `${currentPlayer.getname()} wins!`;
  } else if (gameController.isDraw()) {
    statusMsg.textContent = "It’s a draw!";
  } else {
    statusMsg.textContent = `${currentPlayer.getname()}'s turn`;
  }
}

resetBtn.addEventListener('click', () => {
  gameController.resetGame(); // reset board + current player
  renderBoard();              // show empty board
  updateStatus();             // reset status message
});


renderBoard();
updateStatus();



