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
        this.lastLanded = {'x':0, 'y': 0};
        this.lastWallStick = {'x':0, 'y': 0, 'direction': 0};

        this.stickingToWallX = 0;

        this.clock = 0;

        this.bandanaTrail = [];
    }

    get landed() {
        const leftX = this.x - PLAYER_RADIUS;
        const rightX = this.x + PLAYER_RADIUS - 1; // -1 so we can't jump off a wall
        const bottomY = this.y + PLAYER_RADIUS + 1;

        return hasBlock(leftX, bottomY) || hasBlock(rightX, bottomY);
    }

    get canJump() {
        // Don't jump until the player has release the jump key
        if (!this.jumpReleased) {
            return false;
        }

        // Avoid double jumping unless we're sticking to a wall
        if (this.isRising && !this.sticksToWall) {
            return false;
        }

        // If the user hasn't landed recently, don't let us jump
        if (dist(this, this.lastLanded) > COYOTE_RADIUS && abs(this.x - this.lastWallStick.x) > COYOTE_RADIUS_WALLJUMP) {
            return false;
        }

        return true;
    }

    get isRising() {
        return this.clock < this.jumpStartTime + this.jumpPeakTime;
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

        const holdingJump = INPUT.jump();
        this.jumpReleased = this.jumpReleased || !holdingJump;

        if (holdingJump) {
            this.jumpHoldTime += e;
        } else {
            this.jumpHoldTime = 0;
        }

        if (holdingJump && this.canJump) {
            this.jumpReleased = false;
            this.jumpStartY = this.y;
            this.jumpStartTime = this.clock;

            if (this.sticksToWall) {
                this.vX = this.lastWallStick.direction * 800;
            }

            // Fixes a walljump issue: vY would keep accumulating even though a new jump was
            // started, causing bad physics once the jump reaches its peak.
            this.vY = 0;

            jumpSound();
        }

        if (holdingJump && !this.jumpReleased) {
            const jumpHoldRatio = min(this.jumpHoldTime, MAX_JUMP_HOLD_TIME) / MAX_JUMP_HOLD_TIME;
            const steppedRatio = max(0.33, roundToNearest(jumpHoldRatio, 0.33));
            const height = CELL_SIZE / 2 + steppedRatio * CELL_SIZE * 3;

            this.jumpPeakTime = 0.1 + 0.2 * steppedRatio;
            this.jumpEndY = this.jumpStartY - height;
        }

        if (this.isRising) {
            // Rise up
            const jumpRatio = (this.clock - this.jumpStartTime) / this.jumpPeakTime;
            this.y = easeOutQuad(jumpRatio) * (this.jumpEndY - this.jumpStartY) + this.jumpStartY;
        } else {
            // Fall down
            const gravity = this.sticksToWall && this.vY > 0 ? WALL_GRAVITY_ACCELERATION : GRAVITY_ACCELERATION;
            this.vY = max(0, this.vY + gravity * e);
            if (this.sticksToWall) {
                this.vY = min(this.vY, WALL_FALL_DOWN_CAP);
            }

            this.y += this.vY * e;
        }

        // Left/right
        let dX = 0, targetVX = 0;
        if (INPUT.left()) {
            dX = -1;
            targetVX = -PLAYER_HORIZONTAL_SPEED;
        }
        if (INPUT.right()) {
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

        if (this.landed) {
            this.lastLanded.x = this.x;
            this.lastLanded.y = this.y;
        }

        // Bandana gravity
        this.bandanaTrail.forEach(position => position.y += e * 100);

        // Bandana
        const newTrail = this.bandanaTrail.length > 100 ? this.bandanaTrail.pop() : {};
        newTrail.x = this.x - this.facing * 5;
        newTrail.y = this.y - 10 + rnd(-3, 3) * sign(this.vX);
        this.bandanaTrail.unshift(newTrail);

        // Trail
        if (!this.landed && !this.sticksToWall && this.level.clock) {
            const { renderCharacterParams, x, y } = this;

            const renderable = {
                'render': () => {
                    R.globalAlpha = renderable.alpha;
                    translate(x, y);
                    renderCharacter.apply(null, renderCharacterParams);
                }
            };

            this.level.renderables.push(renderable);
            interp(renderable, 'alpha', 0.1, 0, 0.5, 0.2, null, () => {
                remove(this.level.renderables, renderable);
            });
        }

        if (this.sticksToWall) {
            for (let i = 0 ; i < 10 ; i++) {
                this.level.particle({
                    'size': [6],
                    'color': '#fff',
                    'duration': rnd(0.4, 0.8),
                    'x': [this.x - this.sticksToWall * PLAYER_RADIUS, rnd(-20, 20)],
                    'y': [this.y + rnd(-PLAYER_RADIUS, PLAYER_RADIUS), rnd(-20, 20)]
                });
            }
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

        const res = [];
        snapX.forEach((x) => snapY.forEach((y) => {
            if (!hasBlock(x, y, PLAYER_RADIUS)) {
                res.push({
                    'x': x,
                    'y': y
                });
            }
        }));
        return res;
    }

    dust(y) {
        for (let i = 0 ; i < 10 ; i++) {
            this.level.particle({
                'size': [8],
                'color': '#fff',
                'duration': rnd(0.4, 0.8),
                'x': [this.x + rnd(-PLAYER_RADIUS, PLAYER_RADIUS), rnd(-20, 20)],
                'y': [y, sign(this.y - y) * rnd(15, 10)]
            });
        }

        // This function is only called when landing or tapping, we can safely play the sound
        landSound();
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

        const hitWall = this.x != x;
        const adjustmentDirectionX = sign(this.x - x)

        // Player hit a wall in the face, reset horizontal momentum
        if (hitWall && adjustmentDirectionX != sign(this.vX)) {
            this.vX = 0;
        }

        // Player hit a wall and isn't on the floor, stick to the wall
        if (hitWall && !this.landed) {
            this.sticksToWall = adjustmentDirectionX;
        }

        // Player has landed or is moving horizontally without hitting a wall, stop sticking to a wall
        if (this.landed || this.x != this.previous.x && !hitWall) {
            this.sticksToWall = 0;
        }

        // No block on the left or right, cancel wall sticking
        const leftX = this.x - PLAYER_RADIUS - 1;
        const rightX = this.x + PLAYER_RADIUS + 1;
        if (!hasBlock(leftX, this.y) && !hasBlock(rightX, this.y)) {
            this.sticksToWall = false;
        }

        if (this.sticksToWall) {
            this.lastWallStick.x = this.x;
            this.lastWallStick.y = this.y;
            this.lastWallStick.direction = this.sticksToWall;
        }
    }

    get renderCharacterParams() {
        return [
            R,
            this.level.clock,
            PLAYER_BODY,
            this.landed,
            this.facing * this.facingScale,
            this.walking,
            limit(0, (this.clock - this.jumpStartTime) / this.jumpPeakTime, 1)
        ];
    }

    render() {
        renderBandana(R, this, this.bandanaTrail);

        // Then render the actual character
        wrap(() => {
            // R.globalAlpha = this.canJump ? 1 : 0.5;
            translate(this.x, this.y);
            renderCharacter.apply(null, this.renderCharacterParams);
        });
    }
}
