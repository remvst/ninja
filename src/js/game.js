class Game {

    constructor() {
        G = this;
        G.clock = 0;

        this.timer = 0;
        this.timerActive = false;

        this.level = LEVELS[0];
        if (DEBUG) {
            this.level = LEVELS[getDebugValue('level', 0)];
        }
        this.level.prepare();

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

        this.timerActive = true;
        this.timer = 0;

        // A run is only valid if it's on normal difficulty
        this.isRunValid = DIFFICULTY == NORMAL_DIFFICULTY;

        this.level = LEVELS[0];
        if (DEBUG) {
            this.level = LEVELS[getDebugValue('level', 0)];
        }
        this.level.prepare();

        interp(
            this,
            'titleAlpha',
            1,
            0,
            0.5
        );

        // Center the level, hide the windows, then start it
        this.centerLevel(
            this.level.index,
            5,
            0.5,
            () => {
                // Hide the windows, then start the level
                interp(this, 'windowsAlpha', 1, 0, 1, 0, null, () => this.level.start());
            }
        )

        setTimeout(() => {
            G.menu = new Menu(
                nomangle('INFILTRATE THE TOWER'),
                nomangle('FIND THE EVIL PLANS')
            );
            G.menu.dim = false;
            G.menu.animateIn();

            setTimeout(() => {
                G.menu.animateOut();
            }, 3000);
        }, 1000);

        beepSound();
    }

    get bestTime() {
        try {
            return parseFloat(localStorage[location.pathname]) || 0;
        } catch(e) {
            return 0;
        }
    }

    endAnimation() {
        // Allow the player to start the game again
        this.isStarted = false;
        this.timerActive = false;

        if (this.isRunValid) {
            localStorage[location.pathname] = min(this.bestTime || 999999, this.timer);
        }

        // Go to the top of the tower
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

        // Trophy for OS13K
        if (DIFFICULTY == NORMAL_DIFFICULTY) {
            localStorage[nomangle('OS13kTrophy,GG,' + document.title + ',Beat the game - normal')] = nomangle('Beat the game in normal difficulty');
        }
        localStorage[nomangle('OS13kTrophy,GG,' + document.title + ',Beat the game - any difficulty')] = nomangle('Beat the game in any difficulty');
    }

    cycle(e) {
        if (DEBUG) {
            if (w.down[KEYBOARD_F]) {
                e *= 4;
            }
            if (w.down[KEYBOARD_G]) {
                e *= 0.25;
            }
        }

        if (this.timerActive) {
            this.timer += e;
        }
        this.clock += e;

        if (down[KEYBOARD_SPACE]) {
            this.startAnimation();
        }

        this.level.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        if (this.menu) {
            this.menu.cycle(e);
        }

        wrap(() => this.render());
    }

    centerLevel(levelIndex, duration, delay, callback) {
        // Move the camera to the new level, and only then start it
        interp(
            this,
            'bottomScreenAltitude',
            this.bottomScreenAltitude,
            this.levelBottomAltitude(levelIndex) - TOWER_BASE_HEIGHT,
            duration,
            delay,
            easeInOutCubic,
            callback
        );
    }

    nextLevel() {
        // Stop the previous level
        this.level.stop();

        // Prepare the new one
        this.level = LEVELS[this.level.index + 1];
        this.level.prepare();

        // Move the camera to the new level, and only then start it
        this.centerLevel(this.level.index, 0.5, 0, () => this.level.start());

        nextLevelSound();
    }

    levelBottomAltitude(levelIndex) {
        return levelIndex * LEVEL_HEIGHT;
    }

    render() {
        let lastTime = performance.now();
        const perfLogs = [];
        const logPerf = label => {
            if (!getDebugValue('perf')) {
                return;
            }

            const now = performance.now();
            perfLogs.push([label, now - lastTime]);
            lastTime = now;
        };

        // Sky
        R.fillStyle = SKY_BACKGROUND;
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // TODO maybe split into two?

        if (DEBUG) logPerf('sky');

        // Moon
        wrap(() => {
            translate(CANVAS_WIDTH - 200, 100);

            R.globalAlpha = 0.2;
            drawImage(HALO, -HALO.width / 2, -HALO.height / 2);

            // Moon shape
            R.globalAlpha = 1;
            R.fillStyle = '#fff';
            fillCircle(0, 0, 50);
        })

        if (DEBUG) logPerf('moon');

        // Buildings in the background
        BUILDINGS_BACKGROUND.forEach((layer, i) => wrap (() => {
            const layerRatio = 0.2 + 0.8 * i / (BUILDINGS_BACKGROUND.length - 1);

            const altitudeRatio = this.bottomScreenAltitude / MAX_LEVEL_ALTITUDE;

            R.fillStyle = layer;
            translate(0, ~~(CANVAS_HEIGHT - layer.height + altitudeRatio * layerRatio * 400));

            fr(0, 0, CANVAS_WIDTH, layer.height);
        }));

        if (DEBUG) logPerf('builds bg');

        // Thunder
        if (G.clock % 3 < 0.3 && G.clock % 0.1 < 0.05) {
            R.fillStyle = 'rgba(255, 255, 255, 0.2)';
            fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        if (DEBUG) logPerf('thunder');

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

        if (DEBUG) logPerf('rain');

        // Render the tower
        wrap(() => {
            translate(LEVEL_X, ~~this.bottomScreenAltitude + LEVEL_HEIGHT + TOWER_BASE_HEIGHT);

            // Render the rooftop (sign, lights)
            wrap(() => {
                translate(0, -MAX_LEVEL_ALTITUDE - LEVEL_HEIGHT);

                wrap(() => {
                    R.globalAlpha = 0.5;

                    drawImage(
                        GOD_RAY,
                        0, 0,
                        GOD_RAY.width,
                        GOD_RAY.height / 2,
                        0,
                        -100,
                        LEVEL_WIDTH,
                        100
                    );
                });

                // Sign holder
                wrap(() => {
                    translate(LEVEL_WIDTH / 2 - CELL_SIZE * 6, 0);
                    fs(SIGN_HOLDER_PATTERN);
                    fr(0, 0, CELL_SIZE * 12, -CELL_SIZE * 2);
                });

                // Halo behind the sign
                [
                    30,
                    90,
                    150,
                    210
                ].forEach(x => wrap(() => {
                    R.globalAlpha = (sin(G.clock * PI * 2 / 2) * 0.5 + 0.5) * 0.1 + 0.2;
                    drawImage(RED_HALO, LEVEL_WIDTH / 2 + x - RED_HALO.width / 2, -200);
                    drawImage(RED_HALO, LEVEL_WIDTH / 2 - x - RED_HALO.width / 2, -200);
                }));

                // Sign
                R.textAlign = nomangle('center');
                R.textBaseline = nomangle('alphabetic');
                R.fillStyle = '#900';
                R.strokeStyle = '#f00';
                R.lineWidth = 5;
                R.font = nomangle('italic 96pt Impact');
                outlinedText(nomangle('EVILCORP'), LEVEL_WIDTH / 2, -30);


                wrap(() => {
                    const ninjaScale = 1.5;
                    const ninjaPosition = {
                        'x': LEVEL_WIDTH / 2 + 30,
                        'y': -PLAYER_RADIUS
                    }

                    scale(1.5, 1.5);
                    renderBandana(
                        R,
                        ninjaPosition,
                        Array(10).fill(0).map((x, i) => {
                            return {
                                'x': ninjaPosition.x + i * 10,
                                'y': ninjaPosition.y - PLAYER_RADIUS + 10 + rnd(-7, 7) - i * 5
                            };
                        })
                    );

                    translate(ninjaPosition.x, ninjaPosition.y);

                    renderCharacter(
                        R,
                        this.clock,
                        PLAYER_BODY,
                        true,
                        -1,
                        0,
                        0
                    );
                });
            });

            if (DEBUG) logPerf('roof');

            // Render the levels
            const currentLevelIndex = LEVELS.indexOf(this.level);
            for (let i = max(0, currentLevelIndex - 1) ; i < min(LEVELS.length, currentLevelIndex + 2) ; i++) {
                wrap(() => {
                    translate(0, -this.levelBottomAltitude(i) - LEVEL_HEIGHT);
                    LEVELS[i].render();
                });
            }

            if (DEBUG) logPerf('levels');

            // Render the windows in front
            R.globalAlpha = this.windowsAlpha;
            R.fillStyle = BUILDING_PATTERN;
            wrap(() => {
                // translate(-CELL_SIZE / 2, 0);
                fr(0, 0, LEVEL_WIDTH, -MAX_LEVEL_ALTITUDE - LEVEL_HEIGHT);
            });

            if (DEBUG) logPerf('windows');
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
            outlinedText(this.title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 45);

            R.font = nomangle('24pt Impact');
            R.lineWidth = 2;
            outlinedText(this.interTitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 85);

            if (G.clock % 2 < 1.5 && this.titleAlpha == 1) {
                [
                    nomangle('PRESS [SPACE] TO START'),
                    nomangle('PRESS [D] TO CHANGE DIFFICULTY'),
                ].forEach((s, i) => {
                    outlinedText(s, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 4 / 5 + i * 50);
                })
            }
        });

        if (DEBUG) logPerf('instructions');

        // Mobile controls
        R.fillStyle = '#000';
        fillRect(0, CANVAS_HEIGHT, CANVAS_WIDTH, MOBILE_CONTROLS_HEIGHT);

        R.fillStyle = '#fff';

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * !!down[KEYBOARD_LEFT];
            translate(CANVAS_WIDTH / 8, CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2);
            scale(-1, 1);
            renderMobileArrow();
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * !!down[KEYBOARD_RIGHT];
            translate(CANVAS_WIDTH * 3 / 8, CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2);
            renderMobileArrow();
        });

        wrap(() => {
            R.globalAlpha = 0.5 + 0.5 * !!down[KEYBOARD_SPACE];
            fillCircle(
                evaluate(CANVAS_WIDTH * 3 / 4),
                evaluate(CANVAS_HEIGHT + MOBILE_CONTROLS_HEIGHT / 2),
                evaluate(MOBILE_BUTTON_SIZE / 2)
            );
        });

        if (DEBUG) logPerf('mobile');

        // HUD
        const hudItems = [];
        hudItems.push([nomangle('DIFFICULTY [D]:'), DIFFICULTY.label]);

        if (this.timer) {
            hudItems.push([nomangle('LEVEL:'), (this.level.index + 1) + '/' + LEVELS.length]);
            hudItems.push([nomangle('TIME:'), formatTime(this.timer)]);
            hudItems.push([nomangle('BEST:'), this.isRunValid ? formatTime(this.bestTime) : 'N/A']);
        }

        if (DEBUG) {
            hudItems.push(['FPS', ~~G.fps]);
            perfLogs.forEach(log => {
                hudItems.push(log);
            });
        }

        hudItems.forEach(([label, value], i) => wrap(() => {
            R.textAlign = nomangle('left');
            R.textBaseline = nomangle('middle');
            R.fillStyle = '#fff';
            R.fillStyle = '#fff';

            // Label
            R.font = nomangle('bold italic 18pt Impact');
            fillText(label, 20, 30 + i * 90);

            // Value
            R.font = nomangle('36pt Impact');
            fillText(value, 20, 30 + 40 + i * 90);
        }));
    }

}
