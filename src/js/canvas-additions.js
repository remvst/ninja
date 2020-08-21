const canvasProto = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
canvasProto.wrap = function(f) {
    this.save();
    f();
    this.restore();
};
canvasProto.fr = canvasProto.fillRect;
canvasProto.fs = function(x) { this.fillStyle = x; };
