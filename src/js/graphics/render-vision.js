renderVision = (x, y, fromAngle, toAngle, maxDistance, color) => wrap(() => {
    R.fillStyle = R.strokeStyle = color;
    R.lineWidth = 2;

    beginPath();
    moveTo(x, y);

    const angleInterval = PI / 100;
    const subAngles = ceil(normalize(toAngle - fromAngle) / angleInterval);

    for (let i = 0 ; i <= subAngles ; i++) {
        let angle = (i / subAngles) * (toAngle - fromAngle) + fromAngle;

        // For all angles in between, round them so that it looks a bit better when the vision is
        // interpolated.
        if (i && i < subAngles) {
            angle = roundToNearest(angle, angleInterval);
        }

        const impact = castRay(x, y, angle, maxDistance);
        lineTo(impact.x, impact.y);
    }

    closePath();

    R.globalAlpha = 0.3;
    fill();

    R.globalAlpha = 0.8;
    stroke();
});
