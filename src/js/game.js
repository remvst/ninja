const NINJA_POSITION = {
    'x': LEVEL_WIDTH / 2 + 30,
    'y': -PLAYER_RADIUS
};
const TITLE_FONT = italicFont(120);
const INTER_TITLE_FONT = italicFont(24);

class Game {

    constructor() {
        G = this;
        G.clock = 0;

        G.timer = 0;
        G.timerActive = false;

        G.difficulty = NORMAL_DIFFICULTY;
        G.wasDifficultyChangedDuringRun = false;
        G.difficultyPromptShown = false;

        G.level = LEVELS[0];
        G.level.prepare();

        G.renderables = [];

        G.bottomScreenAltitude = MAX_LEVEL_ALTITUDE + LEVEL_HEIGHT - CANVAS_HEIGHT / 2 + 100;
        G.windowsAlpha = 1;

        G.introAlpha = 1;
        G.mainTitleAlpha = 1;
        G.mainTitleYOffset = 1;
        G.interTitleYOffset = 1;

        G.bandanaSource = {'x': NINJA_POSITION.x, 'y': NINJA_POSITION.y - 10};
        G.bandanaTrail = Array(~~(MAX_BANDANA_LENGTH / MAIN_MENU_BANDANA_X_INTERVAL)).fill(0).map((x, i) => {
            return { 'x': G.bandanaSource.x + PLAYER_RADIUS / 2 + i * MAIN_MENU_BANDANA_X_INTERVAL};
        })

        G.mainTitle = nomangle('NINJA');
        G.interTitle = nomangle('VS');

        interp(G, 'introAlpha', 1, 0, 1, 2);
        interp(G, 'mainTitleYOffset', -CANVAS_HEIGHT , 0, 0.3, 0.5, null, () => {
            G.shakeTitleTime = 0.1;

            R.font = TITLE_FONT;
            G.dust(measureText(G.mainTitle).width / 2, TITLE_Y + 50, 100);
        });
        interp(G, 'interTitleYOffset', CANVAS_HEIGHT, 0, 0.3, 1, null, () => {
            G.shakeTitleTime = 0.1;

            R.font = INTER_TITLE_FONT;
            G.dust(measureText(G.interTitle).width / 2, INTER_TITLE_Y - 20, 5);
        });
    }

    dust(spreadRadius, y, count) {
        for (let i = 0 ; i < count ; i++) {
            G.particle({
                'size': [16],
                'color': '#fff',
                'duration': rnd(0.4, 0.8),
                'x': [CANVAS_WIDTH / 2 + rnd(-spreadRadius, spreadRadius), rnd(-40, 40)],
                'y': [y + rnd(-10, 10), rnd(-15, 15)]
            });
        }
    }

    changeDifficulty() {
        if (G.isStarted) {
            G.wasDifficultyChangedDuringRun = true;
        }

        const settings = difficultySettings();
        const currentDifficultyIndex = settings.indexOf(G.difficulty);
        G.difficulty = settings[(currentDifficultyIndex + 1) % settings.length];
    };

    startAnimation() {
        if (G.isStarted) {
            return;
        }

        G.isStarted = true;

        G.timer = 0;

        G.wasDifficultyChangedDuringRun = false;
        G.queuedTweet = null;

        G.level = LEVELS[0];
        if (DEBUG) {
            G.level = LEVELS[getDebugValue('level', 0)];
        }
        G.level.prepare();

        // Fade the title and intertitle out
        interp(G, 'mainTitleAlpha', 1, 0, 0.5);

        // Center the level, hide the windows, then start it
        G.centerLevel(
            G.level.index,
            5,
            0.5,
            () => {
                // Hide the windows, then start the level
                interp(G, 'windowsAlpha', 1, 0, 1, 0, null, () => {
                    G.timerActive = true;
                    G.level.start()
                });
            }
        )

        setTimeout(() => {
            G.menu = new Menu(
                nomangle('INFILTRATE THE TOWER'),
                nomangle('FIND THE EVIL PLANS')
            );
            G.menu.dim = false;
            G.menu.animateIn();

            setTimeout(() => G.menu.animateOut(), 3000);
        }, 1000);

        beepSound();
    }

    get bestTime() {
        try {
            return parseFloat(localStorage[G.bestTimeKey]) || 0;
        } catch(e) {
            return 0;
        }
    }

    get bestTimeKey() {
        return location.pathname + G.difficulty.label;
    }

    mainMenu() {
        INTERPOLATIONS = [];

        // Go to the top of the tower
        interp(
            G,
            'bottomScreenAltitude',
            G.bottomScreenAltitude,
            MAX_LEVEL_ALTITUDE + LEVEL_HEIGHT - CANVAS_HEIGHT / 2 + 100,
            2,
            0.5,
            easeInOutCubic
        );

        // Show the windows so the tower can be rendered again
        interp(G, 'windowsAlpha', G.windowsAlpha, 1, 1, 1);
        interp(G, 'mainTitleAlpha', 0, 1, 1, 3);

        G.isStarted = false;
        G.timerActive = false;
        G.timer = 0;
    }

    endAnimation() {
        // Allow the player to start the game again
        G.isStarted = false;
        G.timerActive = false;

        // Only save the best time if the player didn't switch the difficulty during
        if (!G.wasDifficultyChangedDuringRun) {
            localStorage[G.bestTimeKey] = min(G.bestTime || 999999, G.timer);
        }

        G.queuedTweet = nomangle('I beat ') + document.title + nomangle(' in ') + formatTime(G.timer) + nomangle(' on ') + G.difficulty.label + ' ' + nomangle('difficulty!');

        G.mainMenu();

        // Replace the title
        G.mainTitle = nomangle('YOU BEAT');
        G.interTitle = '';

        // Trophies for OS13K (not checking if the player changed difficulty just so they can win trophies more easily)
        const hardTrophy = G.difficulty == HARD_DIFFICULTY;
        const normalTrophy = G.difficulty == NORMAL_DIFFICULTY || hardTrophy;

        const keyPrefix = nomangle(`OS13kTrophy,GG,${document.title},Beat the game - `);
        const value = nomangle(`Find the evil plans`);

        if (normalTrophy) {
            localStorage[keyPrefix + nomangle('normal')] = value;
        }

        if (hardTrophy) {
            localStorage[keyPrefix + nomangle('nightmare')] = value;
        }

        localStorage[keyPrefix + nomangle('any')] = value;
    }

    cycle(e) {
        if (DEBUG) {
            if (down[KEYBOARD_F]) {
                e *= 4;
            }
            if (down[KEYBOARD_G]) {
                e *= 0.25;
            }
        }

        if (G.timerActive) {
            G.timer += e;
        }
        G.clock += e;
        G.shakeTitleTime -= e;

        if (INPUT.jump()) {
            G.startAnimation();
        }

        G.level.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));
    }

    centerLevel(levelIndex, duration, delay, callback) {
        // Move the camera to the new level, and only then start it
        interp(
            G,
            'bottomScreenAltitude',
            G.bottomScreenAltitude,
            G.levelBottomAltitude(levelIndex) - TOWER_BASE_HEIGHT,
            duration,
            delay,
            easeInOutCubic,
            callback
        );
    }

    nextLevel() {
        // Stop the previous level
        G.level.stop();

        // Prepare the new one
        G.level = LEVELS[G.level.index + 1];
        G.level.prepare();

        // Move the camera to the new level, and only then start it
        G.centerLevel(G.level.index, 0.5, 0, () => G.level.start());

        nextLevelSound();
    }

    levelBottomAltitude(levelIndex) {
        return levelIndex * LEVEL_HEIGHT;
    }

    render() {
        if (DEBUG) {
            resetPerfLogs();
        }

        if (DEBUG) {
            G.castIterations = 0;
        }

        if (DEBUG && getDebugValue('zoom')) {
            translate(-mousePosition.x + CANVAS_WIDTH / 2, -mousePosition.y + CANVAS_HEIGHT / 2);
            translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            scale(getDebugValue('zoom'), getDebugValue('zoom'));
            translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
        }

        // Sky
        fs(SKY_BACKGROUND);
        fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // TODO maybe split into two?

        if (DEBUG) logPerf('sky');

        // Moon
        wrap(() => {
            fs('#fff');
            fillCircle(CANVAS_WIDTH - 200, 100, 50);
        })

        if (DEBUG) logPerf('moon');

        // Thunder
        if (G.clock % THUNDER_INTERVAL < 0.3) {
            if (G.clock % 0.1 < 0.05) {
                fs('rgba(255, 255, 255, 0.2)');
                fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            R.strokeStyle = '#fff';
            R.lineWidth = 4;
            let x = createNumberGenerator(G.clock / THUNDER_INTERVAL).floating() * CANVAS_WIDTH;
            beginPath();
            for (let y = 0 ; y <= CANVAS_HEIGHT ; y += 40) {
                x += rnd(-40, 40);
                lineTo(x, y);
            }
            stroke();
        }

        if (DEBUG) logPerf('thunder');

        // Buildings in the background
        BUILDINGS_BACKGROUND.forEach((layer, i) => wrap (() => {
            const layerRatio = 0.2 + 0.8 * i / (BUILDINGS_BACKGROUND.length - 1);

            const altitudeRatio = G.bottomScreenAltitude / MAX_LEVEL_ALTITUDE;

            fs(layer);
            translate(0, ~~(CANVAS_HEIGHT - layer.height + altitudeRatio * layerRatio * 400));

            fr(0, 0, CANVAS_WIDTH, layer.height);
        }));

        if (DEBUG) logPerf('builds bg');

        // Rain
        wrap(() => {
            fs('rgba(255,255,255,0.4)');
            const rng = createNumberGenerator(1);
            for (let i = 0 ; i < 200 ; i++) {
                const startX = rng.between(-0.2, 1);
                const startRatio = rng.floating();
                const speed = rng.between(1, 2);

                const rainDropAngle = PI * 14 / 32 + rng.between(-1, 1) * PI / 64;

                const ratio = (startRatio + G.clock * speed) % 1.2;
                const xRatio = startX + cos(rainDropAngle) * ratio;
                const yRatio = sin(rainDropAngle) * ratio;

                wrap(() => {
                    translate(xRatio * CANVAS_WIDTH, yRatio * CANVAS_HEIGHT);
                    rotate(rainDropAngle);
                    fr(0, 0, -RAIN_DROP_LENGTH, 1);
                });
            }
        });

        if (DEBUG) logPerf('rain');

        // Render the tower
        wrap(() => {
            translate(LEVEL_X, ~~G.bottomScreenAltitude + LEVEL_HEIGHT + TOWER_BASE_HEIGHT);

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
                fs('#900');
                R.strokeStyle = '#f00';
                R.lineWidth = 5;
                R.font = italicFont(96);
                outlinedText(nomangle('EVILCORP'), LEVEL_WIDTH / 2, -30);

                wrap(() => {
                    const ninjaScale = 1.5;

                    G.bandanaTrail.forEach((item, i, arr) => {
                        const ratio = i / arr.length
                        const amplitude = 15 * ratio;
                        item.y = G.bandanaSource.y - ratio * 30 + sin(-ratio * 20 + G.clock * 35) * amplitude;
                    });

                    scale(1.5, 1.5);
                    renderBandana(R, G.bandanaSource, G.bandanaTrail);

                    translate(NINJA_POSITION.x, NINJA_POSITION.y);
                    renderCharacter(
                        R,
                        G.clock,
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
            const currentLevelIndex = LEVELS.indexOf(G.level);
            for (let i = max(0, currentLevelIndex - 1) ; i < min(LEVELS.length, currentLevelIndex + 2) ; i++) {
                wrap(() => {
                    translate(0, -G.levelBottomAltitude(i) - LEVEL_HEIGHT);
                    LEVELS[i].render();
                });
            }

            if (DEBUG) logPerf('levels');

            // Render the windows in front
            R.globalAlpha = G.windowsAlpha;
            fs(BUILDING_PATTERN);
            wrap(() => {
                // translate(-CELL_SIZE / 2, 0);
                fr(0, 0, LEVEL_WIDTH, -MAX_LEVEL_ALTITUDE - LEVEL_HEIGHT);
            });

            if (DEBUG) logPerf('windows');
        });

        if (G.menu) {
            wrap(() => G.menu.render());
        }

        wrap(() => {
            if (DEBUG && getDebugValue('nohud')) {
                return;
            }

            // Instructions
            if (G.clock % 2 < 1.5 && G.mainTitleAlpha == 1) {
                const instructions = [
                    nomangle('PRESS [SPACE] TO START'),
                    DIFFICULTY_INSTRUCTION.toUpperCase(),
                ]
                if (G.queuedTweet) {
                    instructions.unshift(nomangle('PRESS [T] TO TWEET YOUR TIME'));
                }
                instructions.forEach((s, i) => {
                    R.textAlign = nomangle('center');
                    R.textBaseline = nomangle('middle');
                    R.font = font(24);
                    fs('#fff');
                    R.strokeStyle = '#000';
                    R.lineWidth = 2;

                    outlinedText(s, CANVAS_WIDTH / 2, CANVAS_HEIGHT * 4 / 5 + i * 50);
                });
            }
        });

        if (DEBUG) logPerf('instructions');

        // Mobile controls
        fs('#000');
        fr(0, CANVAS_HEIGHT, CANVAS_WIDTH, MOBILE_CONTROLS_HEIGHT);

        fs('#fff');

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
        const hudItems = [
            [nomangle('DIFFICULTY:'), G.difficulty.label]
        ];

        if (G.timer) {
            hudItems.push([
                nomangle('LEVEL:'),
                (G.level.index + 1) + '/' + LEVELS.length
            ]);
            hudItems.push([
                nomangle('TIME' ) + (G.wasDifficultyChangedDuringRun ? nomangle(' (INVALIDATED):') : ':'),
                formatTime(G.timer)
            ]);
        }

        hudItems.push([
            nomangle('BEST [') + G.difficulty.label + ']:',
            formatTime(G.bestTime)
        ]);

        if (DEBUG) {
            hudItems.push(['Render FPS', ~~G.renderFps]);
            hudItems.push(['Cycle FPS', ~~G.cycleFps]);
            hudItems.push(['Interpolations', INTERPOLATIONS.length]);
            hudItems.push(['Cast iterations', ~~G.castIterations]);
            perfLogs.forEach(log => {
                hudItems.push(log);
            });
        }

        hudItems.forEach(([label, value], i) => wrap(() => {
            if (DEBUG && getDebugValue('nohud')) {
                return;
            }

            R.textAlign = nomangle('left');
            R.textBaseline = nomangle('middle');
            fs('#fff');

            // Label
            R.font = italicFont(18);
            shadowedText(label, 20, 30 + i * 90);

            // Value
            R.font = font(36);
            shadowedText(value, 20, 30 + 40 + i * 90);
        }));

        // Gamepad info
        R.textAlign = nomangle('right');
        R.textBaseline = nomangle('alphabetic');
        R.font = nomangle('18pt Courier');
        fs('#888');
        fillText(
            nomangle('Gamepad: ') + (gamepads().length ? nomangle('yes') : nomangle('no')),
            evaluate(CANVAS_WIDTH - 20),
            evaluate(CANVAS_HEIGHT - 20)
        );

        // Intro background
        wrap(() => {
            R.globalAlpha = G.introAlpha;
            fs('#000');
            fr(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

        // Title
        wrap(() => {
            if (G.shakeTitleTime > 0) {
                translate(rnd(-10, 10), rnd(-10, 10));
            }

            R.globalAlpha = G.mainTitleAlpha;
            R.textAlign = nomangle('center');
            R.textBaseline = nomangle('middle');
            fs('#fff');
            R.strokeStyle = '#000';

            // Main title
            R.lineWidth = 5;
            R.font = TITLE_FONT;
            outlinedText(G.mainTitle, CANVAS_WIDTH / 2, TITLE_Y + G.mainTitleYOffset);

            // "Inter" title (between the title and EVILCORP)
            R.font = INTER_TITLE_FONT;
            R.lineWidth = 2;
            outlinedText(G.interTitle, CANVAS_WIDTH / 2, INTER_TITLE_Y + G.interTitleYOffset);
        });

        G.renderables.forEach(renderable => wrap(() => renderable.render()));
    }

    particle(props) {
        let particle;
        props.onFinish = () => remove(G.renderables, particle);
        G.renderables.push(particle = new Particle(props));
    }

}
