w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;

    if (e.keyCode == KEYBOARD_K) {
        G.changeDifficulty();
        beepSound();
    }

    if (e.keyCode == KEYBOARD_T && G.queuedTweet) {
        tweet(G.queuedTweet);
    }
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
onblur = oncontextmenu = () => w.down = {};

if (DEBUG) {
    mousePosition = {'x': 0, 'y': 0};
    onmousemove = e => {
        const canvasCoords = CANVAS.getBoundingClientRect();

        const x = CANVAS_WIDTH * (e.pageX - canvasCoords.left) / canvasCoords.width;
        const y = CANVAS.height * (e.pageY - canvasCoords.top) / canvasCoords.height;

        mousePosition.x = x;
        mousePosition.y = y;
    };
}
