const LEVEL_WIDTH = LEVEL_COLS * CELL_SIZE;
const LEVEL_HEIGHT = LEVEL_ROWS * CELL_SIZE;
const TOWER_BASE_HEIGHT = (CANVAS_HEIGHT - LEVEL_HEIGHT) / 2;
const LEVEL_X = (CANVAS_WIDTH - LEVEL_COLS * CELL_SIZE) / 2;

class Game {

    constructor() {
        G = this;
        G.clock = 0;

        this.bottomScreenAltitude = TOWER_BASE_HEIGHT;

        this.level = LEVELS[0];
        this.startLevel(this.level);
    }

    cycle(e) {
        this.clock += e;

        this.level.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        if (this.menu) {
            this.menu.cycle(e);
        }

        this.render();
    }

    nextLevel() {
        // Stop the previous level
        this.level.stop();

        // Start the new one
        this.startLevel(LEVELS[this.level.index + 1]);
    }

    startLevel(level) {
        this.level = level;
        this.centerLevel(this.level);
        this.level.start();
    }

    centerLevel(level) {
        interp(
            this,
            'bottomScreenAltitude',
            this.bottomScreenAltitude,
            this.levelBottomAltitude(level) + TOWER_BASE_HEIGHT,
            0.5
        );
    }

    levelBottomAltitude(level) {
        return level.index * LEVEL_HEIGHT;
    }

    // renderOneBuilding(x, altitude) {
    //     wrap(() => {
    //         translate(x, altitude);
    //         R.fillStyle = WINDOW_PATTERN;
    //
    //         fs(0, 0);
    //     });
    // }

    render() {
        // Sky
        R.fillStyle = SKY_BACKGROUND;
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // TODO maybe split into two?

        R.fillStyle = '#fff';
        beginPath();
        arc(CANVAS_WIDTH - 200, 100, 50, 0, PI * 2, true);
        fill();

        // Thunder
        if (G.clock % 3 < 0.3 && G.clock % 0.1 < 0.05) {
            R.fillStyle = 'rgba(255, 255, 255, 0.2)';
            fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Buildings in the background
        BUILDINGS_BACKGROUND.forEach((layer, i) => wrap (() => {
            const layerRatio = i / (BUILDINGS_BACKGROUND.length);
            const maxAltitude = LEVELS.length * LEVEL_HEIGHT;

            const altitudeRatio = this.bottomScreenAltitude / maxAltitude;

            R.fillStyle = layer;
            translate(0, ~~(CANVAS_HEIGHT - layer.height + altitudeRatio * layerRatio * 800));

            fr(0, 0, CANVAS_WIDTH, layer.height);
        }));

        // Render the levels
        wrap(() => {
            translate(0, this.bottomScreenAltitude + LEVEL_HEIGHT + TOWER_BASE_HEIGHT);

            const currentLevelIndex = LEVELS.indexOf(this.level);
            for (let i = max(0, currentLevelIndex - 1) ; i < min(LEVELS.length, currentLevelIndex + 2) ; i++) {
                wrap(() => {
                    translate(LEVEL_X, -this.levelBottomAltitude(LEVELS[i]) - LEVEL_HEIGHT);
                    LEVELS[i].render();
                });
            }
        });

        // Rain
        R.fillStyle = '#fff';
        const rng = createNumberGenerator(1);
        for (let i = 0 ; i < 100 ; i++) {
            const x = rng.floating() * LEVEL_X;
            const startY = rng.floating() * CANVAS_HEIGHT;
            const speed = rng.between(800, 1600);
            const y = (startY + G.clock * speed) % evaluate(CANVAS_HEIGHT + RAIN_DROP_LENGTH);

            fr(x, y, 1, -RAIN_DROP_LENGTH);
            fr(CANVAS_WIDTH - x, y, 1, -RAIN_DROP_LENGTH);
        }

        if (this.menu) {
            wrap(() => this.menu.render());
        }


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
