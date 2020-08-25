class Menu {

    constructor(title, subtitle) {
        this.title = title;
        this.subtitle = subtitle;

        this.titlePosition = this.subtitlePosition = 9999;
        this.dimAlpha = 0;
        this.dim = true;
    }

    animateIn() {
        interp(this, 'titlePosition', -CANVAS_WIDTH / 2, LEVEL_WIDTH / 2, 0.5, 0, easeOutQuint);
        interp(this, 'subtitlePosition', CANVAS_WIDTH * 3 / 2, LEVEL_WIDTH / 2, 0.5, 1, easeOutQuint);
        interp(this, 'dimAlpha', 0, 1, 0.3);
    }

    animateOut() {
        interp(this, 'titlePosition', LEVEL_WIDTH / 2, CANVAS_WIDTH * 3 / 2, 0.5, 0, easeInQuint);
        interp(this, 'subtitlePosition', LEVEL_WIDTH / 2, -CANVAS_WIDTH / 2, 0.5, 0, easeInQuint, () => G.menu = null);
        interp(this, 'dimAlpha', 1, 0, 0.3, 0.2);
    }

    cycle(e) {

    }

    render() {
        const LEVEL_WIDTH = LEVEL_COLS * CELL_SIZE;
        const levelHeight = LEVEL_ROWS * CELL_SIZE;

        translate(
            (CANVAS_WIDTH - LEVEL_WIDTH) / 2,
            (CANVAS_HEIGHT - levelHeight) / 2
        );

        if (this.dim) {
            beginPath();
            rect(0, 0, LEVEL_WIDTH, levelHeight);
            clip();

            // Dim
            R.fillStyle = 'rgba(0,0,0,' + this.dimAlpha * 0.8 + ')';
            fr(0, 0, LEVEL_WIDTH, levelHeight);
        }


        R.textAlign = 'center';
        R.textBaseline = 'middle';
        R.fillStyle = '#fff';

        R.font = 'italic 24pt Impact';
        shadowedText(this.title, this.titlePosition, levelHeight / 2 - 25);

        R.font = 'italic 48pt Impact';
        shadowedText(this.subtitle, this.subtitlePosition, levelHeight / 2 + 25);
    }

}
