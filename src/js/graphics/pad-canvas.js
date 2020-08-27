padCanvas = (rows, cols, anchorY, image) => createCanvas(CELL_SIZE * cols, CELL_SIZE * rows, (c, can) => {
    let y;

    y = (can.height - image.height) * anchorY;

    c.drawImage(
        image,
        (can.width - image.width) / 2,
        y
    );
});
