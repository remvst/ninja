SKY_BACKGROUND = createCanvasPattern(200, CANVAS_HEIGHT, (c) => {
    const g = c.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    g.addColorStop(0, '#00032c');
    g.addColorStop(0.7, '#14106f');
    g.addColorStop(1, '#64196c');

    c.fillStyle = g;
    c.fr(0, 0, 200, CANVAS_HEIGHT);
});

WINDOW_PATTERN = createCanvasPattern(CELL_SIZE * 2, CELL_SIZE * 2, (c, can) => {
    c.fillStyle = '#8c9bee';
    c.fillRect(0, 0, 999, 999);

    c.fillStyle = '#f29afb';
    c.fillRect(can.width / 4, can.height / 4, can.width / 2, can.width / 2);
});

BUILDINGS_BACKGROUND = createCanvasPattern(800, 400, (c, can) => {

    c.fillStyle = WINDOW_PATTERN;

    c.fillRect(
        0,
        0,
        can.width,
        can.height
    );
});

FRAME = createCanvas(CELL_SIZE * 0.6, CELL_SIZE * 0.8, (c, can) => {
    c.fillStyle = '#925e2a';
    c.fillRect(0, 0, 99, 99);
    c.fillStyle = '#fcf3d7';
    c.fillRect(4, 4, can.width - 8, can.height - 8);
    c.fillStyle = '#ccc';
    c.fillRect(can.width / 2 - 5, can.height / 2 - 5, 10, 10);
});

WINDOW = createCanvas(CELL_SIZE * 0.8, CELL_SIZE * 1.2, (c, can) => {
    c.fillStyle = '#494742';
    c.fillRect(0, 0, 99, 99);
    c.fillStyle = '#b8c8fa';
    c.fillRect(2, 2, can.width - 4, can.height - 4);

    c.fillStyle = '#494742';
    c.fillRect(0, can.height * 0.7, can.width, 4);
});

DESK = createCanvas(CELL_SIZE * 0.9, CELL_SIZE * 0.5, (c, can) => {
    // Legs
    c.fillStyle = '#000';
    c.fillRect(2, 0, 2, can.height);
    c.fillRect(can.width - 2, 0, -2, can.height);

    // Top
    c.fillStyle = '#494742';
    c.fillRect(0, 0, 99, 4);

    // Drawers
    c.fillStyle = '#ccc';
    c.fillRect(4, 4, can.width - 8, can.height / 3);
    // c.fillRect(can.width - 4, 4, -can.width / 4, can.height / 3);
});

TRASH = createCanvas(CELL_SIZE * 0.3, CELL_SIZE * 0.4, (c, can) => {
    c.fillStyle = '#4c80be';
    c.fillRect(0, 0, 99, 99);
    c.fillStyle = '#78a1d6';
    c.fillRect(0, 0, 99, 4);
});

OUTLET = createCanvas(CELL_SIZE * 0.2, CELL_SIZE * 0.2, (c, can) => {
    c.fillStyle = '#fff';
    c.fillRect(0, 0, 99, 99);
});

LIGHT = createCanvas(CELL_SIZE * 5, CELL_SIZE * 3, (c, can) => {
    const g = c.createRadialGradient(can.width / 2, 0, 0, can.width / 2, 0, can.height);
    g.addColorStop(0, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    // g.addColorStop(0, 'red');
    // g.addColorStop(1, 'blue');

    c.fillStyle = g;

    // c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(can.width / 2, 0);
    c.arc(can.width / 2, 0, can.height, PI / 6, PI * 5 / 6, false);
    c.fill();
});

LEVEL_BACKGROUND = createCanvasPattern(CELL_SIZE * 4, CELL_SIZE * 6, (c, can) => {
    c.fillStyle = '#29c2fd';
    c.fr(0, 0, can.width, can.height);

    c.fillStyle = '#000';
    c.globalAlpha = 0.05;
    c.fr(0, 0, can.width, 2);
    c.fr(0, CELL_SIZE * 3, can.width, 2);


    c.fr(0, 0, 2, CELL_SIZE * 3);
    c.fr(CELL_SIZE * 2, CELL_SIZE * 3, 2, CELL_SIZE * 10);

    c.globalAlpha = 1;
    // c.drawImage(WINDOW, CELL_SIZE * 1.5, CELL_SIZE * 2);
});

createLevelBackground = (matrix) => createCanvas(CELL_SIZE * LEVEL_COLS, CELL_SIZE * LEVEL_ROWS, (c, can) => {
    c.fillStyle = LEVEL_BACKGROUND;
    c.fr(0, 0, can.width, can.height);

    const possibleDetails = [];

    const centered = (row, col, image) => {
        return () => c.drawImage(
            image,
            col * CELL_SIZE + (CELL_SIZE - image.width) / 2,
            row * CELL_SIZE + (CELL_SIZE - image.height) / 2
        );
    }

    const bottomAnchored = (row, col, image) => {
        return () => c.drawImage(
            image,
            col * CELL_SIZE + (CELL_SIZE - image.width) / 2,
            (row + 1) * CELL_SIZE - image.height
        );
    }

    const topAnchored = (row, col, image) => {
        return () => c.drawImage(
            image,
            col * CELL_SIZE + (CELL_SIZE - image.width) / 2,
            row * CELL_SIZE
        );
    }

    for (let row = 1 ; row < LEVEL_ROWS - 1 ; row++) {
        for (let col = 1 ; col < LEVEL_ROWS - 1 ; col+=2) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;

            const current = matrix[row][col];
            const right = matrix[row][col + 1];
            const below = matrix[row + 1][col];
            const belowBelow = matrix[row + 2] && matrix[row + 2][col];
            const belowRight = matrix[row + 1][col + 1];

            const cellDetails = [];

            if (!current && !below && belowBelow) {
                cellDetails.push(centered(row, col, FRAME));
                cellDetails.push(centered(row + 0.5, col, WINDOW));
            }

            if (!current && below && !right && belowRight) {
                cellDetails.push(bottomAnchored(row, col + 0.5, DESK));
            }

            if (!current && below) {
                cellDetails.push(bottomAnchored(row, col, TRASH));
                cellDetails.push(bottomAnchored(row - 0.05, col, OUTLET));
            }

            if (current && !below && !belowBelow) {
                cellDetails.push(topAnchored(row + 1, col, LIGHT));
            }

            if (cellDetails.length) {
                possibleDetails.push(cellDetails);
            }
        }
    }

    possibleDetails.forEach((details) => {
        if (random() > 0.5) {
            pick(details)();
        }
    });
});
