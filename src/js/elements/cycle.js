class Cycle {
    constructor() {
        this.items = [];
        this.totalDuration = 0;
        this.phase = 0;
    }

    withPhase(phase) {
        this.phase = phase;
        return this;
    }

    add(duration, action) {
        this.items.push([duration, this.totalDuration, action]);
        this.totalDuration += duration;
        return this;
    }

    update(element, clock) {
        this.constants(element);

        if (!this.items.length) {
            return;
        }

        const progressInCycle = (this.phase + clock + this.totalDuration) % this.totalDuration;

        // Find which item is currently relevant
        let index = this.items.length - 1;
        while (this.items[index][1] > progressInCycle) {
            index--;
        }

        // Find the progress within that item
        const [duration, startTime, update] = this.items[index];
        const progressWithinItem = progressInCycle - startTime;
        const progressRatio = progressWithinItem / duration;

        update(element, progressRatio);
    }
}

class CameraCycle extends Cycle {
    constructor(row, col, angle) {
        super();
        this.lastAngle = angle;
        this.x = toMiddleCellCoord(col);
        this.y = toMiddleCellCoord(row);
    }

    wait(duration) {
        const { lastAngle } = this;
        return this.add(duration, camera => {
            camera.angle = lastAngle;
        });
    }

    rotateTo(duration, toAngle) {
        const { lastAngle } = this;
        this.lastAngle = toAngle;
        return this.add(duration, (camera, ratio) => {
            camera.angle = ratio * (toAngle - lastAngle) + lastAngle;
        });
    }

    rotateBy(duration, angleOffset) {
        return this.rotateTo(duration, this.lastAngle + angleOffset);
    }

    constants(camera) {
        camera.x = this.x;
        camera.y = this.y;
        camera.angle = this.lastAngle;
    }

    patrol(rotationDuration, toAngle, pauseDuration) {
        const { lastAngle } = this;
        return this.wait(pauseDuration).rotateTo(rotationDuration, toAngle).wait(pauseDuration).rotateTo(rotationDuration, lastAngle);
    }
}

class GuardCycle extends Cycle {
    constructor(row, col) {
        super();
        this.lastFacing = 1;
        this.lastX = toMiddleCellCoord(col);
        this.y = toMiddleCellCoord(row) + evaluate(CELL_SIZE / 2 - PLAYER_RADIUS);
    }

    wait(duration) {
        const { lastFacing, lastX } = this;
        return this.add(duration, guard => {
            guard.walking = false;
            guard.x = lastX;
        });
    }

    walkTo(col) {
        const { lastX } = this;
        const x = toMiddleCellCoord(col);
        const duration = abs(this.lastX - x) / GUARD_WALKING_SPEED;
        const facing = sign(x - lastX);
        this.lastX = x;
        this.lastFacing = facing;
        return this.add(duration, (guard, ratio) => {
            guard.facing = facing;
            guard.walking = true;
            guard.x = ratio * (x - lastX) + lastX;
        });
    }

    constants(guard) {
        guard.y = this.y;
        guard.x = this.lastX;
    }

    patrol(pauseFrom, toCol, pauseTo) {
        const fromCol = toCellUnit(this.lastX);
        return this.wait(pauseFrom).walkTo(toCol).wait(pauseTo).walkTo(fromCol);
    }
}
