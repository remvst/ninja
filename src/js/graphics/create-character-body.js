const legLength = 6;
const visualRadius = PLAYER_RADIUS + 2;
const bodyWidth = visualRadius * 2 - 8;
const bodyHeight = visualRadius * 2 - 4;

createCharacterBody = instructions => createCanvas(bodyWidth, bodyHeight + legLength, (c, can) => {
    c.fillStyle = '#000';

    c.beginPath();
    c.roundedRectangle(
        0,
        0,
        can.width,
        bodyHeight,
        6
    );
    c.fill();

    c.globalCompositeOperation = nomangle('source-atop');

    instructions(c, can);
});

PLAYER_BODY = createCharacterBody((c, can) => {
    // Skin
    c.fillStyle = '#daab79';
    c.fr(can.width, 6, -bodyWidth / 2, 4);

    // Belt
    c.fillStyle = '#222';
    c.fr(0, bodyHeight - 10, 99, 2);
});

GUARD_BODY = createCharacterBody((c, can) => {
    // Shirt
    c.fillStyle = '#a3b5ce';
    c.fr(0, 0, 99, 99);

    // Skin
    c.fillStyle = '#daab79';
    c.fr(0, 0, 99, 14);

    // Pants
    c.fillStyle = '#010640';
    c.fr(0, 25, 99, 99);

    // Tie
    c.fillStyle = '#f00';
    c.fr(bodyWidth - 6, 14, 2, 10);
});

renderPlayer = (
    context,
    body,
    legs,
    facing,
    walking,
    jumpRatio
) => {
    context.scale(facing, 1);

    wrap(() => {
        // Bobbing
        if (walking) {
            context.rotate(
                sin(G.clock * PI * 2 / 0.25) * PI / 32
            );
        }

        // Flip animation
        context.rotate(jumpRatio * PI * 2);

        context.translate(-body.width / 2, -body.height / 2);
        context.drawImage(body, 0, 0);

        renderEyes(context);
    });

    // Legs
    if (legs) {
        renderLegs(context, walking);
    }
};

renderEyes = (context) => {
    context.fillStyle = '#000';
    context.fr(bodyWidth - 1, 7, -2, 2);
    context.fr(bodyWidth - 5, 7, -2, 2);
};

renderLegs = (context, walking) => {
    R.fillStyle = '#000';

    const legLengthRatio = sin(G.clock * PI * 2 / 0.25) * 0.5 + 0.5;
    const leftRatio = walking ? legLengthRatio : 1
    const rightRatio = walking ? 1 - legLengthRatio : 1;
    context.fr(-8, visualRadius - legLength, 4, leftRatio * legLength);
    context.fr(8, visualRadius - legLength, -4, rightRatio * legLength);
}
