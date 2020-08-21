const createCanvasPattern = (w, h, instructions) => {
    const x = createCanvas(w, h, instructions);
    return x.getContext('2d').createPattern(x, 'repeat');
};
