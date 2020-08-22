class Guard extends PlayerSpotter {
    constructor(level, cycleDefinition) {
        super(level);
        this.cycleDefinition = cycleDefinition;
        this.maxDistance = GUARD_MAX_DISTANCE;
        this.halfFov = GUARD_HALF_FOV;
    }

    cycle(e) {
        if (!this.foundPlayer) {
            this.cycleDefinition.update(this, this.level.clock);

            // If the guard is facing back, add a quick 180 degrees
            this.angle = this.facing > 0 ? 0 : PI;
        }

        super.cycle(e);
    }

    render() {
        super.render();

        wrap(() => {
            translate(this.x, this.y);

            fs('#f00');
            fr(-10,-10,20,20);
        });

        const angles = [];

        R.strokeStyle = '#f00';
        R.fillStyle = '#f00';
        R.globalAlpha = 0.2;
        R.lineWidth = 5;

        beginPath();
        for (let angle = 0 ; angle < PI * 2 ; angle += PI / 16) {
            const impact = castRay(this.x, this.y, angle, 400);
            // beginPath();
            // moveTo(this.x, this.y);
            lineTo(impact.x, impact.y);
            // stroke();
        }

        // fill();

        // const allAdjustments = this.allSnapAdjustments();
        // allAdjustments.forEach((adjustment) => {
        //     R.strokeStyle = 'blue';
        //     strokeRect(adjustment.x - PLAYER_RADIUS, adjustment.y - PLAYER_RADIUS, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);
        // });
    }
}
