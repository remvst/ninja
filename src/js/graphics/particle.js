class Particle {
    constructor(properties) {
        const duration = properties.duration || 1;

        this.color = properties.color || '#f00';

        const size = properties.size || [5, 5];
        const alpha = properties.alpha || [1, -1];

        interp(this, 'x', properties.x[0], properties.x[0] + properties.x[1], duration);
        interp(this, 'y', properties.y[0], properties.y[0] + properties.y[1], duration);
        interp(this, 'alpha', alpha[0], alpha[0] + alpha[1], duration);
        interp(this, 'size', size[0], size[0] + (size[1] || 0), duration, 0, null, properties.onFinish);
    }

    render() {
        R.globalAlpha = this.alpha;
        fs(this.color);
        fr(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        // fillCircle(this.x, this.y, this.size / 2);
    }
}
