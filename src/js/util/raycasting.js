castRay = (x, y, angle, maxDistance) => {
    const castHorizontal = castAgainstHorizontal(x, y, angle, maxDistance);
    const castVertical = castAgainstVertical(x, y, angle, maxDistance);

    let cast;
    if (!castHorizontal) {
        cast = castVertical;
    } else if(!castVertical) {
        cast = castHorizontal;
    } else {
        const dHorizontal = distP(x, y, castHorizontal.x, castHorizontal.y);
        const dVertical = distP(x, y, castVertical.x, castVertical.y);
        cast = dHorizontal < dVertical ? castHorizontal : castVertical;
    }

    if (distP(x, y, cast.x, cast.y) > maxDistance) {
        cast = {'x': x + cos(angle) * maxDistance, 'y': y + sin(angle) * maxDistance};
    }

    return cast;
}

castAgainstHorizontal = (startX, startY, angle, maxDistance) => {
    var pointingDown = sin(angle) > 0;

    var y = ~~(startY / CELL_SIZE) * CELL_SIZE + (pointingDown ? CELL_SIZE : -0.0001);
    var x = startX + (y - startY) / tan(angle);

    var yStep = pointingDown ? CELL_SIZE : -CELL_SIZE;
    var xStep = yStep / tan(angle);

    return doCast(x, y, xStep, yStep, 1, maxDistance);
}

castAgainstVertical = (startX, startY, angle, maxDistance) => {
    var pointingRight = cos(angle) > 0;

    var x = ~~(startX / CELL_SIZE) * CELL_SIZE + (pointingRight ? CELL_SIZE : -0.0001);
    var y = startY + (x - startX) * tan(angle);

    var xStep = pointingRight ? CELL_SIZE : -CELL_SIZE;
    var yStep = xStep * tan(angle);

    return doCast(x, y, xStep, yStep, 0, maxDistance);
}

doCast = (startX, startY, xStep, yStep, castType, maxDistance) => {
    let x = startX,
        y = startY;

    for (let i = 0 ; distP(x, y, startX, startY) < maxDistance ; i++) {
        if (DEBUG) {
            G.castIterations++;
        }
        if (internalHasBlock(x, y)) {
            // Got a block!
            const blockId = ~~(x / CELL_SIZE) + ~~(y / CELL_SIZE) * G.level.definition.matrix.length;
            return {
                'x': x,
                'y': y,
                'castType': castType + '-' + blockId,
                'blockId': blockId
            };
        } else if(isOut(x, y)) {
            // Out of bounds
            break;
        } else {
            x += xStep;
            y += yStep;
        }
    }

    return {
        'x': x,
        'y': y,
        'castType': ''
    };
}

hasBlock = (x, y, radius = 0) => {
    return internalHasBlock(x, y) ||
        internalHasBlock(x - radius, y - radius) ||
        internalHasBlock(x - radius, y + radius) ||
        internalHasBlock(x + radius, y - radius) ||
        internalHasBlock(x + radius, y + radius);
}

internalHasBlock = (x, y) => {
    return !isOut(x, y) && G.level.definition.matrix[~~(y / CELL_SIZE)][~~(x / CELL_SIZE)];
}

isOut = (x, y) => {
    return !between(0, x, G.level.definition.matrix[0].length * CELL_SIZE - 1) ||
        !between(0, y, G.level.definition.matrix.length * CELL_SIZE - 1);
}

toCellUnit = x => ~~(x / CELL_SIZE);
toMiddleCellCoord = rowOrCol => (rowOrCol + 0.5) * CELL_SIZE;
