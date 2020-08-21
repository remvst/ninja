class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.previous = {'x': x, 'y': y};

        this.vX = this.vY = 0;
    }

    cycle(e) {
        // Save the previous state
        this.previous.x = this.x;
        this.previous.y = this.y;

        // Fall down
        this.vY += GRAVITY_ACCELERATION * e;

        // this.y += this.vY * e;

        let dX = 0, dY = 0;
        if (down[KEYBOARD_LEFT]) dX = -1;
        if (down[KEYBOARD_RIGHT]) dX = 1;
        if (down[KEYBOARD_UP]) dY = -1;
        if (down[KEYBOARD_DOWN]) dY = 1;

        this.x += dX * 500 * e;
        this.y += dY * 500 * e;

        this.readjust();
    }

    goToClosestAdjustment(reference, adjustments) {
        let closestAdjustment,
            closestAdjustmentDistance = 999;
        for (let i = 0 ; i < adjustments.length ; i++) {
            const distance = dist(reference, adjustments[i]);
            if (distance < closestAdjustmentDistance) {
                closestAdjustment = adjustments[i];
                closestAdjustmentDistance = distance;
            }
        }

        if (closestAdjustment) {
            this.x = closestAdjustment.x;
            this.y = closestAdjustment.y;
            // console.log(closestAdjustment);
        }

        return closestAdjustment;
    }

    toCellUnit(x) {
        return ~~(x / CELL_SIZE);
    }

    allSnapAdjustments() {
        const leftX = this.x - PLAYER_HORIZONTAL_RADIUS;
        const rightX = this.x + PLAYER_HORIZONTAL_RADIUS;
        const topY = this.y - PLAYER_VERTICAL_RADIUS;
        const bottomY = this.y + PLAYER_VERTICAL_RADIUS;

        const leftCol = this.toCellUnit(leftX);
        const rightCol = this.toCellUnit(rightX);
        const topRow = this.toCellUnit(topY);
        const bottomRow = this.toCellUnit(bottomY);

        const topLeft = hasBlock(leftX, topY);
        const topRight = hasBlock(rightX, topY);
        const bottomLeft = hasBlock(leftX, bottomY);
        const bottomRight = hasBlock(rightX, bottomY);

        const collision = topLeft || topRight || bottomLeft || bottomRight;
        if (!collision) {
            return [];
        }

        // console.log(leftCol, rightCol, topRow, bottomRow);
        // console.log(!!hasBlock(leftX, topY));

        const snapX = [this.previous.x, this.x];
        const snapY = [this.previous.y, this.y];
        for (let col = leftCol ; col <= rightCol ; col++) {
            snapX.push(
                col * CELL_SIZE + PLAYER_HORIZONTAL_RADIUS,
                (col + 1) * CELL_SIZE - PLAYER_HORIZONTAL_RADIUS - 0.0001
            );
        }
        for (let row = topRow ; row <= bottomRow ; row++) {
            snapY.push(
                row * CELL_SIZE + PLAYER_VERTICAL_RADIUS,
                (row + 1) * CELL_SIZE - PLAYER_VERTICAL_RADIUS - 0.0001
            );
        }

        return snapX.flatMap((x) => {
            return snapY.map((y) => {
                return {
                    'x': x,
                    'y': y
                };
            });
        }).filter((adjustment) => {
            return !hasBlock(
                adjustment.x,
                adjustment.y,
                PLAYER_HORIZONTAL_RADIUS
            );
        });
    }

    readjust() {
        const allAdjustments = this.allSnapAdjustments();

        // console.log('all adjustments: ', allAdjustments);
        const adjustment = this.goToClosestAdjustment(this, allAdjustments);

        return;

        // const allAdjustments = [
        //     this.possibleAdjustmentsFor(topRow, leftCol, this),
        //     this.possibleAdjustmentsFor(topRow, rightCol, this),
        //     this.possibleAdjustmentsFor(bottomRow, leftCol, this),
        //     this.possibleAdjustmentsFor(bottomRow, rightCol, this),
        // ].flat();
        //
        // // allAdjustments.forEach(adjustment => {
        // //     G.level.renderables.push(new PointRenderable(adjustment.x, adjustment.y, PLAYER_HORIZONTAL_RADIUS, 'rgba(255,0,0,0.1)'));
        // // })
        //
        // // console.log(allAdjustments);
        //
        // const adjustment = this.goToClosestAdjustment(this.previous, allAdjustments);
        // console.log(adjustment);

        // TODO land or tap based on adjustment

    }

    render() {
        wrap(() => {
            translate(this.x, this.y);

            R.fillStyle = '#f00';
            fr(
                -PLAYER_HORIZONTAL_RADIUS,
                -PLAYER_VERTICAL_RADIUS,
                PLAYER_HORIZONTAL_RADIUS * 2,
                PLAYER_VERTICAL_RADIUS * 2
            );
        });

        const allAdjustments = this.allSnapAdjustments();
        allAdjustments.forEach((adjustment) => {
            R.strokeStyle = 'blue';
            strokeRect(adjustment.x - PLAYER_HORIZONTAL_RADIUS, adjustment.y - PLAYER_HORIZONTAL_RADIUS, PLAYER_HORIZONTAL_RADIUS * 2, PLAYER_HORIZONTAL_RADIUS * 2);
        });
    }
}
