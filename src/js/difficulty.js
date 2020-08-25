DIFFICULTY_SETTINGS = [
    // Label, time factor, vision factor
    NORMAL_DIFFICULTY = {'label': nomangle('NORMAL'), 'timeFactor': 1, 'visionFactor': 1},
    {'label': nomangle('EASY'), 'timeFactor': 0.8, 'visionFactor': 0.7},
    {'label': nomangle('SUPER EASY'), 'timeFactor': 0.5, 'visionFactor': 0.5},
];

DIFFICULTY = null;

changeDifficulty = () => {
    DIFFICULTY = DIFFICULTY_SETTINGS[(DIFFICULTY_SETTINGS.indexOf(DIFFICULTY) + 1) % DIFFICULTY_SETTINGS.length];

    // If the difficulty is changed even once, the run becomes invalid
    if (G) {
        G.isRunValid = false;
    }
};

changeDifficulty();
