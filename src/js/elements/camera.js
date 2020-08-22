class Camera {
    constructor(
        level,
        x,
        y,
        cycleDefinition
    ) {
        this.level = level;
        this.x = x;
        this.y = y;
        this.cycleDefinition = cycleDefinition;
    }

    cycle(e) {
        if (!this.foundPlayer) {
            this.cycleDefinition.update(this, this.level.clock);

            this.foundPlayer = this.seesPlayer;
            if (this.foundPlayer) {
                this.level.wasFound();
            }
        }
    }

    get seesPlayer() {
        // Check if the player is close enough, and within the FOV first
        const angleToPlayer = angleBetween(this, this.level.player);
        const distToPlayer = dist(this, this.level.player)

        if (abs(normalize(this.angle - angleToPlayer)) > CAMERA_HALF_FOV || distToPlayer > CAMERA_MAX_DISTANCE) {
            return false;
        } else {
            const impact = castRay(this.x, this.y, angleToPlayer, CAMERA_MAX_DISTANCE);
            return dist(this, impact) >= distToPlayer;
        }
    }

    render() {
        renderVision(
            this.x,
            this.y,
            this.angle - CAMERA_HALF_FOV,
            this.angle + CAMERA_HALF_FOV,
            CAMERA_MAX_DISTANCE,
            this.foundPlayer ? '#f00': '#ff0'
        );

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
