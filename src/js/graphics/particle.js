class Particle {
    constructor({
        x,
        y,
        duration = 1,
        color = '#f00',
        size = [5, 5],
        alpha = [1, -1],
        onFinish
    }) {
        this.color = color;
        this.size = size;

        interp(this, 'x', x[0], x[0] + x[1], duration);
        interp(this, 'y', y[0], y[0] + y[1], duration);
        interp(this, 'alpha', alpha[0], alpha[0] + alpha[1], duration);
        interp(this, 'size', size[0], size[0] + (size[1] || 0), duration, 0, null, onFinish);
    }

    render() {
        R.globalAlpha = this.alpha;
        fs(this.color);
        fr(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}
