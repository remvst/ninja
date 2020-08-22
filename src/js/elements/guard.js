class Guard extends PlayerSpotter {
    constructor(level, cycleDefinition) {
        super(level);
        this.cycleDefinition = cycleDefinition;
        this.maxDistance = GUARD_MAX_DISTANCE;
        this.halfFov = GUARD_HALF_FOV;
        this.facing = 1;
        this.facingScale = 1;
    }

    cycle(e) {
        if (!this.foundPlayer) {
            this.cycleDefinition.update(this, this.level.clock);
        } else {
            this.facing = sign(this.level.player.x - this.x);
        }

        // If the guard is facing back, add a quick 180 degrees
        this.angle = this.facing > 0 ? 0 : PI;

        const { facing } = this;

        super.cycle(e);

        if (facing != this.facing) {
            interp(this, 'facingScale', -1, 1, 0.1);
        }
    }

    render() {
        super.render();

        wrap(() => {
            translate(this.x, this.y);

            fs('#f00');
            fr(-10,-10,20,20);

            renderPlayer(
                R,
                GUARD_BODY,
                true,
                this.facing * this.facingScale,
                this.walking,
                0
            );
        });
    }
}
