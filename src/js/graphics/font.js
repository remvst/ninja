FONT = createCanvas(1, 1, (c) => {
    const testText = document.title;

    // Measure the width for a font that we know does not exist
    c.font = '100pt d';
    const reference = c.measureText(testText).width;

    // Then measure the same width for fonts that we may support
    return [
        nomangle('Impact'),
        nomangle('Arial Black'),
        nomangle('Arial')
    ].filter(fontName => {
        c.font = '100pt ' + fontName;
        return c.measureText(testText).width != reference;
    })[0] || nomangle('serif');
});

console.log(FONT);
