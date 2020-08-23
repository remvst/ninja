let R, // canvas context
    G, // Game instance
    w = window,
    CANVAS = nomangle(g),

    LEVEL_WIDTH = evaluate(LEVEL_COLS * CELL_SIZE),
    LEVEL_HEIGHT = evaluate(LEVEL_ROWS * CELL_SIZE),
    TOWER_BASE_HEIGHT = ((CANVAS_HEIGHT - LEVEL_HEIGHT) / 2),
    LEVEL_X = ((CANVAS_WIDTH - LEVEL_COLS * CELL_SIZE) / 2);
