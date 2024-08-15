// Create snake and ladder maps with a single function for consistency
const createGameElements = (elements) => {
    const map = new Map();
    elements.forEach(([start, end]) => map.set(start, end));
    return map;
};

let roll=0;

// Snakes map: key represents snake head, value represents snake tail
const snakes = createGameElements([
    [99, 23],
    [81, 53],
    [70, 30],
    [43, 10],
    [73, 29],
    [88, 44]
]);

// Ladders map: key represents ladder bottom, value represents ladder top
const ladders = createGameElements([
    [15, 57],
    [24, 53],
    [7, 30],
    [50, 71],
    [67, 82],
    [40, 63]
]);

// Function to simulate rolling a 6-sided dice
const rollDice = () => Math.floor(Math.random() * 6) + 1;

// Player positions
let playerPositions = {
    a: 1,
    b: 1
};

// Function to handle a player's turn
const takeTurn = (player) => {
    roll = rollDice();
    playerPositions[player] += roll;

    // Check for ladders
    if (ladders.has(playerPositions[player])) {
        playerPositions[player] = ladders.get(playerPositions[player]);
    }

    // Check for snakes
    if (snakes.has(playerPositions[player])) {
        playerPositions[player] = snakes.get(playerPositions[player]);
    }
    console.log(player, playerPositions[player]);
    return playerPositions[player];
};

let noOfTurns = 0; // Updated variable name for better readability

// Main play function
function play() {
    console.log("Playing turn", noOfTurns);
    let box; // Declare the variable 'box' outside the conditional blocks

    if (noOfTurns % 2 === 0) {
        console.log('A turn',`box-number-${playerPositions['a']}`);
        box = document.getElementById(`box-number-${playerPositions['a']}`);
        console.log(box);
        box.innerHTML = playerPositions['a'];
        let newbox = takeTurn('a'); // Player 'a' takes a turn
        console.log("A", newbox);
        box = document.getElementById(`box-number-${newbox}`);
        if(box.innerHTML === 'B'){
            box.innerHTML = 'A | B';
        }else{
            box.innerHTML = 'A';
        }
    } else {
        console.log('B turn',`box-number-${playerPositions['b']}`);
        box = document.getElementById(`box-number-${playerPositions['b']}`);
        box.innerHTML = playerPositions['b'];
        let newbox = takeTurn('b'); // Player 'b' takes a turn
        console.log("B", newbox);
        box = document.getElementById(`box-number-${newbox}`);
        if(box.innerHTML === 'A'){
            box.innerHTML = 'A | B';
        }else{
            box.innerHTML = 'B';
        }
    }

    noOfTurns++;
}


// Function to render the board with snakes and ladders
function renderBoard() {
    const board = document.getElementById("chessboard");
    board.style.position = 'relative'; // Ensure the board is positioned for absolute child elements

    for (let row = 100; row >= 1; row -= 10) {
        let start = row % 20 === 0 ? row : row - 9; // Calculate the start of the row
        let step = row % 20 === 0 ? -1 : 1; // Alternates direction every 2 rows (20 boxes)

        for (let i = start; step === 1 ? i <= row : i >= row - 9; i += step) {
            const box = document.createElement("div");
            box.className = "box";
            box.id = `box-${i}`;
            const boxNumber = document.createElement("div");
            boxNumber.className = `box-number`;
            boxNumber.id = `box-number-${i}`;
            boxNumber.innerHTML = i.toString();
            box.appendChild(boxNumber);
            board.appendChild(box);
        }
    }

    // Draw ladders
    ladders.forEach((end, start) => {
        drawLine(getBoxPosition(start), getBoxPosition(end), 'ladder');
    });

    // Draw snakes
    snakes.forEach((end, start) => {
        drawLine(getBoxPosition(start), getBoxPosition(end), 'snake');
    });

    return board;
}
function getDice(){
    return roll;
}

// Function to calculate the position of a box on the board
function getBoxPosition(boxId) {
    const box = document.getElementById(`box-${boxId}`);
    const rect = box.getBoundingClientRect();
    const boardRect = document.getElementById("chessboard").getBoundingClientRect();
    return { 
        x: rect.left - boardRect.left + rect.width / 2, 
        y: rect.top - boardRect.top + rect.height / 2 
    };
}

// Function to draw a line (ladder or snake) between two points
function drawLine(startPos, endPos, className) {
    if (className === 'ladder') {
        drawLadder(startPos, endPos);
    } else if (className === 'snake') {
        drawSnake(startPos, endPos);
    }
}

function drawLadder(startPos, endPos) {
    const ladderWidth = 4;
    const numberOfRungs = 7;

    // Calculate positions for the two sides of the ladder
    const sideOffsetX = (endPos.y - startPos.y) / 15;
    const sideOffsetY = (endPos.x - startPos.x) / 15;

    const leftSideStart = { x: startPos.x - sideOffsetX, y: startPos.y + sideOffsetY };
    const leftSideEnd = { x: endPos.x - sideOffsetX, y: endPos.y + sideOffsetY };

    const rightSideStart = { x: startPos.x + sideOffsetX, y: startPos.y - sideOffsetY };
    const rightSideEnd = { x: endPos.x + sideOffsetX, y: endPos.y - sideOffsetY };

    // Draw the two sides of the ladder
    drawSimpleLine(leftSideStart, leftSideEnd, 'green', ladderWidth);
    drawSimpleLine(rightSideStart, rightSideEnd, 'green', ladderWidth);

    // Draw rungs
    for (let i = 0; i <= numberOfRungs; i++) {
        const rungX = leftSideStart.x + i * (leftSideEnd.x - leftSideStart.x) / numberOfRungs;
        const rungY = leftSideStart.y + i * (leftSideEnd.y - leftSideStart.y) / numberOfRungs;

        const rungEndX = rightSideStart.x + i * (rightSideEnd.x - rightSideStart.x) / numberOfRungs;
        const rungEndY = rightSideStart.y + i * (rightSideEnd.y - rightSideStart.y) / numberOfRungs;

        drawSimpleLine({ x: rungX, y: rungY }, { x: rungEndX, y: rungEndY }, 'green', 2);
    }
}

function drawSnake(startPos, endPos) {
    const snakeWidth = 7; // Width of the snake

    // Draw a simple line representing the snake
    drawSimpleLine(startPos, endPos, 'red', snakeWidth);
}

function drawSimpleLine(startPos, endPos, color, width) {
    const line = document.createElement("div");
    line.style.position = 'absolute';
    line.style.backgroundColor = color;
    
    const deltaX = endPos.x - startPos.x;
    const deltaY = endPos.y - startPos.y;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    line.style.width = `${length}px`;
    line.style.height = `${width}px`;
    line.style.left = `${startPos.x}px`;
    line.style.top = `${startPos.y}px`;
    line.style.transformOrigin = '0 0';
    line.style.transform = `rotate(${Math.atan2(deltaY, deltaX)}rad)`;

    document.getElementById("chessboard").appendChild(line);
}


module.exports = {
    rollDice,
    play,
    renderBoard,
    getDice
};
