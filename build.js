'use strict';

const compiler = require('./js13k-compiler/src/compiler');

const JS_FILES = require('./config/js');
const CONSTANTS = require('./config/constants');
const MANGLE_SETTINGS = require('./config/mangle');

const optimizeMatrix = require('./macros/optimize-matrix');
const rawFile = require('./macros/raw-file');

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

compiler.run((tasks) => {
    function buildJS({
        mangle,
        uglify
    }) {
        // Manually injecting the DEBUG constant
        const constants = copy(CONSTANTS);
        constants.DEBUG = !uglify;

        // Inject some computed constants
        constants.LEVEL_WIDTH = constants.LEVEL_COLS * constants.CELL_SIZE;
        constants.LEVEL_HEIGHT = constants.LEVEL_ROWS * constants.CELL_SIZE;
        constants.TOWER_BASE_HEIGHT = (constants.CANVAS_HEIGHT - constants.LEVEL_HEIGHT) / 2,
        constants.LEVEL_X = constants.CANVAS_WIDTH / 2 - constants.LEVEL_COLS * constants.CELL_SIZE / 2;

        const sequence = [
            tasks.label('Building JS'),
            tasks.loadFiles(JS_FILES),
            tasks.concat(),
            tasks.macro('optimizeMatrix', optimizeMatrix),
            tasks.constants(constants),
            tasks.macro('evaluate'),
            tasks.macro('nomangle'),
            tasks.macro('rawFile', rawFile),
        ];

        if (mangle) {
            sequence.push(tasks.mangle(MANGLE_SETTINGS));
        }

        if (uglify) {
            sequence.push(tasks.uglifyES());
        }

        return tasks.sequence(sequence);
    }

    function buildCSS(uglify) {
        const sequence = [
            tasks.label('Building CSS'),
            tasks.loadFiles([__dirname + "/src/style.css"]),
            tasks.concat()
        ];

        if (uglify) {
            sequence.push(tasks.uglifyCSS());
        }

        return tasks.sequence(sequence);
    }

    function buildHTML(uglify) {
        const sequence = [
            tasks.label('Building HTML'),
            tasks.loadFiles([__dirname + "/src/index.html"]),
            tasks.concat()
        ];

        if (uglify) {
            sequence.push(tasks.uglifyHTML());
        }

        return tasks.sequence(sequence);
    }

    function buildMain() {
        return tasks.sequence([
            tasks.block('Building main files'),
            tasks.parallel({
                'js': buildJS({
                    'mangle': true,
                    'uglify': true
                }),
                'css': buildCSS(true),
                'html': buildHTML(true)
            }),
            tasks.combine(),
            tasks.output(__dirname + '/build/index.html'),
            tasks.label('Building ZIP'),
            tasks.zip('index.html'),
            tasks.output(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),
            tasks.advzip(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),
        ]);
    }

    function buildDebug({
        mangle,
        suffix
    }) {
        return tasks.sequence([
            tasks.block('Building debug files'),
            tasks.parallel({
                // Debug JS in a separate file
                'debug_js': tasks.sequence([
                    buildJS({
                        'mangle': mangle,
                        'uglify': false
                    }),
                    tasks.output(__dirname + '/build/debug' + suffix + '.js')
                ]),

                // Injecting the debug file
                'js': tasks.inject(['debug' + suffix + '.js']),

                'css': buildCSS(false),
                'html': buildHTML(false)
            }),
            tasks.combine(),
            tasks.output(__dirname + '/build/debug' + suffix + '.html')
        ]);
    }

    function main() {
        return tasks.sequence([
            buildMain(),
            buildDebug({
                'mangle': false,
                'suffix': ''
            }),
            buildDebug({
                'mangle': true,
                'suffix': '_mangled'
            })
        ]);
    }

    return main();
});
