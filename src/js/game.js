class Game {

    constructor() {
        G = this;
        G.clock = 0;

        this.level = new Level(LEVELS[0]);
    }

    cycle(e) {
        this.level.cycle(e);
        this.render();
    }

    render() {
        R.fillStyle = '#585a7f';
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        wrap(() => {
            translate((CANVAS_WIDTH - LEVEL_COLS * CELL_SIZE) / 2, 0);

            this.level.render();
        });
    }

}
