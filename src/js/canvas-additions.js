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

canvasProto.roundedRectangle = function(x, y, width, height, rounded) {
    const radiansInCircle = 2 * PI;
    const halfRadians = (2 * PI) / 2;
    const quarterRadians = (2 * PI) / 4;

    this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)
    this.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true)
    this.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true)
    this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true)
}
