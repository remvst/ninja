class Level {
    constructor(index, definition) {
        this.index = index;
        this.definition = definition;

        this.deathCount = 0;

        this.backgroundColor = LEVEL_COLORS[index % LEVEL_COLORS.length];
        this.obstacleColor = darken(this.backgroundColor, 0.2);

        this.stop();
    }

    endWith(f) {
        if (!this.ended) {
            this.ended = true;
            f();
        }
    }

    foundExit() {
        this.endWith(() => {
            exitSound();

            const hasNextLevel = LEVELS[this.index + 1];
            G.menu = new Menu(
                pick([
                    nomangle('SEARCHING FOR EVIL PLANS...'),
                    nomangle('GET http://evil.corp/plans.pdf'),
                    nomangle('GET http://localhost/evil-plans.pdf'),
                    nomangle('BROWSING FILES...'),
                ]),
                hasNextLevel ? pick([
                    nomangle('404 NOT FOUND'),
                    nomangle('FILE NOT FOUND'),
                    nomangle('NOTHING HERE'),
                ]) : nomangle('200 FOUND!')
            );
            G.menu.animateIn();

            setTimeout(() => {
                (hasNextLevel ? notFoundSound : finishSound)();
            }, 1000);

            setTimeout(() => {
                G.menu.animateOut();
            }, 2000);

            setTimeout(() => {
                if (hasNextLevel) {
                    G.nextLevel();
                } else {
                    G.endAnimation();
                }
            }, 2500);
        });
    }

    wasFound() {
        this.endWith(() => {
            this.deathCount++;

            G.menu = new Menu(
                nomangle('YOU WERE FOUND!'),
                nomangle('PRESS [R] TO TRY AGAIN'),
                DIFFICULTY_INSTRUCTION.toUpperCase()
            );
            G.menu.animateIn();

            failSound();

            setTimeout(() => {
                if (this.ended) {
                    this.waitingForRetry = true;
                }
            }, 1000);
        });
    }

    prepare() {
        this.ended = false;
        this.started = false;

        this.clock = 0;

        this.cyclables = [];
        this.renderables = [];

        this.player = new Player(
            this,
            toMiddleCellCoord(this.definition.spawn[1]),
            toMiddleCellCoord(this.definition.spawn[0])
        );
        this.cyclables.push(this.player);

        const exit = new Exit(
            this,
            toMiddleCellCoord(this.definition.exit[1]),
            toMiddleCellCoord(this.definition.exit[0])
        );
        this.cyclables.push(exit);
        this.renderables.push(exit);

        this.definition.cameras.forEach(cameraDefinition => {
            const camera = new Camera(this, cameraDefinition);
            this.cyclables.push(camera);
            this.renderables.push(camera);
        });

        this.definition.guards.forEach(guardDefinition => {
            const guard = new Guard(this, guardDefinition);
            this.cyclables.push(guard);
            this.renderables.push(guard);
        });

        // Give cyclables a cycle so they're in place
        this.cyclables.forEach((cyclable) => {
            cyclable.cycle(0);
        });
    }

    start() {
        this.started = true;

        this.player.spawn();
        this.renderables.push(this.player);
    }

    stop() {
        this.cyclables = [];
        this.renderables = [];
    }

    cycle(e) {
        e *= G.difficulty.timeFactor;

        if (this.started && !this.ended) {
            this.clock += e;
            this.cyclables.forEach(x => x.cycle(e));
        }

        if (INPUT.jump() && this.waitingForRetry || down[KEYBOARD_R] && this.started) {
            this.waitingForRetry = false;
            if (G.menu) {
                G.menu.animateOut();

                if (!G.difficultyPromptShown && this.deathCount > DIFFICULTY_PROMPT_DEATH_COUNT) {
                    G.difficultyPromptShown = true;
                    alert(DIFFICULTY_INSTRUCTION);
                }
            }
            this.prepare();

            setTimeout(() => this.start(), 1000);

            beepSound();
        }
    }

    render() {
        this.background = this.background || createLevelBackground(this);
        drawImage(this.background, 0, 0);

        if (DEBUG && getDebugValue('grid')) {
            R.fs('rgba(0,0,0,0.2)');
            for (let k = 0 ; k < LEVEL_ROWS ; k++) {
                fr(0, k * CELL_SIZE, LEVEL_COLS * CELL_SIZE, 1);
                fr(k * CELL_SIZE, 0, 1, LEVEL_ROWS * CELL_SIZE);
            }

            R.fs('#fff');
            R.textAlign = 'center';
            R.textBaseline = 'middle';
            R.font = '8pt Arial';
            for (let row = 0 ; row < LEVEL_ROWS ; row++) {
                for (let col = 0 ; col < LEVEL_ROWS ; col++) {
                    fillText(
                        `${row}-${col}`,
                        toMiddleCellCoord(col),
                        toMiddleCellCoord(row)
                    );
                }
            }
        }

        // Message
        wrap(() => {
            const ratio = limit(0, (this.clock - LEVEL_MESSAGE_DELAY) * 3, 1);
            R.globalAlpha = ratio;
            translate(0, (1 - ratio) * -10);

            const [row, message] = this.definition.message || [0, ''];
            R.textAlign = 'center';
            R.textBaseline = 'middle';
            R.fs('rgba(255,255,255,0.7)');
            R.font = font(26);
            fillText(
                message,
                LEVEL_WIDTH / 2,
                toMiddleCellCoord(row)
            );
        });

        // Renderables
        this.renderables.forEach(x => wrap(() => x.render()));

        // Matrix
        R.fs(this.obstacleColor);
        for (let row = 0 ; row < LEVEL_ROWS ; row++) {
            for (let col = 0 ; col < LEVEL_ROWS ; col++) {
                if (this.definition.matrix[row][col]) {
                    fr(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

    particle(properties) {
        let particle;
        properties.onFinish = () => remove(this.renderables, particle);
        this.renderables.push(particle = new Particle(properties));
    }

}
