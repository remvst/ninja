onload = () => {
    onresize(); // trigger initial sizing pass

    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;

    R = CANVAS.getContext('2d');

    // Shortcut for all canvas methods to the main canvas
    Object.getOwnPropertyNames(canvasProto).forEach(n => {
        if (R[n].call) {
            w[n] = canvasProto[n].bind(R);
        }
    });

    new Game();

    // Start cycle()
    let lastFrame = Date.now();
    let frame = () => {
        let n = Date.now(),
            e = min((n - lastFrame) / 1000, 1000 / 10);

        if(DEBUG){
            G.fps = ~~(1 / e);
        }

        lastFrame = n;

        G.cycle(e);

        requestAnimationFrame(frame);
        // setTimeout(frame, 1000 / 25);
    };
    frame();
};
