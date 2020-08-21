class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        wrap(() => {
            translate(this.x, this.y);

            R.fillStyle = '#f00';
            fr(-10, -10, 20, 20);
        });
    }
}
