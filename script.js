const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

const aiToggle = document.getElementById("aiToggle");
const newGameBtn = document.getElementById("newGame");
const resetAllBtn = document.getElementById("resetAll");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

let scores = { X:0, O:0, D:0 };

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// create cells
boardEl.innerHTML = "";
board.forEach((_, i) => {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  boardEl.appendChild(cell);
});

const cells = document.querySelectorAll(".cell");

cells.forEach(cell => cell.addEventListener("click", handleCell));

function handleCell(e){
  const index = e.target.dataset.index;

  if(board[index] !== "" || !gameActive) return;

  placeMark(index, currentPlayer);
  checkResult();

  if(gameActive && aiToggle.checked && currentPlayer === "O"){
    setTimeout(aiMove, 350);
  }
}

function placeMark(index, player){
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add("taken");
}

function switchPlayer(){
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
}

function checkResult(){
  for(let pattern of winPatterns){
    const [a,b,c] = pattern;

    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      gameActive = false;
      statusEl.textContent = `🎉 Player ${board[a]} wins!`;

      pattern.forEach(i => cells[i].classList.add("win"));

      board[a] === "X" ? scores.X++ : scores.O++;
      updateScore();
      return;
    }
  }

  if(!board.includes("")){
    gameActive = false;
    statusEl.textContent = "😄 It's a draw!";
    scores.D++;
    updateScore();
    return;
  }

  switchPlayer();
}

function aiMove(){
  // simple: choose random empty spot
  let empty = board
    .map((v,i) => v === "" ? i : null)
    .filter(v => v !== null);

  if(empty.length === 0) return;

  const randomIndex = empty[Math.floor(Math.random() * empty.length)];
  placeMark(randomIndex, "O");
  checkResult();
}

function updateScore(){
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.D;
}

function newGame(){
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  statusEl.textContent = "Player X's turn";

  cells.forEach(c=>{
    c.textContent = "";
    c.className = "cell";
  });
}

function resetAll(){
  scores = { X:0, O:0, D:0 };
  updateScore();
  newGame();
}

newGameBtn.addEventListener("click", newGame);
resetAllBtn.addEventListener("click", resetAll);