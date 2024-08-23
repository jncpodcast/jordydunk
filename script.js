const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dunkGif = document.getElementById('dunkGif');
const scoreElement = document.getElementById('score');
const instructions = document.getElementById('instructions');

const target = {
    x: Math.random() * (canvas.width - 100),
    y: Math.random() * (canvas.height - 100),
    radius: 40,
    hit: false
};

let score = 0;
let gamePaused = false;
let intervalTime = 2000; // Initial interval time for target movement
let intervalId;

// Start the game loop
startGame();

function startGame() {
    intervalId = setInterval(() => {
        if (!gamePaused && !target.hit) {
            resetTarget();
            updateGame();
        }
    }, intervalTime);

    updateGame();
}

canvas.addEventListener('click', handleClick);
dunkGif.addEventListener('click', handleClick);

function handleClick(event) {
    if (gamePaused) {
        gamePaused = false;
        dunkGif.style.display = 'none'; // Hide the GIF
        canvas.style.display = 'block'; // Show the canvas
        instructions.style.display = 'none'; // Hide instructions
        resetTarget();
        increaseDifficulty(); // Make the target harder to hit after each score
        updateGame();
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const dist = Math.sqrt((clickX - target.x) ** 2 + (clickY - target.y) ** 2);

    if (dist < target.radius) {
        target.hit = true;
        score++;
        scoreElement.textContent = `Score: ${score}`;
        gamePaused = true;
        showGif(); // Show the animated GIF
    }
}

function drawTarget() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius - 10, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius - 20, 0, Math.PI * 2, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius - 30, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function resetTarget() {
    target.hit = false;
    target.x = Math.random() * (canvas.width - 2 * target.radius) + target.radius;
    target.y = Math.random() * (canvas.height - 2 * target.radius) + target.radius;
}

function showGif() {
    canvas.style.display = 'none'; // Hide the canvas
    dunkGif.style.display = 'block'; // Show the GIF
    instructions.style.display = 'block'; // Show instructions
}

function updateGame() {
    if (gamePaused) return;

    drawTarget();

    requestAnimationFrame(updateGame);
}

function increaseDifficulty() {
    clearInterval(intervalId);
    intervalTime *= 0.9; // Increase speed by reducing interval time by 10%
    target.radius *= 0.9; // Reduce target size by 10%
    if (target.radius < 10) {
        target.radius = 10; // Set a minimum target size to ensure it's always hittable
    }
    intervalId = setInterval(() => {
        if (!gamePaused && !target.hit) {
            resetTarget();
            updateGame();
        }
    }, intervalTime);
}