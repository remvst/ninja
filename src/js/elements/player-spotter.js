class PlayerSpotter {
    constructor(level) {
        this.level = level;
        this.angle = 0;
        this.halfFov = 0;
        this.maxDistance = 100;
    }

    cycle() {
        if (!this.foundPlayer) {
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

        if (distToPlayer < PLAYER_RADIUS * 2) {
            return true;
        }

        if (abs(normalize(this.angle - angleToPlayer)) > this.halfFov || distToPlayer > this.maxDistance) {
            return false;
        }

        const impact = castRay(this.x, this.y, angleToPlayer, this.maxDistance);
        return dist(this, impact) >= distToPlayer;
    }

    render() {
        renderVision(
            this.x,
            this.y,
            this.angle - this.halfFov,
            this.angle + this.halfFov,
            this.maxDistance,
            this.foundPlayer ? '#f00': '#ff0'
        );
    }
}
