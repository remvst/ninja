onload = () => {
    onresize(); // trigger initial sizing pass

    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;

    R = CANVAS.getContext('2d');
    // R.imageSmoothingEnabled = false;

    // Shortcut for all canvas methods to the main canvas
    Object.getOwnPropertyNames(canvasProto).forEach(n => {
        if (R[n].call) {
            w[n] = canvasProto[n].bind(R);
        }
    });

    console.log('LOADED');

    new Game();
    G.render();
    return;

    // Start cycle()
    let lastFrame = Date.now();
    let frame = () => {
        let n = Date.now(),
            e = (n - lastFrame) / 1000;

        if(DEBUG){
            G.fps = ~~(1 / e);
        }

        lastFrame = n;

        G.cycle(e);

        requestAnimationFrame(frame);
    };
    frame();
};
