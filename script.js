const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const aiBtn = document.getElementById('aiBtn');

let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = 'X';
let isGameActive = true;
let againstAI = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !isGameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    if (checkWinner()) {
        statusDisplay.textContent = `${currentPlayer} wins!`;
        statusDisplay.classList.add('win');
        isGameActive = false;
    } else if (isDraw()) {
        statusDisplay.textContent = `It's a draw!`;
        statusDisplay.classList.add('draw');
        isGameActive = false;
    } else {
        switchPlayer();
        if (againstAI && currentPlayer === 'O') {
            setTimeout(aiMove, 1000); // Delay AI's move by 1 second
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `${currentPlayer}'s turn`;
    statusDisplay.className = ''; // Reset status text color
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] !== "" && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}

function isDraw() {
    return gameState.every(cell => cell !== "");
}

function restartGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `${currentPlayer}'s turn`;
    statusDisplay.className = '';
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('X', 'O');
    });
}

function aiMove() {
    let availableCells = gameState
        .map((cell, index) => (cell === "" ? index : null))
        .filter(index => index !== null);

    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
    cell.textContent = 'O';
    cell.classList.add('O');

    if (checkWinner()) {
        statusDisplay.textContent = `O wins!`;
        statusDisplay.classList.add('win');
        isGameActive = false;
    } else if (isDraw()) {
        statusDisplay.textContent = `It's a draw!`;
        statusDisplay.classList.add('draw');
        isGameActive = false;
    } else {
        switchPlayer();
    }
}

restartBtn.addEventListener('click', restartGame);
aiBtn.addEventListener('click', () => {
    againstAI = !againstAI;
    aiBtn.textContent = againstAI ? 'Play vs Human' : 'Play vs AI';
    restartGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

restartGame();
