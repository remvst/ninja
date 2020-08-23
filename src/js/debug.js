if (DEBUG) {
    getDebugValue = (key, defaultValue) => {
        if (!(key in sessionStorage)) {
            return defaultValue;
        }
        return JSON.parse(sessionStorage[key]);
    }

    setDebugValue = (key, x) => {
        sessionStorage[key] = JSON.stringify(x);
    }
}
