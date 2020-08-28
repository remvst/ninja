linear = t => t;
easeOutQuad = t => t * (2 - t);
easeOutQuint = t => 1 + (--t) * t * t * t * t;
easeInQuint = t => t * t * t * t * t;
easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

interp = (
    obj,
    property,
    fromValue,
    toValue,
    duration,
    delay,
    easing,
    endCallback
) => {
    let progress = 0;

    const interpolation = {
        'cycle': e => {
            progress += e;

            const progressAsRatio = limit(0, (progress - (delay || 0)) / duration, 1);
            obj[property] = (easing || linear)(progressAsRatio) * (toValue - fromValue) + fromValue;

            if (progressAsRatio >= 1) {
                remove(INTERPOLATIONS, interpolation);
                endCallback && endCallback();
            }
        }
    };
    INTERPOLATIONS.push(interpolation);
};

INTERPOLATIONS = [];
