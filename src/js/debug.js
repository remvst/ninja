if (DEBUG) {
    getDebugValue = (key, defaultValue) => {
        if (!(key in sessionStorage)) {
            return defaultValue;
        }
        return JSON.parse(sessionStorage[key]);
    }

    setDebugValue = (key, x) => {
        sessionStorage[key] = JSON.stringify(x);
    }

    // In game level editor
    addEventListener('click', event => {
        const canvasCoords = CANVAS.getBoundingClientRect();
        const x = CANVAS.width * (event.pageX - canvasCoords.left) / canvasCoords.width;
        const y = CANVAS.height * (event.pageY - canvasCoords.top) / canvasCoords.height;

        if (getDebugValue('editor')) {
            const row = toCellUnit(y - TOWER_BASE_HEIGHT);
            const col = toCellUnit(x - LEVEL_X);

            if (row >= 0 && row < LEVEL_ROWS && col >= 0 && col < LEVEL_COLS) {
                G.level.definition.matrix[row][col] = !G.level.definition.matrix[row][col];
                G.level.background = null;
            }
        }
    }, false);

    addEventListener('keydown', e => {
        if (getDebugValue('editor') && e.keyCode == KEYBOARD_S) {
            prompt(
                'Level matrix',
                JSON.stringify(G.level.definition.matrix.map(row => row.map(x => !!x + 0)))
            );
        }

        if (e.keyCode == KEYBOARD_T) {
            setDebugValue('grid', !getDebugValue('grid', 0));
        }

        if (e.keyCode == KEYBOARD_N) {
            G.nextLevel();
        }
    }, false);

    const lastLogTime = performance.now();
    perfLogs = [];
    resetPerfLogs = () => perfLogs = [];
    logPerf = label => {
        if (!getDebugValue('perf')) {
            return;
        }

        const now = performance.now();
        perfLogs.push([label, now - lastTime]);
        lastTime = now;
    };
}
