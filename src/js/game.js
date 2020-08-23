const LEVEL_WIDTH = LEVEL_COLS * CELL_SIZE;
const LEVEL_HEIGHT = LEVEL_ROWS * CELL_SIZE;
const TOWER_BASE_HEIGHT = (CANVAS_HEIGHT - LEVEL_HEIGHT) / 2;
const LEVEL_X = (CANVAS_WIDTH - LEVEL_COLS * CELL_SIZE) / 2;
const MAX_LEVEL_ALTITUDE = LEVELS.length * LEVEL_HEIGHT + TOWER_BASE_HEIGHT;

class Game {

    constructor() {
        G = this;
        G.clock = 0;

        this.level = LEVELS[0];

        this.bottomScreenAltitude = MAX_LEVEL_ALTITUDE + LEVEL_HEIGHT - CANVAS_HEIGHT / 2 + 100;
        this.windowsAlpha = 1;
        this.titleAlpha = 1;

        this.title = nomangle('NINJA');
        this.interTitle = nomangle('VS');
    }

    startAnimation() {
        if (this.isStarted) {
            return;
        }

        this.isStarted = true;

        interp(
            this,
            'titleAlpha',
            1,
            0,
            0.5
        );

        interp(
            this,
            'bottomScreenAltitude',
            this.bottomScreenAltitude,
            -TOWER_BASE_HEIGHT,
            5,
            0.5,
            easeInOutCubic,
            () => {
                interp(
                    this,
                    'windowsAlpha',
                    1,
                    0,
                    1,
                    1,
                    null
                );
                this.startLevel(this.level);
            }
        );
    }

    endAnimation() {
        // Allow the player to start the game again
        this.isStarted = false;

        interp(
            this,
            'bottomScreenAltitude',
            this.bottomScreenAltitude,
            MAX_LEVEL_ALTITUDE + LEVEL_HEIGHT - CANVAS_HEIGHT / 2 + 100,
            2,
            0.5,
            easeInOutCubic
        );

        // Show the windows so the tower can be rendered again
        interp(this, 'windowsAlpha', 0, 1, 1, 1);

        // Replace the title and fade it in
        this.title = 'YOU BEAT';
        this.interTitle = '';
        interp(this, 'titleAlpha', 0, 1, 1, 3);
    }

    cycle(e) {
        this.clock += e;

        if (down[KEYBOARD_SPACE]) {
            this.startAnimation();
        }

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
            this.levelBottomAltitude(level) - TOWER_BASE_HEIGHT,
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
            const layerRatio = 0.2 + 0.8 * i / (BUILDINGS_BACKGROUND.length - 1);

            const altitudeRatio = this.bottomScreenAltitude / MAX_LEVEL_ALTITUDE;

            R.fillStyle = layer;
            translate(0, ~~(CANVAS_HEIGHT - layer.height + altitudeRatio * layerRatio * 400));

            fr(0, 0, CANVAS_WIDTH, layer.height);
        }));

        // Rain
        R.fillStyle = 'rgba(255,255,255,0.4)';
        const rng = createNumberGenerator(1);
        for (let i = 0 ; i < 200 ; i++) {
            const x = rng.floating() * CANVAS_WIDTH;
            const startY = rng.floating() * CANVAS_HEIGHT;
            const speed = rng.between(800, 1600);
            const y = (startY + G.clock * speed + this.bottomScreenAltitude) % evaluate(CANVAS_HEIGHT + RAIN_DROP_LENGTH);

            fr(x, y, 1, -RAIN_DROP_LENGTH);
        }

        // Render the levels
        wrap(() => {
            translate(LEVEL_X, this.bottomScreenAltitude + LEVEL_HEIGHT + TOWER_BASE_HEIGHT);

            const currentLevelIndex = LEVELS.indexOf(this.level);
            for (let i = max(0, currentLevelIndex - 1) ; i < min(LEVELS.length, currentLevelIndex + 2) ; i++) {
                wrap(() => {
                    translate(0, -this.levelBottomAltitude(LEVELS[i]) - LEVEL_HEIGHT);
                    LEVELS[i].render();
                });
            }

            // Render the top of the tower
            wrap(() => {
                translate(0, -MAX_LEVEL_ALTITUDE - LEVEL_HEIGHT);

                // Sign holder
                wrap(() => {
                    translate(LEVEL_WIDTH / 2 - CELL_SIZE * 6, 0);
                    fs(SIGN_HOLDER_PATTERN);
                    fr(0, 0, CELL_SIZE * 12, -CELL_SIZE * 2);
                });

                // Sign
                R.textAlign = nomangle('center');
                R.textBaseline = nomangle('alphabetic');
                R.fillStyle = '#900';
                R.strokeStyle = '#f00';
                R.lineWidth = 5;
                R.font = nomangle('italic 96pt Impact');
                fillText(nomangle('EVILCORP'), LEVEL_WIDTH / 2, -30);
                strokeText(nomangle('EVILCORP'), LEVEL_WIDTH / 2, -30);

                // Light in front of the sign
                R.globalAlpha = 0.5;
                [
                    30,
                    90,
                    150,
                    210
                ].forEach(x => {
                    drawImage(GOD_RAY, LEVEL_WIDTH / 2 + x - GOD_RAY.width / 2, -GOD_RAY.height / 2);
                    drawImage(GOD_RAY, LEVEL_WIDTH / 2 - x - GOD_RAY.width / 2, -GOD_RAY.height / 2);
                });
            });

            // Render the windows in front
            R.globalAlpha = this.windowsAlpha;
            R.fillStyle = BUILDING_PATTERN;
            wrap(() => {
                // translate(-CELL_SIZE / 2, 0);
                fr(0, 0, LEVEL_WIDTH, -MAX_LEVEL_ALTITUDE - LEVEL_HEIGHT);
            });

        });

        if (this.menu) {
            wrap(() => this.menu.render());
        }

        wrap(() => {
            R.globalAlpha = this.titleAlpha;

            R.textAlign = nomangle('center');
            R.textBaseline = nomangle('alphabetic');
            R.fillStyle = '#fff';
            R.strokeStyle = '#000';
            R.lineWidth = 5;

            R.font = nomangle('italic 120pt Impact');
            fillText(this.title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 45);
            strokeText(this.title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 45);

            R.font = nomangle('24pt Impact');
            R.lineWidth = 2;
            fillText(this.interTitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 85);
            strokeText(this.interTitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 85);

            if (G.clock % 2 < 1.5 && this.titleAlpha == 1) {
                fillText(nomangle('PRESS [SPACE] TO START'), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 4 / 5);
                strokeText(nomangle('PRESS [SPACE] TO START'), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 4 / 5);
            }
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
