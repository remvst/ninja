class Cycle {
    constructor() {
        this.items = [];
        this.totalDuration = 0;
    }

    add(duration, action) {
        this.items.push([duration, this.totalDuration, action]);
        this.totalDuration += duration;
        return this;
    }

    update(element, clock) {
        const progressInCycle = clock % this.totalDuration;

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
    constructor(angle) {
        super();
        this.lastAngle = angle;
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
}
