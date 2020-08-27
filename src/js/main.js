onload = () => {
    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;

    if (navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo/i))) {
        CANVAS.height += MOBILE_CONTROLS_HEIGHT;
    }

    onresize(); // trigger initial sizing pass

    R = CANVAS.getContext('2d');

    // Shortcut for all canvas methods to the main canvas
    Object.getOwnPropertyNames(canvasProto).forEach(n => {
        if (R[n].call) {
            w[n] = canvasProto[n].bind(R);
        }
    });

    new Game();

    const loop = (func, nextFrameFunc) => {
        let lastFrame = performance.now();
        const iteration = () => {
            let n = performance.now(),
                e = min((n - lastFrame) / 1000, 1000 / 10);

            lastFrame = n;
            func(e, ~~(1 / e));

            nextFrameFunc(iteration);
        };

        iteration();
    };

    // Run the game at 200 FPS
    let didCycle = false;
    loop(
        (e, fps) => {
            G.cycle(e);
            didCycle = true;

            if (DEBUG) {
                G.cycleFps = fps;
            }
        },
        func => setTimeout(func, 1000 / 200)
    );

    // Render at 60 FPS
    loop(
        (e, fps) => {
            // Don't render if nothing was updated
            if (!didCycle) {
                return;
            }

            wrap(() => G.render());

            if (DEBUG) {
                G.renderFps = fps;
            }
        },
        func => requestAnimationFrame(func)
    );

};
