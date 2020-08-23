const createCanvasPattern = (patternWidth, patternHeight, instructions) => {
    const x = createCanvas(patternWidth, patternHeight, instructions);
    const pattern = x.getContext('2d').createPattern(x, 'repeat');
    pattern.height = patternHeight;
    return pattern;
};
