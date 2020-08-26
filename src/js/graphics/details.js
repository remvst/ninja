UNPADDED_WINDOW = createCanvas(
    CELL_SIZE * 0.8,
    CELL_SIZE * 1.2,
    (c, can) => {
        // Window
        const g = c.createLinearGradient(0, 0, can.width, can.height);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.3)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        g.addColorStop(0.75, 'rgba(255,255,255,0.3)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g;
        c.fillRect(0, 0, can.width, can.height);

        // Frame
        c.fillStyle = '#888';
        c.fillRect(0, 0, can.width, 2);
        c.fillRect(0, can.height, can.width, -2);
        c.fillRect(0, 0, 2, can.height);
        c.fillRect(can.width, 0, -2, can.height);
        c.fillRect(0, can.height * 0.7, can.width, 4);
    }
);

WINDOW = padCanvas(2, 1, 0.5, UNPADDED_WINDOW);

UNPADDED_DESK = createCanvas(CELL_SIZE * 1.1, CELL_SIZE * 0.5, (c, can) => {
    // Legs
    c.fillStyle = '#000';
    c.fillRect(2, 0, 2, can.height);
    c.fillRect(can.width - 2, 0, -2, can.height);

    // Top
    c.fillStyle = '#494742';
    c.fillRect(0, 0, 99, 4);

    // Drawers
    c.fillStyle = '#ccc';
    c.fillRect(4, 4, can.width / 4, can.height / 3);
    c.fillRect(can.width - 4, 4, -can.width / 4, can.height / 3);
});

COMPUTER = createCanvas(CELL_SIZE * 0.6, CELL_SIZE * 0.6, (c, can) => {
    c.fillStyle = '#000';
    c.fr(0, 0, 99, 99);

    c.fillStyle = '#a9a9a9';
    // c.fr(2, 2, can.width - 4, 20);
    c.fr(2, 2, can.width - 4, can.height - 4);

    c.fillStyle = '#4253ff';
    c.fr(4, 4, can.width - 8, can.height - 12);

    c.fillStyle = '#000';
    c.fr(4, can.height - 6, can.width - 8, 2);

    c.fillStyle = '#a5dc40';
    c.fr(can.width - 6, can.height - 6, 2, 2);

    // document.body.appendChild(can);
});

FRAME = padCanvas(1, 1, 0.5, createCanvas(CELL_SIZE * 0.6, CELL_SIZE * 0.8, (c, can) => {
    c.fillStyle = '#925e2a';
    c.fillRect(0, 0, 99, 99);
    c.fillStyle = '#fcf3d7';
    c.fillRect(4, 4, can.width - 8, can.height - 8);
    c.fillStyle = '#ccc';
    c.fillRect(can.width / 2 - 5, can.height / 2 - 5, 10, 10);
}));

DESK = padCanvas(1, 2, 1, UNPADDED_DESK);

TRASH = padCanvas(1, 1, 1, createCanvas(CELL_SIZE * 0.3, CELL_SIZE * 0.4, (c, can) => {
    c.fillStyle = '#4c80be';
    c.fillRect(0, 0, 99, 99);
    c.fillStyle = '#78a1d6';
    c.fillRect(0, 0, 99, 4);
}));

OUTLET = padCanvas(1, 1, 0.75, createCanvas(CELL_SIZE * 0.2, CELL_SIZE * 0.2, (c, can) => {
    c.fillStyle = '#fff';
    c.fillRect(0, 0, 99, 99);
}));

LIGHT = padCanvas(3, 10, 0, createCanvas(CELL_SIZE * 5, CELL_SIZE * 3, (c, can) => {
    const g = c.createRadialGradient(can.width / 2, 0, 0, can.width / 2, 0, can.height);
    g.addColorStop(0, 'rgba(255,255,255,0.2)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    // g.addColorStop(0, 'red');
    // g.addColorStop(1, 'blue');

    c.fillStyle = g;

    // c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(can.width / 2, 0);
    c.arc(can.width / 2, 0, can.height, PI / 6, PI * 5 / 6, false);
    c.fill();
}));
