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
