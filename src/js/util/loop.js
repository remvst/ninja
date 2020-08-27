loop = (func, nextFrameFunc) => {
    let lastFrame = performance.now();
    const iteration = () => {
        const n = performance.now();
        const e = min((n - lastFrame) / 1000, 1000 / 10);

        lastFrame = n;
        func(e, ~~(1 / e));

        nextFrameFunc(iteration);
    };

    iteration();
};
