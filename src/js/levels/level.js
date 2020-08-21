class Level {
    constructor(definition) {
        this.definition = definition;
        this.index = LEVELS.indexOf(this.definition);
        this.bottomY = LEVELS.length - this.index * LEVEL_ROWS * CELL_SIZE;

        this.cyclables = [];
        this.renderables = [];

        this.player = new Player(
            (this.definition.spawn[1] + 0.5) * CELL_SIZE,
            (this.definition.spawn[0] + 0.5) * CELL_SIZE
        );

        this.cyclables.push(this.player);
        this.renderables.push(this.player);
    }

    cycle(e) {
        this.cyclables.forEach(x => x.cycle(e));
    }

    render() {
        // Background
        R.fillStyle = '#fff';
        fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);

        // Matrix
        R.fillStyle = '#000';
        for (let row = 0 ; row < LEVEL_ROWS ; row++) {
            for (let col = 0 ; col < LEVEL_ROWS ; col++) {
                if (this.definition.matrix[row][col]) {
                    fr(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        // Render renderables
        this.renderables.forEach(x => x.render());
    }
}
