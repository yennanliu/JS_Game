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
    maze = Array.from({ length: rows }, () => Array(cols).fill(1)); // Start with all walls

    // Ensure the maze has a simple solution by carving a straightforward path from start to end
    let currentRow = 0;
    let currentCol = 0;
    while (currentRow < rows - 1 || currentCol < cols - 1) {
        maze[currentRow][currentCol] = 0; // Mark the cell as part of the path

        if (currentRow === rows - 1) {
            currentCol++; // Move right if at the bottom row
        } else if (currentCol === cols - 1) {
            currentRow++; // Move down if at the rightmost column
        } else if (Math.random() > 0.5) {
            currentRow++; // Randomly move down
        } else {
            currentCol++; // Randomly move right
        }
    }
    maze[currentRow][currentCol] = 0; // Mark the goal cell as part of the path

    // Add fewer random walls to make the maze simpler
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] !== 0) {
                maze[row][col] = Math.random() > 0.85 ? 1 : 0; // Fewer walls
            }
        }
    }

    drawMaze(); // Ensure the maze is drawn immediately after generation
    saveMazeToLocalStorage();
}

function solveMaze() {
    solutionPath = [];

    // Implement a simple Depth-First Search (DFS) to solve the maze
    function dfs(row, col, visited) {
        if (row < 0 || col < 0 || row >= rows || col >= cols || maze[row][col] === 1 || visited[row][col]) {
            return false;
        }

        visited[row][col] = true;
        solutionPath.push([row, col]);

        // Check if we reached the bottom-right corner (goal)
        if (row === rows - 1 && col === cols - 1) {
            return true;
        }

        // Explore neighbors: down, right, up, left
        if (dfs(row + 1, col, visited) || dfs(row, col + 1, visited) || dfs(row - 1, col, visited) || dfs(row, col - 1, visited)) {
            return true;
        }

        // Backtrack if no solution found
        solutionPath.pop();
        return false;
    }

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    if (!dfs(0, 0, visited)) {
        alert('No solution found for the maze!');
    }

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