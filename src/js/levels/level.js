class Level {
    constructor(index, definition) {
        this.index = index;
        this.definition = definition;

        this.backgroundColor = LEVEL_COLORS[index % LEVEL_COLORS.length];
        this.obstacleColor = darken(this.backgroundColor, 0.18);

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
            G.menu = new Menu(
                nomangle('YOU WERE FOUND!'),
                nomangle('PRESS [SPACE] TO TRY AGAIN')
            );
            G.menu.animateIn();

            failSound();
        });

        setTimeout(() => this.waitingForRetry = true, 1000);
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

        if (INPUT.jump() && this.waitingForRetry) {
            this.waitingForRetry = false;
            G.menu.animateOut();

            this.prepare();

            setTimeout(() => this.start(), 1000);

            beepSound();
        }
    }

    render() {
        this.background = this.background || createLevelBackground(this);
        drawImage(this.background, 0, 0);

        if (DEBUG && getDebugValue('grid')) {
            R.fillStyle = 'rgba(0,0,0,0.2)';
            for (let k = 0 ; k < LEVEL_ROWS ; k++) {
                fr(0, k * CELL_SIZE, LEVEL_COLS * CELL_SIZE, 1);
                fr(k * CELL_SIZE, 0, 1, LEVEL_ROWS * CELL_SIZE);
            }

            R.fillStyle = '#fff';
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
        const [row, message] = this.definition.message || [0, ''];
        R.textAlign = 'center';
        R.textBaseline = 'middle';
        R.fillStyle = 'rgba(255,255,255,0.7)';
        R.font = nomangle('bold 30pt ') + FONT;
        fillText(
            message,
            LEVEL_WIDTH / 2,
            toMiddleCellCoord(row)
        );

        // Renderables
        this.renderables.forEach(x => wrap(() => x.render()));

        // Matrix
        R.fillStyle = this.obstacleColor;
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
