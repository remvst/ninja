GOD_RAY = createCanvas(CELL_SIZE * 0.6, CELL_SIZE * 4, (c, can) => {
    const g = c.createLinearGradient(0, 0, 0, CELL_SIZE * 4);
    g.addColorStop(0, 'rgba(255,255,255, 0)');
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c.fillStyle = g;
    c.fillRect(0, 0, 99, 999);
});

HALO = createCanvas(CELL_SIZE * 4, CELL_SIZE * 4, (c, can) => {
    const g = c.createRadialGradient(can.width / 2, can.height / 2, 0, can.width / 2, can.height / 2, can.width / 2);
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c.fillStyle = g;
    c.fillRect(0, 0, 999, 999);
});

RED_HALO = createCanvas(CELL_SIZE * 6, CELL_SIZE * 6, (c, can) => {
    const g = c.createRadialGradient(
        can.width / 2, can.height / 2, 0,
        can.width / 2, can.height / 2, can.width / 2
    );
    g.addColorStop(0.5, 'rgba(255,0,0, 0.5)');
    g.addColorStop(1, 'rgba(255,0,0, 0)');

    c.fillStyle = g;
    c.fillRect(0, 0, 999, 999);
});

WINDOW_PATTERN = createCanvasPattern(CELL_SIZE * 2, CELL_SIZE * 2, (c, can) => {
    c.fillStyle = '#637ab5';
    c.fillRect(0, 0, 999, 999);

    c.fillStyle = '#2c3556';
    c.fillRect(can.width / 10, can.height / 4, can.width * 8 / 10, can.height / 2);
});

BUILDING_PATTERN = createCanvasPattern(CELL_SIZE * LEVEL_COLS, CELL_SIZE * 8, (c, can) => {
    c.fillStyle = '#485473';
    c.fillRect(0, 0, can.width, 999);

    // c.translate(CELL_SIZE / 4, CELL_SIZE / 4);

    c.fillStyle = WINDOW_PATTERN;
    c.fillRect(0, CELL_SIZE / 4, can.width, can.height - CELL_SIZE / 2);
});

SIGN_HOLDER_PATTERN = createCanvasPattern(CELL_SIZE * 2, CELL_SIZE * 2, (c, can) => {
    c.fillStyle = c.strokeStyle = '#111';
    c.lineWidth = 4;
    c.fr(0, 0, 99, 99);
    c.clearRect(4, 4, can.width - 8, can.height - 8);

    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(99, 99);
    c.moveTo(can.width, 0);
    c.lineTo(0, can.height);
    c.stroke();
});
