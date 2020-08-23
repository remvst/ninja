class Player {
    constructor(level, x, y) {
        this.level = level;
        this.x = x;
        this.y = y;
        this.previous = {};

        this.vX = this.vY = 0;
        this.facing = 1;
        this.walking = false;
        this.facingScale = 1;

        this.jumpHoldTime = 0;
        this.jumpReleased = true;
        this.jumpStartY = 0;
        this.jumpEndY = 0;
        this.jumpPeakTime = 0;

        this.clock = 0;

        this.bandanaTrail = [];
    }

    get landed() {
        const leftX = this.x - PLAYER_RADIUS;
        const rightX = this.x + PLAYER_RADIUS;
        const bottomY = this.y + PLAYER_RADIUS + 1;

        return hasBlock(leftX, bottomY) || hasBlock(rightX, bottomY);
    }

    get sticksToWall() {
        if (this.landed) {
            return 0;
        }

        const leftX = this.x - PLAYER_RADIUS - 1;
        const rightX = this.x + PLAYER_RADIUS + 1;

        if (hasBlock(leftX, this.y)) {
            return 1;
        }

        if (hasBlock(rightX, this.y)) {
            return -1;
        }

        return 0;
    }

    cycle(e) {
        let remaining = e;
        do {
            const sub = min(remaining, 1 / 60);
            remaining -= sub;
            this.subCycle(sub);
        } while (remaining > 0);
    }

    subCycle(e) {
        // Save the previous state
        this.previous.x = this.x;
        this.previous.y = this.y;
        this.previous.clock = this.clock;
        this.previous.facing = this.facing;
        this.previous.landed = this.landed;
        this.previous.jumpHoldTime = this.jumpHoldTime;

        this.clock += e;

        const holdingJump = down[KEYBOARD_SPACE];
        this.jumpReleased = this.jumpReleased || !holdingJump;

        if (holdingJump) {
            this.jumpHoldTime += e;
        } else {
            this.jumpHoldTime = 0;
        }

        const newJump = holdingJump && this.jumpReleased && (this.landed || this.sticksToWall);
        if (newJump) {
            this.jumpReleased = false;
            this.jumpStartY = this.y;
            this.jumpStartTime = this.clock;

            this.vX = this.sticksToWall * 800;

            // Fixes a walljump issue: vY would keep accumulating even though a new jump was
            // started, causing bad physics once the jump reaches its peak.
            this.vY = 0;
        }

        if (holdingJump && !this.jumpReleased) {
            const jumpHoldRatio = min(this.jumpHoldTime, MAX_JUMP_HOLD_TIME) / MAX_JUMP_HOLD_TIME;
            const height = CELL_SIZE / 2 + jumpHoldRatio * CELL_SIZE * 3;

            this.jumpPeakTime = 0.1 + 0.2 * jumpHoldRatio;
            this.jumpEndY = this.jumpStartY - height;
        }

        if (this.clock < this.jumpStartTime + this.jumpPeakTime) {
            // Rise up
            const jumpRatio = (this.clock - this.jumpStartTime) / this.jumpPeakTime;
            this.y = easeOutQuad(jumpRatio) * (this.jumpEndY - this.jumpStartY) + this.jumpStartY;
        } else {
            // Fall down
            const gravity = this.sticksToWall && this.vY > 0 ? 1000 : GRAVITY_ACCELERATION;
            this.vY = max(0, this.vY + gravity * e);
            this.y += this.vY * e;
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

        if (this.landed && dX) {
            this.facing = dX;
        }
        if (this.facing != this.previous.facing) {
            interp(this, 'facingScale', -1, 1, 0.1);
        }
        this.walking = dX;

        const horizontalAcceleration = this.landed ? PLAYER_HORIZONTAL_FLOOR_ACCELERATION : PLAYER_HORIZONTAL_FLIGHT_ACCELERATION;
        this.vX += limit(
            -horizontalAcceleration * e,
            targetVX - this.vX,
            horizontalAcceleration * e
        );
        this.x += this.vX * e;

        this.readjust();

        // Bandana
        this.bandanaTrail.unshift({'x': this.x - this.facing * 5, 'y': this.y - 10 + rnd(-1, 1)});
        while (this.bandanaTrail.length > 30) {
            this.bandanaTrail.pop();
        }
        this.bandanaTrail.forEach(position => position.y += e * 100);

        // Trail
        if (!this.landed && !this.sticksToWall && this.level.clock) {
            const {x,y} = this;
            const trail = createCanvas(CELL_SIZE * 2, CELL_SIZE * 2, (r) => {
                r.translate(CELL_SIZE, CELL_SIZE);
                this.renderCharacter(r);
            })
            const renderable = {
                'render': () => {
                    R.globalAlpha = renderable.alpha;
                    drawImage(trail, x - trail.width / 2, y - trail.height / 2);
                }
            }

            this.level.renderables.push(renderable);
            interp(renderable, 'alpha', 0.1, 0, 0.5, 0.2, null, () => {
                remove(this.level.renderables, renderable);
            });
        }

        if (this.sticksToWall) {
            for (let i = 0 ; i < 10 ; i++)
            this.level.particle({
                'size': [6],
                'color': '#888',
                'duration': rnd(0.4, 0.8),
                'x': [this.x - this.sticksToWall * PLAYER_RADIUS, rnd(-20, 20)],
                'y': [this.y + rnd(-PLAYER_RADIUS, PLAYER_RADIUS), rnd(-20, 20)]
            });
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

    allSnapAdjustments() {
        const leftX = this.x - PLAYER_RADIUS;
        const rightX = this.x + PLAYER_RADIUS;
        const topY = this.y - PLAYER_RADIUS;
        const bottomY = this.y + PLAYER_RADIUS;

        const leftCol = toCellUnit(leftX);
        const rightCol = toCellUnit(rightX);
        const topRow = toCellUnit(topY);
        const bottomRow = toCellUnit(bottomY);

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

    dust(y) {
        for (let i = 0 ; i < 10 ; i++) {
            this.level.particle({
                'size': [4],
                'color': '#888',
                'duration': rnd(0.4, 0.8),
                'x': [this.x + rnd(-PLAYER_RADIUS, PLAYER_RADIUS), rnd(-10, 10)],
                'y': [y, sign(this.y - y) * rnd(10, 5)]
            });
        }
    }

    spawn() {
        for (let i = 0 ; i < 100 ; i++) {
            this.level.particle({
                'size': [10, -10],
                'color': '#000',
                'duration': rnd(1, 2),
                'x': [this.x + rnd(-PLAYER_RADIUS, PLAYER_RADIUS) * 1.5, rnd(-20, 20)],
                'y': [this.y + rnd(-PLAYER_RADIUS, PLAYER_RADIUS) * 1.5, rnd(-20, 20)]
            });
        }
    }

    readjust() {
        // Desired position
        const { x, y } = this;

        const allAdjustments = this.allSnapAdjustments();
        const adjustment = this.goToClosestAdjustment(this, allAdjustments);

        if (this.landed) {
            // Landed, reset the jump
            this.vY = min(0, this.vY);

            if (!this.previous.landed) {
                this.dust(this.y + PLAYER_RADIUS);
                this.jumpStartTime = -1;
            }
        } else if (this.y > y) {
            this.dust(this.y - PLAYER_RADIUS);

            // Tapped its head, cancel all jump
            this.vY = max(0, this.vY);
            this.jumpStartTime = -1;
        }

        if (this.x != x && sign(this.x - x) != this.facing) {
            // Player hit an obstacle, reset horizontal momentum
            this.vX = 0;
        }

    }

    renderCharacter(context) {
        renderCharacter(
            context,
            this.level.clock,
            PLAYER_BODY,
            this.landed,
            this.facing * this.facingScale,
            this.walking,
            limit(0, (this.clock - this.jumpStartTime) / this.jumpPeakTime, 1)
        );
    }

    render() {
        // Render bandana
        R.lineWidth = 8;
        R.strokeStyle = '#000';
        R.lineJoin = 'round';
        beginPath();
        moveTo(this.bandanaTrail[0].x, this.bandanaTrail[0].y);

        let remainingLength = MAX_BANDANA_LENGTH;

        for (let i = 1 ; i < this.bandanaTrail.length && remainingLength > 0 ; i++) {
            const current = this.bandanaTrail[i];
            const previous = this.bandanaTrail[i - 1];

            const actualDistance = dist(current, previous);
            const renderedDist = min(actualDistance, remainingLength);
            remainingLength -= renderedDist;
            const ratio = renderedDist / actualDistance;

            // beginPath();
            lineTo(
                previous.x + ratio * (current.x - previous.x),
                previous.y + ratio * (current.y - previous.y)
            );
        }
        stroke();

        // Then render the actual character
        wrap(() => {
            translate(this.x, this.y);
            this.renderCharacter(R);
        });
    }
}
