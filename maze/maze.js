const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let maze = [];
let solutionPath = [];

function generateMaze() {
    maze = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Simple maze generation logic (e.g., recursive backtracking)
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            maze[row][col] = Math.random() > 0.7 ? 1 : 0; // Randomly generate walls
        }
    }

    saveMazeToLocalStorage();
    drawMaze();
}

function solveMaze() {
    solutionPath = [];
    // Implement maze-solving logic (e.g., DFS, BFS, A*)
    // ...
    drawSolution();
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawSolution() {
    ctx.fillStyle = 'red';
    for (const [row, col] of solutionPath) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
}

function saveMazeToLocalStorage() {
    const mazeHistory = JSON.parse(localStorage.getItem('mazeHistory')) || [];
    mazeHistory.push(maze);
    localStorage.setItem('mazeHistory', JSON.stringify(mazeHistory));
    updateMazeHistoryDropdown();
}

function updateMazeHistoryDropdown() {
    const mazeHistory = JSON.parse(localStorage.getItem('mazeHistory')) || [];
    const dropdown = document.getElementById('mazeHistory');
    dropdown.innerHTML = '<option value="">Select a saved maze</option>';
    mazeHistory.forEach((_, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Maze ${index + 1}`;
        dropdown.appendChild(option);
    });
}

document.getElementById('generateMaze').addEventListener('click', generateMaze);
document.getElementById('solveMaze').addEventListener('click', solveMaze);
document.getElementById('mazeHistory').addEventListener('change', (e) => {
    const mazeHistory = JSON.parse(localStorage.getItem('mazeHistory')) || [];
    const selectedMaze = mazeHistory[e.target.value];
    if (selectedMaze) {
        maze = selectedMaze;
        drawMaze();
    }
});

updateMazeHistoryDropdown();