createCanvasPattern = (patternWidth, patternHeight, instructions) => {
    const x = createCanvas(patternWidth, patternHeight, instructions);
    const pattern = x.getContext('2d').createPattern(x, 'repeat');

    // Add some extra properties (background rendering needs to know the size of patterns)
    pattern.width = patternWidth;
    pattern.height = patternHeight;

    return pattern;
};
