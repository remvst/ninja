class Menu {

    constructor(title, subtitle, footer) {
        this.title = title;
        this.subtitle = subtitle;
        this.footer = footer || '';

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

    render() {
        translate(
            (CANVAS_WIDTH - LEVEL_WIDTH) / 2,
            (CANVAS_HEIGHT - LEVEL_HEIGHT) / 2
        );

        if (this.dim) {
            beginPath();
            rect(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
            clip();

            // Dim
            R.fillStyle = 'rgba(0,0,0,' + this.dimAlpha * 0.8 + ')';
            fr(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
        }


        R.textAlign = 'center';
        R.textBaseline = 'middle';
        R.fillStyle = '#fff';

        R.font = nomangle('bold italic 24pt ') + FONT;
        shadowedText(this.title, this.titlePosition, LEVEL_HEIGHT / 2 - 25);

        R.font = nomangle('bold italic 48pt ') + FONT;
        shadowedText(this.subtitle, this.subtitlePosition, LEVEL_HEIGHT / 2 + 25);

        R.fillStyle = '#888';
        R.font = nomangle('16pt ') + FONT;
        shadowedText(this.footer, LEVEL_WIDTH / 2, LEVEL_HEIGHT - 20);
    }

}
