ontouchstart = ontouchmove = ontouchend = ontouchcancel = e => {
    down = {};

    const canvasCoords = CANVAS.getBoundingClientRect();
    for (let i = 0 ; i < e.touches.length ; i++) {
        const x = CANVAS_WIDTH * (e.touches[i].pageX - canvasCoords.left) / canvasCoords.width;
        const buttonIndex = ~~(x / (CANVAS_WIDTH / 4));
        w.down[KEYBOARD_LEFT] = buttonIndex == 0;
        w.down[KEYBOARD_RIGHT] = buttonIndex == 1;
        w.down[KEYBOARD_SPACE] = buttonIndex == 3;
    }
};
