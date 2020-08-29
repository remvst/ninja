'use strict';

const {
    LEVEL_COLS,
    LEVEL_ROWS
} = require('../config/constants.json');

module.exports = {
    'apply': (input) => {
        const matrix = JSON.parse(input);
        const lines = [];

        const rows = matrix.length;
        const cols = matrix[0].length;

        if (rows !== LEVEL_ROWS || cols !== LEVEL_COLS) {
            throw new Error('Invalid rows or cols');
        }

        for (let row = 1; row < rows - 1; row++) {
            for (let col = 1; col < cols - 1; col++) {
                if (!matrix[row][col]) {
                    continue;
                }

                let verticalLength = 0;
                while (row + verticalLength < rows - 1 && matrix[row + verticalLength][col]) {
                    verticalLength++;
                }

                let horizontalLength = 0;
                while (col + horizontalLength < cols - 1 && matrix[row][col + horizontalLength]) {
                    horizontalLength++;
                }

                // If we're on the first column or the last one, it means we're on one of the bounds,
                // which we always assume are there so we don't need them.
                // if (col === 0 || col === cols - 1) {
                //     continue;
                // }

                if (verticalLength >= horizontalLength) {
                    for (let i = 0; i < verticalLength; i++) {
                        matrix[row + i][col] = 0;
                    }
                    lines.push([row, col, verticalLength, 0]);
                } else {
                    for (let i = 0; i < horizontalLength; i++) {
                        matrix[row][col + i] = 0;
                    }
                    lines.push([row, col, 0, horizontalLength]);
                }
            }
        }

        // console.log(
        //     'Optimized size:',
        //     Math.round(100 * JSON.stringify(lines).length / JSON.stringify(matrix).length) + '%'
        // );

        return JSON.stringify(lines);
    },
    'revert': function(lines) {
        const decoded = [];
        const topAndBottomRow = Array(LEVEL_COLS).fill(1);
        decoded.push(topAndBottomRow);
        for (let i = 0; i < LEVEL_ROWS - 2; i++) {
            const row = Array(LEVEL_COLS).fill(0);
            row[0] = 1;
            row[LEVEL_COLS - 1] = 1;
            decoded.push(row);
        }
        decoded.push(topAndBottomRow);

        lines.forEach(([
            row,
            col,
            verticalLength,
            horizontalLength
        ]) => {
            for (let i = 0; i < max(verticalLength, horizontalLength); i++) {
                decoded[row + i * !!verticalLength][col + i * !!horizontalLength] = 1;
            }
        });

        return decoded;
    }
};
