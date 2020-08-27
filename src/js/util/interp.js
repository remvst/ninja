linear = t => t;
easeOutQuad = t => t * (2 - t);
easeOutQuint = t => 1 + (--t) * t * t * t * t;
easeInQuint = t => t * t * t * t * t;
easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

interp = (object, property, fromValue, toValue, duration, delay, easing, endCallback) => {
    const interpolation = {
        object: object, // object
        property: property, // property
        fromValue: fromValue, // from
        toValue: toValue, // to
        duration: duration, // duration
        delay: delay || 0, // delay
        easing: easing || linear, // easing function
        endCallback: endCallback || (() => 0), // end callback
        progress: 0,
        cycle: e => {
            if (interpolation.delay > 0) {
                interpolation.delay -= e;
                interpolation.object[interpolation.property] = interpolation.fromValue;
            } else {
                interpolation.progress = min(interpolation.duration, interpolation.progress + e);

                interpolation.object[interpolation.property] = interpolation.easing(interpolation.progress / interpolation.duration) * (interpolation.toValue - interpolation.fromValue) + interpolation.fromValue;
                if (interpolation.progress == interpolation.duration) {
                    interpolation.endCallback();

                    remove(INTERPOLATIONS, interpolation);
                }
            }
        }
    };
    INTERPOLATIONS.push(interpolation);
};

INTERPOLATIONS = [];
