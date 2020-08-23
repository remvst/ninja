if (DEBUG) {
    getDebugValue = (key, defaultValue) => {
        if (!(key in localStorage)) {
            return defaultValue;
        }
        return JSON.parse(localStorage[key]);
    }

    setDebugValue = (key, x) => {
        localStorage[key] = JSON.stringify(x);
    }
}
