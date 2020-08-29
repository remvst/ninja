const canvasProto = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
canvasProto.wrap = function(f) {
    this.save();
    f();
    this.restore();
};
canvasProto.fr = canvasProto.fillRect;
canvasProto.fs = function(x) {
    this.fillStyle = x;
};

canvasProto.roundedRectangle = function(x, y, w, h, rounded) {
    const radiansInCircle = 2 * PI;
    const halfRadians = PI;
    const quarterRadians = PI / 2;

    this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)
    this.arc(rounded + x, h - rounded + y, rounded, halfRadians, quarterRadians, true)
    this.arc(x + w - rounded, y + h - rounded, rounded, quarterRadians, 0, true)
    this.arc(x + w - rounded, y + rounded, rounded, 0, -quarterRadians, true)
}

canvasProto.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, PI * 2, true);
    this.fill();
};

canvasProto.outlinedText = function(s, x, y) {
    this.fillText(s, x, y);
    this.strokeText(s, x, y);
};

canvasProto.shadowedText = function(s, x, y) {
    this.wrap(() => {
        this.fs('#000');
        fillText(s, x, y + 5);
    })
    this.fillText(s, x, y);
};
