class Menu {

    constructor(title, subtitle) {
        this.title = title;
        this.subtitle = subtitle;

        this.titlePosition = this.subtitlePosition = 9999;
        this.dimAlpha = 0;
        this.dim = true;
    }

    animateIn() {
        const levelWidth = LEVEL_COLS * CELL_SIZE;
        interp(this, 'titlePosition', -levelWidth / 2, levelWidth / 2, 0.5, 0, easeOutQuint);
        interp(this, 'subtitlePosition', levelWidth * 3 / 2, levelWidth / 2, 0.5, 1, easeOutQuint);
        interp(this, 'dimAlpha', 0, 1, 0.3);
    }

    animateOut() {
        const levelWidth = LEVEL_COLS * CELL_SIZE;
        interp(this, 'titlePosition', levelWidth / 2, levelWidth * 3 / 2, 0.5, 0, easeInQuint);
        interp(this, 'subtitlePosition', levelWidth / 2, -levelWidth / 2, 0.5, 0, easeInQuint, () => G.menu = null);
        interp(this, 'dimAlpha', 1, 0, 0.3, 0.2);
    }

    cycle(e) {

    }

    render() {
        const levelWidth = LEVEL_COLS * CELL_SIZE;
        const levelHeight = LEVEL_ROWS * CELL_SIZE;

        translate(
            (CANVAS_WIDTH - levelWidth) / 2,
            (CANVAS_HEIGHT - levelHeight) / 2
        );

        beginPath();
        rect(0, 0, levelWidth, levelHeight);
        clip();

        // Dim
        R.fillStyle = 'rgba(0,0,0,' + this.dim * this.dimAlpha * 0.8 + ')';
        fr(0, 0, levelWidth, levelHeight);

        R.textAlign = 'center';
        R.textBaseline = 'middle';
        R.fillStyle = '#fff';
        R.shadowColor = '#000';
        R.shadowOffsetY = 5;

        R.font = 'italic 24pt Impact';
        fillText(this.title, this.titlePosition, levelHeight / 2 - 25);

        R.font = 'italic 48pt Impact';
        fillText(this.subtitle, this.subtitlePosition, levelHeight / 2 + 25);
    }

}
