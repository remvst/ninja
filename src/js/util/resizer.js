onresize = () => {
    var mw = innerWidth,
        mh = innerHeight,

        ar = mw / mh, // available ratio
        br = CANVAS_WIDTH / CANVAS.height, // base ratio
        w,
        h,
        s = nomangle(t).style;

    if (ar <= br) {
        w = mw;
        h = w / br;
    } else {
        h = mh;
        w = h * br;
    }

    s.width = w + 'px';
    s.height = h + 'px';
};
