BUILDINGS_BACKGROUND = [
    ['#000', 600],
    ['#111', 500],
    ['#222', 300]
].map(([color, patternHeight]) => createCanvasPattern(400, patternHeight, (c, can) => {
    c.fillStyle = color;

    let x = 0;
    while (x < can.width) {
        const buildingWidth = ~~rnd(80, 120);
        c.fr(x, random() * 200, buildingWidth, patternHeight);
        x += buildingWidth;
    }
}));

SKY_BACKGROUND = createCanvasPattern(1, CANVAS_HEIGHT, (c) => {
    const g = c.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    g.addColorStop(0, '#00032c');
    g.addColorStop(0.7, '#14106f');
    g.addColorStop(1, '#64196c');

    c.fillStyle = g;
    c.fr(0, 0, 200, CANVAS_HEIGHT);
});
