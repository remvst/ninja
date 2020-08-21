SKY_BACKGROUND = createCanvasPattern(200, CANVAS_HEIGHT, (c) => {
    const g = c.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    g.addColorStop(0, '#221680');
    g.addColorStop(1, '#9a8afd');

    c.fillStyle = g;
    c.fr(0, 0, 200, CANVAS_HEIGHT);
});

WINDOW_PATTERN = createCanvasPattern(40, 40, c => {
    c.fillStyle = '#888';
    c.fillRect(0, 0, 40, 40);

    c.fillStyle = '#fff';
    c.fillRect(10, 10, 20, 20);
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
