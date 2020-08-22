class Level {
    constructor(index, definition) {
        this.index = index;
        this.definition = definition;

        this.windowsAlpha = 0;

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
            G.menu = new Menu(
                'SEARCHING FOR EVIL PLANS...',
                '404 NOT FOUND'
            );
            G.menu.animateIn();

            setTimeout(() => {
                G.menu.animateOut();
            }, 2000);

            setTimeout(() => {
                G.nextLevel();

                interp(this, 'windowsAlpha', 0, 1, 0.2);
            }, 2500);
        });
    }

    wasFound() {
        this.endWith(() => {
            G.menu = new Menu(
                'YOU WERE FOUND!',
                'PRESS [R] TO TRY AGAIN'
            );
            G.menu.animateIn();
        });
    }

    start() {
        this.ended = false;

        interp(this, 'windowsAlpha', 1, 0, 0.2);

        this.clock = 0;

        this.cyclables = [];
        this.renderables = [];

        this.player = new Player(
            this,
            (this.definition.spawn[1] + 0.5) * CELL_SIZE,
            (this.definition.spawn[0] + 0.5) * CELL_SIZE
        );

        this.exit = new Exit(
            this,
            (this.definition.exit[1] + 0.5) * CELL_SIZE,
            (this.definition.exit[0] + 0.5) * CELL_SIZE
        );
        this.cyclables.push(this.exit);
        this.renderables.push(this.exit);

        this.definition.cameras.forEach(([row, col, fromAngle, toAngle, pauseDuration, rotationDuration]) => {
            const camera = new Camera(
                this,
                (col + 0.5) * CELL_SIZE,
                (row + 0.5) * CELL_SIZE,
                fromAngle,
                toAngle,
                pauseDuration,
                rotationDuration
            );
            this.cyclables.push(camera);
            this.renderables.push(camera);
        });

        // Show a menu
        // const menu = G.menu = new Menu(
        //     'Floor ' + (this.index + 1),
        //     ''
        // );
        // menu.animateIn();

        setTimeout(() => {
        //     menu.animateOut();

            this.player.controllable = true;
            this.player.spawn();
            this.cyclables.push(this.player);
            this.renderables.push(this.player);
        }, 500);
    }

    stop() {
        this.cyclables = [];
        this.renderables = [];
    }

    cycle(e) {
        this.clock += e;

        this.cyclables.forEach(x => x.cycle(e));
    }

    render() {
        // Background
        R.fillStyle = '#29c2fd';
        R.fillStyle = LEVEL_BACKGROUND;
        fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);

        this.background = this.background || createLevelBackground(this);
        drawImage(this.background, 0, 0);

        R.fillStyle = 'rgba(0,0,0,0.2)';
        for (let k = 0 ; k < LEVEL_ROWS ; k++) {
            fr(0, k * CELL_SIZE, LEVEL_COLS * CELL_SIZE, 1);
            fr(k * CELL_SIZE, 0, 1, LEVEL_ROWS * CELL_SIZE);
        }

        // Message
        R.textAlign = 'center';
        R.textBaseline = 'middle';
        R.fillStyle = 'rgba(255,255,255,0.5)';
        R.font = 'italic 24pt Impact';

        const levelWidth = LEVEL_COLS * CELL_SIZE;
        const levelHeight = LEVEL_ROWS * CELL_SIZE;
        fillText(this.definition.message || '', levelWidth / 2, levelHeight / 5);

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

        R.globalAlpha = this.windowsAlpha;
        R.fillStyle = WINDOW_PATTERN;
        // fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);
    }

    particle(properties) {
        let particle;
        properties.onFinish = () => remove(this.renderables, particle);
        this.renderables.push(particle = new Particle(properties));
    }

}
