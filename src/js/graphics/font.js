FONT = createCanvas(1, 1, (c) => {
    // Pick a string that will most likely have a bunch of characters
    const testText = location;

    // Measure the width for a font that we know does not exist
    c.font = '99pt d';
    const reference = c.measureText(testText).width;

    // Then measure the same width for fonts that we may support
    return [
        nomangle('Impact'),
        nomangle('Arial Black')
    ].filter(fontName => {
        c.font = '99pt ' + fontName;
        return c.measureText(testText).width != reference;
    })[0] || nomangle('serif');
});

font = size => size + 'pt ' + FONT;
italicFont = size => nomangle(`italic `) + font(size);
