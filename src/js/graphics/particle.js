class Particle {
    constructor(props) {
        const duration = props.duration || 1;

        this.color = props.color || '#f00';

        const size = props.size || [5, 5];
        const alpha = props.alpha || [1, -1];

        interp(this, 'x', props.x[0], props.x[0] + props.x[1], duration);
        interp(this, 'y', props.y[0], props.y[0] + props.y[1], duration);
        interp(this, 'alpha', alpha[0], alpha[0] + alpha[1], duration);
        interp(this, 'size', size[0], size[0] + (size[1] || 0), duration, 0, null, props.onFinish);
    }

    render() {
        R.globalAlpha = this.alpha;
        fs(this.color);
        fr(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}
