'use strict';

const fs = require('fs');

module.exports = {
    'apply': (s) => {
        const path = s.substr(1, s.length - 2);

        const fileContent = fs.readFileSync(path).toString();

        return fileContent;
    }
};
