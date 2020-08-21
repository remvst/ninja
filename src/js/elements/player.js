class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.previous = {};

        this.vX = this.vY = 0;
        this.jumpHoldTime = 0;
        this.holdingJump = false;
    }

    get landed() {
        const leftX = this.x - PLAYER_RADIUS;
        const rightX = this.x + PLAYER_RADIUS;
        const bottomY = this.y + PLAYER_RADIUS + 1;

        return hasBlock(leftX, bottomY) || hasBlock(rightX, bottomY);
    }

    cycle(e) {
        // Save the previous state
        this.previous.x = this.x;
        this.previous.y = this.y;
        this.previous.landed = this.landed;

        // Fall down
        this.vY += GRAVITY_ACCELERATION * e;

        this.y += this.vY * e;

        const holdingJump = down[KEYBOARD_SPACE] && (this.jumpHoldTime || this.landed);
        if (holdingJump) {
            this.jumpHoldTime += e;
            this.jump();
        } else {
            this.jumpHoldTime = 0;
            this.jumpVY = MIN_JUMP_VY;
        }

        // Left/right
        let dX = 0, targetVX = 0;
        if (down[KEYBOARD_LEFT]) {
            dX = -1;
            targetVX = -PLAYER_HORIZONTAL_SPEED;
        }
        if (down[KEYBOARD_RIGHT]) {
            dX = 1;
            targetVX = PLAYER_HORIZONTAL_SPEED;
        }

        const distanceToTargetVX = targetVX - this.vX;
        const HORIZONTAL_ACCELERATION = this.landed ? 3000 : 800;
        const appliedDistanceToTargetVX = limit(
            -HORIZONTAL_ACCELERATION * e,
            distanceToTargetVX,
            HORIZONTAL_ACCELERATION * e
        );
        this.vX += appliedDistanceToTargetVX;

        // TODO use friction
        this.x += this.vX * e;

        this.readjust();
    }

    jump() {
        const jumpHoldTime = min(this.jumpHoldTime, MAX_JUMP_HOLD_TIME);
        const jumpRatio = jumpHoldTime / MAX_JUMP_HOLD_TIME;
        const jumpVY = jumpRatio * (MAX_JUMP_VY - MIN_JUMP_VY) + MIN_JUMP_VY;

        this.vY = -jumpVY;

        if (jumpRatio == 1) {
            this.jumpHoldTime = 0;
        }
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
        }

        return closestAdjustment;
    }

    toCellUnit(x) {
        return ~~(x / CELL_SIZE);
    }

    allSnapAdjustments() {
        const leftX = this.x - PLAYER_RADIUS;
        const rightX = this.x + PLAYER_RADIUS;
        const topY = this.y - PLAYER_RADIUS;
        const bottomY = this.y + PLAYER_RADIUS;

        const leftCol = this.toCellUnit(leftX);
        const rightCol = this.toCellUnit(rightX);
        const topRow = this.toCellUnit(topY);
        const bottomRow = this.toCellUnit(bottomY);

        const topLeft = hasBlock(leftX, topY);
        const topRight = hasBlock(rightX, topY);
        const bottomLeft = hasBlock(leftX, bottomY);
        const bottomRight = hasBlock(rightX, bottomY);

        const snapX = [this.previous.x, this.x];
        const snapY = [this.previous.y, this.y];
        for (let col = leftCol ; col <= rightCol ; col++) {
            snapX.push(
                col * CELL_SIZE + PLAYER_RADIUS,
                (col + 1) * CELL_SIZE - PLAYER_RADIUS - 0.0001
            );
        }
        for (let row = topRow ; row <= bottomRow ; row++) {
            snapY.push(
                row * CELL_SIZE + PLAYER_RADIUS,
                (row + 1) * CELL_SIZE - PLAYER_RADIUS - 0.0001
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
                PLAYER_RADIUS
            );
        });
    }

    readjust() {
        const { x, y } = this;

        const allAdjustments = this.allSnapAdjustments();
        const adjustment = this.goToClosestAdjustment(this, allAdjustments);

        if (this.landed) {
            // Landed, reset the vertical velocity
            this.vY = min(0, this.vY);

            if (!this.previous.landed) {
                console.log('LAND!')
            }
        } else if (this.y > y) {
            console.log('OUCH!');

            // Tapped its head, cancel all jump
            this.vY = max(0, this.vY);
        }

        if (this.x != x) {
            // Player hit an obstacle, reset horizontal momentum
            this.vX = 0;
        }

    }

    render() {
        wrap(() => {
            translate(this.x, this.y);

            R.fillStyle = '#f00';
            fr(
                -PLAYER_RADIUS,
                -PLAYER_RADIUS,
                PLAYER_RADIUS * 2,
                PLAYER_RADIUS * 2
            );
        });

        // const allAdjustments = this.allSnapAdjustments();
        // allAdjustments.forEach((adjustment) => {
        //     R.strokeStyle = 'blue';
        //     strokeRect(adjustment.x - PLAYER_RADIUS, adjustment.y - PLAYER_RADIUS, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);
        // });
    }
}
