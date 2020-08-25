sound = definition => {
    const pool = Array(5).fill(0).map(() => jsfxr(definition));
    return () => {
        // Cycle the queue by removing the first value and moving it to the last
        pool.push(pool.shift());

        // Play the sound
        pool[0]();
    };
};

beepSound = sound([rawFile('config/sounds/beep')]);
exitSound = sound([rawFile('config/sounds/exit')]);
failSound = sound([rawFile('config/sounds/fail')]);
finishSound = sound([rawFile('config/sounds/finish')]);
jumpSound = sound([rawFile('config/sounds/jump')]);
landSound = sound([rawFile('config/sounds/land')]);
nextLevelSound = sound([rawFile('config/sounds/next-level')]);
notFoundSound = sound([rawFile('config/sounds/not-found')]);
