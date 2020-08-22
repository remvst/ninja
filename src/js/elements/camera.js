class Camera extends PlayerSpotter {
    constructor(level, cycleDefinition) {
        super(level);
        this.cycleDefinition = cycleDefinition;
        this.maxDistance = CAMERA_MAX_DISTANCE;
        this.halfFov = CAMERA_HALF_FOV;
    }

    cycle(e) {
        if (!this.foundPlayer) {
            this.cycleDefinition.update(this, this.level.clock);
        }

        super.cycle(e);
    }

    render() {
        super.render();

        wrap(() => {
            translate(this.x, this.y);
            rotate(this.angle);

            fs('#888');
            fr(-10, -5, 20, 10);

            fs('#444');
            fr(10, -2, 4, 4);

            fs(this.level.clock % 2 > 1 ? '#f00' : '#0f0');
            fr(6, -3, 2, 2);
        });
    }
}
