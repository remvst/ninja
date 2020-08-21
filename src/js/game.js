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

        if (DEBUG) {
            wrap(() => {
                R.font = '24pt Arial';
                R.textAlign = 'left';
                fs('#fff');

                const fpsGauge = [];
                for (let i = 0 ; i < (G.fps / 60) * 20 ; i++) {
                    fpsGauge.push('-');
                }

                const info = [
                    'fps: ' + G.fps,
                    fpsGauge.join(''),
                ];
                let y = 40;
                info.forEach(info => {
                    fillText(info, 40, y);
                    y += 40;
                });
            });
        }
    }

}
