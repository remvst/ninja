BUILDINGS_BACKGROUND = [
    ['#000', 600],
    ['#222', 500],
    ['#333', 300]
].map(([color, patternHeight]) => createCanvasPattern(400, patternHeight, (c, can) => {
    c.fillStyle = color;

    let x = 0;
    while (x < can.width) {
        const buildingWidth = ~~rnd(80, 120);
        c.fr(x, random() * 200, buildingWidth, patternHeight);
        x += buildingWidth;
    }
}));

SKY_BACKGROUND = createCanvas(1, CANVAS_HEIGHT, (c) => {
    const gradient = c.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#00032c');
    gradient.addColorStop(0.7, '#14106f');
    gradient.addColorStop(1, '#64196c');
    return gradient;
});
