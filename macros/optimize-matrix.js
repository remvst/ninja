'use strict';

const {LEVEL_COLS, LEVEL_ROWS} = require('../config/constants.json');

module.exports = {
    'apply': (input) => {
        const matrix = JSON.parse(input);
        const lines = [];

        const rows = matrix.length;
        const cols = matrix[0].length;

        for (let row = 0 ; row < rows ; row++) {
            for (let col = 0 ; col < cols ; col++) {
                if (!matrix[row][col]) {
                    continue;
                }

                let verticalLength = 0;
                while (matrix[row + verticalLength] && matrix[row + verticalLength][col]) {
                    verticalLength++;
                }

                let horizontalLength = 0;
                while (matrix[row][col + horizontalLength]) {
                    horizontalLength++;
                }

                if (verticalLength >= horizontalLength) {
                    for (let i = 0 ; i < verticalLength ; i++) {
                        matrix[row + i][col] = 0;
                    }
                    lines.push([row, col, verticalLength, 0]);
                } else {
                    for (let i = 0 ; i < horizontalLength ; i++) {
                        matrix[row][col + i] = 0;
                    }
                    lines.push([row, col, 0, horizontalLength]);
                }
            }
        }

        return `${rows}, ${cols}, ${JSON.stringify(lines)}`;
    },
    'revert': function(rows, cols, lines) {
        const result = [];
        for (let i = 0 ; i < rows ; i++) {
            const row = [];
            row.length = cols;
            result.push(row);
        }

        lines.forEach((line) => {
            let [
                row,
                col,
                verticalLength,
                horizontalLength
            ] = line;

            let verticalIncr = !!verticalLength;
            let horizontalIncr = !!horizontalLength;

            for (let i = 0 ; i < max(verticalLength, horizontalLength) ; i++) {
                result[row + i * verticalIncr][col + i * horizontalIncr] = 1;
            }
        });

        return result;
    }
};
