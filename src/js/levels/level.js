class Level {
    constructor(index, definition) {
        this.index = index;
        this.definition = definition;

        this.stop();
    }

    endWith(f) {
        if (!this.ended) {
            this.ended = true;
            this.player.controllable = false;
            f();
        }
    }

    foundExit() {
        this.endWith(() => {
            const hasNextLevel = LEVELS[this.index + 1];
            G.menu = new Menu(
                nomangle('SEARCHING FOR EVIL PLANS...'),
                hasNextLevel ? nomangle('404 NOT FOUND') : nomangle('200 FOUND!')
            );
            G.menu.animateIn();

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
        });

        setTimeout(() => this.waitingForRetry = true, 1000);
    }

    start() {
        this.ended = false;

        this.clock = 0;

        this.cyclables = [];
        this.renderables = [];

        this.player = new Player(
            this,
            toMiddleCellCoord(this.definition.spawn[1]),
            toMiddleCellCoord(this.definition.spawn[0])
        );

        this.exit = new Exit(
            this,
            toMiddleCellCoord(this.definition.exit[1]),
            toMiddleCellCoord(this.definition.exit[0])
        );
        this.cyclables.push(this.exit);
        this.renderables.push(this.exit);

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

        setTimeout(() => {
            this.player.controllable = true;
            this.player.spawn();
            this.cyclables.push(this.player);
            this.renderables.push(this.player);
        }, 1000);
    }

    stop() {
        this.cyclables = [];
        this.renderables = [];
    }

    cycle(e) {
        this.clock += e;

        this.cyclables.forEach(x => x.cycle(e));

        if (down[KEYBOARD_SPACE] && this.waitingForRetry) {
            this.waitingForRetry = false;
            G.menu.animateOut();

            setTimeout(() => this.start(), 1000);
        }
    }

    render() {
        // Background
        R.fillStyle = '#29c2fd';
        fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);

        R.fillStyle = LEVEL_BACKGROUND;
        fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);

        this.background = this.background || createLevelBackground(this);
        drawImage(this.background, 0, 0);

        // R.fillStyle = 'rgba(0,0,0,0.2)';
        // for (let k = 0 ; k < LEVEL_ROWS ; k++) {
        //     fr(0, k * CELL_SIZE, LEVEL_COLS * CELL_SIZE, 1);
        //     fr(k * CELL_SIZE, 0, 1, LEVEL_ROWS * CELL_SIZE);
        // }

        // Renderables
        this.renderables.forEach(x => wrap(() => x.render()));

        // Matrix
        R.fillStyle = '#010640';
        for (let row = 0 ; row < LEVEL_ROWS ; row++) {
            for (let col = 0 ; col < LEVEL_ROWS ; col++) {
                if (this.definition.matrix[row][col]) {
                    fr(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        // Message
        R.textAlign = 'center';
        R.textBaseline = 'middle';
        R.fillStyle = 'rgba(255,255,255,0.5)';
        R.font = '30pt Impact';
        fillText(this.definition.message || '', LEVEL_WIDTH / 2, 100);
    }

    particle(properties) {
        let particle;
        properties.onFinish = () => remove(this.renderables, particle);
        this.renderables.push(particle = new Particle(properties));
    }

}
