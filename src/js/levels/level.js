class Level {
    constructor(index, definition) {
        this.index = index;
        this.definition = definition;

        this.cyclables = [];
        this.renderables = [];

        this.background = createLevelBackground(this.definition.matrix);

        this.stop();
    }

    foundExit() {
        // Avoid finding the exit twice
        remove(this.cyclables, this.exit);

        // Prevent the player from moving
        this.player.controllable = false;

        G.menu = new Menu(
            'SEARCHING FOR EVIL PLANS...',
            'NOT FOUND'
        );
        G.menu.animateIn();

        setTimeout(() => {
            G.menu.animateOut();
        }, 2000);

        setTimeout(() => {
            G.nextLevel();
        }, 2500);
    }

    start() {
        this.active = true;

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

        // Show a menu
        G.menu = new Menu(
            'Floor ' + (this.index + 1),
            ''
        );
        G.menu.animateIn();

        setTimeout(() => {
            G.menu.animateOut();

            this.player.controllable = true;
            this.player.spawn();
            this.cyclables.push(this.player);
            this.renderables.push(this.player);
        }, 2000);
    }

    stop() {
        this.active = false;
    }

    cycle(e) {
        this.cyclables.forEach(x => x.cycle(e));
    }

    render() {
        // Background
        R.fillStyle = '#29c2fd';
        R.fillStyle = LEVEL_BACKGROUND;
        fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);

        drawImage(this.background, 0, 0);

        R.fillStyle = 'rgba(0,0,0,0.2)';
        // for (let k = 0 ; k < LEVEL_ROWS ; k++) {
        //     fr(0, k * CELL_SIZE, LEVEL_COLS * CELL_SIZE, 1);
        //     fr(k * CELL_SIZE, 0, 1, LEVEL_ROWS * CELL_SIZE);
        // }

        // Render renderables
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

        // if (!this.active) {
        //     R.fillStyle = WINDOW_PATTERN;
        //     fr(0, 0, LEVEL_ROWS * CELL_SIZE, LEVEL_COLS * CELL_SIZE);
        // }
    }

    particle(properties) {
        let particle;
        properties.onFinish = () => remove(this.renderables, particle);
        this.renderables.push(particle = new Particle(properties));
    }

}
