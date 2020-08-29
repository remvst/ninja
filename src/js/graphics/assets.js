GOD_RAY = createCanvas(evaluate(CELL_SIZE * 0.6), evaluate(CELL_SIZE * 4), (c, can) => {
    const g = c.createLinearGradient(0, 0, 0, CELL_SIZE * 4);
    g.addColorStop(0, 'rgba(255,255,255, 0)');
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c.fs(g);
    c.fr(0, 0, 99, 999);
});

HALO = createCanvas(evaluate(CELL_SIZE * 4), evaluate(CELL_SIZE * 4), (c, can) => {
    const g = c.createRadialGradient(can.width / 2, can.height / 2, 0, can.width / 2, can.height / 2, can.width / 2);
    g.addColorStop(0.5, 'rgba(255,255,255, 0.5)');
    g.addColorStop(1, 'rgba(255,255,255, 0)');

    c.fs(g);
    c.fr(0, 0, 999, 999);
});

RED_HALO = createCanvas(evaluate(CELL_SIZE * 6), evaluate(CELL_SIZE * 6), (c, can) => {
    const g = c.createRadialGradient(
        can.width / 2, can.height / 2, 0,
        can.width / 2, can.height / 2, can.width / 2
    );
    g.addColorStop(0.5, 'rgba(255,0,0, 0.5)');
    g.addColorStop(1, 'rgba(255,0,0, 0)');

    c.fs(g);
    c.fr(0, 0, 999, 999);
});

WINDOW_PATTERN = createCanvasPattern(evaluate(CELL_SIZE * 2), evaluate(CELL_SIZE * 2), (c, can) => {
    c.fs('#67b');
    c.fr(0, 0, 999, 999);

    c.fs('#235');
    c.fr(can.width / 10, can.height / 4, can.width * 8 / 10, can.height / 2);
});

BUILDING_PATTERN = createCanvasPattern(evaluate(CELL_SIZE * LEVEL_COLS), evaluate(CELL_SIZE * 10), (c, can) => {
    c.fs('#457');
    c.fr(0, 0, can.width, 999);

    // c.translate(CELL_SIZE / 4, CELL_SIZE / 4);

    c.fs(WINDOW_PATTERN);
    c.fr(0, CELL_SIZE / 4, can.width, can.height - CELL_SIZE / 2);
});

SIGN_HOLDER_PATTERN = createCanvasPattern(evaluate(CELL_SIZE * 2), evaluate(CELL_SIZE * 2), (c, can) => {
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

renderMobileArrow = () => {
    beginPath();
    moveTo(MOBILE_BUTTON_SIZE / 2, 0);
    lineTo(-MOBILE_BUTTON_SIZE / 2, MOBILE_BUTTON_SIZE / 2);
    lineTo(-MOBILE_BUTTON_SIZE / 2, -MOBILE_BUTTON_SIZE / 2);
    fill();
};
