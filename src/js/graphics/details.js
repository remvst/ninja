UNPADDED_WINDOW = createCanvas(
    CELL_SIZE * 0.8,
    CELL_SIZE * 1.2,
    (c, can) => {
        // Window
        const g = c.createLinearGradient(0, 0, can.width, can.height);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.3)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        g.addColorStop(0.75, 'rgba(255,255,255,0.3)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fs(g);
        c.fr(0, 0, can.width, can.height);

        // Frame
        c.fs('#888');
        c.fr(0, 0, can.width, 2);
        c.fr(0, can.height, can.width, -2);
        c.fr(0, 0, 2, can.height);
        c.fr(can.width, 0, -2, can.height);
        c.fr(0, can.height * 0.7, can.width, 4);
    }
);

WINDOW = padCanvas(2, 1, 0.5, UNPADDED_WINDOW);

UNPADDED_DESK = createCanvas(CELL_SIZE * 1.1, CELL_SIZE * 0.5, (c, can) => {
    // Legs
    c.fs('#000');
    c.fr(2, 0, 2, can.height);
    c.fr(can.width - 2, 0, -2, can.height);

    // Top
    c.fs('#494742');
    c.fr(0, 0, 99, 4);

    // Drawers
    c.fs('#ccc');
    c.fr(4, 4, can.width / 4, can.height / 3);
    c.fr(can.width - 4, 4, -can.width / 4, can.height / 3);
});

COMPUTER = createCanvas(CELL_SIZE * 0.6, CELL_SIZE * 0.6, (c, can) => {
    c.fs('#000');
    c.fr(0, 0, 99, 99);

    c.fs('#a9a9a9');
    c.fr(2, 2, can.width - 4, can.height - 4);

    c.fs('#4253ff');
    c.fr(4, 4, can.width - 8, can.height - 12);

    c.fs('#000');
    c.fr(4, can.height - 6, can.width - 8, 2);

    c.fs('#a5dc40');
    c.fr(can.width - 6, can.height - 6, 2, 2);
});

FRAME = padCanvas(1, 1, 0.5, createCanvas(CELL_SIZE * 0.6, CELL_SIZE * 0.8, (c, can) => {
    c.fs('#925e2a');
    c.fr(0, 0, 99, 99);

    c.fs('#fcf3d7');
    c.fr(4, 4, can.width - 8, can.height - 8);

    c.fs('#ccc');
    c.fr(can.width / 2 - 5, can.height / 2 - 5, 10, 10);
}));

DESK = padCanvas(1, 2, 1, UNPADDED_DESK);

TRASH = padCanvas(1, 1, 1, createCanvas(CELL_SIZE * 0.3, CELL_SIZE * 0.4, (c, can) => {
    c.fs('#4c80be');
    c.fr(0, 0, 99, 99);

    c.fs('#78a1d6');
    c.fr(0, 0, 99, 4);
}));

OUTLET = padCanvas(1, 1, 0.75, createCanvas(CELL_SIZE * 0.2, CELL_SIZE * 0.2, (c, can) => {
    c.fs('#fff');
    c.fr(0, 0, 99, 99);
}));

LIGHT = padCanvas(3, 10, 0, createCanvas(CELL_SIZE * 5, CELL_SIZE * 3, (c, can) => {
    const g = c.createRadialGradient(can.width / 2, 0, 0, can.width / 2, 0, can.height);
    g.addColorStop(0, 'rgba(255,255,255,0.2)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fs(g);

    c.beginPath();
    c.moveTo(can.width / 2, 0);
    c.arc(can.width / 2, 0, can.height, PI / 6, PI * 5 / 6, false);
    c.fill();
}));
