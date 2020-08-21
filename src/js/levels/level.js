class Level {
    constructor(definition) {
        this.definition = definition;
        this.index = LEVELS.indexOf(this.definition);
        this.bottomY = LEVELS.length - this.index * LEVEL_ROWS * CELL_SIZE;
    }

    render() {
        // Background
        R.fillStyle = '#fff';
        fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);

        // Matrix
        R.fillStyle = '#00f';
        for (let row = 0 ; row < LEVEL_ROWS ; row++) {
            for (let col = 0 ; col < LEVEL_ROWS ; col++) {
                if (this.definition.matrix[row][col]) {
                    fr(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        // Render cyclables
    }
}
