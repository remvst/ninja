linear = (t, b, c, d) => {
    return (t / d) * c + b;
};

easeOutBounce = (t, b, c, d) => {
    if ((t /= d) < (1/2.75)) {
        return c * (7.5625 * t * t) + b;
    }
    if (t < (2/2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    }
    if (t < (2.5/2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    }
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
};

easeInCubic = (t, b, c, d) => {
    return c*(t/=d)*t*t + b;
};

interp = (o, p, a, b, d, l, f, e) => {
    var i = {
        o: o, // object
        p: p, // property
        a: a, // from
        b: b, // to
        d: d, // duration
        l: l || 0, // delay
        f: f || linear, // easing function
        e: e || (() => 0), // end callback
        t: 0,
        cycle: e => {
            if (i.l > 0) {
                i.l -= e;
                i.o[i.p] = i.a;
            } else {
                i.t = min(i.d, i.t + e);
                i.o[i.p] = i.f(i.t, i.a, i.b - i.a, i.d);
                if (i.t == i.d) {
                    i.e();

                    const index = INTERPOLATIONS.indexOf(i);
                    if (index >= 0) INTERPOLATIONS.splice(index, 1);
                }
            }
        }
    };
    INTERPOLATIONS.push(i);
};

INTERPOLATIONS = [];
