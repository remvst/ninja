class Exit {
    constructor(level, x, y) {
        this.level = level;
        this.x = x;
        this.y = y;
    }

    cycle(e) {
        // TODO check distance
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);
            drawImage(HALO, -HALO.width / 2, -HALO.height / 2);

            [G.clock * PI, -G.clock * PI / 2, G.clock * PI / 4].forEach(angle => {
                wrap(() => {
                    rotate(angle);
                    drawImage(GOD_RAY, -GOD_RAY.width / 2, -GOD_RAY.height / 2);
                });
            });
        });

        const height = COMPUTER.height + DESK.height;
        // translate(this.x, this.y);

        const row = toCellUnit(this.y);
        translate(this.x, (row + 1) * CELL_SIZE - height);

        drawImage(COMPUTER, -COMPUTER.width / 2, 0);
        drawImage(DESK, -DESK.width / 2, COMPUTER.height);
    }
}
