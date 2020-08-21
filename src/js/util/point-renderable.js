class PointRenderable {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    render() {
        R.fillStyle = this.color;
        fr(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}
