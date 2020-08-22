class Guard {
    constructor(level, definition) {
        

        // [fromAngle, toAngle, duration, startTime]
        this.cycleDescription = [
            [fromAngle, fromAngle, pauseDuration],
            [fromAngle, toAngle, rotationDuration],
            [toAngle, toAngle, pauseDuration],
            [toAngle, fromAngle, rotationDuration]
        ];

        this.cycleItem = () => getCycleItem(this.level.clock, [
            [fromRowCol, [fromRowCol, fromRowCol]],
            [rotationDuration, [fromAngle, toAngle]],
            [pauseDuration, [toAngle, toAngle]],
            [rotationDuration, [toAngle, fromAngle]]
        ])
    }

    cycleItem() {
        const progressInCycle = this.level.clock % this.totalCycleDuration;

        // Find which item is currently relevant
        let cycleItemIndex = this.cycleDescription.length - 1;
        while (this.cycleDescription[cycleItemIndex][3] > progressInCycle) {
            cycleItemIndex--;
        }


    }

    cycle() {

    }
}
