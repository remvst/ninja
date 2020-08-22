class Camera {
    constructor(
        level,
        x,
        y,
        fromAngle,
        toAngle,
        pauseDuration,
        rotationDuration
    ) {
        this.level = level;
        this.x = x;
        this.y = y;

        // [fromAngle, toAngle, duration, startTime]
        this.cycleDescription = [
            [fromAngle, fromAngle, pauseDuration],
            [fromAngle, toAngle, rotationDuration],
            [toAngle, toAngle, pauseDuration],
            [toAngle, fromAngle, rotationDuration]
        ];

        // Add the start time to each item
        let acc = 0;
        this.cycleDescription.forEach(item => {
            item.push(acc);
            acc += item[2];
        });

        this.totalCycleDuration = acc;
    }

    cycle(e) {
        const progressInCycle = this.level.clock % this.totalCycleDuration;

        // Find which item is currently relevant
        let cycleItemIndex = this.cycleDescription.length - 1;
        while (this.cycleDescription[cycleItemIndex][3] > progressInCycle) {
            cycleItemIndex--;
        }

        // Find the progress within that item
        const [fromAngle, toAngle, duration, startTime] = this.cycleDescription[cycleItemIndex];
        const progressWithinItem = progressInCycle - startTime;
        const progressRatio = progressWithinItem / duration;

        // Calculate the angle based on that progress
        const angleToPlayer = normalize(angleBetween(this, this.level.player));
        if (this.foundPlayer) {
            this.angle = angleToPlayer;
        } else {
            this.angle = progressRatio * (toAngle - fromAngle) + fromAngle;
        }

        this.foundPlayer = this.foundPlayer || this.seesPlayer;
        if (this.foundPlayer) {
            this.level.wasFound();
        }
    }

    get seesPlayer() {
        // Check if the player is close enough, and within the FOV first
        const angleToPlayer = normalize(angleBetween(this, this.level.player));
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
